import React from 'react';
import { X, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  danger = false,
  confirmColor = 'blue'
}) => {
  if (!isOpen) return null;

  const getColorClasses = () => {
    if (danger || confirmColor === 'red') {
      return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
    }
    const colors = {
      blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      green: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
      purple: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
      yellow: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
    };
    return colors[confirmColor] || colors.blue;
  };

  const getIcon = () => {
    if (danger || confirmColor === 'red') {
      return <AlertTriangle className="w-6 h-6 text-red-600" />;
    }
    if (confirmColor === 'green') {
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    }
    return <Info className="w-6 h-6 text-blue-600" />;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
        data-testid="confirm-dialog"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  {getIcon()}
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl font-bold text-gray-900"
                >
                  {title}
                </motion.h3>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                data-testid="confirm-dialog-close"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 mb-6 leading-relaxed"
            >
              {message}
            </motion.p>
            
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-3"
            >
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                data-testid="confirm-dialog-cancel"
              >
                {cancelText}
              </motion.button>
              <motion.button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 px-4 py-2.5 rounded-xl transition-all font-semibold text-white focus:outline-none focus:ring-2 ${getColorClasses()}`}
                data-testid="confirm-dialog-confirm"
              >
                {confirmText}
              </motion.button>
            </motion.div>
          </div>

          {/* Bottom accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className={`h-1 ${danger || confirmColor === 'red' ? 'bg-red-600' : 'bg-blue-600'}`}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmDialog;