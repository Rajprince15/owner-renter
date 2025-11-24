import React from 'react';
import { X, Check, Zap } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const UpgradeModal = ({ isOpen, onClose, onUpgrade, contactsUsed = 5, contactsLimit = 5 }) => {
  const freeFeatures = [
    '5 property contacts',
    'Basic search filters',
    'Browse all listings',
    'Shortlist properties'
  ];

  const premiumFeatures = [
    'Unlimited property contacts',
    'Verified Renter badge',
    'Advanced lifestyle search',
    'Natural language search',
    'Reverse marketplace visibility',
    'Priority support'
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <div className="p-6" data-testid="upgrade-modal">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Zap className="w-8 h-8 text-yellow-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">
              Upgrade to Premium
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600"
            data-testid="close-upgrade-modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Warning Message */}
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-800 font-semibold text-lg">
            ⚠️ You've reached your contact limit ({contactsUsed}/{contactsLimit})
          </p>
          <p className="text-red-700 text-sm mt-1">
            Upgrade to Premium to unlock unlimited contacts and powerful features!
          </p>
        </div>

        {/* Feature Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Free Tier */}
          <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Free Plan</h3>
            <ul className="space-y-2">
              {freeFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Premium Tier */}
          <div className="border-2 border-blue-500 rounded-lg p-5 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-blue-700">Premium Plan</h3>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                ₹750 / 90 days
              </span>
            </div>
            <ul className="space-y-2">
              {premiumFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Benefits Highlight */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-900 font-semibold mb-2">💎 Premium Benefits:</p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Contact unlimited property owners without restrictions</li>
            <li>• Get verified renter badge - owners trust verified renters 3X more</li>
            <li>• Access advanced lifestyle filters (AQI, noise levels, walkability)</li>
            <li>• Be visible to verified owners in reverse marketplace</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex-1"
            data-testid="maybe-later-button"
          >
            Maybe Later
          </Button>
          <Button 
            onClick={onUpgrade} 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            data-testid="upgrade-now-button"
          >
            Upgrade Now - ₹750
          </Button>
        </div>

        {/* Trust Badge */}
        <p className="text-xs text-gray-500 text-center mt-4">
          🔒 Secure payment • Cancel anytime • 100% satisfaction guaranteed
        </p>
      </div>
    </Modal>
  );
};

export default UpgradeModal;
