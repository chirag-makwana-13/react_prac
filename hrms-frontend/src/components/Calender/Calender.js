import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import axios from "../../api";
import './MyCalendar.css'; // Make sure to create and import this CSS file

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("birthdays");

  useEffect(() => {
    fetchEvents();
  }, [view]);

  const fetchEvents = async () => {
    if (view === "birthdays") {
      await fetchBirthdays();
    } else {
      await fetchLeaves();
    }
  };

  const fetchBirthdays = async () => {
    try {
      const response = await axios.get("/employees/");
      const employees = response.data;

      // Map employee data to calendar events
      const birthdayEvents = employees.map(employee => {
        const dob = new Date(employee.dob);
        const currentYear = new Date().getFullYear();
        const birthdayThisYear = new Date(currentYear, dob.getMonth(), dob.getDate());

        return {
          title: `${employee.first_name} ${employee.last_name}`,
          start: birthdayThisYear,
          end: birthdayThisYear
        };
      });

      setEvents(birthdayEvents);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchLeaves = async () => {
    try {
      const response = await axios.get("/all-leaves/");
      const leaves = response.data.results;

      // Map leave data to calendar events
      const leaveEvents = leaves
        .filter(leave => leave.status === "Approved")
        .map(leave => {
          const leaveDate = new Date(leave.date);
          return {
            title: `${leave.first_name} ${leave.last_name}`,
            start: leaveDate,
            end: leaveDate
          };
        });

      setEvents(leaveEvents);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  return (
    <div style={{ height: "500px", marginTop: "200px" }}>
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => setView("birthdays")}
          className={`calendar-button ${view === "birthdays" ? "active" : ""}`}
        >
          Birthday Calendar
        </button>
        <button
          onClick={() => setView("leaves")}
          className={`calendar-button ${view === "leaves" ? "active" : ""}`}
        >
          Leave Calendar
        </button>
      </div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        {view === "birthdays" ? "Birthday Calendar" : "Leave Calendar"}
      </h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["month"]}
        style={{ height: "500px", marginLeft: "14px", width: "93%", backgroundColor: "white" }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: "#f0f8ff",
            borderRadius: "5px",
            border: "1px solid #ddd",
            cursor: "pointer",
          }
        })}
      />
    </div>
  );
};

export default MyCalendar;
