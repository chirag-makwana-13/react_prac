import React, { useEffect, useState } from "react";
import axios from "../../api";
import "./AttedanceReport.css";
import Pagination from "../Pagination";

const AttedanceReport = () => {
  const [attendancereport, setAttedancereport] = useState([]);
  const [dataReport, setDataReport] = useState({
    total_present_days: "",
    total_office_hours: "",
    total_working_hours: "",
    total_late_days: "",
    total_half_days: "",
  });
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const attendancereportResponse = await axios.get("/attendanceReport/", {
          params: {
            page: currentPage,
          },
        });
        setAttedancereport(attendancereportResponse.data.results);
        const dataAdd = attendancereportResponse.data.results[0];
        setDataReport({
          total_present_days: dataAdd.total_present_days,
          total_office_hours: dataAdd.total_office_hours,
          total_working_hours: dataAdd.total_working_hours,
          total_late_days: dataAdd.total_late_days,
          total_half_days: dataAdd.total_half_days,
        });
        setTotalPage(Math.ceil(attendancereportResponse.data.count / 10));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, [currentPage]);

  const formatTime1 = (datetime) => {
    if (!datetime) return "-";
    const date = new Date(datetime);
    // Check if the date is valid
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handlePageChage = (page) => {
    setCurrentPage(page);
  };

  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hrs, " : " hrs, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " mins " : " mins ") : "";
    return hDisplay + mDisplay; 
}

  return (
    <div className="attendance-list-container">
      <h1>Attendace-Report List</h1>
      <div className="lcard">
        <p className="ulcard p"><strong>Days: </strong><br/><br/>{dataReport.total_present_days}</p>
        <p className="plcard p"><strong>Late: </strong><br/><br/>{dataReport.total_late_days}</p>
        <p className="ulcard p"><strong>Half Days: </strong><br/><br/>{dataReport.total_half_days}</p>
        <p className="plcard p"><strong>Total Office: </strong><br/><br/>{dataReport.total_office_hours}</p>
        <p className="ulcard p"><strong>Total worked: </strong><br/><br/>{secondsToHms(dataReport.total_working_hours)}</p>
      </div><br/>
      {error && <p className="error-message">{error}</p>}
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Date</th>
            <th>Entry Time</th>
            <th>Exit Time</th>
            <th>Break Time</th>
            <th>Working Hours</th>
          </tr>
        </thead>
        {attendancereport.length > 0 ? (
          <tbody>
            {attendancereport.map((attendance, index) => (
              <tr key={attendance.id}>
                <td>{index + 1}</td>
                <td>{attendance.date}</td>
                <td>{formatTime1(attendance.entry_time)}</td>
                <td>{formatTime1(attendance.exit_time)}</td>
                <td>{attendance.total_break_hours.substring(0, 5)}</td>
                <td>{attendance.net_working_hours.substring(0, 5)}</td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan="12">
                <h4>No Attendance Report found.</h4>
              </td>
            </tr>
          </tbody>
        )}
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPage}
        onPageChange={handlePageChage}
      />
    </div>
  );
};

export default AttedanceReport;
