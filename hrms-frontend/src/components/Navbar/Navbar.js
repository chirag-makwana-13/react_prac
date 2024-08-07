// src/components/Navbar/Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useSelector } from "react-redux";

const Navbar = ({ handleLogout }) => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");
  // const { user } = useSelector((state) => state.user);
  const { firstName } = useSelector((state) => state.firstName);
  const { lastName } = useSelector((state) => state.lastName);
  const { profile } = useSelector((state) => state.profile);

  useEffect(() => {
    const path = location.pathname.split("/")[1];
    setActiveLink(path ? path : "home");
  }, [location]);

  console.log(firstName);
  // if (user) {
  //   return navigate("/dashboard");
  // }

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
              Hotline
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
      <div className="top-bar" style={{ display: "flex" }}>
        <div>
          <h1>{activeLink.charAt(0).toUpperCase() + activeLink.slice(1)}</h1>
        </div>
        <div style={{ marginLeft: "900px", display:"flex" }}>
          <img
            src={`http://127.0.0.1:8000${profile}`}
            alt="No image found"
            style={{
              height: "70px",
              width: "70px",
              borderRadius: "100%",
            }}
          />&emsp;
          <h2>
            {firstName} {lastName}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
