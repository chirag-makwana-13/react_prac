import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [birthdays, setBirthdays] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = {
                    'Authorization': `Bearer ${token}`
                };

                const [employeesResponse, birthdaysResponse, holidaysResponse] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/employees/', { headers }),
                    axios.get('http://127.0.0.1:8000/api/birthdays/', { headers }),
                    axios.get('http://127.0.0.1:8000/api/holidays/', { headers })
                ]);

                console.log('Employees:', employeesResponse.data);
                console.log('Birthdays:', birthdaysResponse.data);
                console.log('Holidays:', holidaysResponse.data);

                setEmployees(employeesResponse.data);
                setBirthdays(birthdaysResponse.data);
                setHolidays(holidaysResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data. Please try again later.');
            }
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            {error && <p className="error-message">{error}</p>}
            <section className="dashboard-section">
                <h2>Employee List</h2>
                {employees.length > 0 ? (
                    <ul>
                        {employees.map(employee => (
                            <li key={employee.id}>{employee.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No employees found.</p>
                )}
            </section>
            <section className="dashboard-section">
                <h2>Birthday List</h2>
                {birthdays.length > 0 ? (
                    <ul>
                        {birthdays.map(birthday => (
                            <li key={birthday.id}>{birthday.name} - {birthday.date}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No upcoming birthdays.</p>
                )}
            </section>
            <section className="dashboard-section">
                <h2>Holiday List</h2>
                {holidays.length > 0 ? (
                    <ul>
                        {holidays.map(holiday => (
                            <li key={holiday.id}>{holiday.name} - {holiday.date}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No upcoming holidays.</p>
                )}
            </section>
        </div>
    );
};

export default Dashboard;
