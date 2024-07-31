import React, { useState, useEffect } from 'react';
import axios from '../../api';
import './Dashboard.css';

const Dashboard = () => {
    const [birthdays, setBirthdays] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [logs, setLogs] = useState([]);
    const [currentHolidayPage, setCurrentHolidayPage] = useState(1);
    const [currentBirthdayPage, setCurrentBirthdayPage] = useState(1);
    const [itemsPerPage] = useState(1);
    const [error, setError] = useState('');
    const [buttonsState, setButtonsState] = useState({
        checkIn: false,
        breakIn: true,
        breakOut: true,
        checkOut: true,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [birthdaysResponse, holidaysResponse, logsResponse] = await Promise.all([
                    axios.get('/birthdays/'),
                    axios.get('/holidays/'),
                    axios.get('/employeeDailyLogs/')
                ]);

                setBirthdays(birthdaysResponse.data);
                setHolidays(holidaysResponse.data);
                setLogs(logsResponse.data);
                updateButtonState(logsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data. Please try again later.');
            }
        };

        fetchData();
    }, []);

    const updateButtonState = (logs) => {
        if (logs.length > 0) {
            const latestLog = logs[logs.length - 1];
            if (!latestLog.checkIn) {
                setButtonsState({ checkIn: false, breakIn: true, breakOut: true, checkOut: true });
            } else if (latestLog.checkIn && !latestLog.breaks.length && !latestLog.checkOut) {
                setButtonsState({ checkIn: true, breakIn: false, breakOut: true, checkOut: false });
            } else if (latestLog.breaks.length && !latestLog.breaks[latestLog.breaks.length - 1].breakOut && !latestLog.checkOut) {
                setButtonsState({ checkIn: true, breakIn: true, breakOut: false, checkOut: true });
            } else if (latestLog.checkIn && latestLog.breaks.length && latestLog.breaks[latestLog.breaks.length - 1].breakOut && !latestLog.checkOut) {
                setButtonsState({ checkIn: true, breakIn: false, breakOut: true, checkOut: false });
            } else {
                setButtonsState({ checkIn: true, breakIn: true, breakOut: true, checkOut: true });
            }
        }
    };

    const handleAction = async (action) => {
        try {
            await axios.post(`/${action}/`);
            const logsResponse = await axios.get('/employeeDailyLogs/');
            setLogs(logsResponse.data);
            updateButtonState(logsResponse.data);
        } catch (error) {
            console.error(`Failed to ${action}:`, error);
            setError(`Failed to ${action}. Please try again later.`);
        }
    };

    const indexOfLastHoliday = currentHolidayPage * itemsPerPage;
    const indexOfFirstHoliday = indexOfLastHoliday - itemsPerPage;
    const currentHoliday = holidays.slice(indexOfFirstHoliday, indexOfLastHoliday);

    const indexOfLastBirthday = currentBirthdayPage * itemsPerPage;
    const indexOfFirstBirthday = indexOfLastBirthday - itemsPerPage;
    const currentBirthday = birthdays.slice(indexOfFirstBirthday, indexOfLastBirthday);

    const handleHolidayPagination = (direction) => {
        setCurrentHolidayPage(prevPage => {
            const newPage = direction === 'next' ? prevPage + 1 : prevPage - 1;
            return newPage > 0 && newPage <= Math.ceil(holidays.length / itemsPerPage) ? newPage : prevPage;
        });
    };

    const handleBirthdayPagination = (direction) => {
        setCurrentBirthdayPage(prevPage => {
            const newPage = direction === 'next' ? prevPage + 1 : prevPage - 1;
            return newPage > 0 && newPage <= Math.ceil(birthdays.length / itemsPerPage) ? newPage : prevPage;
        });
    };

    const formatTime1 = (datetime) => {
        if (!datetime) return 'N/A';  // Return a placeholder if the datetime is null or invalid
        const date = new Date(datetime);
        // Check if the date is valid
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    return (
        <div className="dashboard-container">
            <div className="upper-container">
                <section className="dashboard-section">
                    <h2>Upcoming Birthday</h2>
                    {currentBirthday.length > 0 ? (
                        <div className="card">
                            {currentBirthday.map(birthday => (
                                <div key={birthday.id} className="birthday-card">
                                    <h3>{birthday.first_name} {birthday.last_name}</h3>
                                    <p>{new Date(birthday.dob).toLocaleDateString('en-US', { day: '2-digit', month: 'long' })}</p>
                                </div>
                            ))}
                            <div className="pagination">
                                <button 
                                    onClick={() => handleBirthdayPagination('prev')} 
                                    disabled={currentBirthdayPage === 1}
                                    className="pagination-button"
                                >
                                    &lt;
                                </button>
                                <button 
                                    onClick={() => handleBirthdayPagination('next')} 
                                    disabled={currentBirthdayPage === Math.ceil(birthdays.length / itemsPerPage)}
                                    className="pagination-button"
                                >
                                    &gt;
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p>No upcoming birthdays.</p>
                    )}
                </section>

                <section className="dashboard-section">
                    <h2>Holidays</h2>
                    {currentHoliday.length > 0 ? (
                        <div className="card">
                            {currentHoliday.map(holiday => (
                                <div key={holiday.id} className="holiday-card">
                                    <h1>{holiday.name}</h1>
                                    <p>{new Date(holiday.date).toLocaleDateString('en-US', { day: '2-digit', month: 'long' })}</p>
                                </div>
                            ))}
                            <div className="pagination">
                                <button 
                                    onClick={() => handleHolidayPagination('prev')} 
                                    disabled={currentHolidayPage === 1}
                                    className="pagination-button"
                                >
                                    &lt;
                                </button>
                                <button 
                                    onClick={() => handleHolidayPagination('next')} 
                                    disabled={currentHolidayPage === Math.ceil(holidays.length / itemsPerPage)}
                                    className="pagination-button"
                                >
                                    &gt;
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p>No upcoming holidays.</p>
                    )}
                </section>
            </div>

            <div className="lower-container">
                {error && <p className="error-message">{error}</p>}
                <div className="actions">
                    <button 
                        onClick={() => handleAction('checkin')} 
                        disabled={buttonsState.checkIn} 
                        className={`action-button ${buttonsState.checkIn ? 'disabled' : 'checkin'}`}
                    >
                        Check In
                    </button>
                    <button 
                        onClick={() => handleAction('breakin')} 
                        disabled={buttonsState.breakIn} 
                        className={`action-button ${buttonsState.breakIn ? 'disabled' : 'breakin'}`}
                    >
                        Break In
                    </button>
                    <button 
                        onClick={() => handleAction('breakout')} 
                        disabled={buttonsState.breakOut} 
                        className={`action-button ${buttonsState.breakOut ? 'disabled' : 'breakout'}`}
                    >
                        Break Out
                    </button>
                    <button 
                        onClick={() => handleAction('checkout')} 
                        disabled={buttonsState.checkOut} 
                        className={`action-button ${buttonsState.checkOut ? 'disabled' : 'checkout'}`}
                    >
                        Check Out
                    </button>
                </div>

                <section className="logs-section">
                    <h2>Logs</h2>
                    {logs.length > 0 ? (
                        <div className="logs-list">
                            {logs.map((log, index) => (
                                <div key={index} className="log-card">
                                    <p><strong>Check In:</strong> {formatTime1(log.checkIn)}</p>
                                    {log.breaks.length > 0 && (
                                        log.breaks.map((breakItem, index) => (
                                            <div key={index}>
                                                <p><strong>Break In:</strong> {formatTime1(breakItem.breakIn)}</p>
                                                <p><strong>Break Out:</strong> {formatTime1(breakItem.breakOut)}</p>
                                            </div>
                                        ))
                                    )}
                                    <p><strong>Check Out:</strong> {formatTime1(log.checkOut)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No logs available.</p>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
