import axios from 'axios';

// Configure axios to include credentials with all requests by default
axios.defaults.withCredentials = true;

// Add a request interceptor
axios.interceptors.request.use(
  config => {
    // You can add additional logic here if needed
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle authentication errors globally
    if (error.response && error.response.status === 401) {
      console.error('Authentication error:', error);
      // You could redirect to login page or show a toast notification here
    }
    return Promise.reject(error);
  }
);

export default axios;
