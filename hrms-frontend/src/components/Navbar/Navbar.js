// src/components/Navbar/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ handleLogout }) => {
    const location = useLocation();
    const [activeLink, setActiveLink] = useState('');

    useEffect(() => {
        const path = location.pathname.split('/')[1];
        setActiveLink(path ? path : 'home');
    }, [location]);

    return (
        <div className="navbar-container">
            <nav className="navbar">
                <div className="nav-header">HRMS</div>
                <ul className="nav-links">
                    <li>
                        <Link to="/dashboard" className={activeLink === 'dashboard' ? 'active' : ''}>Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/employees" className={activeLink === 'employees' ? 'active' : ''}>Employees</Link>
                    </li>
                </ul>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </nav>
            <div className="top-bar">
                <h1>{activeLink.charAt(0).toUpperCase() + activeLink.slice(1)}</h1>
            </div>
        </div>
    );
};

export default Navbar;
