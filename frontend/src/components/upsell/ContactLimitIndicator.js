import React from 'react';
import { AlertCircle, MessageCircle, Crown, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const ContactLimitIndicator = ({ contactsUsed, contactsLimit, isPremium, className = '' }) => {
  const navigate = useNavigate();
  const contactsRemaining = contactsLimit === 'unlimited' ? 'unlimited' : contactsLimit - contactsUsed;
  const percentage = contactsLimit === 'unlimited' ? 100 : (contactsUsed / contactsLimit) * 100;

  // Don't show for premium users with unlimited contacts
  if (isPremium && contactsLimit === 'unlimited') {
    return (
      <motion.div 
        className={`bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4 ${className}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 5 }}
            >
              <Crown className="w-5 h-5 text-yellow-600 mr-3" />
            </motion.div>
            <div>
              <p className="text-sm font-semibold text-yellow-900">Premium Member</p>
              <p className="text-xs text-yellow-700">Unlimited property contacts</p>
            </div>
          </div>
          <motion.div 
            className="text-yellow-600"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <MessageCircle className="w-6 h-6" />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Determine color scheme based on usage
  let colorClass = 'green';
  let bgClass = 'bg-green-50';
  let borderClass = 'border-green-200';
  let textClass = 'text-green-900';
  let progressClass = 'bg-green-500';
  let iconColor = 'text-green-600';

  if (percentage >= 80) {
    colorClass = 'red';
    bgClass = 'bg-red-50';
    borderClass = 'border-red-200';
    textClass = 'text-red-900';
    progressClass = 'bg-red-500';
    iconColor = 'text-red-600';
  } else if (percentage >= 60) {
    colorClass = 'yellow';
    bgClass = 'bg-yellow-50';
    borderClass = 'border-yellow-200';
    textClass = 'text-yellow-900';
    progressClass = 'bg-yellow-500';
    iconColor = 'text-yellow-600';
  }

  return (
    <motion.div 
      className={`${bgClass} border ${borderClass} rounded-lg p-4 ${className}`}
      data-testid="contact-limit-indicator"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <motion.div
            animate={
              percentage >= 80
                ? { rotate: [0, -10, 10, -10, 10, 0] }
                : {}
            }
            transition={
              percentage >= 80
                ? { duration: 0.5, repeat: Infinity, repeatDelay: 3 }
                : {}
            }
          >
            <AlertCircle className={`w-5 h-5 ${iconColor} mr-2`} />
          </motion.div>
          <div>
            <p className={`text-sm font-semibold ${textClass}`}>
              Contact Limit: {contactsUsed} / {contactsLimit}
            </p>
            <p className={`text-xs ${iconColor}`}>
              {contactsRemaining > 0 
                ? `${contactsRemaining} contacts remaining` 
                : 'Contact limit reached'}
            </p>
          </div>
        </div>
        {percentage >= 80 && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <MessageCircle className={`w-5 h-5 ${iconColor}`} />
          </motion.div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
        <motion.div 
          className={`${progressClass} h-2 rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        />
      </div>

      {/* Upgrade CTA */}
      {percentage >= 60 && !isPremium && (
        <motion.div 
          className="flex items-center justify-between pt-2 border-t border-gray-200"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-gray-600 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            Get unlimited contacts with Premium
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => navigate('/renter/subscription')}
              size="small"
              className="text-xs py-1 px-3 bg-blue-600 hover:bg-blue-700 relative overflow-hidden"
              data-testid="upgrade-from-indicator-button"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <span className="relative z-10">Upgrade</span>
            </Button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ContactLimitIndicator;