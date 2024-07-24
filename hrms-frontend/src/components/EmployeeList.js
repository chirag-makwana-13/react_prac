// src/components/EmployeeList.js
import React, { useEffect, useState } from 'react';
import axios from '../api';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('/employees/');
                setEmployees(response.data);
            } catch (err) {
                setError(err.response ? err.response.data : 'An error occurred');
            }
        };

        fetchEmployees();
    }, []);

    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Employee List</h1>
            <ul>
                {employees.map((employee) => (
                    <li key={employee.id}>{employee.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default EmployeeList;
