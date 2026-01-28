import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getTargetRole } from "../utils/getTargetRole";
import API from "../utils/api";
import "./JobFinder.css";
export default function JobFinder() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [saveError, setSaveError] = useState("");
  useEffect(() => {
    setRole(getTargetRole() || "");
  }, []);
  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    API.get("/api/jobs/saved")
      .then((res) => {
        setSavedJobIds(res.data.map(job => job.applyLink));
      })
      .catch(() => { });
  }, []);
  useEffect(() => {
    if (saveError && errorRef.current) {
      errorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [saveError]);
  const errorRef = useRef(null);
  const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
  const handleSearch = async () => {
    if (!role.trim() || !location.trim()) {
      setError("Please fill each field.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/api/ai/search", {
        role,
        location,
      });
      const json = res.data;
      if (!json.data || json.data.length === 0) {
        setError("No jobs found");
        setLoading(false);
        return;
      }
      setJobs(json.data);
      setShowResults(true);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch jobs");
    }
    setLoading(false);
  };
  const toggleSaveJob = async (job) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSaveError("Please login first to save jobs");
      setTimeout(() => setSaveError(""), 2000);
      return;
    }
    const isSaved = savedJobIds.includes(job.job_apply_link);
    try {
      if (isSaved) {
        await API.post("/api/jobs/unsave", {
          applyLink: job.job_apply_link,
        });
        setSavedJobIds(prev =>
          prev.filter(id => id !== job.job_apply_link)
        );
      } else {
        await API.post("/api/jobs/save", {
          title: job.job_title,
          company: job.employer_name,
          location: `${job.job_city}, ${job.job_country}`,
          applyLink: job.job_apply_link,
        });
        setSavedJobIds(prev => [...prev, job.job_apply_link]);
      }
    } catch {
      setSaveError("Failed to update saved job");
      setTimeout(() => setSaveError(""), 2000);
    }
  };
  return (
    <div className="jf-root">
      {!showResults && (
        <>
          <div className="home-btn-wrapper">
            <button className="home-btn" onClick={() => navigate("/")}>
              Home
            </button>
          </div>
          <h2 className="jf-heading">Job Finder</h2>
          <div className="jf-main-box">
            <div className="jf-grid-box">
              <label className="section-title">Job Role:</label>
              <div className="jf-field full-width">
                <input
                  className="jf-input jf-blue-box"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Enter Role"
                />
              </div>
              <label className="section-title">Location:</label>
              <div className="jf-field full-width">
                <input
                  className="jf-input jf-blue-box"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter Location (within India)"
                />
              </div>
            </div>
            {error && <p className="jf-error">{error}</p>}
            <button
              className="jf-btn"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search Jobs"}
            </button>
          </div>
        </>
      )}
      {showResults && (
        <div className="jf-results-root">
          <h2 className="jf-heading">Job Results</h2>

          <div className="jf-list">
            {jobs.map((job, i) => (
              <div className="jf-card" key={i}>
                <h3>{job.job_title}</h3>
                <p className="jf-company">{job.employer_name}</p>
                <p>
                  {job.job_city}, {job.job_country}
                </p>
                <p>{job.job_employment_type}</p>
                <a
                  href={job.job_apply_link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className="jf-apply-btn">Apply Now</button>
                </a>
                <button
                  className={`jf-save-btn ${savedJobIds.includes(job.job_apply_link) ? "saved" : ""
                    }`}
                  onClick={() => toggleSaveJob(job)}
                >
                  {savedJobIds.includes(job.job_apply_link)
                    ? "Saved"
                    : "Save Job"}
                </button>
              </div>
            ))}
          </div>
          <button
            className="jf-btn jf-back-bottom"
            onClick={() => setShowResults(false)}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}