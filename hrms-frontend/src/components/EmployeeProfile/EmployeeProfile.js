import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import "./EmployeeProfile.css";
import { useSelector } from "react-redux";

const EmployeeProfile = () => {
  const { userId } = useSelector((state) => state.userId);
  const [employee, setEmployee] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    relationship_status: "",
    department: "",
    dob: "",
    phone_number: "",
    address: "",
    bio: "",
    profile: null, // file input will be handled separately
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await api.get(`/profile/${userId}/`);
        console.log(response, "Employee data");
        setEmployee(response.data);
        setFormData({
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          email: response.data.email || "",
          gender: response.data.gender || "",
          relationship_status: response.data.relationship_status || "",
          department: response.data.department || "",
          dob: response.data.dob || "",
          phone_number: response.data.phone_number || "",
          address: response.data.address || "",
          bio: response.data.bio || "",
          profile: null, // Clear profile data since it's managed separately
        });
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setError("Failed to load employee data.");
      }
    };

    fetchEmployeeData();
  }, [userId]);

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedData = new FormData();
    for (const key in formData) {
      if (key === 'profile' && formData[key] !== null) {
        updatedData.append(key, formData[key]); // Append file if selected
      } else if (key !== 'profile') {
        updatedData.append(key, formData[key]);
      }
    }

    try {
      await api.put(`/profile/${userId}/`, updatedData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating employee data:", error);
      setError("Failed to update profile. Please try again later.");
    }
  };

  if (!employee) {
    return <p>Loading...</p>;
  }

  return (
    <div className="employee-profile-container">
      <h1>Update Your Profile</h1>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="message">{message}</p>}
      <div className="profile-image-container">
        <img
          src={employee.profile || "/default-profile.png"} 
          alt="Profile"
          className="profile-image"
        />
         <input type="file" name="profile" onChange={handleFileChange} style={{width:'10%', height:'10%', marginTop:'60px'}}/>
      </div>
      <form onSubmit={handleUpdate}>
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
        <label>Date of Birth:</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
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
        <button type="submit" className="login-button" style={{width:'10%'}}>Update</button>
      </form>
    </div>
  );
};

export default EmployeeProfile;
