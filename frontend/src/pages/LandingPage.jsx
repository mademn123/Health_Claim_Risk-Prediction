import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import Navbar from "../components/Navbar";

import apple from "../assets/apple.png";
import exercise from "../assets/exercise.png";
import sleep from "../assets/sleep.png";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <div className="landing-container">
        {/* left half of the screen */}
        <div className="left-panel">
          <h1 className="heading">Take Survey Now!</h1>
          <p className="description">
            Explore your{" "}
            <span className="highlight">estimated health claim risk level</span>{" "}
            and{" "}
            <span className="highlight">expected annual healthcare costs</span>{" "}
            based on your demographic and health information.
          </p>
          <p className="description">
            Use this tool to{" "}
            <span className="highlight">
              understand your potential healthcare expenses
            </span>{" "}
            and make more informed insurance or preventive health decisions.
          </p>

          <Link to="/survey" className="survey-button">
            Take Survey Now!
          </Link>
        </div>

        {/* right half of the screen */}
        <div className="right-panel">
          <div className="fact-card">
            <img src={apple} alt="Apple" className="fact-icon" />
            <div className="fact-text">
              <p className="fact-title">
                “An Apple a Day Keeps the Doctor Away!”
              </p>
              <p className="fact-body">
                People with diets rich in vegetables and fruit have a
                significantly lower risk of obesity, heart disease, stroke,
                diabetes, and certain types of cancer.
              </p>
            </div>
          </div>

          <div className="fact-card">
            <img src={exercise} alt="Exercise" className="fact-icon" />
            <div className="fact-text">
              <p className="fact-title">Stay Active!</p>
              <p className="fact-body">
                Physical activity helps prevent cardiovascular diseases,
                diabetes, and depression, while improving brain health and
                overall well-being.
              </p>
            </div>
          </div>

          <div className="fact-card">
            <img src={sleep} alt="Sleep" className="fact-icon" />
            <div className="fact-text">
              <p className="fact-title">Get Good Sleep!</p>
              <p className="fact-body">
                Quality sleep enhances brain performance, mood, and health. Poor
                sleep increases the risk of chronic diseases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
