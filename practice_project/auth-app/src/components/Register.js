import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    dob: '',
    bio: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.username) tempErrors.username = 'Username is required';
    if (!formData.firstName) tempErrors.firstName = 'First name is required';
    if (!formData.lastName) tempErrors.lastName = 'Last name is required';
    if (!formData.email) tempErrors.email = 'Email is required';
    if (!formData.password) tempErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = 'Passwords do not match';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      users.push(formData);
      localStorage.setItem('users', JSON.stringify(users));
      console.log('User registered successfully');
      // Redirect to login or show success message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
      {errors.username && <span>{errors.username}</span>}
      <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
      {errors.firstName && <span>{errors.firstName}</span>}
      <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
      {errors.lastName && <span>{errors.lastName}</span>}
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
      {errors.email && <span>{errors.email}</span>}
      <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
      <input type="date" name="dob" placeholder="Date of Birth" value={formData.dob} onChange={handleChange} />
      <textarea name="bio" placeholder="Bio" value={formData.bio} onChange={handleChange}></textarea>
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
      {errors.password && <span>{errors.password}</span>}
      <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
      {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
