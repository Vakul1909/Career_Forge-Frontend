import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTargetRole } from "../utils/getTargetRole";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import * as pdfjsLib from "pdfjs-dist";
import API from "../utils/api";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import "./ResumeAnalyzer.css";
import { Copy, Check } from "lucide-react";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
const ResumeAnalyzer = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [role, setRole] = useState(getTargetRole());
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const resultRef = useRef(null);
  const resumeRef = useRef(null);
  const extractPDFTextStructured = async (file) => {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      content.items.forEach((item) => {
        if (item.str) text += item.str + " ";
      });
      text += "\n\n";
    }
    return text.trim();
  };
  const copyToClipboard = async () => {
    if (!resumeRef.current) return;
    try {
      await navigator.clipboard.writeText(resumeRef.current.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };
  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 2000);
  };
  useEffect(() => {
    setRole(getTargetRole());
  }, []);
  const analyzeResume = async () => {
    setError("");
    if (!file || !role) {
      showError("Please fill each Field.");
      return;
    }
    setLoading(true);
    setResult("");
    window.scrollTo({ top: 0, behavior: "smooth" });
    let resumeText = "";
    try {
      resumeText = file.type.includes("pdf")
        ? await extractPDFTextStructured(file)
        : await file.text();
    } catch {
      setError("Failed to read the file. Upload a valid PDF or TXT file.");
      setLoading(false);
      return;
    }
    try {
      const prompt = `
Analyze resume for role: ${role}
Return:
1. Resume Score out of 100
2. Strengths
3. Weaknesses
4. Missing Skills
5. ATS Tips
6. Suggestions
7. Rewritten correct Resume (Markdown Format)
Resume:
${resumeText}
`;
      const res = await API.post("/api/ai/resume-analyze", { prompt });
      const aiText = res.data?.result || "No Response";
      setResult(aiText);
      const dashboardData = extractDashboardData(aiText);
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("score", dashboardData.score);
      formData.append("strengths", JSON.stringify(dashboardData.strengths));
      formData.append("weaknesses", JSON.stringify(dashboardData.weaknesses));
      formData.append("analyzedAt", new Date().toISOString());
      await API.post("/api/users/resume", formData);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze resume");
    }
    setLoading(false);
  };
  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [result]);
  const getResumeParts = (text) => {
    const cleaned = text.replace(/^\s*7[\.\)]?\s*/m, "");
    const match = cleaned.match(/rewritten resume[\s:]*\n?([\s\S]*)/i);
    if (!match) {
      return {
        analysis: cleaned,
        rewritten: "INVALID FILE UPLOADED!!",
      };
    }
    return {
      analysis: cleaned.slice(0, match.index).trim(),
      rewritten: match[1].trim(),
    };
  };
  const extractDashboardData = (text) => {
    const scoreMatch = text.match(/(\d{1,3})\s*\/\s*100/);
    const strengthsMatch = text.match(
      /Strengths[\s\S]*?:([\s\S]*?)(Weaknesses|Missing Skills|ATS|Suggestions)/i
    );
    const weaknessesMatch = text.match(
      /Weaknesses[\s\S]*?:([\s\S]*?)(Missing Skills|ATS|Suggestions)/i
    );
    const strengths = strengthsMatch
      ? strengthsMatch[1]
        .split("\n")
        .map(s => s.replace(/[-•]/g, "").trim())
        .filter(Boolean)
        .slice(0, 4)
      : [];
    const weaknesses = weaknessesMatch
      ? weaknessesMatch[1]
        .split("\n")
        .map(w => w.replace(/[-•]/g, "").trim())
        .filter(Boolean)
        .slice(0, 3)
      : [];
    return {
      score: scoreMatch ? Number(scoreMatch[1]) : 0,
      strengths,
      weaknesses
    };
  };
  const { analysis, rewritten: rewrittenResume } = getResumeParts(result);
  return (
    <div className="page-container">
      <button className="home-btn" onClick={() => navigate("/")}>
        Home
      </button>
      <h1 className="title">Resume Analyzer</h1>
      <div className="upload-box">
        <label className="section-title">Job Role:</label>
        <div className="box-row">
          <input
            className="ra-input"
            placeholder="Job Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
        <label className="section-title">Upload Resume:</label>
        <div className="file-row">
          <label htmlFor="resumeFile" className="btnc">Choose</label>
          <span className="file-name">{file ? file.name : "No file selected"}</span>
          <input
            id="resumeFile"
            type="file"
            accept=".pdf,.txt"
            hidden
            onChange={(e) => {
              setFile(e.target.files[0]);
              e.target.value = null;
            }}
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button onClick={analyzeResume} disabled={loading} className="btn full">
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>
      {result && (
        <div ref={resultRef} className="result-box show">
          <div className="markdown-body">
            <Markdown remarkPlugins={[remarkGfm]}>
              {analysis}
            </Markdown>
          </div>
          <div className="editor-box show">
            <div className="editor-header">
              <span className="editor-title">Rewritten Resume</span>
              <button onClick={copyToClipboard} className="icon-btn">
                {copied ? (
                  <>
                    <Check size={18} />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    <span>Copy Resume</span>
                  </>
                )}
              </button>
            </div>
            <div ref={resumeRef} className="editor-body">
              <Markdown remarkPlugins={[remarkGfm]}>
                {rewrittenResume}
              </Markdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ResumeAnalyzer;