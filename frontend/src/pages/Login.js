import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { fadeInUp, slideInLeft, slideInRight, staggerContainer, staggerItem } from '../utils/motionConfig';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email or phone is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuickLogin = (email, password) => {
    setFormData({ email, password });
    setErrors({});
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const result = await login({
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user.user_type === 'admin') {
          navigate('/admin');
        } else if (user.user_type === 'renter') {
          navigate('/renter/dashboard');
        } else if (user.user_type === 'owner') {
          navigate('/owner/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setApiError(result.error);
      }
    } catch (error) {
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-100 to-primary-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 dark:bg-primary-900 rounded-full opacity-20 blur-3xl"
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 blur-3xl"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
        />
      </div>

      <motion.div 
        className="max-w-md w-full space-y-8 relative z-10"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        {/* Header */}
        <motion.div className="text-center" variants={fadeInUp}>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome Back
          </motion.h2>
          <motion.p 
            className="text-slate-600 dark:text-slate-400 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Sign in to your account to continue
          </motion.p>
        </motion.div>

        {/* Login Form */}
        <motion.div 
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 transition-colors duration-300"
          variants={fadeInUp}
          whileHover={{ boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
        >
          {/* API Error */}
          {apiError && (
            <motion.div 
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              data-testid="login-error-message"
            >
              <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">{apiError}</p>
            </motion.div>
          )}

          {/* Quick Login Buttons */}
          <motion.div 
            className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
            variants={staggerItem}
          >
            <p className="text-sm text-blue-900 dark:text-blue-300 font-semibold mb-3">🚀 Quick Login (Demo Accounts)</p>
            <motion.div 
              className="grid grid-cols-2 gap-2"
              variants={staggerContainer}
            >
              {[
                { label: 'Admin', icon: '👑', email: 'admin@homer.com', password: 'admin@123', color: 'red', testid: 'quick-login-admin' },
                { label: 'Free Renter', icon: '🏠', email: 'renter.free@homer.com', password: 'password123', color: 'blue', testid: 'quick-login-renter-free' },
                { label: 'Premium Renter', icon: '⭐', email: 'renter.premium@homer.com', password: 'password123', color: 'purple', testid: 'quick-login-renter-premium' },
                { label: 'Owner', icon: '🔑', email: 'owner.verified@homer.com', password: 'password123', color: 'green', testid: 'quick-login-owner' }
              ].map((account, index) => (
                <motion.button
                  key={index}
                  type="button"
                  onClick={() => handleQuickLogin(account.email, account.password)}
                  className={`px-3 py-2 bg-${account.color}-500 hover:bg-${account.color}-600 text-white text-xs font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1 shadow-md hover:shadow-lg`}
                  variants={staggerItem}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid={account.testid}
                >
                  <span>{account.icon}</span>
                  <span>{account.label}</span>
                </motion.button>
              ))}
            </motion.div>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-3 text-center">
              Click any button to auto-fill credentials
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <motion.div variants={staggerItem}>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email or Phone
                <span className="text-red-500 ml-1">*</span>
              </label>
              <motion.div 
                className="relative"
                whileFocus={{ scale: 1.01 }}
              >
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="text"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email or phone"
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 ${errors.email ? 'border-red-500 shake' : 'border-slate-300 dark:border-slate-600'}`}
                  data-testid="login-email-input"
                />
              </motion.div>
              {errors.email && (
                <motion.p 
                  className="mt-2 text-sm text-red-500 dark:text-red-400"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {errors.email}
                </motion.p>
              )}
            </motion.div>

            {/* Password Input */}
            <motion.div variants={staggerItem}>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full pl-11 pr-11 py-3 border rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 ${errors.password ? 'border-red-500 shake' : 'border-slate-300 dark:border-slate-600'}`}
                  data-testid="login-password-input"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  data-testid="login-password-toggle"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>
              {errors.password && (
                <motion.p 
                  className="mt-2 text-sm text-red-500 dark:text-red-400"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            {/* Forgot Password Link */}
            <motion.div className="flex items-center justify-between" variants={staggerItem}>
              <div className="text-sm">
                <Link 
                  to="/forgot-password" 
                  className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={staggerItem}>
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                data-testid="login-submit-button"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Sign Up Link */}
          <motion.div 
            className="mt-6 text-center"
            variants={staggerItem}
          >
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
              >
                Sign up now
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;