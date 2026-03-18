import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check if the JWT token actually exists in the browser
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // If there is no token, or the user is NOT an admin, kick them immediately
  if (!token || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // If they are legit, render the Admin Dashboard
  return <Outlet />;
};

export default ProtectedRoute;