import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Home } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import Button from './Button';

const ProtectedRoute = ({ children, userType }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Show enhanced loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <LoadingSpinner 
          size="lg" 
          variant="icon"
          text="Verifying access..."
        />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admin access denied screen
  if (userType === 'admin' && !user?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <motion.div 
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: 0.1
            }}
          >
            <Shield className="w-10 h-10 text-red-600 dark:text-red-400" />
          </motion.div>
          
          <motion.h1 
            className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Admin Access Required
          </motion.h1>
          
          <motion.p 
            className="text-slate-600 dark:text-slate-400 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            This area is restricted to administrators only. You don't have permission to access this page.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              to="/" 
              variant="primary"
              icon={<Home className="w-4 h-4" />}
            >
              Go to Homepage
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // User type mismatch - access denied screen
  if (userType && userType !== 'admin' && user.user_type !== userType && user.user_type !== 'both') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <motion.div 
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: 0.1
            }}
          >
            <Lock className="w-10 h-10 text-orange-600 dark:text-orange-400" />
          </motion.div>
          
          <motion.h1 
            className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Access Denied
          </motion.h1>
          
          <motion.p 
            className="text-slate-600 dark:text-slate-400 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            You don't have permission to access this page. This section is only available for {userType} users.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
            >
              Go Back
            </Button>
            <Button 
              to="/" 
              variant="primary"
              icon={<Home className="w-4 h-4" />}
            >
              Go to Homepage
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
