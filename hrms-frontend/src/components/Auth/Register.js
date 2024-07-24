import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        confirm_password: '',
        first_name: '',
        last_name: '',
        email: '',
        department: '',
        date_of_joining: '',
        phone_number: '',
        address: '',
        dob: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userData.password !== userData.confirm_password) {
            setErrors({ password: 'Passwords do not match' });
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register/', userData);
            console.log(response.data);  // Debugging line
            navigate('/login');
        } catch (error) {
            console.error('Error:', error);  // Debugging line
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            } else {
                setErrors({ general: 'An error occurred. Please try again.' });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="register-form">
            <div>
                <label>Username:</label>
                <input type="text" name="username" value={userData.username} onChange={handleChange} />
                {errors.username && <p>{errors.username}</p>}
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password" value={userData.password} onChange={handleChange} />
                {errors.password && <p>{errors.password}</p>}
            </div>
            <div>
                <label>Confirm Password:</label>
                <input type="password" name="confirm_password" value={userData.confirm_password} onChange={handleChange} />
                {errors.confirm_password && <p>{errors.confirm_password}</p>}
            </div>
            <div>
                <label>First Name:</label>
                <input type="text" name="first_name" value={userData.first_name} onChange={handleChange} />
                {errors.first_name && <p>{errors.first_name}</p>}
            </div>
            <div>
                <label>Last Name:</label>
                <input type="text" name="last_name" value={userData.last_name} onChange={handleChange} />
                {errors.last_name && <p>{errors.last_name}</p>}
            </div>
            <div>
                <label>Email:</label>
                <input type="email" name="email" value={userData.email} onChange={handleChange} />
                {errors.email && <p>{errors.email}</p>}
            </div>
            <div>
                <label>Department:</label>
                <input type="text" name="department" value={userData.department} onChange={handleChange} />
                {errors.department && <p>{errors.department}</p>}
            </div>
            <div>
                <label>Date of Joining:</label>
                <input type="date" name="date_of_joining" value={userData.date_of_joining} onChange={handleChange} />
                {errors.date_of_joining && <p>{errors.date_of_joining}</p>}
            </div>
            <div>
                <label>Phone Number:</label>
                <input type="text" name="phone_number" value={userData.phone_number} onChange={handleChange} />
                {errors.phone_number && <p>{errors.phone_number}</p>}
            </div>
            <div>
                <label>Address:</label>
                <input type="text" name="address" value={userData.address} onChange={handleChange} />
                {errors.address && <p>{errors.address}</p>}
            </div>
            <div>
                <label>Date of Birth:</label>
                <input type="date" name="dob" value={userData.dob} onChange={handleChange} />
                {errors.dob && <p>{errors.dob}</p>}
            </div>
            {errors.general && <p>{errors.general}</p>}
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;


// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Register = () => {
//     const [userData, setUserData] = useState({
//         username: '',
//         password: '',
//         confirm_password: '',
//         first_name: '',
//         last_name: '',
//         email: '',
//         department: '',
//         date_of_joining: '',
//         phone_number: '',
//         address: '',
//         dob: '',
//     });
//     const [errors, setErrors] = useState({});
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setUserData({ ...userData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (userData.password !== userData.confirm_password) {
//             setErrors({ password: 'Passwords do not match' });
//             return;
//         }

//         try {
//             const response = await axios.post('http://127.0.0.1:8000/api/register/', userData);
//             console.log('Response:', response.data);  // Debugging line
//             navigate('/login');
//         } catch (error) {
//             console.error('Error:', error.response ? error.response.data : error.message);  // Debugging line
//             if (error.response && error.response.data) {
//                 setErrors(error.response.data);
//             } else {
//                 setErrors({ general: 'An error occurred. Please try again.' });
//             }
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <div>
//                 <label>Username:</label>
//                 <input type="text" name="username" value={userData.username} onChange={handleChange} />
//                 {errors.username && <p>{errors.username}</p>}
//             </div>
//             <div>
//                 <label>Password:</label>
//                 <input type="password" name="password" value={userData.password} onChange={handleChange} />
//                 {errors.password && <p>{errors.password}</p>}
//             </div>
//             <div>
//                 <label>Confirm Password:</label>
//                 <input type="password" name="confirm_password" value={userData.confirm_password} onChange={handleChange} />
//                 {errors.confirm_password && <p>{errors.confirm_password}</p>}
//             </div>
//             <div>
//                 <label>First Name:</label>
//                 <input type="text" name="first_name" value={userData.first_name} onChange={handleChange} />
//                 {errors.first_name && <p>{errors.first_name}</p>}
//             </div>
//             <div>
//                 <label>Last Name:</label>
//                 <input type="text" name="last_name" value={userData.last_name} onChange={handleChange} />
//                 {errors.last_name && <p>{errors.last_name}</p>}
//             </div>
//             <div>
//                 <label>Email:</label>
//                 <input type="email" name="email" value={userData.email} onChange={handleChange} />
//                 {errors.email && <p>{errors.email}</p>}
//             </div>
//             <div>
//                 <label>Department:</label>
//                 <input type="text" name="department" value={userData.department} onChange={handleChange} />
//                 {errors.department && <p>{errors.department}</p>}
//             </div>
//             <div>
//                 <label>Date of Joining:</label>
//                 <input type="date" name="date_of_joining" value={userData.date_of_joining} onChange={handleChange} />
//                 {errors.date_of_joining && <p>{errors.date_of_joining}</p>}
//             </div>
//             <div>
//                 <label>Phone Number:</label>
//                 <input type="text" name="phone_number" value={userData.phone_number} onChange={handleChange} />
//                 {errors.phone_number && <p>{errors.phone_number}</p>}
//             </div>
//             <div>
//                 <label>Address:</label>
//                 <input type="text" name="address" value={userData.address} onChange={handleChange} />
//                 {errors.address && <p>{errors.address}</p>}
//             </div>
//             <div>
//                 <label>Date of Birth:</label>
//                 <input type="date" name="dob" value={userData.dob} onChange={handleChange} />
//                 {errors.dob && <p>{errors.dob}</p>}
//             </div>
//             {errors.general && <p>{errors.general}</p>}
//             <button type="submit">Register</button>
//         </form>
//     );
// };

// export default Register;
