import React, { useEffect, useState } from "react";
import axios from "../../utils/api";
import "./TodayAttendance.css";

const TodayAttendance = ({ id, hide }) => {
  const [todayLog, setTodayLog] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodayLog = async () => {
      try {
        const response = await axios.get(`/todayEmployeeActivity/${id}/`);
        setTodayLog([response.data]);
      } catch (error) {
        console.error("Error fetching today's attendance:", error);
        setError("Failed to fetch today's attendance.");
      }
    };

    fetchTodayLog();
  }, [id]);

  const handleUpdateStatusTime = async (logId) => {
    try {
      const response = await axios.put(`/todayEmployeeActivity/${logId}/`, {
        status_time: new Date().toISOString(), // Update with current time
      });
      setTodayLog((prevLogs)=>
        prevLogs.map((log)=>
          log.id === logId ? { ...log, status_time: response.data.status_time } : log
        )
      );
    } catch (error) {
      console.error("Error updating status time:", error);
      setError("Failed to update status time.");
    }
  };

  return (
    <div className="today-attendance-container">
      <h2>Today's Attendance</h2>
      {error && <p className="error-message">{error}</p>}
      <button onClick={hide} className="back-button">Back to Employee List</button>
      <table className="today-log-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Status</th>
            <th>Status Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {todayLog.map((log) => (
            <tr key={log.id}>
              <td>{log.first_name}</td>
              <td>{log.last_name}</td>
              <td>{log.status}</td>
              <td>{new Date(log.status_time).toLocaleTimeString()}</td>
              <td>
                <button
                  onClick={() => handleUpdateStatusTime(log.id)}
                  className="update-button"
                >
                  Update Status Time
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodayAttendance;
    