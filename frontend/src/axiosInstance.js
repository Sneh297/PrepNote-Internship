// src/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'localhost:3000/api/', // Replace with your API base URL
  timeout: 10000, // Optional: You can specify a timeout in milliseconds
});

export default axiosInstance;
