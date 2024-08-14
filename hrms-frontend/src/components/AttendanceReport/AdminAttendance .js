import React, { useEffect, useState } from "react";
import axios from "../../utils/api";
import "./AdminAttendance.css";
import ParticularAttendance from "./ParticularAttendance";

const AdminAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [viewAttendance, setViewAttendance] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("/employees/");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("Failed to fetch employees.");
      }
    };

    fetchEmployees();
  }, []);

  const handleBackToEmployeeList = () => {
    setViewAttendance(false);
  };

  const handleAttendanceData = (id) => {
    setViewAttendance(true);
    setUserId(id);
  };

  return (
    <div className="admin-attendance-container">
      <h1>Admin Attendance View</h1>
      {error && <p className="error-message">{error}</p>}

      {!viewAttendance ? (
        <table className="employee-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.first_name}</td>
                <td>{emp.last_name}</td>
                <td>{emp.email}</td>
                <td>
                  <button
                    onClick={() => handleAttendanceData(emp.id)}
                    className="attendance-button"
                  >
                    Show Attendance
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <ParticularAttendance id={userId} hide={handleBackToEmployeeList} />
      )}
    </div>
  );
};

export default AdminAttendance;
