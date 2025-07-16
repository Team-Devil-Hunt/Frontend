import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalStateProvider';

/**
 * Protected route component that redirects unauthenticated users to the login page
 * and authenticated users to their appropriate dashboard based on their role
 */
const ProtectedRoute = ({ requiredRole }) => {
  const { globalState } = useGlobalState();
  const isAuthenticated = !!globalState?.user?.isAuthenticated;
  const userRole = globalState?.user?.role?.name?.toLowerCase() || '';
  
  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If a specific role is required and user doesn't have it, redirect to home
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated and has the required role, render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
