// src/components/EmployeeList/EmployeeList.js
import React, { useEffect, useState } from 'react';
import axios from '../../api';
import './EmployeeList.css';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/employees/');
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data. Please try again later.');
            }
        };

        fetchData();
    }, []);

    return (
        <div className="employee-list-container">
            <h1>Employee List</h1>
            {error && <p className="error-message">{error}</p>}
            {employees.length > 0 ? (
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>Sr No</th>
                            <th>Username</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Gender</th>
                            <th>Relationship Status</th>
                            <th>Department</th>
                            <th>Date of Joining</th>
                            <th>Phone Number</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee, index) => (
                            <tr key={employee.id}>
                                <td>{index + 1}</td>
                                <td>{employee.username}</td>
                                <td>{employee.first_name}</td>
                                <td>{employee.last_name}</td>
                                <td>{employee.email}</td>
                                <td>{employee.gender}</td>
                                <td>{employee.relationship_status}</td>
                                <td>{employee.department}</td>
                                <td>{employee.date_of_joining}</td>
                                <td>{employee.phone_number}</td>
                                <td>{employee.address}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No employees found.</p>
            )}
        </div>
    );
};

export default EmployeeList;
