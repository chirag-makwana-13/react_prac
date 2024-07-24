import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <h1>Welcome to Our HR Management System</h1>
            <p>This is a comprehensive solution for managing employee information, attendance, and more.</p>
            <div className="button-container">
                <Link to="/login" className="btn">Login</Link>
                <Link to="/register" className="btn">Register</Link>
            </div>
        </div>
    );
};

export default Home;


// import React from 'react';
// import EmployeeList from '../components/Employee/EmployeeList';
// import BirthdayList from '../components/Birthday/BirthdayList';

// const Home = () => {
//     return (
//         <div>
//             <h1>Welcome to HRMS</h1>
//             <EmployeeList />
//             <BirthdayList />
//         </div>
//     );
// };

// export default Home;
