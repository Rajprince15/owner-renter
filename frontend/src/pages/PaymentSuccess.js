import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Home, Crown, Shield, Sparkles, Gift } from 'lucide-react';
import Button from '../components/common/Button';
import { fadeInUp, scaleIn } from '../utils/motionConfig';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, amount, propertyId } = location.state || {};
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    document.title = 'Payment Successful - Homer';
    
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
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

  // Confetti particles
  const confettiColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const confettiParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)]
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-12 px-4 transition-colors duration-200 relative overflow-hidden" data-testid="payment-success-page">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {confettiParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: particle.color,
                left: `${particle.x}%`,
                top: '-10%'
              }}
              initial={{ y: 0, opacity: 1, rotate: 0 }}
              animate={{
                y: '110vh',
                opacity: [1, 1, 0],
                rotate: 360 * 3
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: 'easeOut'
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        className="max-w-2xl mx-auto relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Success Card */}
        <motion.div
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden transition-colors duration-200"
          variants={scaleIn}
          initial="initial"
          animate="animate"
        >
          {/* Header with Animation */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-center relative overflow-hidden">
            {/* Sparkle effects */}
            <motion.div
              className="absolute top-4 left-8"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </motion.div>
            <motion.div
              className="absolute top-4 right-8"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -180, -360]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              <Gift className="w-6 h-6 text-yellow-300" />
            </motion.div>

            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-slate-800 rounded-full mb-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 10,
                delay: 0.2
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 0.5,
                  repeat: 3,
                  delay: 0.5
                }}
              >
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
              </motion.div>
            </motion.div>
            <motion.h1
              className="text-3xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              data-testid="success-title"
            >
              {successData.title}
            </motion.h1>
            <motion.p
              className="text-green-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {successData.subtitle}
            </motion.p>
          </div>

          {/* Payment Details */}
          <div className="p-8">
            <motion.div
              className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-6 mb-6 transition-colors duration-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600 dark:text-slate-400">Amount Paid:</span>
                <motion.span
                  className="text-2xl font-bold text-slate-900 dark:text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.6 }}
                >
                  ₹{amount || 'N/A'}
                </motion.span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Payment Status:</span>
                <motion.span
                  className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-semibold rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.7 }}
                >
                  Success
                </motion.span>
              </div>
            </motion.div>

            {/* Benefits/Next Steps */}
            {successData.benefits.length > 0 && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <IconComponent className={`w-6 h-6 ${successData.iconColor} dark:opacity-80 mr-2`} />
                  </motion.div>
                  What's Next?
                </h3>
                <motion.ul
                  className="space-y-3"
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
                  {successData.benefits.map((benefit, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start"
                      variants={fadeInUp}
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300">{benefit}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => navigate(successData.ctaLink)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                  data-testid="cta-button"
                >
                  {successData.ctaText}
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
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

            {/* Additional Info */}
            <motion.div
              className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors duration-200"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
            >
              <p className="text-sm text-blue-900 dark:text-blue-300 text-center">
                📧 A confirmation email has been sent to your registered email address
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Support */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Need help?{' '}
            <a href="mailto:support@homer.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              Contact Support
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;