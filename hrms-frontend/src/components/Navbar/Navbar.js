// src/components/Navbar/Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ handleLogout }) => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");
  const username = localStorage.getItem("username");

  useEffect(() => {
    const path = location.pathname.split("/")[1];
    setActiveLink(path ? path : "home");
  }, [location]);

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div className="nav-header">HRMS</div>
        <ul className="nav-links">
          <li>
            <Link
              to="/dashboard"
              className={activeLink === "dashboard" ? "active" : ""}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/employees"
              className={activeLink === "employees" ? "active" : ""}
            >
              Employees
            </Link>
          </li>
          <li>
            <Link
              to="/attendance"
              className={activeLink === "attendance" ? "active" : ""}
            >
              Attendance
            </Link>
          </li>
          <li>
            <Link
              to="/leaves"
              className={activeLink === "leaves" ? "active" : ""}
            >
              Leaves
            </Link>
          </li>
          <li>
            <Link
              to="/calendar"
              className={activeLink === "calendar" ? "active" : ""}
            >
              Calendar
            </Link>
          </li>
          <li>
            <Link
              to="/changepassword"
              className={activeLink === "changepassword" ? "active" : ""}
            >
              Change Password
            </Link>
          </li>
        </ul>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </nav>
      <div className="top-bar" style={{display:"flex"}}>
        <div >
          <h1>{activeLink.charAt(0).toUpperCase() + activeLink.slice(1)}</h1>
        </div>
        <div style={{marginLeft:"1000px"}}>
          <h2>{username.toUpperCase()}</h2>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
