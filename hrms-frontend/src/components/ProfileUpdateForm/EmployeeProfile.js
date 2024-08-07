// src/components/EmployeeProfile.js
import React, { useState, useEffect } from 'react';
import api from '../../api';
import './EmployeeProfile.css';

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    relationship_status: '',
    department: '',
    date_of_joining: '',
    phone_number: '',
    address: '',
    profile: null,
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch employee data
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await api.get('/auth/user/'); // Make sure this endpoint is correct
        setEmployee(response.data);
        setFormData({
          first_name: response.data.first_name || '',
          last_name: response.data.last_name || '',
          email: response.data.email || '',
          gender: response.data.gender || '',
          relationship_status: response.data.relationship_status || '',
          department: response.data.department || '',
          date_of_joining: response.data.date_of_joining || '',
          phone_number: response.data.phone_number || '',
          address: response.data.address || '',
          profile: response.data.profile || null,
        });
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setError('Failed to load employee data.');
      }
    };

    fetchEmployeeData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setFormData((prevData) => ({ ...prevData, profile: file }));
    } else {
      alert('Please select a valid image file (jpg, jpeg, png).');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedData = new FormData();
    for (const key in formData) {
      updatedData.append(key, formData[key]);
    }

    try {
      await api.put('/auth/user/', updatedData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Profile updated successfully.');
    } catch (error) {
      console.error('Error updating employee data:', error);
      setError('Failed to update profile. Please try again later.');
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
  );
};

export default EmployeeProfile;
