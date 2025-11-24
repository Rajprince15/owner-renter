import React, { useState } from 'react';
import { X, CreditCard, AlertCircle } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const MockPaymentModal = ({ isOpen, onClose, onSuccess, amount, orderData }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing (2 seconds)
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess({
        payment_id: `mock_pay_${Date.now()}`,
        order_id: orderData.order_id,
        signature: `mock_sig_${Date.now()}`
      });
    }, 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="medium">
      <div className="p-6">
        {/* TEST MODE Banner */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
            <div>
              <p className="text-sm font-semibold text-yellow-800">TEST MODE</p>
              <p className="text-xs text-yellow-700">This is a mock payment. No real money will be charged.</p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Complete Payment
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600"
            disabled={isProcessing}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Payment Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
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
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Amount to Pay:</span>
            <span className="text-2xl font-bold text-blue-600">₹{amount}</span>
          </div>
        </div>

        {/* Mock Payment Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <CreditCard className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Mock Payment Gateway</p>
              <p className="text-xs text-blue-700">
                This payment will be automatically approved. In production, this would connect to Razorpay.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex-1"
            disabled={isProcessing}
            data-testid="cancel-payment-button"
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePayment} 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={isProcessing}
            data-testid="pay-now-button"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Pay ₹${amount} Now`
            )}
          </Button>
        </div>

        {/* Additional Info */}
        <p className="text-xs text-gray-500 text-center mt-4">
          By proceeding, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </Modal>
  );
};

export default MockPaymentModal;
