import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, ArrowLeft, Home, RefreshCw, AlertTriangle } from 'lucide-react';
import Button from '../components/common/Button';
import { fadeInUp } from '../utils/motionConfig';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { error } = location.state || {};

  const commonIssues = [
    'Insufficient balance in account',
    'Payment gateway timeout',
    'Network connectivity issues',
    'Incorrect payment details'
  ];

  const handleRetry = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 py-12 px-4 transition-colors duration-200" data-testid="payment-failure-page">
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Failure Card */}
        <motion.div
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden transition-colors duration-200"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header with Shake Animation */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-center relative overflow-hidden">
            {/* Warning indicators */}
            <motion.div
              className="absolute top-4 left-8"
              animate={{
                rotate: [0, 10, -10, 10, 0]
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              <AlertTriangle className="w-6 h-6 text-orange-300" />
            </motion.div>
            <motion.div
              className="absolute top-4 right-8"
              animate={{
                rotate: [0, -10, 10, -10, 0]
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 2,
                delay: 0.25
              }}
            >
              <AlertTriangle className="w-6 h-6 text-orange-300" />
            </motion.div>

            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-slate-800 rounded-full mb-4"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
            >
              <motion.div
                animate={{
                  x: [-2, 2, -2, 2, 0],
                  rotate: [0, -5, 5, -5, 0]
                }}
                transition={{
                  duration: 0.5,
                  repeat: 2,
                  delay: 0.3
                }}
              >
                <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
              </motion.div>
            </motion.div>
            <motion.h1
              className="text-3xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              data-testid="failure-title"
            >
              Payment Failed
            </motion.h1>
            <motion.p
              className="text-red-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Your payment could not be processed
            </motion.p>
          </div>

          {/* Error Details */}
          <div className="p-8">
            <AnimatePresence>
              {error && (
                <motion.div
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 transition-colors duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <p className="text-red-800 dark:text-red-300 text-sm">
                    <strong>Error:</strong> {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Common Issues */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Common Reasons for Payment Failure:
              </h3>
              <motion.ul
                className="space-y-2"
                variants={{
                  animate: {
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="initial"
                animate="animate"
              >
                {commonIssues.map((issue, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    variants={fadeInUp}
                  >
                    <motion.span
                      className="text-red-500 dark:text-red-400 mr-3 mt-1"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    >
                      •
                    </motion.span>
                    <span className="text-slate-700 dark:text-slate-300">{issue}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* What to Do */}
            <motion.div
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 transition-colors duration-200"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">What should I do?</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>• Check your internet connection</li>
                <li>• Verify your payment method has sufficient balance</li>
                <li>• Try using a different payment method</li>
                <li>• Contact your bank if the issue persists</li>
              </ul>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(59, 130, 246, 0)',
                      '0 0 0 8px rgba(59, 130, 246, 0.2)',
                      '0 0 0 0 rgba(59, 130, 246, 0)'
                    ]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity
                  }}
                  className="rounded-lg"
                >
                  <Button
                    onClick={handleRetry}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                    data-testid="retry-payment-button"
                  >
                    <RefreshCw className="w-5 h-5 mr-2 inline" />
                    Try Again
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => navigate(-2)}
                  variant="outline"
                  className="w-full"
                  data-testid="go-back-button"
                >
                  <ArrowLeft className="w-5 h-5 mr-2 inline" />
                  Go Back
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full"
                  data-testid="home-button"
                >
                  <Home className="w-5 h-5 mr-2 inline" />
                  Go to Home
                </Button>
              </motion.div>
            </motion.div>

            {/* Support */}
            <motion.div
              className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg transition-colors duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-sm text-slate-700 dark:text-slate-300 text-center mb-2">
                <strong>Still facing issues?</strong>
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                Contact our support team at{' '}
                <a href="mailto:support@homer.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                  support@homer.com
                </a>
                {' '}or call us at{' '}
                <a href="tel:+911800000000" className="text-blue-600 dark:text-blue-400 hover:underline">
                  1800-000-000
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <p className="text-sm text-slate-600 dark:text-slate-400">
            🔒 Your payment information is secure and encrypted
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentFailure;