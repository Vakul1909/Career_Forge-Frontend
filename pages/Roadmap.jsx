import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTargetRole } from "../utils/getTargetRole";
import API from "../utils/api";
import "./Roadmap.css";
const levels = ["Beginner", "Intermediate", "Advanced"];
const durations = ["3 Months", "6 Months", "12 Months"];
export default function Roadmap() {
  const navigate = useNavigate();
  const [role, setRole] = useState(getTargetRole());
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);
  const showError = (msg) => {
    setError(msg);
    setTimeout(() => {
      setError("");
    }, 2000);
  };
  const token = localStorage.getItem("token");
  useEffect(() => {
    setRole(getTargetRole());
  }, []);
  const generateRoadmap = async () => {
    if (!role || !level || !duration) {
      showError("Please fill each field.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/api/ai/roadmap", {
        role,
        level,
        duration,
      });
      const parsed = JSON.parse(res.data.result);
      const roadmapWithTracking = parsed.roadmap.map((p, i) => ({
        id: i + 1,
        ...p,
        completed: false,
      }));
      setRoadmap(roadmapWithTracking);
      setShowResult(true);
      await API.post("/api/users/roadmap", {
        role,
        level,
        duration,
        phases: roadmapWithTracking,
      });
    } catch (err) {
      console.error(err);
      showError("Failed to generate roadmap.");
    }
    setLoading(false);
  };
  return (
    <div className="roadmap-root">
      <button className="home-btn" onClick={() => navigate("/")}>
        Home
      </button>
      {!showResult && (
        <>
          <h1 className="title">Roadmap Generator</h1>
          <div className="roadmap-box">
            <label className="section-title">Job Role:</label>
            <div className="input-group">
              <input
                className="rm-input"
                placeholder="Job Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div className="roadmap-grid">
              <div className="select-card">
                <div className="select-label">Current Level</div>
                <select value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option value="">Select</option>
                  {levels.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="select-card">
                <div className="select-label">Target Duration</div>
                <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                  <option value="">Select</option>
                  {durations.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
            {error && <p className="error-text">{error}</p>}
            <button className="generate-btn" onClick={generateRoadmap}>
              {loading ? "Generating..." : "Generate Roadmap"}
            </button>
          </div>
        </>
      )}
      {showResult && (
        <div className="roadmap-result">
          <h2 className="roadmap-heading">
            Your Roadmap for {role}
          </h2>
          <div className="roadmap-list">
            {roadmap.map((step, i) => (
              <div className="roadmap-card" key={i}>
                <h3>
                  {i + 1}. {step.phase}
                </h3>
                <p>
                  <b>Duration:</b> {step.duration}
                </p>
                <p><b>Skills:</b></p>
                <ul>
                  {step.skills.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
                <p><b>Tools:</b> {step.tools.join(", ")}</p>
                <p className="outcome"> {step.outcome}</p>
              </div>
            ))}
          </div>
          <div className="roadmap-graph">
            <h2 className="roadmap-heading">Roadmap Flow</h2>
            <div className="timeline">
              {roadmap.map((step, index) => (
                <div className="timeline-item" key={index}>
                  <div className="timeline-dot">{index + 1}</div>
                  {index !== roadmap.length - 1 && (
                    <div className="timeline-line"></div>
                  )}
                  <div className="timeline-content">
                    <h3>{step.phase}</h3>
                    <p><b>Duration:</b> {step.duration}</p>
                    <p><b>Skills:</b> {step.skills.slice(0, 3).join(", ")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            className="back-btn"
            onClick={() => setShowResult(false)}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}