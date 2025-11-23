from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import traceback
import pandas as pd
import numpy as np
import sys
import __main__

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}}, supports_credentials=True)
# list of all the predictors
PREDICTORS = [
    "AGE23X", "SEX", "RACETHX", "REGION23", "MARRY23X",
    "POVCAT23", "INSCOV23", "CANCERDX", "HIBPDX", "ASTHDX",
    "CHDDX", "DIABDX_M18", "ADSMOK42"
]

# mapping for predictors
REGION_MAP = {"northeast": 1, "midwest": 2, "south": 3, "west": 4}
SEX_MAP = {"male": 1, "female": 2}
INSCOV_MAP = {"private": 1, "public": 2, "uninsured": 3}
RACE_MAP = {"white": 1, "black": 2, "hispanic": 3, "asian": 4, "other": 5}
SMOKE_MAP = {"yes": 1, "no": 2, "current": 1, "non-smoker": 2}  # 1=Current smoker, 2=Non-smoker

# mapping for marry23x predictor
MARRY_MAP = {
    "married": 1,
    "widowed": 2,
    "divorced": 3,
    "separated": 4,
    "never married": 5,
    "single": 5,
    "under 16": 6,
    "na": 6
}

# mapping for povcat predictor
POVCAT_MAP = {
    "poor": 1,
    "near poor": 2,
    "low income": 3,
    "middle income": 4,
    "high income": 5
}

def meps_to_binary(v):
    """Convert MEPS encoding (1=yes, 2=no) to binary (1=yes, 0=no)"""
    if isinstance(v, (int, float)):
        return 1 if v == 1 else 0
    v = str(v).strip().lower()
    return 1 if v in {"1", "y", "yes", "true", "t"} else 0

# CombinedHealthCostModel stub so unpickling works if pickle referenced __main__
class CombinedHealthCostModel:
    def __init__(self, freq_model=None, sev_model=None):
        self.freq_model = freq_model
        self.sev_model = sev_model

    def predict(self, X):
        if self.freq_model is None or self.sev_model is None:
            raise RuntimeError("Combined model not fully loaded.")
        p_claim = self.freq_model.predict_proba(X)[:, 1]
        sev_pred = self.sev_model.predict(X)
        return p_claim, sev_pred, p_claim * sev_pred

setattr(__main__, "CombinedHealthCostModel", CombinedHealthCostModel)

# loads model.pkl
model = None
try:
    model = joblib.load("model.pkl")
    print("Loaded model.pkl")
except Exception as e:
    model = None
    print("Failed to load model.pkl:", e, file=sys.stderr)
# converts all the user inputs into the mapped MEPS codes to send to model
@app.route("/predict", methods=["POST"])
def predict():
    try:
        if model is None:
            return jsonify({"error": "model_not_loaded"}), 500

        data = request.get_json() or {}
        
        age = int(data.get("age", 0))
        sex_raw = str(data.get("sex", "")).strip().lower()
        sex = SEX_MAP.get(sex_raw, SEX_MAP.get("male", 1))
        
        race_raw = str(data.get("race", "")).strip().lower()
        race = RACE_MAP.get(race_raw, RACE_MAP.get("other", 5))
        
        region_raw = str(data.get("region", "")).strip().lower()
        region = REGION_MAP.get(region_raw, REGION_MAP.get("west", 4))
        
        marry_raw = str(data.get("married", "")).strip().lower()
        marry_code = MARRY_MAP.get(marry_raw, MARRY_MAP.get("married"))
        
        income_raw = str(data.get("income", "")).strip().lower()
        povcat_code = POVCAT_MAP.get(income_raw, POVCAT_MAP.get("middle income"))
        
        ins_raw = str(data.get("insurance", "")).strip().lower()
        inscov_code = INSCOV_MAP.get(ins_raw, INSCOV_MAP.get("private"))

        chronic = data.get("chronic", []) or []
        def has_condition(cond):
            return 1 if any(cond.strip().lower() == c.strip().lower() 
                           for c in chronic) else 2

        cancer_meps = has_condition("Cancer")
        hbp_meps = has_condition("High Blood Pressure") or has_condition("HIBP")
        asthma_meps = has_condition("Asthma")
        chd_meps = has_condition("Heart Disease") or has_condition("CHD")
        diab_meps = has_condition("Diabetes") or has_condition("DIAB")

        cancer = meps_to_binary(cancer_meps)
        hbp = meps_to_binary(hbp_meps)
        asthma = meps_to_binary(asthma_meps)
        chd = meps_to_binary(chd_meps)
        diab = meps_to_binary(diab_meps)
        
        smoke_raw = str(data.get("smoke", "")).strip().lower()
        adsmok42 = int(SMOKE_MAP.get(smoke_raw, 2))

        row = {
            "AGE23X": age, "SEX": sex, "RACETHX": race,
            "REGION23": region, "MARRY23X": marry_code,
            "POVCAT23": povcat_code, "INSCOV23": inscov_code,
            "CANCERDX": cancer, "HIBPDX": hbp, "ASTHDX": asthma,
            "CHDDX": chd, "DIABDX_M18": diab, "ADSMOK42": adsmok42
        }

        df = pd.DataFrame([row], columns=PREDICTORS)
        if hasattr(model, "freq_model") and hasattr(model, "sev_model"):
            p_any_spend = float(model.freq_model.predict_proba(df)[:, 1])
            cond_mean_cost = float(np.clip(model.sev_model.predict(df)[0], 0, None))
            est_cost = p_any_spend * cond_mean_cost
        else:
            # fallback for combined model
            p_any_spend, cond_mean_cost, ec_arr = model.predict(df)
            p_any_spend = float(p_any_spend[0])
            cond_mean_cost = float(cond_mean_cost[0])
            est_cost = float(ec_arr[0])

        # -computes risk bands
        if est_cost < 5000:
            risk_band = "Low"
        elif est_cost < 15000:
            risk_band = "Medium"
        else:
            risk_band = "High"

        # returns JSON response
        return jsonify({
            "p_any_spend": p_any_spend,
            "cond_mean_cost": cond_mean_cost,
            "est_cost": est_cost,
            "risk_band": risk_band
        })

    except Exception as e:
        tb = traceback.format_exc()
        print(tb, file=sys.stderr)
        return jsonify({"error": "prediction_failed", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
