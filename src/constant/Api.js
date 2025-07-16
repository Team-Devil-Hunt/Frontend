// Api.js - Centralized API service for making HTTP requests
import axios from 'axios';
import { BaseUrl } from '../services/BaseUrl';

// Create an axios instance with default config
const Api = axios.create({
  baseURL: BaseUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important: This ensures cookies are sent with every request
  xsrfCookieName: 'SESSION', // Match the session cookie name used by the backend
  xsrfHeaderName: 'X-CSRF-TOKEN', // Header name for CSRF token if needed
  // Ensure cookies are always sent with cross-origin requests
  sameSite: 'none',
  secure: true
});

// Add request interceptor for logging purposes
Api.interceptors.request.use(
  (config) => {
    try {
      // Always ensure withCredentials is set to true for every request
      config.withCredentials = true;
      
      // Get session cookie if it exists
      const sessionCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('SESSION='));
        
      if (sessionCookie) {
        // Extract the cookie value
        const sessionValue = sessionCookie.split('=')[1];
        // Make sure the cookie is included in the request headers
        config.headers = {
          ...config.headers,
          'Cookie': `SESSION=${sessionValue}`
        };
      }
      
      // Log request for debugging
      console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
      console.log('Request config:', {
        withCredentials: config.withCredentials,
        headers: config.headers,
        cookies: document.cookie
      });
    } catch (err) {
      console.error('Error in request interceptor:', err);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (401, 403, 500, etc.)
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        // Handle unauthorized (e.g., redirect to login)
        console.error('Unauthorized access. Please login again.');
        
        // Check if we're already on the login page to prevent redirect loops
        if (!window.location.pathname.includes('/login')) {
          // Clear user data
          localStorage.removeItem('globalState');
          // Use history push instead of direct location change to avoid page reload
          window.location.href = '/login';
        }
      }
      
      if (status === 403) {
        console.error('Forbidden access.');
      }
      
      if (status === 500) {
        console.error('Server error. Please try again later.');
      }
    }
    
    return Promise.reject(error);
  }
);

export default Api;
