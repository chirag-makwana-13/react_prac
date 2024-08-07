import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { debounce } from "lodash";
import { Button, Card } from "react-bootstrap";
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
      <h1>Hotline</h1>
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
      {employees.length > 0 ? (
        <>
      <div className="hotline">
        {employees.map((employee) => (
          <Card
            className="hotline-card"
            style={{ width: "18rem", marginTop: "30px", cursor: "pointer" }}
          >
            <Card.Img
              variant="top"
              src={employee.profile}
              alt={employee.username}
              style={{ height: "300px", width: "290px", borderRadius: "15px" }}
            />
            <Card.Body>
              <Card.Title>
                <h2>{employee.department}</h2>
              </Card.Title>
              <Card.Text style={{ fontSize: "20px" }}>
                {employee.first_name} {employee.last_name}
              </Card.Text>
            </Card.Body>
            {isAdmin && (
              <div>
                <Button
                  className="yes-button "
                  onClick={() => handleEdit(employee)}
                >
                  Edit
                </Button>
                <Button
                  className="cancle-button"
                  onClick={() => setDeletingEmployee(employee.id)}
                >
                  Delete
                </Button>
              </div>
            )}
          </Card>
        ))}
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
      </>
      ) : (
        <h4 className="card">No employees found.</h4>
      )}
    </div>
    
  );
};

export default EmployeeList;
