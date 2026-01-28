import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 2000);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      showError("All fields are required");
      return;
    }
    if (!isValidEmail(formData.email)) {
      showError("Please enter a valid email address");
      return;
    }
    if (formData.password.length < 6) {
      showError("Password must be at least 6 characters");
      return;
    }
    try {
      await API.post("/api/auth/signup", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
    }
  };
  return (
    <div className="signup-container">
      <h2>Signup</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label className="sectionlogin-title">Enter Name:</label>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <label className="sectionlogin-title">Enter Mail:</label>
        <input name="email" type="text" placeholder="Email" onChange={handleChange} />
        <label className="sectionlogin-title">Enter Password:</label>
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};
export default Signup;