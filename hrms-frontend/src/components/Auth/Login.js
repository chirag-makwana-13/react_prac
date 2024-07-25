// src/components/Auth/Login.js
import React, { useState } from 'react';
import axios from '../../api';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/login/', {
                username,
                password,
            });
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            navigate('/dashboard');
        } catch (error) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="login-form">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;



// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Login = () => {
//     const [credentials, setCredentials] = useState({
//         username: '',
//         password: '',
//     });
//     const [errors, setErrors] = useState({});
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setCredentials({ ...credentials, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await axios.post('http://127.0.0.1:8000/api/login/', credentials);
//             const { access, refresh } = response.data;

//             // Save tokens to local storage or a more secure place
//             localStorage.setItem('access_token', access);
//             localStorage.setItem('refresh_token', refresh);

//             // Set default headers for Axios
//             axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

//             navigate('/dashboard'); // Redirect to a protected route after login
//         } catch (error) {
//             console.error('Login error:', error);
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
//                 <input
//                     type="text"
//                     name="username"
//                     value={credentials.username}
//                     onChange={handleChange}
//                 />
//                 {errors.username && <p>{errors.username}</p>}
//             </div>
//             <div>
//                 <label>Password:</label>
//                 <input
//                     type="password"
//                     name="password"
//                     value={credentials.password}
//                     onChange={handleChange}
//                 />
//                 {errors.password && <p>{errors.password}</p>}
//             </div>
//             {errors.non_field_errors && <p>{errors.non_field_errors}</p>}
//             {errors.general && <p>{errors.general}</p>}
//             <button type="submit">Login</button>
//         </form>
//     );
// };

// export default Login;
