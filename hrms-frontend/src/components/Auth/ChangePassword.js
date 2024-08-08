import React, { useState } from 'react';
import axios from '../../api';
import { useNavigate } from 'react-router-dom';
import './ChangePassword.css';

const ChangePassword = () => {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');  // Clear any previous errors

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.put('/changepassword/', {
                current_password: password,
                new_password: newPassword,
                confirm_password: confirmPassword
            });
            setMessage(response.data.message);
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="change-password-form-container">
            <div className="change-password-form">
                <h2>Change Password</h2>
                {message && <p className="message">{message}</p>}
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Current Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="reset-button">Change Password</button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
