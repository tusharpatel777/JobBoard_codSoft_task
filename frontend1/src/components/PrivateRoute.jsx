import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ user, role, children }) {
  if (!user) {
  
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    // User logged in but has the wrong role, redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;