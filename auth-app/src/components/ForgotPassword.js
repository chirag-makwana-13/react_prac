import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email);
    if (user) {
      // Implement password reset logic here
      setMessage('Password reset link sent to your email');
    } else {
      setMessage('Email not found');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="Email" value={email} onChange={handleChange} />
      <button type="submit">Send Reset Link</button>
      {message && <span>{message}</span>}
    </form>
  );
};

export default ForgotPassword;
