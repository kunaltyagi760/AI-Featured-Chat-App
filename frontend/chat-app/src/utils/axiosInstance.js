import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-featured-chat-app.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global variable to prevent multiple alerts
let isLoggingOut = false;

// Handle token expiration and redirect
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isLoggingOut) {
      isLoggingOut = true; // Set flag to true to prevent duplicate alerts
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.replace("/login-email"); // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default API;
