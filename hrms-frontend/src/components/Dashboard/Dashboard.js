// src/components/Dashboard/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from '../../api';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const [birthdays, setBirthdays] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [holidaysPerPage] = useState(5);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [birthdaysResponse, holidaysResponse] = await Promise.all([
                    axios.get('/birthdays/'),
                    axios.get('/holidays/')
                ]);

                setBirthdays(birthdaysResponse.data);
                setHolidays(holidaysResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data. Please try again later.');
            }
        };

        fetchData();
    }, []);

    const indexOfLastHoliday = currentPage * holidaysPerPage;
    const indexOfFirstHoliday = indexOfLastHoliday - holidaysPerPage;
    const currentHolidays = holidays.slice(indexOfFirstHoliday, indexOfLastHoliday);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="dashboard-container">

            <h1>Dashboard</h1>
            {error && <p className="error-message">{error}</p>}
            <section className="dashboard-section">
                <h2>Birthday List</h2>
                {birthdays.length > 0 ? (
                    <ul>
                        {birthdays.map(birthday => (
                            <li key={birthday.id}>{birthday.username} - {birthday.dob}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No upcoming birthdays.</p>
                )}
            </section>
            <section className="dashboard-section">
                <h2>Holiday List</h2>
                {currentHolidays.length > 0 ? (
                    <ul>
                        {currentHolidays.map(holiday => (
                            <li key={holiday.id}>{holiday.name} - {holiday.date}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No upcoming holidays.</p>
                )}
                <div className="pagination">
                    {Array.from({ length: Math.ceil(holidays.length / holidaysPerPage) }, (_, i) => (
                        <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
                            {i + 1}
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
