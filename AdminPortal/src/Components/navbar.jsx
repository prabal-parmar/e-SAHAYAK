import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import logo from "./logo.png";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout(); // Use logout from context
    navigate("/login");
  };

  return (
    <nav className="navbar-3d">
      <div
        className="nav-logo"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        <img src={logo} alt="MP Govt Logo" />
        <span>मध्यप्रदेश श्रम मंत्रालय</span>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/workers">Workers</Link>
        </li>
        <li>
          <Link to="/complaint">Complaint Box</Link>
        </li>
        <li>
          <Link to="/employers">Employer</Link>
        </li>
        {isLoggedIn ? (
          <li>
            <button onClick={handleLogout} className="nav-logout-btn">
              Logout
            </button>
          </li>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
