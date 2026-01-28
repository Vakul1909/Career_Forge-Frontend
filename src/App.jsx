import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "/src/components/Navbar";
import Footer from "/src/components/Footer";
import Home from "/src/pages/Home";
import ResumeAnalyzer from "/src/pages/ResumeAnalyzer";
import MockInterview from "/src/pages/MockInterview";
import JobFinder from "/src/pages/JobFinder";
import Roadmap from "/src/pages/Roadmap";
import Login from "/src/pages/Login";
import Signup from "/src/pages/Signup";
import Profile from "/src/pages/Profile";
import SavedJobs from "/src/pages/SavedJobs";
import Dashboard from "/src/pages/Dashboard";
const App = () => {
  useEffect(() => {
    if (!sessionStorage.getItem("freshStart")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.setItem("freshStart", "true");
    }
  }, []);
  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/savedjobs" element={<SavedJobs />} />
            <Route path="/resume" element={<ResumeAnalyzer />} />
            <Route path="/mock-interview" element={<MockInterview />} />
            <Route path="/job-finder" element={<JobFinder />} />
            <Route path="/roadmap" element={<Roadmap />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};
export default App;