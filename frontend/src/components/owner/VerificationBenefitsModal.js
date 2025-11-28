import React from 'react';
import { X, Shield, TrendingUp, Eye, Users, CheckCircle, Zap, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';

const VerificationBenefitsModal = ({ isOpen, onClose, onVerifyNow }) => {
  if (!isOpen) return null;

  const benefits = [
    {
      icon: Eye,
      color: 'blue',
      title: '5X More Views',
      description: 'Verified properties appear at the top of search results and get dramatically more visibility'
    },
    {
      icon: TrendingUp,
      color: 'green',
      title: 'Find Tenants Faster',
      description: 'Verified listings attract quality renters in 7-10 days vs 45 days for unverified'
    },
    {
      icon: Users,
      color: 'purple',
      title: 'Premium Renters Access',
      description: 'Get discovered by verified renters and access the reverse marketplace'
    },
    {
      icon: CheckCircle,
      color: 'amber',
      title: 'Lifestyle Data Enrichment',
      description: 'Automatic AQI, noise level, and walkability scores make your listing stand out'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto" data-testid="verification-benefits-modal">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <motion.div 
            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Center modal */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">​</span>

          <motion.div 
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header with gradient */}
            <motion.div 
              className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8 text-white"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <motion.div 
                    className="p-3 bg-white/20 rounded-full mr-4"
                    animate={{ 
                      rotate: [0, -10, 10, -10, 10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Shield className="w-8 h-8" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Verify Your Properties!</h2>
                    <p className="text-green-100">Get 5X more views & find tenants faster</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition"
                  data-testid="close-modal-button"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
            </motion.div>

            {/* Content */}
            <div className="px-6 py-6">
              {/* Key Benefits */}
              <div className="space-y-4 mb-6">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div 
                      key={index}
                      className="flex items-start space-x-4"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <motion.div 
                        className={`p-2 bg-${benefit.color}-100 rounded-lg`}
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon className={`w-6 h-6 text-${benefit.color}-600`} />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                        <p className="text-sm text-gray-600">
                          {benefit.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pricing */}
              <motion.div 
                className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 mb-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">One-time fee per property</p>
                    <motion.p 
                      className="text-3xl font-bold text-gray-900"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ₹2,000
                    </motion.p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Average ROI</p>
                    <motion.p 
                      className="text-2xl font-bold text-green-600"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      12X
                    </motion.p>
                  </div>
                </div>
              </motion.div>

              {/* CTA Buttons */}
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
                    onClick={() => {
                      onClose();
                      onVerifyNow();
                    }}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 relative overflow-hidden"
                    data-testid="verify-now-button"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="relative z-10 flex items-center justify-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Verify Now
                    </span>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Footer Note */}
              <motion.p 
                className="text-xs text-center text-gray-500 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Verification takes 24-48 hours. You can verify anytime from your dashboard.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default VerificationBenefitsModal;