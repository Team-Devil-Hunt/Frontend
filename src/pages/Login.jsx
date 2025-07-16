import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, LogIn, BookOpen, Users } from 'lucide-react';
import cseduLogo from '../assets/csedu_logo.png'
import Api from '../constant/Api';
import {toast} from 'react-hot-toast';
import { useGlobalState } from '../context/GlobalStateProvider';

/*
API Schema:

POST /api/auth/login
Request: {
  email: string,
  password: string,
  role: 'student' | 'faculty'
}
Response: {
  success: boolean,
  token: string,
  user: {
    id: string,
    name: string,
    email: string,
    role: 'student' | 'faculty',
    department: string,
    profileImage?: string
  }
}
*/

const Login = () => {

  const { globalState, setGlobalState } = useGlobalState();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      // The backend uses session cookies for authentication, not tokens
      const response = await Api.post('/api/auth/login', formData, {
        withCredentials: true // Important: This ensures cookies are sent/received
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.message === "Login successful") {
        toast.success("Login successful!");
        
        // Store the complete user object with role information
        const userData = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role, // Store the complete role object from the backend
          username: response.data.username,
          contact: response.data.contact,
          isAuthenticated: true
        };
        
        console.log('Storing user data with permissions:', userData);
        
        // Update global state with proper user data structure
        setGlobalState(prev => ({ ...prev, user: userData }));
        
        // Redirect based on role name
        if (response.data.role.name === 'student') {
          navigate('/student/dashboard');
        } else if (response.data.role.name === 'faculty') {
          navigate('/faculty/dashboard');
        } else {
          navigate('/');
        }
      }
  
      setIsLoading(false);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <div className="flex justify-center">
            <img 
              className="h-20 w-auto" 
              src={cseduLogo}
              alt="CSEDU Logo" 
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access the Department of Computer Science and Engineering portal
          </p>
        </div>
        
        {error && (
          <motion.div 
            className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>{error}</p>
          </motion.div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address (e.g., student1@csedu.edu)"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <input
                  id="role-student"
                  name="role"
                  type="radio"
                  value="student"
                  checked={formData.role === 'student'}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="role-student" className="ml-2 flex items-center text-sm text-gray-700">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Student
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="role-faculty"
                  name="role"
                  type="radio"
                  value="faculty"
                  checked={formData.role === 'faculty'}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="role-faculty" className="ml-2 flex items-center text-sm text-gray-700">
                  <Users className="h-4 w-4 mr-1" />
                  Faculty
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
              </span>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
