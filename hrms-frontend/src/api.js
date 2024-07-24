// src/api.js
import axios from 'axios';

// Set up axios defaults
axios.defaults.baseURL = 'http://127.0.0.1:8000/api/';
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

export default axios;
