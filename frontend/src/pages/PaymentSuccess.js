import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home, Crown, Shield } from 'lucide-react';
import Button from '../components/common/Button';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, amount, propertyId } = location.state || {};

  useEffect(() => {
    // Confetti animation or celebration effect can be added here
    document.title = 'Payment Successful - Homer';
  }, []);

  const getSuccessMessage = () => {
    if (type === 'subscription') {
      return {
        title: 'Welcome to Premium!',
        subtitle: 'Your subscription has been activated successfully',
        icon: Crown,
        iconColor: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        benefits: [
          'Unlimited property contacts',
          'Verified Renter badge added to your profile',
          'Access to advanced lifestyle search',
          'Reverse marketplace visibility enabled',
          'Priority customer support'
        ],
        ctaText: 'Explore Premium Features',
        ctaLink: '/renter/dashboard'
      };
    } else if (type === 'verification') {
      return {
        title: 'Payment Successful!',
        subtitle: 'Your property verification request has been submitted',
        icon: Shield,
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-100',
        benefits: [
          'Our team will review your documents within 24-48 hours',
          'You will receive a notification once verified',
          'Verified properties get 5X more visibility',
          'Enhanced trust from potential renters',
          'Access to property analytics dashboard'
        ],
        ctaText: 'View My Properties',
        ctaLink: '/owner/properties'
      };
    }
    return {
      title: 'Payment Successful!',
      subtitle: 'Your payment has been processed successfully',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100',
      benefits: [],
      ctaText: 'Go to Dashboard',
      ctaLink: '/'
    };
  };

  const successData = getSuccessMessage();
  const IconComponent = successData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-12 px-4 transition-colors duration-200" data-testid="payment-success-page">
      <div className="max-w-2xl mx-auto">
        {/* Success Card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden transition-colors duration-200">
          {/* Header with Animation */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-slate-800 rounded-full mb-4 animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2" data-testid="success-title">
              {successData.title}
            </h1>
            <p className="text-green-100">{successData.subtitle}</p>
          </div>

          {/* Payment Details */}
          <div className="p-8">
            <div className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-6 mb-6 transition-colors duration-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600 dark:text-slate-400">Amount Paid:</span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">₹{amount || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Payment Status:</span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-semibold rounded-full">
                  Success
                </span>
              </div>
            </div>

            {/* Benefits/Next Steps */}
            {successData.benefits.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                  <IconComponent className={`w-6 h-6 ${successData.iconColor} dark:opacity-80 mr-2`} />
                  What's Next?
                </h3>
                <ul className="space-y-3">
                  {successData.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => navigate(successData.ctaLink)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                data-testid="cta-button"
              >
                {successData.ctaText}
                <ArrowRight className="w-5 h-5 ml-2 inline" />
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

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors duration-200">
              <p className="text-sm text-blue-900 dark:text-blue-300 text-center">
                📧 A confirmation email has been sent to your registered email address
              </p>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Need help?{' '}
            <a href="mailto:support@homer.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
