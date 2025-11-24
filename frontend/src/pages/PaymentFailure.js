import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { XCircle, ArrowLeft, Home, RefreshCw } from 'lucide-react';
import Button from '../components/common/Button';

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
    // Go back to the previous page (subscription or verification)
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-12 px-4" data-testid="payment-failure-page">
      <div className="max-w-2xl mx-auto">
        {/* Failure Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2" data-testid="failure-title">
              Payment Failed
            </h1>
            <p className="text-red-100">Your payment could not be processed</p>
          </div>

          {/* Error Details */}
          <div className="p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}

            {/* Common Issues */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Common Reasons for Payment Failure:
              </h3>
              <ul className="space-y-2">
                {commonIssues.map((issue, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-3 mt-1">•</span>
                    <span className="text-gray-700">{issue}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What to Do */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">What should I do?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Check your internet connection</li>
                <li>• Verify your payment method has sufficient balance</li>
                <li>• Try using a different payment method</li>
                <li>• Contact your bank if the issue persists</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                data-testid="retry-payment-button"
              >
                <RefreshCw className="w-5 h-5 mr-2 inline" />
                Try Again
              </Button>
              <Button
                onClick={() => navigate(-2)}
                variant="outline"
                className="w-full"
                data-testid="go-back-button"
              >
                <ArrowLeft className="w-5 h-5 mr-2 inline" />
                Go Back
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full"
                data-testid="home-button"
              >
                <Home className="w-5 h-5 mr-2 inline" />
                Go to Home
              </Button>
            </div>

            {/* Support */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 text-center mb-2">
                <strong>Still facing issues?</strong>
              </p>
              <p className="text-xs text-gray-600 text-center">
                Contact our support team at{' '}
                <a href="mailto:support@homer.com" className="text-blue-600 hover:underline">
                  support@homer.com
                </a>
                {' '}or call us at{' '}
                <a href="tel:+911800000000" className="text-blue-600 hover:underline">
                  1800-000-000
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            🔒 Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
