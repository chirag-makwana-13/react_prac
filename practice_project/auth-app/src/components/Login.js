import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === formData.username && user.password === formData.password);
    if (user) {
      localStorage.setItem('token', JSON.stringify('your_token_here'));
      console.log('Logged in successfully');
      // Redirect to dashboard or show success message
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
      {error && <span>{error}</span>}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
