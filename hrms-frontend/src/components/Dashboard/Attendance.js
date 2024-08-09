import React, { useState, useEffect } from "react";
import axios from "../../utils/api";
import "./Dashboard.css";

const Attendance = () => {
  const [error, setError] = useState("");
  const [attendancereport, setAttedancereport] = useState([]);
  const [dataReport, setDataReport] = useState({
    total_present_days: "",
    total_office_hours: "",
    total_working_hours: "",
    total_late_days: "",
    total_half_days: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attendancereportResponse] = await Promise.all([
          axios.get("/attendanceReport/"),
        ]);

        setAttedancereport(attendancereportResponse.data.results);
        const dataAdd = attendancereportResponse.data.results[0];
        setDataReport({
          total_present_days: dataAdd.total_present_days,
          total_office_hours: dataAdd.total_office_hours,
          total_working_hours: dataAdd.total_working_hours,
          total_late_days: dataAdd.total_late_days,
          total_half_days: dataAdd.total_half_days,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hrs, " : " hrs, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " mins " : " mins ") : "";
    return hDisplay + mDisplay;
  }

  return (
    <div>
      <div className="">
        <section className="middle">
          <h1>Record Your Attendance</h1>
          <div className="card">
            <div className="attendance">
              <div className="attendance-card">
                <p className="p">
                  <strong>Days: </strong>
                  {dataReport.total_present_days}
                </p>
                <p className="p">
                  <strong>Late: </strong>
                  {dataReport.total_late_days}
                </p>
                <p className="p">
                  <strong>Half Days: </strong>
                  {dataReport.total_half_days}
                </p>
                <p className="p">
                  <strong>Total Office: </strong>
                  {dataReport.total_office_hours}
                </p>
                <p className="p">
                  <strong>Total worked: </strong>
                  {secondsToHms(dataReport.total_working_hours)}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Attendance;
