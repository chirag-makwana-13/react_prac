import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', loginData);
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            } else {
                setErrors({ general: 'An error occurred. Please try again.' });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <div>
                <label>Username:</label>
                <input type="text" name="username" value={loginData.username} onChange={handleChange} />
                {errors.username && <p>{errors.username}</p>}
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password" value={loginData.password} onChange={handleChange} />
                {errors.password && <p>{errors.password}</p>}
            </div>
            {errors.general && <p>{errors.general}</p>}
            <button type="submit">Login</button>
        </form>
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
