import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { debounce } from "lodash";
import axios from "../../api";
import "./EmployeeList.css";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [message, setMessage] = useState("");
  const [searchEmployee, setSearchemployee] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    relationship_status: "",
    department: "",
    date_of_joining: "",
    phone_number: "",
    address: "",
    profile: "",
  });

  const { register } = useForm();

  const handleSearch = useCallback(
    debounce((searchEmployee) => {
      setSearchemployee(searchEmployee);
    }, 300),
    [searchEmployee]
  );

  const handleChangeSearch = (event) => {
    const searchTerm = event.target.value;
    handleSearch(searchTerm);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get("/auth/user/");
        setIsAdmin(userResponse.data.is_staff);

        const employeesResponse = await axios.get("/employees/", {
          params: {
            search: searchEmployee,
          },
        });
        setEmployees(employeesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, [searchEmployee]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/employees/${id}/`);
      setEmployees(employees.filter((employee) => employee.id !== id));
      setMessage("Employee deleted successfully");
      setDeletingEmployee(null);
    } catch (error) {
      console.error("Error deleting employee:", error);
      setError("Failed to delete employee. Please try again later.");
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee.id);
    setFormData({
      username: employee.username,
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      gender: employee.gender,
      relationship_status: employee.relationship_status,
      department: employee.department,
      date_of_joining: employee.date_of_joining,
      phone_number: employee.phone_number,
      address: employee.address,
      profile: employee.profile,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`/employees/${id}/`, formData);
      setEmployees(
        employees.map((emp) => (emp.id === id ? { ...emp, ...formData } : emp))
      );
      setMessage("Employee updated successfully");
      setEditingEmployee(null);
    } catch (error) {
      console.error("Error updating employee:", error);
      setError("Failed to update employee. Please try again later.");
    }
  };

  return (
    <div className="employee-list-container">
      <h1>Employee List</h1>
      {/* <input
        placeholder="Search Here"
        onChange={(event) => setSearchemployee(event.target.value)}
        className="search"
      /> */}
      <form>
        <input
          type="text"
          placeholder="Search..."
          {...register("search", {
            onChange: (e) => handleChangeSearch(e),
          })}
          className="search"
        />
      </form>
      <br />
      {error && <p className="error-message">{error}</p>}
      {message && <p className="message">{message}</p>}
      <br />
      <table className="employee-table">
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Relationship Status</th>
            <th>Department</th>
            <th>Date of Joining</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Bio</th>
            <th>Profile</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        {employees.length > 0 ? (
          <>
            <tbody>
              {employees.map((employee, index) => (
                <tr key={employee.id}>
                  <td>{index + 1}</td>
                  <td>{employee.username}</td>
                  <td>{employee.first_name}</td>
                  <td>{employee.last_name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.gender}</td>
                  <td>{employee.relationship_status}</td>
                  <td>{employee.department}</td>
                  <td>{employee.date_of_joining}</td>
                  <td>{employee.phone_number}</td>
                  <td>{employee.address}</td>
                  <td>{employee.bio}</td>
                  <td>
                    <img
                      src={employee.profile}
                      alt={employee.username}
                      style={{
                        height: "70px",
                        width: "70px",
                        borderRadius: "100%",
                      }}
                    />
                  </td>
                  {isAdmin && (
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(employee)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => setDeletingEmployee(employee.id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </>
        ) : (
          <tbody>
            <tr>
              <td colSpan="12">
                <h4>No employees found.</h4>
              </td>
            </tr>
          </tbody>
        )}
      </table>
      {editingEmployee && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setEditingEmployee(null)}>
              &times;
            </span>
            <h2>Edit Employee</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(editingEmployee);
              }}
            >
              <label>First Name:</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
              <label>Last Name:</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <label>Gender:</label>
              <input
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              />
              <label>Relationship Status:</label>
              <input
                type="text"
                name="relationship_status"
                value={formData.relationship_status}
                onChange={handleChange}
              />
              <label>Department:</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
              <label>Date of Joining:</label>
              <input
                type="date"
                name="date_of_joining"
                value={formData.date_of_joining}
                onChange={handleChange}
              />
              <label>Phone Number:</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
              <label>Bio:</label>
              <input
                type="text"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              />
              <button type="submit">Update</button>
            </form>
          </div>
        </div>
      )}
      {deletingEmployee && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setDeletingEmployee(null)}>
              &times;
            </span>
            <h2>Confirm Delete</h2>
            <h4>Are you sure you want to delete this employee?</h4>
            <button
              onClick={() => handleDelete(deletingEmployee)}
              className="yes-button"
            >
              Yes
            </button>
            <button
              onClick={() => setDeletingEmployee(null)}
              className="cancle-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
