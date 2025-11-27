import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { toastSlideIn } from '../../utils/motionConfig';

const Toast = ({ message, type = 'info', onClose, duration = 3000, action }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      // Progress bar animation
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - (100 / (duration / 100));
          return newProgress < 0 ? 0 : newProgress;
        });
      }, 100);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      bgColor: 'bg-green-50 dark:bg-green-900/30',
      borderColor: 'border-green-500 dark:border-green-400',
      textColor: 'text-green-800 dark:text-green-300',
      progressColor: 'bg-green-500 dark:bg-green-400',
      icon: <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
    },
    error: {
      bgColor: 'bg-red-50 dark:bg-red-900/30',
      borderColor: 'border-red-500 dark:border-red-400',
      textColor: 'text-red-800 dark:text-red-300',
      progressColor: 'bg-red-500 dark:bg-red-400',
      icon: <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
    },
    warning: {
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
      borderColor: 'border-yellow-500 dark:border-yellow-400',
      textColor: 'text-yellow-800 dark:text-yellow-300',
      progressColor: 'bg-yellow-500 dark:bg-yellow-400',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
    },
    info: {
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
      borderColor: 'border-blue-500 dark:border-blue-400',
      textColor: 'text-blue-800 dark:text-blue-300',
      progressColor: 'bg-blue-500 dark:bg-blue-400',
      icon: <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <motion.div
      className={`
        ${config.bgColor} ${config.borderColor}
        border-l-4 rounded-r-lg shadow-lg backdrop-blur-sm
        min-w-[300px] max-w-[500px] overflow-hidden
      `}
      {...toastSlideIn}
      data-testid={`toast-${type}`}
    >
      <div className="p-4 flex items-start space-x-3">
        {/* Icon with bounce animation */}
        <motion.div 
          className="flex-shrink-0"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: 'spring',
            stiffness: 500,
            damping: 15,
            delay: 0.1
          }}
        >
          {config.icon}
        </motion.div>
        
        {/* Message */}
        <div className="flex-1">
          <motion.div 
            className={`${config.textColor} text-sm font-medium`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            {message}
          </motion.div>
          
          {/* Action button */}
          {action && (
            <motion.button
              onClick={action.onClick}
              className={`${config.textColor} text-xs font-semibold mt-2 hover:underline`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {action.label}
            </motion.button>
          )}
        </div>
        
        {/* Close button */}
        <motion.button
          onClick={onClose}
          className={`flex-shrink-0 ${config.textColor} hover:opacity-75 transition-opacity`}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          data-testid="toast-close-btn"
        >
          <X className="w-5 h-5" />
        </motion.button>
      </div>
      
      {/* Progress bar */}
      {duration > 0 && (
        <motion.div 
          className={`h-1 ${config.progressColor}`}
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      )}
    </motion.div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2" data-testid="toast-container">
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
            duration={toast.duration}
            action={toast.action}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
