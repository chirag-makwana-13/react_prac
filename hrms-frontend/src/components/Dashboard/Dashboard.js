import React, { useState, useEffect } from 'react';
import axios from '../../api';
import './Dashboard.css';

const Dashboard = () => {
    const [birthdays, setBirthdays] = useState([]);
    const [holidays, setHolidays] = useState([]);
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
                const [birthdaysResponse, holidaysResponse] = await Promise.all([
                    axios.get('/birthdays/'),
                    axios.get('/holidays/'),
                ]);

                setBirthdays(birthdaysResponse.data);
                setHolidays(holidaysResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data. Please try again later.');
            }
        };

        fetchData();
    }, []);

    const handleAction = async (action) => {
        try {
            await axios.post(`/${action}/`);

            // Update button states based on the action performed
            if (action === 'checkin') {
                setButtonsState({ checkIn: true, breakIn: false, breakOut: true, checkOut: false });
            } else if (action === 'breakin') {
                setButtonsState({ checkIn: true, breakIn: true, breakOut: false, checkOut: true });
            } else if (action === 'breakout') {
                setButtonsState({ checkIn: true, breakIn: false, breakOut: true, checkOut: false });
            } else if (action === 'checkout') {
                setButtonsState({ checkIn: true, breakIn: true, breakOut: true, checkOut: true });
            }
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

    return (
        <div className="dashboard-container">
                        <div className="lower-dashboard">
                {error && <p className="error-message">{error}</p>}
                <div className="actions">
                    <button 
                        onClick={() => handleAction('checkin')} 
                        disabled={buttonsState.checkIn} 
                        className={buttonsState.checkIn ? 'disabled' : ''}
                    >
                        Check In
                    </button>
                    <button 
                        onClick={() => handleAction('breakin')} 
                        disabled={buttonsState.breakIn} 
                        className={buttonsState.breakIn ? 'disabled' : ''}
                    >
                        Break In
                    </button>
                    <button 
                        onClick={() => handleAction('breakout')} 
                        disabled={buttonsState.breakOut} 
                        className={buttonsState.breakOut ? 'disabled' : ''}
                    >
                        Break Out
                    </button>
                    <button 
                        onClick={() => handleAction('checkout')} 
                        disabled={buttonsState.checkOut} 
                        className={buttonsState.checkOut ? 'disabled' : ''}
                    >
                        Check Out
                    </button>
                </div>
            </div>
            <div className="upper-dashboard">
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
        </div>
    );
};

export default Dashboard;
