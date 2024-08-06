import React, { useState, useEffect } from "react";
import axios from "../../api";
import "./Dashboard.css";

const Dashboard = () => {
  const [birthdays, setBirthdays] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [logs, setLogs] = useState([]);
  const [todaylogs, setTodaylogs] = useState([]);
  const [currentHolidayPage, setCurrentHolidayPage] = useState(1);
  const [currentBirthdayPage, setCurrentBirthdayPage] = useState(1);
  const [itemsPerPage] = useState(1);
  const [searchTodaylogs, setSearchtodaylogs] = useState("");
  const [error, setError] = useState("");
  const [attendancereport, setAttedancereport] = useState([]);
  const [dataReport, setDataReport] = useState({
    total_present_days: "",
    total_office_hours: "",
    total_working_hours: "",
    total_late_days: "",
    total_half_days: "",
  });
  const [buttonsState, setButtonsState] = useState({
    checkIn: false,
    breakIn: true,
    breakOut: true,
    checkOut: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          birthdaysResponse,
          holidaysResponse,
          logsResponse,
          attendancereportResponse,
          todaylogsResponse,
        ] = await Promise.all([
          axios.get("/birthdays/"),
          axios.get("/holidays/"),
          axios.get("/employeeDailyLogs/"),
          axios.get("/attendanceReport/"),
          axios.get("/todayEmployeeActivity/", {
            params: {
              search: searchTodaylogs,
            },
          }),
        ]);

        setBirthdays(birthdaysResponse.data);
        setHolidays(holidaysResponse.data);
        setLogs(logsResponse.data);
        setAttedancereport(attendancereportResponse.data.results);
        const dataAdd = attendancereportResponse.data.results[0];
        setDataReport({
          total_present_days: dataAdd.total_present_days,
          total_office_hours: dataAdd.total_office_hours,
          total_working_hours: dataAdd.total_working_hours,
          total_late_days: dataAdd.total_late_days,
          total_half_days: dataAdd.total_half_days,
        });
        setTodaylogs(todaylogsResponse.data);
        updateButtonState(logsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, [searchTodaylogs]);

  const updateButtonState = (logs) => {
    if (logs.length > 0) {
      const latestLog = logs[logs.length - 1];
      if (!latestLog.checkIn) {
        setButtonsState({
          checkIn: false,
          breakIn: true,
          breakOut: true,
          checkOut: true,
        });
      } else if (
        latestLog.checkIn &&
        !latestLog.breaks.length &&
        !latestLog.checkOut
      ) {
        setButtonsState({
          checkIn: true,
          breakIn: false,
          breakOut: true,
          checkOut: false,
        });
      } else if (
        latestLog.breaks.length &&
        !latestLog.breaks[latestLog.breaks.length - 1].breakOut &&
        !latestLog.checkOut
      ) {
        setButtonsState({
          checkIn: true,
          breakIn: true,
          breakOut: false,
          checkOut: true,
        });
      } else if (
        latestLog.checkIn &&
        latestLog.breaks.length &&
        latestLog.breaks[latestLog.breaks.length - 1].breakOut &&
        !latestLog.checkOut
      ) {
        setButtonsState({
          checkIn: true,
          breakIn: false,
          breakOut: true,
          checkOut: false,
        });
      } else {
        setButtonsState({
          checkIn: true,
          breakIn: true,
          breakOut: true,
          checkOut: true,
        });
      }
    }
  };

  const handleAction = async (action) => {
    try {
      await axios.post(`/${action}/`);
      const logsResponse = await axios.get("/employeeDailyLogs/");
      setLogs(logsResponse.data);
      updateButtonState(logsResponse.data);
    } catch (error) {
      console.error(`Failed to ${action}:`, error);
      setError(`Failed to ${action}. Please try again later.`);
    }
  };

  const indexOfLastHoliday = currentHolidayPage * itemsPerPage;
  const indexOfFirstHoliday = indexOfLastHoliday - itemsPerPage;
  const currentHoliday = holidays.slice(
    indexOfFirstHoliday,
    indexOfLastHoliday
  );

  const indexOfLastBirthday = currentBirthdayPage * itemsPerPage;
  const indexOfFirstBirthday = indexOfLastBirthday - itemsPerPage;
  const currentBirthday = birthdays.slice(
    indexOfFirstBirthday,
    indexOfLastBirthday
  );
  const holidayimage = currentHoliday.holiday_image;
  const handleHolidayPagination = (direction) => {
    setCurrentHolidayPage((prevPage) => {
      const newPage = direction === "next" ? prevPage + 1 : prevPage - 1;
      return newPage > 0 && newPage <= Math.ceil(holidays.length / itemsPerPage)
        ? newPage
        : prevPage;
    });
  };

  const handleBirthdayPagination = (direction) => {
    setCurrentBirthdayPage((prevPage) => {
      const newPage = direction === "next" ? prevPage + 1 : prevPage - 1;
      return newPage > 0 &&
        newPage <= Math.ceil(birthdays.length / itemsPerPage)
        ? newPage
        : prevPage;
    });
  };

  const formatTime1 = (datetime) => {
    if (!datetime) return "-"; // Return a placeholder if the datetime is null or invalid
    const date = new Date(datetime);
    // Check if the date is valid
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hrs, " : " hrs, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " mins " : " mins ") : "";
    return hDisplay + mDisplay;
  }

  const handlefecth = () => {
    axios
      .get("/todayEmployeeActivity/", {
        params: {
          search: searchTodaylogs,
        },
      })
      .then((response) => {
        setTodaylogs(response.data);
      })
      .catch((error) => {
        console.error("cannot fetch data", error);
      });
  };

  // useEffect(() => {}, [searchTodaylogs]);

  return (
    <div>
      <div className="dashboard-container">
        <div className="upper-container">
          <section className="dashboard-section">
            <h2>Upcoming Birthday</h2>
            {currentBirthday.length > 0 ? (
              <div className="card">
                {currentBirthday.map((birthday) => (
                  <div key={birthday.id} className="birthday-card">
                    <h3>
                      {birthday.first_name} {birthday.last_name}
                    </h3>
                    <p style={{ fontSize: "17px" }}>
                      {new Date(birthday.dob).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "long",
                      })}
                    </p>
                  </div>
                ))}
                <div className="pagination">
                  <button
                    onClick={() => handleBirthdayPagination("prev")}
                    disabled={currentBirthdayPage === 1}
                    className="pagination-button"
                  >
                    &lt;
                  </button>
                  <button
                    onClick={() => handleBirthdayPagination("next")}
                    disabled={
                      currentBirthdayPage ===
                      Math.ceil(birthdays.length / itemsPerPage)
                    }
                    className="pagination-button"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            ) : (
              <p>No upcoming birthdays.</p>
            )}
          </section>

          <section className="dashboard-section">
            <h2>Holidays</h2>
            {currentHoliday.length > 0 ? (
              <div className="card">
                {currentHoliday.map((holiday) => (
                  <div
                    key={holiday.id}
                    className="holiday-card"
                    style={{
                      backgroundImage: `url(${holiday.holiday_image})`,
                      backgroundRepeat: "no-repeat",
                      objectFit:"cover",
                      backgroundSize: "300px 200px",
                      color:"white"                   
                    }}
                  >
                    <h1>{holiday.name}</h1>
                    <p style={{ fontSize: "17px" }}>
                      {new Date(holiday.date).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "long",
                      })}
                    </p>
                  </div>
                ))}
                <div className="pagination">
                  <button
                    onClick={() => handleHolidayPagination("prev")}
                    disabled={currentHolidayPage === 1}
                    className="pagination-button"
                  >
                    &lt;
                  </button>
                  <button
                    onClick={() => handleHolidayPagination("next")}
                    disabled={
                      currentHolidayPage ===
                      Math.ceil(holidays.length / itemsPerPage)
                    }
                    className="pagination-button"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            ) : (
              <p>No upcoming holidays.</p>
            )}
          </section>
        </div>
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

        <div className="lower-container">
          {error && <p className="error-message">{error}</p>}
          <h2>Today's Action</h2>
          <div className="actions">
            <button
              onClick={() => handleAction("checkin")}
              disabled={buttonsState.checkIn}
              className={`action-button ${
                buttonsState.checkIn ? "disabled" : "checkin"
              }`}
            >
              Check In
            </button>
            <button
              onClick={() => handleAction("breakin")}
              disabled={buttonsState.breakIn}
              className={`action-button ${
                buttonsState.breakIn ? "disabled" : "breakin"
              }`}
            >
              Break In
            </button>
            <button
              onClick={() => handleAction("breakout")}
              disabled={buttonsState.breakOut}
              className={`action-button ${
                buttonsState.breakOut ? "disabled" : "breakout"
              }`}
            >
              Break Out
            </button>
            <button
              onClick={() => handleAction("checkout")}
              disabled={buttonsState.checkOut}
              className={`action-button ${
                buttonsState.checkOut ? "disabled" : "checkout"
              }`}
            >
              Check Out
            </button>
          </div>

          <section className="logs-section">
            <h2>Logs</h2>
            <div className="card">
              {logs.length > 0 ? (
                <>
                  {logs.map((log, index) => (
                    <div key={index} className="login-card">
                      <p className="p">
                        <strong>Check In:</strong> {formatTime1(log.checkIn)}
                      </p>
                      {log.breaks.length > 0 &&
                        log.breaks.map((breakItem, index) => (
                          <div key={index}>
                            <p className="p">
                              <strong>Break In:</strong>{" "}
                              {formatTime1(breakItem.breakIn)}
                            </p>
                            <p className="p">
                              <strong>Break Out:</strong>{" "}
                              {formatTime1(breakItem.breakOut)}
                            </p>
                          </div>
                        ))}
                      <p className="p">
                        <strong>Check Out:</strong> {formatTime1(log.checkOut)}
                      </p>
                    </div>
                  ))}
                </>
              ) : (
                <h4>No logs available.</h4>
              )}
            </div>
          </section>
        </div>
      </div>
      <section className="todaylogs-section">
        <h2>Todays All Logs</h2>
        <input
          placeholder="Search Here"
          onChange={(event) => setSearchtodaylogs(event.target.value)}
          className="search"
        />
        <button className="refresh" onClick={handlefecth}>
          Refresh
        </button>
        <br />
        <br />
        <div className="todaycard">
          {todaylogs.length > 0 ? (
            <>
              {todaylogs.map((todaylog, index) => (
                <div key={index} className="todaylog-card">
                  <p className="p">{`${todaylog.first_name} ${
                    todaylog.last_name
                  } ${todaylog.status} ${formatTime1(
                    todaylog.status_time
                  )}`}</p>
                </div>
              ))}
            </>
          ) : (
            <h4>No logs available.</h4>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
