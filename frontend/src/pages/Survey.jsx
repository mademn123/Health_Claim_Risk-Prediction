import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Survey.css";
import Navbar from "../components/Navbar";

export default function Survey() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: "",
    sex: "",
    race: "",
    region: "",
    married: "",
    income: "",
    insurance: "",
    chronic: [],
    smoke: "",
  });
  // handles the input changes (i.e. if the checkboxes are checked)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => {
        if (checked) return { ...prev, chronic: [...prev.chronic, value] };
        else
          return { ...prev, chronic: prev.chronic.filter((v) => v !== value) };
      });
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // if the form is submitted, send the data to the backend for prediction and if successful, navigate to results page
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const text = await res.text();
      let data = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch (err) {
        console.error("Response parse error:", err);
        alert("Failed to parse server response");
        return;
      }

      if (!res.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          text ||
          `HTTP ${res.status}`;
        alert("Server error: " + msg);
        return;
      }

      if (!data || data.est_cost === undefined) {
        alert("No cost estimate returned");
        return;
      }

      navigate("/results", {
        state: {
          prediction: data.est_cost,
          conditionalCost: data.cond_mean_cost,
          probabilitySpend: data.p_any_spend,
          riskBand: data.risk_band,
          userInput: formData,
        },
      });
    } catch (err) {
      console.error("Request failed:", err);
      alert("Request failed: " + err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="survey-container">
        <h2>Estimated Health Claim Annual Cost Survey</h2>
        <form onSubmit={handleSubmit}>
          <label>1. Please input your age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />

          <label>2. Please select your sex:</label>
          <div className="option-group vertical">
            <label>
              <input
                type="radio"
                name="sex"
                value="male"
                onChange={handleChange}
              />{" "}
              Male
            </label>
            <label>
              <input
                type="radio"
                name="sex"
                value="female"
                onChange={handleChange}
              />{" "}
              Female
            </label>
          </div>

          <label>3. Please select your race:</label>
          <select
            name="race"
            value={formData.race}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="white">White</option>
            <option value="black">Black</option>
            <option value="hispanic">Hispanic</option>
            <option value="asian">Asian</option>
            <option value="other">Other</option>
          </select>

          <label>4. Please select which region of the U.S. you are from:</label>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="northeast">Northeast</option>
            <option value="midwest">Midwest</option>
            <option value="south">South</option>
            <option value="west">West</option>
          </select>

          <label>5. What is your marital status?</label>
          <select
            name="married"
            value={formData.married}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="married">Married</option>
            <option value="widowed">Widowed</option>
            <option value="divorced">Divorced</option>
            <option value="separated">Separated</option>
            <option value="never married">Never married</option>
          </select>

          <label>6. What is your income category?</label>
          <select
            name="income"
            value={formData.income}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="poor">Poor</option>
            <option value="near poor">Near poor</option>
            <option value="low income">Low income</option>
            <option value="middle income">Middle income</option>
            <option value="high income">High income</option>
          </select>

          <label>
            7. What type of health insurance coverage do you currently have?
          </label>
          <select
            name="insurance"
            value={formData.insurance}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="private">Private</option>
            <option value="public">Public</option>
            <option value="uninsured">Uninsured</option>
          </select>

          <label>
            8. Please select which of these chronic conditions/illnesses you
            have:
          </label>
          <div className="option-group vertical">
            <label>
              <input type="checkbox" value="Cancer" onChange={handleChange} />{" "}
              Cancer
            </label>
            <label>
              <input
                type="checkbox"
                value="High Blood Pressure"
                onChange={handleChange}
              />{" "}
              High Blood Pressure
            </label>
            <label>
              <input type="checkbox" value="Asthma" onChange={handleChange} />{" "}
              Asthma
            </label>
            <label>
              <input type="checkbox" value="Diabetes" onChange={handleChange} />{" "}
              Diabetes
            </label>
            <label>
              <input
                type="checkbox"
                value="Heart Disease"
                onChange={handleChange}
              />{" "}
              Heart Disease
            </label>
          </div>

          <label>9. Do you smoke?</label>
          <div className="option-group vertical">
            <label>
              <input
                type="radio"
                name="smoke"
                value="yes"
                onChange={handleChange}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="smoke"
                value="no"
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}
