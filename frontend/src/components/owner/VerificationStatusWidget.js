import React from 'react';
import { Shield, AlertCircle, CheckCircle, Clock, XCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const VerificationStatusWidget = ({ properties, user }) => {
  const unverifiedCount = properties.filter(p => !p.is_verified).length;
  const verifiedCount = properties.filter(p => p.is_verified).length;
  const pendingCount = properties.filter(p => p.owner_verification_status === 'pending').length;

  // If all properties are verified, show success state
  if (properties.length > 0 && unverifiedCount === 0) {
    return (
      <motion.div 
        className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6" 
        data-testid="verification-widget-success"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <motion.div 
              className="p-3 bg-green-100 rounded-full"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <CheckCircle className="w-6 h-6 text-green-600" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-green-900 mb-1">
                All Properties Verified! 🎉
              </h3>
              <p className="text-sm text-green-700 mb-3">
                Your {verifiedCount} {verifiedCount === 1 ? 'property is' : 'properties are'} getting maximum visibility
              </p>
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Link 
                  to="/owner/reverse-marketplace"
                  className="text-sm font-medium text-green-600 hover:text-green-700 inline-flex items-center"
                >
                  Browse Premium Renters <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // If no properties, show onboarding
  if (properties.length === 0) {
    return (
      <motion.div 
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6" 
        data-testid="verification-widget-onboarding"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start space-x-4">
          <motion.div 
            className="p-3 bg-blue-100 rounded-full"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield className="w-6 h-6 text-blue-600" />
          </motion.div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-blue-900 mb-1">
              Ready to List Your First Property?
            </h3>
            <p className="text-sm text-blue-700 mb-3">
              Get verified from the start to attract quality tenants 5X faster
            </p>
            <Button 
              to="/owner/property/add"
              variant="primary"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Property
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Show verification CTA for unverified properties
  return (
    <motion.div 
      className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6" 
      data-testid="verification-widget-cta"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <motion.div 
            className="p-3 bg-amber-100 rounded-full"
            animate={{ 
              rotate: [0, -10, 10, -10, 10, 0]
            }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
          >
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </motion.div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-amber-900 mb-1">
              {unverifiedCount} Unverified {unverifiedCount === 1 ? 'Property' : 'Properties'}
            </h3>
            <p className="text-sm text-amber-700 mb-3">
              Unverified properties get 90% fewer views. Get verified to unlock:
            </p>
            <motion.ul 
              className="space-y-1 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[
                '5X more views & top search ranking',
                'Lifestyle data & premium renter access',
                'Verified badge & enhanced trust'
              ].map((benefit, index) => (
                <motion.li 
                  key={index}
                  className="text-sm text-amber-700 flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <CheckCircle className="w-4 h-4 mr-2 text-amber-600" />
                  {benefit}
                </motion.li>
              ))}
            </motion.ul>
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  to="/owner/verification"
                  variant="primary"
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 relative overflow-hidden"
                  data-testid="verify-properties-btn"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="relative z-10 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Verify Now (₹1,500 per property)
                  </span>
                </Button>
              </motion.div>
              {pendingCount > 0 && (
                <motion.span 
                  className="text-xs text-amber-600 flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <Clock className="w-4 h-4 mr-1" />
                  {pendingCount} pending verification
                </motion.span>
              )}
            </motion.div>
          </div>
        </div>
        {verifiedCount > 0 && (
          <motion.div 
            className="text-right"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          >
            <motion.div 
              className="text-2xl font-bold text-green-600"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              {verifiedCount}
            </motion.div>
            <div className="text-xs text-green-700">Verified</div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default VerificationStatusWidget;