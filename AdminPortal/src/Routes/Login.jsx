import React, { useState } from "react";
import "./Login.css";
import { loginAdmin } from "../api/adminAxios"; // Updated import path
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await loginAdmin(formData.username, formData.password);
      console.log("Login successful:", response);
      login(); // Update login status in context
      alert(`Welcome back! Login Successful ✅`);
      navigate("/"); // Redirect to admin dashboard
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.detail || err.message || "An error occurred during login.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2 className="login-title">Welcome Back 👋</h2>
        <p className="login-subtitle">Super Admin Login</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="signup-text">
          No account yet? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
