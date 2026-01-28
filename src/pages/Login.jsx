import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import "./Login.css";
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 2000);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      showError("All fields are required");
      return;
    }
    if (!isValidEmail(formData.email)) {
      showError("Invalid Email");
      return;
    }
    if (formData.password.length < 6) {
      showError("Invalid Password"); 
      return;
    }
    try {
      setLoading(true);
     const res = await API.post("/api/auth/login", formData);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if (user.phone && user.college && user.course && user.targetRole) {
        navigate("/");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label className="section-title">Email</label>
        <input
          name="email"
          type="text"
          placeholder="Enter your email"
          onChange={handleChange}
        />
        <label className="sectionlogin-title">Password</label>
        <input
          name="password"
          type="password"
          placeholder="Enter your password"
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="signup-text">
        Don&apos;t have an account?{" "}
        <span className="signup-link" onClick={() => navigate("/signup")}>
          Sign Up
        </span>
      </p>
    </div>
  );
};
export default Login;