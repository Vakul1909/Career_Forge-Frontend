import React, { useEffect, useState, useRef, } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import API from "../utils/api";
import "./dashboard.css";
export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showInterviewAnalysis, setShowInterviewAnalysis] = useState(false);
  const token = localStorage.getItem("token");
  const mockInterviewRef = useRef(null);
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    API.get("/api/users/dashboard")
      .then((res) => {
        setData(res.data);
        setRoadmap(res.data.roadmap);
      })
      .catch((err) => {
        console.error("DASHBOARD ERROR:", err.response?.data || err.message);
      })
      .finally(() => setLoading(false));
  }, [token]);
  const location = useLocation();
  useEffect(() => {
    setShowInterviewAnalysis(false);
  }, [location.pathname]);
  if (loading) return <p className="loading">Loading dashboard...</p>;
  if (!token)
    return <p className="loading">Please login to view dashboard</p>;
  if (!data) return <p className="loading">No dashboard data</p>;
  const resume = data.resume;
  const previousScore = resume?.previousScore;
  const scoreDiff =
    previousScore !== undefined && previousScore !== null
      ? resume.score - previousScore
      : null;
  const hasResumeAnalysis =
    resume &&
    resume.fileUrl &&
    resume.analyzedAt;
  const togglePhase = async (phaseId) => {
    try {
      const res = await API.patch("/api/users/roadmap/phase", { phaseId });
      setRoadmap(res.data.roadmap);
    } catch (err) {
      console.error(
        "Phase update failed",
        err.response?.data || err.message
      );
    }
  };
  const getDeadline = (createdAt, duration) => {
    if (!createdAt || !duration) return null;
    const months = parseInt(duration);
    if (isNaN(months)) return null;
    const date = new Date(createdAt);
    date.setMonth(date.getMonth() + months);
    return date;
  };
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "N/A";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };
  const roadmapProgress =
    roadmap && roadmap.phases.length > 0
      ? Math.round(
        (roadmap.phases.filter((p) => p.completed).length /
          roadmap.phases.length) *
        100
      )
      : 0;
  const handleDeleteInterview = async (interviewId) => {
    try {
      await API.delete(`/api/users/mock-interviews/${interviewId}`);
      setData((prev) => ({
        ...prev,
        mockInterviews: prev.mockInterviews.filter(
          (i) => i._id !== interviewId
        ),
      }));
      if (selectedInterview?._id === interviewId) {
        setSelectedInterview(null);
      }
    }
    catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete interview");
    }
  };
  const interviewChartData = data?.mockInterviews
    ?.map((i) => ({
      date: new Date(i.createdAt).toLocaleDateString("en-GB"),
      score: i.score,
      id: i._id,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  return (
    <div className="dashboard-root">
      <h1 className="dashboard-title">Your Dashboard</h1>
      <div className="resume-analysis">
        <h2>Resume Analysis</h2>
        {hasResumeAnalysis ? (
          <>
            <div className="resume-date">
              <p className="date">
                <b>Last analyzed:{" "}</b>
                {resume.analyzedAt
                  ? new Date(resume.analyzedAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            {resume.previousAnalyzedAt && (
              <p className="date secondary">
                <b>Previous analysis:</b>{" "}
                {new Date(resume.previousAnalyzedAt).toLocaleDateString()}
              </p>
            )}
            <div className="top-cards">
              <div className="info-card">
                <div className="resume-card">
                  <p className="file">📄 Resume PDF</p>
                  <a
                    href={resume.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Resume PDF
                  </a>
                </div>
              </div>
              <div className="info-card">
                <div className="score-card">
                  <p className="score">{resume.score}/100</p>
                  <p className="label">Latest Resume Score</p>
                  {previousScore !== undefined && previousScore !== null && (
                    <>
                      <p className="prev-score">
                        Previous: {previousScore}/100
                      </p>
                      <p
                        className={`score-diff ${scoreDiff > 0 ? "positive" : scoreDiff < 0 ? "negative" : ""
                          }`}
                      >
                        {scoreDiff > 0 && "⬆ "}
                        {scoreDiff < 0 && "⬇ "}
                        {scoreDiff === 0 && "— "}
                        {scoreDiff !== 0 ? Math.abs(scoreDiff) : 0} points
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="analysis-section">
              <h3>Strengths</h3>
              <ul>
                {resume.strengths && resume.strengths.length > 0 ? (
                  resume.strengths.map((s, i) => <li key={i}>{s}</li>)
                ) : (
                  <li>No strengths extracted</li>
                )}
              </ul>
            </div>
            <div className="analysis-section">
              <h3>Weaknesses</h3>
              <ul>
                {resume.weaknesses && resume.weaknesses.length > 0 ? (
                  resume.weaknesses.map((w, i) => <li key={i}>{w}</li>)
                ) : (
                  <li>No weaknesses extracted</li>
                )}
              </ul>
            </div>
            <div className="section-header">
              <button
                className="action-btn"
                onClick={() => navigate("/resume")}
              >
                Analyze New Resume
              </button>
            </div>
          </>
        ) : (
          <p>No resume analyzed yet.</p>
        )}
      </div>
      <div
        ref={mockInterviewRef}
        className="resume-analysis mock-interviews">
        <h2>Mock Interviews</h2>
        {data.mockInterviews && data.mockInterviews.length > 0 ? (
          <>
            {!selectedInterview && (
              <>
                <div className="interview-list">
                  {data.mockInterviews.map((interview) => (
                    <div key={interview._id} className="interview-card">
                      <p className="role">{interview.role}</p>
                      <p className="difficulty">{interview.difficulty}</p>
                      <p className="date">
                        {new Date(interview.createdAt).toLocaleDateString()}
                      </p>
                      <p className="score">Score: {interview.score}/10</p>
                      <div className="interview-actions">
                        <button
                          className="analyze-btn"
                          onClick={() => setSelectedInterview(interview)}
                        >
                          Analyze
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteInterview(interview._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="section-header dual-btn">
                  <button
                    className="action-btn"
                    onClick={() => navigate("/mock-interview")}
                  >
                    Start Mock Interview
                  </button>
                  <button
                    className="action-btn secondary"
                    onClick={() => {
                      setShowInterviewAnalysis(true);
                      setTimeout(() => {
                        document
                          .getElementById("mock-interview-graph")
                          ?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }, 100);
                    }}
                  >
                    Interviews Analysis
                  </button>
                </div>
              </>
            )}
            {selectedInterview && (
              <div className="interview-detail">
                <div className="details">
                  <span>
                    <b>Role:{" "}</b>
                    {selectedInterview.role}
                  </span>
                  <p className="difficulty">
                    <b>Level:{" "}</b>
                    {selectedInterview.difficulty}
                  </p>
                  <p className="date">
                    <b>Interview Date:{" "}</b>
                    {new Date(selectedInterview.createdAt).toLocaleDateString()}
                  </p>
                  <p className="score">
                    Final Score: {selectedInterview.score}/10
                  </p>
                </div>
                <div className="qa-section">
                  {selectedInterview.questions?.map((qa, index) => (
                    <div key={index} className="qa-card">
                      <p className="question">
                        Q{index + 1}. {qa.question}
                      </p>
                      <p className="answer">
                        <strong>Answer:</strong> {qa.answer}
                      </p>
                    </div>
                  ))}
                </div>
                {selectedInterview.feedback && (
                  <div className="overall-feedback">
                    <h3>Improvement Needed Points-:</h3>
                    <div className="feedback-content">
                      {(() => {
                        const feedback = selectedInterview.feedback;
                        const suggestionPart = feedback.split("Suggestions:")[1];
                        if (!suggestionPart) return "No suggestions available.";
                        return suggestionPart
                          .trim()
                          .split("\n")
                          .map((line, index) => (
                            <p key={index}>{line}</p>
                          ));
                      })()}
                    </div>
                  </div>
                )}
                <button
                  className="back-btn"
                  onClick={() => {
                    setSelectedInterview(null);
                    setTimeout(() => {
                      mockInterviewRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }, 0);
                  }}
                >
                  Back to Interviews
                </button>
              </div>
            )}
          </>
        ) : (
          <p>No mock interviews taken yet.</p>
        )}
        {showInterviewAnalysis && interviewChartData?.length > 0 && (
          <div
            id="mock-interview-graph"
            className="resume-analysis interview-graph"
          >
            <h2>Mock Interviews Performance</h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={interviewChartData}
                barSize={35}
                barCategoryGap="30%"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  domain={[0, 10]}
                  ticks={[0, 2, 4, 6, 8, 10]}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar
                  dataKey="score"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <div className="resume-analysis roadmap-tracker">
        <h2>Roadmap Tracker</h2>
        {!roadmap ? (
          <p>No roadmap generated yet.</p>
        ) : (
          <>
            <div className="roadmap-summary">
              <span><b>Role:</b> {roadmap.role}</span>
              <span><b>Level:</b> {roadmap.level}</span>
              <span><b>Duration:</b> {roadmap.duration}</span>
              <span><b>Date:</b>
                {new Date(roadmap.createdAt).toLocaleDateString()}
              </span>
              <span>
                <b>Deadline:</b>{" "}
                {formatDate(getDeadline(roadmap.createdAt, roadmap.duration))}
              </span>
            </div>
            <div className="roadmap-progress">
              <div className="progress-text">
                Progress: {roadmapProgress}%
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${roadmapProgress}%` }}
                />
              </div>
            </div>
            <div className="roadmap-phases">
              {roadmap.phases.map((phase, index) => {
                const locked = roadmap.phases
                  .slice(0, index)
                  .some((p) => !p.completed);
                return (
                  <div
                    key={phase.id}
                    className={`phase-card ${locked ? "locked" : ""}`}
                  >
                    <div className="phase-header">
                      <input
                        type="checkbox"
                        checked={phase.completed}
                        disabled={locked}
                        onChange={() => togglePhase(phase.id)}
                      />
                      <h4>{phase.phase}</h4>
                    </div>
                    <p className="phase-duration">
                      Duration: {phase.duration}
                    </p>
                    <ul className="phase-skills">
                      {phase.skills.map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                    {locked && (
                      <p className="locked-text">
                        Complete previous phase to unlock
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="section-header">
              <button
                className="action-btn"
                onClick={() => navigate("/roadmap")}
              >
                Regenerate Roadmap
              </button>
            </div>
          </>
        )}
      </div>
    </div >
  );
}