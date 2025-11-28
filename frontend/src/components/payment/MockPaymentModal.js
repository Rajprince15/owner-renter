import React, { useState } from 'react';
import { X, CreditCard, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../common/Modal';
import Button from '../common/Button';

const MockPaymentModal = ({ isOpen, onClose, onSuccess, amount, orderData }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePayment = async () => {
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate payment processing with progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate payment processing (2 seconds)
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess({
          payment_id: `mock_pay_${Date.now()}`,
          order_id: orderData.order_id,
          signature: `mock_sig_${Date.now()}`
        });
      }, 500);
    }, 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="medium">
      <motion.div 
        className="p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* TEST MODE Banner */}
        <motion.div 
          className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        >
          <div className="flex items-center">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
            </motion.div>
            <div>
              <p className="text-sm font-semibold text-yellow-800">TEST MODE</p>
              <p className="text-xs text-yellow-700">This is a mock payment. No real money will be charged.</p>
            </div>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div 
          className="flex justify-between items-center mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900">
            Complete Payment
          </h2>
          <motion.button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600"
            disabled={isProcessing}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-6 h-6" />
          </motion.button>
        </motion.div>

        {/* Payment Details */}
        <motion.div 
          className="bg-gray-50 rounded-lg p-4 mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Order ID:</span>
            <span className="text-sm font-mono text-gray-800">{orderData.order_id}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Payment Type:</span>
            <span className="text-sm text-gray-800">
              {orderData.type === 'renter_subscription' ? 'Premium Subscription' : 'Property Verification'}
            </span>
          </div>
          <div className="border-t border-gray-200 my-3"></div>
          <motion.div 
            className="flex justify-between items-center"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-lg font-semibold text-gray-900">Amount to Pay:</span>
            <span className="text-2xl font-bold text-blue-600">₹{amount}</span>
          </motion.div>
        </motion.div>

        {/* Mock Payment Info */}
        <motion.div 
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-start">
            <motion.div
              animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <CreditCard className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            </motion.div>
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Mock Payment Gateway</p>
              <p className="text-xs text-blue-700">
                This payment will be automatically approved. In production, this would connect to Razorpay.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Processing Animation */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              className="mb-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex items-center mb-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader className="w-5 h-5 text-indigo-600 mr-3" />
                </motion.div>
                <p className="text-sm font-medium text-indigo-900">
                  Processing payment...
                </p>
              </div>
              <div className="w-full bg-indigo-100 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-indigo-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <motion.div 
          className="flex gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex-1"
            disabled={isProcessing}
            data-testid="cancel-payment-button"
          >
            Cancel
          </Button>
          <motion.div className="flex-1">
            <Button 
              onClick={handlePayment} 
              className="w-full bg-blue-600 hover:bg-blue-700 relative overflow-hidden"
              disabled={isProcessing}
              data-testid="pay-now-button"
            >
              {!isProcessing && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}
              <span className="relative z-10">
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </motion.div>
                    Processing...
                  </span>
                ) : (
                  `Pay ₹${amount} Now`
                )}
              </span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Additional Info */}
        <motion.p 
          className="text-xs text-gray-500 text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          By proceeding, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </motion.div>
    </Modal>
  );
};

export default MockPaymentModal;