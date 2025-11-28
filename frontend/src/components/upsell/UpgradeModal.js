import React from 'react';
import { X, Check, Zap, Crown, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '../common/Modal';
import Button from '../common/Button';

const UpgradeModal = ({ isOpen, onClose, onUpgrade, contactsUsed = 2, contactsLimit = 2 }) => {
  const freeFeatures = [
    '2 property contacts',
    'Basic search filters',
    'Browse all listings',
    'Shortlist properties'
  ];

  const premiumFeatures = [
    'Unlimited property contacts',
    'Verified Renter badge',
    'Advanced lifestyle search',
    'Lifestyle search with AI',
    'Reverse marketplace visibility',
    'Priority support'
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <motion.div 
        className="p-6" 
        data-testid="upgrade-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <motion.div 
          className="flex justify-between items-center mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center">
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
            >
              <Zap className="w-8 h-8 text-yellow-500 mr-3" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900">
              Upgrade to Premium
            </h2>
          </div>
          <motion.button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600"
            data-testid="close-upgrade-modal"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-6 h-6" />
          </motion.button>
        </motion.div>

        {/* Warning Message */}
        <motion.div 
          className="bg-red-50 border-l-4 border-red-400 p-4 mb-6"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <p className="text-red-800 font-semibold text-lg">
            ⚠️ You've reached your contact limit ({contactsUsed}/{contactsLimit})
          </p>
          <p className="text-red-700 text-sm mt-1">
            Upgrade to Premium to unlock unlimited contacts and powerful features!
          </p>
        </motion.div>

        {/* Feature Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Free Tier */}
          <motion.div 
            className="border border-gray-200 rounded-lg p-5 bg-gray-50"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Free Plan</h3>
            <ul className="space-y-2">
              {freeFeatures.map((feature, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Check className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Premium Tier */}
          <motion.div 
            className="border-2 border-blue-500 rounded-lg p-5 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-transparent"
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Crown className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-blue-700">Premium Plan</h3>
                </div>
                <motion.span 
                  className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ₹750 / 90 days
                </motion.span>
              </div>
              <ul className="space-y-2">
                {premiumFeatures.map((feature, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Check className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    </motion.div>
                    <span className="text-gray-700 font-medium text-sm">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Benefits Highlight */}
        <motion.div 
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-blue-900 font-semibold mb-2">💎 Premium Benefits:</p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Contact unlimited property owners without restrictions</li>
            <li>• Get verified renter badge - owners trust verified renters 3X more</li>
            <li>• Access advanced lifestyle filters (AQI, noise levels, walkability)</li>
            <li>• Be visible to verified owners in reverse marketplace</li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex-1"
            data-testid="maybe-later-button"
          >
            Maybe Later
          </Button>
          <motion.div className="flex-1">
            <Button 
              onClick={onUpgrade} 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 relative overflow-hidden"
              data-testid="upgrade-now-button"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <span className="relative z-10 flex items-center justify-center">
                <Zap className="w-4 h-4 mr-2" />
                Upgrade Now - ₹750
              </span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Trust Badge */}
        <motion.p 
          className="text-xs text-gray-500 text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          🔒 Secure payment • Cancel anytime • 100% satisfaction guaranteed
        </motion.p>
      </motion.div>
    </Modal>
  );
};

export default UpgradeModal;