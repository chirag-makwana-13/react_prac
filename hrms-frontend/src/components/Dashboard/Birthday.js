import React, { useState, useEffect } from "react";
import axios from "../../utils/api";
import "./Dashboard.css";

const Birthday = () => {
  const [birthdays, setBirthdays] = useState([]);
  const [currentBirthdayPage, setCurrentBirthdayPage] = useState(1);
  const [itemsPerPage] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [birthdaysResponse] = await Promise.all([
          axios.get("/birthdays/"),
        ]);

        setBirthdays(birthdaysResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const indexOfLastBirthday = currentBirthdayPage * itemsPerPage;
  const indexOfFirstBirthday = indexOfLastBirthday - itemsPerPage;
  const currentBirthday = birthdays.slice(
    indexOfFirstBirthday,
    indexOfLastBirthday
  );

  const handleBirthdayPagination = (direction) => {
    setCurrentBirthdayPage((prevPage) => {
      const newPage = direction === "next" ? prevPage + 1 : prevPage - 1;
      return newPage > 0 &&
        newPage <= Math.ceil(birthdays.length / itemsPerPage)
        ? newPage
        : prevPage;
    });
  };

  return (
    <div>
      <div className="">
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
        </div>
      </div>
    </div>
  );
};

export default Birthday;
