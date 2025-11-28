import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertCircle, CheckCircle, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const OwnerVerificationBanner = ({ property }) => {
  if (!property || property.is_verified) {
    return null;
  }

  const estimatedViewIncrease = (property.analytics?.total_views || 0) * 5;

  return (
    <motion.div
      className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 dark:from-amber-900/30 dark:via-orange-900/30 dark:to-amber-900/30 border-2 border-amber-300 dark:border-amber-700 rounded-xl p-6 mb-6 shadow-xl overflow-hidden relative transition-colors duration-200"
      data-testid="owner-verification-banner"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
    >
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-0 right-0 w-64 h-64 bg-amber-300/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-64 h-64 bg-orange-300/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5]
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="flex items-start space-x-4 relative z-10">
        {/* Alert Icon with Animation */}
        <motion.div
          className="p-4 bg-amber-100 dark:bg-amber-900/50 rounded-full flex-shrink-0 shadow-lg"
          animate={{
            rotate: [0, -5, 5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </motion.div>
        
        <div className="flex-1">
          {/* Header */}
          <motion.div
            className="flex items-start justify-between mb-4"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div>
              <motion.h3
                className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  ⚠️
                </motion.span>
                This Property is Not Verified
              </motion.h3>
              <motion.p
                className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  👀
                </motion.span>
                Unverified properties get 90% fewer views and rank at the bottom of search results
              </motion.p>
            </div>
          </motion.div>

          {/* Stats Comparison with Stagger Animation */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3
                }
              }
            }}
          >
            {/* Current Status Card */}
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-lg p-4 border-2 border-red-200 dark:border-red-700 shadow-md transition-colors duration-200"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600 dark:text-gray-400 font-semibold">Current Status</span>
                <motion.span
                  className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold rounded"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Bottom Rank
                </motion.span>
              </div>
              <motion.div
                className="text-3xl font-bold text-gray-900 dark:text-white mb-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.5 }}
              >
                {property.analytics?.total_views || 0}
              </motion.div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Views</div>
            </motion.div>

            {/* After Verification Card */}
            <motion.div
              className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 text-white shadow-lg relative overflow-hidden"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.2)" }}
            >
              {/* Sparkles Animation */}
              <motion.div
                className="absolute top-2 right-2"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-white/50" />
              </motion.div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-green-100 font-semibold">After Verification</span>
                <motion.div
                  animate={{ y: [-2, 2, -2] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <TrendingUp className="w-5 h-5" />
                </motion.div>
              </div>
              <motion.div
                className="text-3xl font-bold mb-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.6 }}
              >
                {estimatedViewIncrease}+
              </motion.div>
              <div className="text-xs text-green-100">Estimated Views (5X Boost)</div>
            </motion.div>

            {/* Benefits Card */}
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-lg p-4 border-2 border-green-200 dark:border-green-700 shadow-md transition-colors duration-200"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
            >
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-3 font-semibold">You&apos;ll Get:</div>
              <motion.ul
                className="space-y-2"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.7 } }
                }}
              >
                {[
                  { icon: '🚀', text: 'Top search rank' },
                  { icon: '🌿', text: 'Lifestyle data' },
                  { icon: '👑', text: 'Premium renters' }
                ].map((benefit, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-center text-xs text-gray-700 dark:text-gray-300"
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    whileHover={{ x: 5 }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="mr-1">{benefit.icon}</span>
                    {benefit.text}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="flex flex-col md:flex-row items-start md:items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link
              to="/owner/verification"
              state={{ propertyId: property.property_id }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl border-2 border-green-400"
                  data-testid="verify-property-cta"
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <Shield className="w-5 h-5 mr-2" />
                  </motion.div>
                  Verify This Property Now (₹1,500)
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </motion.div>
                </Button>
              </motion.div>
            </Link>
            <motion.div
              className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ⏱️
              </motion.span>
              <div>
                <strong>24-48 hour</strong> verification &bull; <strong>12X ROI</strong> on average
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default OwnerVerificationBanner;