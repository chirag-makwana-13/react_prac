import React, { useEffect, useState } from "react";
import axios from "../../utils/api";

const TodayAttendance = ({ id, hide }) => {
  const [todayLog, setTodayLog] = useState([]);
  const [error, setError] = useState(null);
  const [updateTime, setUpdateTime] = useState("");

  useEffect(() => {
    const fetchTodayLog = async () => {
      try {
        const response = await axios.get(`/todayEmployeeActivity/`, {
          params: { emp_id: id },
        });
        setTodayLog(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching today's attendance:", error);
        setError("Failed to fetch today's attendance.");
      }
    };

    fetchTodayLog();
  }, [id]);

  const handleUpdateStatusTime = async (logId, status, previous) => {
    try {
      const todayDate = new Date().toISOString().split("T")[0];
      console.log(updateTime);
      const formattedDateTime = `${todayDate}T${updateTime}:00`;
      console.log(formattedDateTime);
      const response = await axios.put(`/todayEmployeeActivity/${logId}/`, {
        status_time: formattedDateTime, 
        status,
        previous,
      });
      setTodayLog((prevLogs) =>
        prevLogs.map((log) =>
          log.id === logId
            ? {
                ...log,
                status_time: response.data.status_time,
                // status_time: new Date(
                //   response.data.status_time
                // ).toLocaleTimeString(),
              }
            : log
        )
      );
    } catch (error) {
      console.error("Error updating status time:", error);
      setError("Failed to update status time.");
    }
  };

  return (
    <div className="today-attendance-container" style={{padding:"20px"}}>
      <h2>Today's Attendance</h2>
      {error && <p className="error-message">{error}</p>}
      <button onClick={hide} className="attendance-button back" style={{marginBottom:"20px"}}>
        Back to Employee List
      </button>
      <table className="employee-table">
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
                <input
                  type="time"
                  value={updateTime}
                  onChange={(e) => setUpdateTime(e.target.value)}
                  style={{
                    marginRight:"10px",
                    padding:"5px",
                    fontSize:"1rem"
                  }}
                />
                <button
                  onClick={() =>
                    handleUpdateStatusTime(log.id, log.status, log.status_time)
                  }
                  className="yes-button"
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
