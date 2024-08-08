import React, { useState, useEffect } from "react";
import axios from "../../api";
import "./Leaves.css";

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  //   const [allleaves, setAllleaves] = useState([]);
  const [leaveDetails, setLeaveDetails] = useState({
    remaining_paid_leave: 0,
    remaining_unpaid_leave: 0,
    remaining_casual_leave: 0,
    remaining_sick_leave: 0,
    total_approved_leaves: 0,
    first_name: "",
    last_name: "",
  });
  const [newLeave, setNewLeave] = useState({
    date: "",
    type: "",
    reason: "",
    leave_day_type: "Full_Day",
  });
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          leavesResponse,
          leaveDetailsResponse,
          userResponse,
          //   allleaveResponse,
        ] = await Promise.all([
          (!isAdmin && axios.get("/leave/")) ||
            (isAdmin && axios.get("/all-leaves/")),
          axios.get("/leave-details/"),
          axios.get("/auth/user/"),
        ]);

        setLeaves(leavesResponse.data.results);
        setLeaveDetails(leaveDetailsResponse.data[0]);
        setIsAdmin(userResponse.data.is_staff);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, [isAdmin]);
  // ----------------Another way a allleave admin side
  // useEffect(() => {
  //   if (isAdmin) {
  //     axios

  //       .then((response) => {
  //         setLeaves(response.data.results);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }
  // }, [isAdmin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLeave((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/leave/", newLeave);
      setNewLeave({
        date: "",
        type: "",
        reason: "",
        leave_day_type: "Full_Day",
      });
      const leavesResponse = await axios.get("/leave/");
      setLeaves(leavesResponse.data.results);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to submit leave application:", error);
      setError("Failed to submit leave application. Please try again later.");
    }
  };

  const handleApprove = async (leaveId) => {
    try {
      const status = {
        status: "Approved",
      };
      await axios.patch(`/update-leave-status/${leaveId}/`, {
        status: "Approved",
      });
      setLeaves((prev) =>
        prev.map((leaves) =>
          leaves.id === leaveId ? { ...leaves, ...status } : leaves
        )
      );
    } catch (error) {
      console.error("Failed to approve leave:", error);
      setError("Failed to approve leave. Please try again later.");
    }
  };

  const handleRejected = async (leaveId) => {
    try {
      const status = {
        status: "Rejected",
      };
      await axios.patch(`/update-leave-status/${leaveId}/`, {
        status: "Rejected",
      });
      setLeaves((prev) =>
        prev.map((leaves) =>
          leaves.id === leaveId ? { ...leaves, ...status } : leaves
        )
      );
    } catch (error) {
      console.error("Failed to reject leave:", error);
      setError("Failed to reject leave. Please try again later.");
    }
  };

  return (
    <div className="leaves-container">
      {isAdmin ? (
        <div className="admin-leave-list">
          <h2>All Leaves</h2>
          <table className="leave-table admin">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Date</th>
                <th>Type</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Leave Day Type</th>
                <th>Action</th>
              </tr>
            </thead>
            {leaves.length > 0 ? (
              <>
                <tbody>
                  {console.log(leaves, "voiew")}
                  {leaves.map((allleave, index) => (
                    <tr key={allleave.id}>
                      <td>{index + 1}</td>
                      <td>{new Date(allleave.date).toLocaleDateString()}</td>
                      <td>{allleave.type}</td>
                      <td>{allleave.status}</td>
                      <td>{allleave.reason || "-"}</td>
                      <td>{allleave.leave_day_type}</td>
                      <button
                        className="add-leave-button"
                        onClick={() => handleApprove(allleave.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="remove-leave-button"
                        onClick={() => handleRejected(allleave.id)}
                      >
                        Rejected
                      </button>
                    </tr>
                  ))}
                </tbody>
              </>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="12">
                    <h4>No leaves list found.</h4>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      ) : (
        <>
          <h1>Leave Balance</h1>
          <div className="lcard">
            <p className="plcard p">
              Paid Leave (PL): {leaveDetails.remaining_paid_leave}
            </p>
            <p className="ulcard p">
              Unpaid Leave (UL): {leaveDetails.remaining_unpaid_leave}
            </p>
            <p className="clcard p">
              Casual Leave (CL): {leaveDetails.remaining_casual_leave}
            </p>
            <p className="slcard p">
              Sick Leave (SL): {leaveDetails.remaining_sick_leave}
            </p>
            <p className="tlcard p">
              Total Approved Leaves: {leaveDetails.total_approved_leaves}
            </p>
            <h4>
              Name: {leaveDetails.first_name} {leaveDetails.last_name}
            </h4> 
          </div>
          <div className="leave-actions">
            <button
              className="add-leave-button"
              onClick={() => setIsModalOpen(true)}
            >
              Add Leave
            </button>
          </div>
          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={() => setIsModalOpen(false)}>
                  &times;
                </span>
                <h3>Apply for Leave</h3>
                <form onSubmit={handleSubmit}>
                  <label>
                    Date:
                    <input
                      type="date"
                      name="date"
                      value={newLeave.date}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    Type:<br/><br/>
                    <select
                      name="type"
                      style={{height:"30px", width:"500px"}}
                      value={newLeave.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="PL">Paid Leave (PL)</option>
                      <option value="UL">Unpaid Leave (UL)</option>
                      <option value="CL">Casual Leave (CL)</option>
                      <option value="SL">Sick Leave (SL)</option>
                    </select>
                  </label>
                  <label><br/><br/>
                    Reason:<br/><br/>
                    <textarea
                      name="reason"
                      style={{height:"30px", width:"500px"}}
                      value={newLeave.reason}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label><br/><br/>
                    Leave Day Type:<br/><br/>
                    <select
                      name="leave_day_type"
                      style={{height:"30px", width:"500px"}}
                      value={newLeave.leave_day_type}
                      onChange={handleInputChange}
                    >
                      <option value="Full_Day">Full Day</option>
                      <option value="First_Half">1st Half Day</option>
                      <option value="Last_Half">2nd Half Day</option>
                    </select>
                  </label>
                  <button className="add-leave-button" type="submit">Submit</button>
                </form>
                {error && <p className="error-message">{error}</p>}
              </div>
            </div>
          )}
          <div className="leave-list-container">
            <h1>Leaves List</h1>
            <table className="leave-table">
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Reason</th>
                  <th>Leave Day Type</th>
                </tr>
              </thead>
              {leaves.length > 0 ? (
                <tbody>
                  {leaves.map((leave, index) => (
                    <tr key={leave.id}>
                      <td>{index + 1}</td>
                      <td>{new Date(leave.date).toLocaleDateString()}</td>
                      <td>{leave.type}</td>
                      <td>{leave.status}</td>
                      <td>{leave.reason || "-"}</td>
                      <td>{leave.leave_day_type}</td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan="12">
                      <h4>No leaves list found.</h4>
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Leaves;
