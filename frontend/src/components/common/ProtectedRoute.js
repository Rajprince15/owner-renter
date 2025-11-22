import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, userType }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user type matches required type
  if (userType && user.user_type !== userType && user.user_type !== 'both') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Access Denied</h1>
          <p className="text-slate-600 mb-4">You don't have permission to access this page.</p>
          <a href="/" className="text-blue-600 hover:underline">Go to Homepage</a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;