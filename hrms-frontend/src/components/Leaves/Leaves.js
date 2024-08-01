import React, { useState, useEffect } from 'react';
import axios from '../../api';
import './Leaves.css';

const Leaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [leaveDetails, setLeaveDetails] = useState({
        remaining_paid_leave: 0,
        remaining_unpaid_leave: 0,
        remaining_casual_leave: 0,
        remaining_sick_leave: 0,
        total_approved_leaves: 0,
        first_name: '',
        last_name: ''
    });
    const [newLeave, setNewLeave] = useState({
        date: '',
        type: '',
        reason: '',
        leave_day_type: 'Full_Day'
    });
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [leavesResponse, leaveDetailsResponse, userResponse] = await Promise.all([
                    axios.get('/leave/'),
                    axios.get('/leave-details/'),
                    axios.get('/auth/user/')
                ]);

                setLeaves(leavesResponse.data.results);
                setLeaveDetails(leaveDetailsResponse.data[0]);
                setIsAdmin(userResponse.data.is_staff);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data. Please try again later.');
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewLeave(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/leave/', newLeave);
            setNewLeave({
                date: '',
                type: '',
                reason: '',
                leave_day_type: 'Full_Day'
            });
            const leavesResponse = await axios.get('/leave/');
            setLeaves(leavesResponse.data.results);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to submit leave application:', error);
            setError('Failed to submit leave application. Please try again later.');
        }
    };

    const handleApprove = async (leaveId) => {
        try {
            await axios.put(`/update-leaves/`, {
                id: leaveId,
                status: 'Approved'
            });
            const leavesResponse = await axios.get('/all-leaves/');
            setLeaves(leavesResponse.data.results);
        } catch (error) {
            console.error('Failed to approve leave:', error);
            setError('Failed to approve leave. Please try again later.');
        }
    };

    return (
        <div className="leaves-container">
            <div className="leave-details">
                <h3>Leave Balance</h3>
                <p>Paid Leave (PL): {leaveDetails.remaining_paid_leave}</p>
                <p>Unpaid Leave (UL): {leaveDetails.remaining_unpaid_leave}</p>
                <p>Casual Leave (CL): {leaveDetails.remaining_casual_leave}</p>
                <p>Sick Leave (SL): {leaveDetails.remaining_sick_leave}</p>
                <p>Total Approved Leaves: {leaveDetails.total_approved_leaves}</p>
                <p>{leaveDetails.first_name} {leaveDetails.last_name}</p>
            </div>
            {isAdmin ? (
                <div className="admin-leave-list">
                    <h3>All Leaves</h3>
                    {leaves.length > 0 ? (
                        leaves.map(leave => (
                            <div key={leave.id} className="leave-card admin">
                                <p><strong>Date:</strong> {new Date(leave.date).toLocaleDateString()}</p>
                                <p><strong>Type:</strong> {leave.type}</p>
                                <p><strong>Status:</strong> {leave.status}</p>
                                <p><strong>Reason:</strong> {leave.reason || 'N/A'}</p>
                                <p><strong>Leave Day Type:</strong> {leave.leave_day_type}</p>
                                <button className="approve-button" onClick={() => handleApprove(leave.id)}>Approve</button>
                            </div>
                        ))
                    ) : (
                        <p>No leaves available.</p>
                    )}
                </div>
            ) : (
                <>
                    <div className="leave-actions">
                        <button className="add-leave-button" onClick={() => setIsModalOpen(true)}>Add Leave</button>
                    </div>
                    {isModalOpen && (
                        <div className="modal">
                            <div className="modal-content">
                                <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
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
                                        Type:
                                        <select
                                            name="type"
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
                                    <label>
                                        Reason:
                                        <textarea
                                            name="reason"
                                            value={newLeave.reason}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Leave Day Type:
                                        <select
                                            name="leave_day_type"
                                            value={newLeave.leave_day_type}
                                            onChange={handleInputChange}
                                        >
                                            <option value="Full_Day">Full Day</option>
                                            <option value="Half_Day">Half Day</option>
                                        </select>
                                    </label>
                                    <button type="submit">Submit</button>
                                </form>
                                {error && <p className="error-message">{error}</p>}
                            </div>
                        </div>
                    )}
                    <div className="leave-list">
                        <h3>All Leaves</h3>
                        {leaves.length > 0 ? (
                            leaves.map(leave => (
                                <div key={leave.id} className="leave-card">
                                    <p><strong>Date:</strong> {new Date(leave.date).toLocaleDateString()}</p>
                                    <p><strong>Type:</strong> {leave.type}</p>
                                    <p><strong>Status:</strong> {leave.status}</p>
                                    <p><strong>Reason:</strong> {leave.reason || 'N/A'}</p>
                                    <p><strong>Leave Day Type:</strong> {leave.leave_day_type}</p>
                                </div>
                            ))
                        ) : (
                            <p>No leaves available.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Leaves;
