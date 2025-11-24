import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      textColor: 'text-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      textColor: 'text-red-800',
      icon: <AlertCircle className="w-5 h-5 text-red-500" />
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-800',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-800',
      icon: <Info className="w-5 h-5 text-blue-500" />
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div
      className={`${
        config.bgColor
      } ${
        config.borderColor
      } border-l-4 p-4 rounded-r-lg shadow-lg flex items-center space-x-3 min-w-[300px] max-w-[500px] animate-slide-in`}
      data-testid={`toast-${type}`}
    >
      <div className="flex-shrink-0">{config.icon}</div>
      <div className={`flex-1 ${config.textColor} text-sm font-medium`}>
        {message}
      </div>
      <button
        onClick={onClose}
        className={`flex-shrink-0 ${config.textColor} hover:opacity-75 transition-opacity`}
        data-testid="toast-close-btn"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2" data-testid="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
  );
};

export default Toast;
