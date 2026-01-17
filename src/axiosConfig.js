// src/axiosConfig.js - UPDATED VERSION
import axios from "axios";

// Create axios instance without interceptor
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default instance;

// Alternative: Create a function to get headers
export const getAuthHeaders = (token) => {
  if (!token) return {};
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};