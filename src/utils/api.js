import axios from "axios";
import { toast } from "react-toastify";

// Base API URL (set in .env file)
const API_BASE_URL = "https://backend-lnvj.onrender.com/api/";

// Create an Axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// Function to get token from local storage
const getToken = () => localStorage.getItem("token");

// Request Interceptor: Attach token to requests
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token && config.requiresToken !== false) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Response Interceptor: Handle errors globally
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.config.url.includes('/admin/login') && error.response?.status === 401) {
            return Promise.reject(error);
        }
        
        if (error.response && error.response.status === 401) {
            handleLogout(); // Auto logout if unauthorized

        } else {
            toast.error("Network error. Please check your connection.");
        }
        return Promise.reject(error);
    },
);

// Function to handle user logout
export const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully!");
    window.location.href = "/login"; // Redirect to login
};

// Utility functions for API calls
export const apiGet = async (url, config = {}) => {
    return api.get(url, config).then((res) => res.data);
};

export const apiPost = async (url, data, config = {}) => {
    return api.post(url, data, config).then((res) => res.data);
};

export const apiPut = async (url, data, config = {}) => {
    return api.put(url, data, config).then((res) => res.data);
};

export const apiDelete = async (url, config = {}) => {
    return api.delete(url, config).then((res) => res.data);
};

export default api;

export const formatDate = (isoString) => {
    const date = new Date(isoString);

    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long", // "March"
        day: "2-digit", // "09"
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true, // 12-hour format with AM/PM
    });
};
