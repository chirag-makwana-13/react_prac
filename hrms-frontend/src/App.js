import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
};

export default App;


// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Home from './pages/Home';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import './styles/App.css';

// const App = () => {
//     return (
//         <Router>
//             <Routes>
//                 <Route path="/home" element={<Home />} />
//                 <Route path="/login" element={<LoginPage />} />
//                 <Route path="/register" element={<RegisterPage />} />
//             </Routes>
//         </Router>
//     );
// };

// export default App;

