import React from 'react';
import { AlertCircle, MessageCircle, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const ContactLimitIndicator = ({ contactsUsed, contactsLimit, isPremium, className = '' }) => {
  const navigate = useNavigate();
  const contactsRemaining = contactsLimit === 'unlimited' ? 'unlimited' : contactsLimit - contactsUsed;
  const percentage = contactsLimit === 'unlimited' ? 100 : (contactsUsed / contactsLimit) * 100;

  // Don't show for premium users with unlimited contacts
  if (isPremium && contactsLimit === 'unlimited') {
    return (
      <div className={`bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Crown className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-semibold text-yellow-900">Premium Member</p>
              <p className="text-xs text-yellow-700">Unlimited property contacts</p>
            </div>
          </div>
          <div className="text-yellow-600">
            <MessageCircle className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  }

  // Determine color scheme based on usage
  let colorClass = 'green';
  let bgClass = 'bg-green-50';
  let borderClass = 'border-green-200';
  let textClass = 'text-green-900';
  let progressClass = 'bg-green-500';

  if (percentage >= 80) {
    colorClass = 'red';
    bgClass = 'bg-red-50';
    borderClass = 'border-red-200';
    textClass = 'text-red-900';
    progressClass = 'bg-red-500';
  } else if (percentage >= 60) {
    colorClass = 'yellow';
    bgClass = 'bg-yellow-50';
    borderClass = 'border-yellow-200';
    textClass = 'text-yellow-900';
    progressClass = 'bg-yellow-500';
  }

  return (
    <div 
      className={`${bgClass} border ${borderClass} rounded-lg p-4 ${className}`}
      data-testid="contact-limit-indicator"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <AlertCircle className={`w-5 h-5 text-${colorClass}-600 mr-2`} />
          <div>
            <p className={`text-sm font-semibold ${textClass}`}>
              Contact Limit: {contactsUsed} / {contactsLimit}
            </p>
            <p className={`text-xs text-${colorClass}-700`}>
              {contactsRemaining > 0 
                ? `${contactsRemaining} contacts remaining` 
                : 'Contact limit reached'}
            </p>
          </div>
        </div>
        {percentage >= 80 && (
          <MessageCircle className={`w-5 h-5 text-${colorClass}-600`} />
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div 
          className={`${progressClass} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Upgrade CTA */}
      {percentage >= 60 && !isPremium && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            Get unlimited contacts with Premium
          </p>
          <Button
            onClick={() => navigate('/renter/subscription')}
            size="small"
            className="text-xs py-1 px-3 bg-blue-600 hover:bg-blue-700"
            data-testid="upgrade-from-indicator-button"
          >
            Upgrade
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContactLimitIndicator;
