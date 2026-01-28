import { Link } from "react-router-dom";
import "./Home.css";
export default function Home() {
    return (
        <div className="home-container">
            <div className="home-hero">
                <h1 className="home-title">CareerForge</h1>
                <p className="home-subtitle">
                    One platform to analyze your resume, practice interviews, explore jobs,
                    and generate personalized roadmaps.
                </p>
                <p className="home-description">
                    CareerForge is an AI-powered career enhancement platform built for students and young
                    professionals. It helps you understand your strengths, correct weaknesses, and prepare
                    effectively for the job market. With intelligent resume scoring, mock interview evaluation,
                    skill-based job search, and custom learning roadmaps, CareerForge acts as your personal
                    career assistant — guiding you step by step toward your goals.
                </p>
            </div>
            <section className="why-section">
                <h2 className="why-title">Why Choose CareerForge?</h2>
                <p className="why-subtext">
                    CareerForge is your AI-powered career companion designed for students and young professionals.
                    Everything you need — resume insights, mock interviews, job search, and roadmaps — all in one place.
                </p>
                <div className="why-grid">
                    <div className="why-card">
                        <h3>AI-Driven Insights</h3>
                        <p>
                            Get accurate resume scoring, interview feedback, and personalized skill suggestions.
                        </p>
                    </div>
                    <div className="why-card">
                        <h3>Smart Job Finder</h3>
                        <p>
                            Discover job opportunities tailored to your skills, experience level, and goals.
                        </p>
                    </div>
                    <div className="why-card">
                        <h3>Personalized Roadmaps</h3>
                        <p>
                            Follow structured learning paths designed specifically around your career goals.
                        </p>
                    </div>
                    <div className="why-card">
                        <h3>Beginner Friendly</h3>
                        <p>
                            Made for students and freshers who want guidance in building a strong career foundation.
                        </p>
                    </div>
                </div>
            </section>
            <section className="features-section">
                <h2 className="features-title">Platform Features</h2>
                <p className="features-subtext">
                    Explore the powerful tools CareerForge offers to help you grow, prepare, and succeed in your career journey.
                </p>
            </section>
            <div className="home-features">
                <div className="feature-card">
                    <h2>Resume Analyzer</h2>
                    <p>
                        Upload your resume and get an AI-powered score with strengths, weaknesses,
                        and improvement suggestions.
                    </p>
                    <Link to="/resume">
                        <button className="btn primary">Analyze Resume</button>
                    </Link>
                </div>
                <div className="feature-card">
                    <h2>Mock Interview</h2>
                    <p>
                        Practice interview questions and get AI feedback based on clarity,
                        structure, and confidence.
                    </p>
                    <Link to="/mock-interview">
                        <button className="btn primary">Start Interview</button>
                    </Link>
                </div>
                <div className="feature-card">
                    <h2>Job Finder</h2>
                    <p>
                        Search jobs based on your skills, location, experience level, and job type.
                    </p>
                    <Link to="/job-finder">
                        <button className="btn primary">Find Jobs</button>
                    </Link>
                </div>
                <div className="feature-card">
                    <h2>Roadmap</h2>
                    <p>
                        Get personalized learning paths and skill roadmaps based on your goals.
                    </p>
                    <Link to="/roadmap">
                        <button className="btn primary">View Roadmap</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}