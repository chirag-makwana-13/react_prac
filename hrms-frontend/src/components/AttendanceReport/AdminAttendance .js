import React, { useEffect, useState } from "react";
import axios from "../../utils/api";
import "./AdminAttendance.css";
import Pagination from "../Pagination";

const AdminAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [summary, setSummary] = useState({
    total_office_hours: 0,
    total_present_days: 0,
    total_late_days: 0,
    total_half_days: 0,
  });
  const [error, setError] = useState(null);

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

  const handleShowAttendance = async (employeeId) => {
    try {
      const params = {
        page: currentPage,
      };
      setSelectedEmployeeId(employeeId);

      const attendanceResponse = await axios.get(
        `/attendanceReport/?id=${employeeId}`,
        {
          params,
        }
      );
      const attendanceData = attendanceResponse.data.results;

      if (attendanceData.length > 0) {
        setAttendanceRecords(attendanceData);

        setSummary({
          total_office_hours: attendanceData[0].total_office_hours,
          total_present_days: attendanceData[0].total_present_days,
          total_late_days: attendanceData[0].total_late_days,
          total_half_days: attendanceData[0].total_half_days,
        });
      } else {
        setAttendanceRecords([]);
        setSummary({
          total_office_hours: 0,
          total_present_days: 0,
          total_late_days: 0,
          total_half_days: 0,
        });
      }
      setTotalPage(Math.ceil(attendanceResponse.data.count / 5));
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data.");
    }
  };

  const formatTime = (datetime) => {
    if (!datetime) return "-";
    const date = new Date(datetime);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handlePageChage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="admin-attendance-container">
      <h1>Admin Attendance View</h1>
      {error && <p className="error-message">{error}</p>}

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
                  onClick={() => handleShowAttendance(emp.id)}
                  className="attendance-button"
                >
                  Show Attendance
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedEmployeeId && (
        <>
          <div className="attendance-summary">
            <h2>Attendance Summary</h2>
            <p>
              <strong>Total Office Hours:</strong> {summary.total_office_hours}
            </p>
            <p>
              <strong>Total Present Days:</strong> {summary.total_present_days}
            </p>
            <p>
              <strong>Total Late Days:</strong> {summary.total_late_days}
            </p>
            <p>
              <strong>Total Half Days:</strong> {summary.total_half_days}
            </p>
          </div>

          <div className="attendance-details">
            <h2>Attendance Records</h2>
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Entry Time</th>
                  <th>Exit Time</th>
                  <th>Break Time</th>
                  <th>Working Hours</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record, index) => (
                  <tr key={index}>
                    <td>{record.date}</td>
                    <td>{formatTime(record.entry_time)}</td>
                    <td>{formatTime(record.exit_time)}</td>
                    <td>{record.total_break_hours.substring(0, 5)}</td>
                    <td>{record.net_working_hours.substring(0, 5)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPage}
              onPageChange={handlePageChage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAttendance;
