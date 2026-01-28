import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import MockInterview from "./pages/MockInterview";
import JobFinder from "./pages/JobFinder";
import Roadmap from "./pages/Roadmap";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Profile from "./pages/Profile";
import SavedJobs from "./pages/savedjobs";
import Dashboard from "./pages/dashboard";
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