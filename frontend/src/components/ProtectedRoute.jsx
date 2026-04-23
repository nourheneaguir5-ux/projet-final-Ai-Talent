import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — wraps routes that require authentication.
 * @param {string[]} roles — optional array of allowed roles (e.g. ['RECRUITER', 'ADMIN'])
 * @param {React.ReactNode} children — the page component to render
 */
const ProtectedRoute = ({ roles, children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
