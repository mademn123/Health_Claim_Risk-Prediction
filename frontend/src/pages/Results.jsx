import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Results.css";

const smokeToMEPS = (v) => {
  const s = String(v ?? "").toLowerCase();
  return ["yes", "current", "1", "true", "y"].includes(s) ? 1 : 2;
};

const mapSurveyToFeatures = (s = {}) => {
  const arr = Array.isArray(s.chronic) ? s.chronic : [];
  const has = (name, ...alts) =>
    arr.some((x) => {
      const y = String(x || "").toLowerCase();
      return [name, ...alts].some((n) => y === String(n).toLowerCase());
    });

  return {
    ...s,
    AGE23X: Number(s.age) || 40,
    ADSMOK42: smokeToMEPS(s.smoke),
    CANCERDX: has("Cancer") ? 1 : 0,
    HIBPDX: has("High Blood Pressure", "HIBP") ? 1 : 0,
    ASTHDX: has("Asthma") ? 1 : 0,
    CHDDX: has("Heart Disease", "CHD") ? 1 : 0,
    DIABDX_M18: has("Diabetes", "DIAB") ? 1 : 0,
  };
};

export default function Results({ surveyData }) {
  const location = useLocation();
  const navigate = useNavigate();
  const navSurvey = location.state?.userInput || surveyData || {};

  const [features, setFeatures] = useState(mapSurveyToFeatures(navSurvey));
  const [cost, setCost] = useState(null);
  const [probability, setProbability] = useState(null);

  const nf = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const buildServerPayload = (f) => {
    // Prefer survey strings if present; fall back to coded fields
    const sex =
      f.sex || (f.SEX === 1 ? "male" : f.SEX === 2 ? "female" : "male");
    const region =
      f.region ||
      (f.REGION23 === 1
        ? "northeast"
        : f.REGION23 === 2
        ? "midwest"
        : f.REGION23 === 3
        ? "south"
        : "west");
    const race =
      f.race ||
      (f.RACETHX === 1
        ? "white"
        : f.RACETHX === 2
        ? "black"
        : f.RACETHX === 3
        ? "hispanic"
        : f.RACETHX === 4
        ? "asian"
        : "other");
    const married = f.married || "married";
    const income = f.income || "middle income";
    const insurance = f.insurance || "private";
    const age = f.age || f.AGE23X || 40;

    const chronic = [];
    if (Number(f.CANCERDX) === 1) chronic.push("Cancer");
    if (Number(f.HIBPDX) === 1) chronic.push("High Blood Pressure");
    if (Number(f.ASTHDX) === 1) chronic.push("Asthma");
    if (Number(f.CHDDX) === 1) chronic.push("Heart Disease");
    if (Number(f.DIABDX_M18) === 1) chronic.push("Diabetes");

    // Always derive smoke from toggle value
    const smoke = Number(f.ADSMOK42) === 1 ? "yes" : "no";

    return {
      age,
      sex,
      race,
      region,
      married,
      income,
      insurance,
      chronic,
      smoke,
    };
  };

  const fetchPrediction = useCallback(
    async (updated = features) => {
      try {
        const payload = buildServerPayload(updated);
        const res = await fetch("http://127.0.0.1:5000/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          body: JSON.stringify(payload),
        });
        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        if (!res.ok) return;
        setCost(data.est_cost ?? null);
        setProbability(data.p_any_spend ?? null);
      } catch (err) {
        console.error("Prediction error:", err);
      }
    },
    [features]
  );

  // Reinitialize toggles from the latest survey submission
  useEffect(() => {
    const initial = mapSurveyToFeatures(navSurvey);
    setFeatures(initial);
    fetchPrediction(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.userInput, surveyData]);

  const handleToggle = (key, value) => {
    const updated = { ...features, [key]: value };
    if (updated.hasOwnProperty("smoke")) delete updated.smoke; // ensure toggle drives smoke
    setFeatures(updated);
    fetchPrediction(updated);
  };

  const handleSmoking = (e) =>
    handleToggle("ADSMOK42", e.target.checked ? 1 : 2);
  const handleHBP = (e) => handleToggle("HIBPDX", e.target.checked ? 1 : 0);
  const handleDiabetes = (e) =>
    handleToggle("DIABDX_M18", e.target.checked ? 1 : 0);
  const handleAsthma = (e) => handleToggle("ASTHDX", e.target.checked ? 1 : 0);
  const handleCancer = (e) =>
    handleToggle("CANCERDX", e.target.checked ? 1 : 0);
  const handleAgeChange = (e) => {
    const ageVal = Number(e.target.value);
    const updated = { ...features, AGE23X: ageVal, age: ageVal };
    setFeatures(updated);
    fetchPrediction(updated);
  };

  return (
    <div className="page">
      <div className="wrapper">
        <div className="title">Results</div>

        <div className="card">
          <div className="title">Estimated Annual Cost:</div>
          <div className="value">
            {cost !== null ? nf.format(cost) : "Loading..."}
          </div>
        </div>

        <div className="card">
          <div className="title">Probability of Needing a Health Claim</div>
          <div className="value">
            {probability !== null
              ? `${Math.round(probability * 100)}%`
              : "Loading..."}
          </div>
        </div>

        <div className="large-card">
          <div className="what-if-title">What if?</div>
          <div className="what-if-subtitle">
            Adjust age or toggle conditions to see updates.
          </div>

          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <label style={{ fontWeight: 700, color: "#1086c8" }}>
              Age: {features.AGE23X}
            </label>
            <div style={{ marginTop: 8 }}>
              <input
                type="range"
                min="18"
                max="90"
                value={features.AGE23X}
                onChange={handleAgeChange}
                style={{ width: "80%" }}
              />
            </div>
          </div>

          <div className="controls">
            <label className="control">
              <input
                type="checkbox"
                onChange={handleSmoking}
                checked={Number(features.ADSMOK42) === 1}
              />{" "}
              Currently smoking
            </label>
            <label className="control">
              <input
                type="checkbox"
                onChange={handleHBP}
                checked={Number(features.HIBPDX) === 1}
              />{" "}
              High blood pressure
            </label>
            <label className="control">
              <input
                type="checkbox"
                onChange={handleDiabetes}
                checked={Number(features.DIABDX_M18) === 1}
              />{" "}
              Diabetes
            </label>
            <label className="control">
              <input
                type="checkbox"
                onChange={handleAsthma}
                checked={Number(features.ASTHDX) === 1}
              />{" "}
              Asthma
            </label>
            <label className="control">
              <input
                type="checkbox"
                onChange={handleCancer}
                checked={Number(features.CANCERDX) === 1}
              />{" "}
              Cancer
            </label>
          </div>

          <div style={{ textAlign: "center", marginTop: 18 }}>
            <button
              onClick={() => navigate("/survey")}
              className="new-estimate-button"
            >
              Retake survey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
