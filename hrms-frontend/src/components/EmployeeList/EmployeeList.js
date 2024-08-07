import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { debounce } from "lodash";
import axios from "../../api";
import "./EmployeeList.css";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
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
        // Fetch user data to check if the user is logged in and is an admin
        const userResponse = await axios.get("/auth/user/");
        setCurrentUser(userResponse.data);
        setIsAdmin(userResponse.data.is_staff);

        // Fetch employees data
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
    if (currentUser && (isAdmin || currentUser.id === employee.id)) {
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
    } else {
      setError("You do not have permission to edit this employee.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setFormData((prevData) => ({ ...prevData, profile: file }));
    } else {
      alert("Please select a valid image file (jpg, jpeg, png).");
    }
  };

  const handleUpdate = async (id) => {
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      await axios.put(`/employees/${id}/`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
          <div className="employee-cards">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="employee-card"
                onClick={() => setSelectedEmployee(employee)}
              >
                <img
                  src={employee.profile ? employee.profile : "https://via.placeholder.com/200"}
                  alt={employee.username}
                  style={{ height: "300px", width: "290px", borderRadius: "15px" }}
                />
                <div className="card-body">
                  <h2>{employee.department}</h2>
                  <p style={{ fontSize: "20px" }}>
                    {employee.first_name} {employee.last_name}
                  </p>
                  {(isAdmin || (currentUser && currentUser.id === employee.id)) && (
                    <div className="button-group">
                      <button className="yes-button" onClick={() => handleEdit(employee)}>
                        Edit
                      </button>
                      <button
                        className="cancel-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingEmployee(employee.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {selectedEmployee && (
            <div className="custom-modal">
              <div className="custom-modal-header">
                <span className="close" onClick={() => setSelectedEmployee(null)}>
                  &times;
                </span>
                <h2 className="custom-modal-title">Employee Details</h2>
              </div>
              <div className="employee-detail-container">
                <div className="left-details">
                  <p><strong>First Name:</strong> {selectedEmployee.first_name}</p>
                  <p><strong>Last Name:</strong> {selectedEmployee.last_name}</p>
                  <p><strong>Username:</strong> {selectedEmployee.username}</p>
                  <p><strong>Email:</strong> {selectedEmployee.email}</p>
                  <p><strong>Gender:</strong> {selectedEmployee.gender}</p>
                  <p><strong>Relationship Status:</strong> {selectedEmployee.relationship_status}</p>
                  <p><strong>Department:</strong> {selectedEmployee.department}</p>
                  <p><strong>Date of Joining:</strong> {selectedEmployee.date_of_joining}</p>
                  <p><strong>Phone Number:</strong> {selectedEmployee.phone_number}</p>
                  <p><strong>Address:</strong> {selectedEmployee.address}</p>
                </div>
                <div className="middle-bio">
                  <p>{selectedEmployee.bio}</p>
                </div>
                <div className="right-profile">
                  <img src={selectedEmployee.profile} alt={selectedEmployee.username} />
                </div>
              </div>
            </div>
          )}
          {editingEmployee && (
            <div className="custom-modal">
              <div className="custom-modal-header">
                <span className="close" onClick={() => setEditingEmployee(null)}>
                  &times;
                </span>
                <h2 className="custom-modal-title">Edit Employee</h2>
              </div>
              <div className="modal-content">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate(editingEmployee);
                }}>
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
                  <label>Username:</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
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
                  <label>Profile Image:</label>
                  <input
                    type="file"
                    name="profile"
                    onChange={handleFileChange}
                  />
                  <button type="submit">Update</button>
                </form>
              </div>
            </div>
          )}
          {deletingEmployee && (
            <div className="custom-modal">
              <div className="custom-modal-header">
                <span className="close" onClick={() => setDeletingEmployee(null)}>
                  &times;
                </span>
                <h2 className="custom-modal-title">Delete Employee</h2>
              </div>
              <div className="modal-content">
                <p>Are you sure you want to delete this employee?</p>
                <button onClick={() => handleDelete(deletingEmployee)}>Yes, Delete</button>
                <button onClick={() => setDeletingEmployee(null)}>Cancel</button>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>No employees found</p>
      )}
    </div>
  );
};

export default EmployeeList;
