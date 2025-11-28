import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, EyeOff, CheckCircle, AlertCircle, Info, Crown, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getPrivacySettings, updatePrivacySettings } from '../../services/reverseMarketplaceService';
import { pageTransition, fadeInUp, staggerContainer } from '../../utils/motionConfig';

const PrivacySettings = () => {
  const { user, updateUser } = useAuth();
  
  const [profileVisibility, setProfileVisibility] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadPrivacySettings();
  }, []);

  const loadPrivacySettings = async () => {
    try {
      setLoading(true);
      const response = await getPrivacySettings();
      setProfileVisibility(response.data.profile_visibility || false);
    } catch (err) {
      console.error('Error loading privacy settings:', err);
      setErrorMessage('Failed to load privacy settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccessMessage('');
      setErrorMessage('');
      
      const response = await updatePrivacySettings({
        profile_visibility: profileVisibility
      });
      
      updateUser({ profile_visibility: profileVisibility });
      
      setSuccessMessage('Privacy settings updated successfully!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error updating privacy settings:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to update privacy settings');
    } finally {
      setSaving(false);
    }
  };

  const isPremium = user?.subscription_tier === 'premium';
  const isVerified = user?.is_verified_renter;

  if (loading) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex justify-center items-center"
        {...pageTransition}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"
          />
          <motion.p 
            className="mt-4 text-gray-600 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Loading settings...
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8" 
      data-testid="privacy-settings-page"
      {...pageTransition}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center mb-3">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Shield className="w-10 h-10 text-indigo-600 mr-4" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Privacy Settings</h1>
          </div>
          <motion.p 
            className="text-gray-600 text-lg ml-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Control your visibility in the reverse marketplace
          </motion.p>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div 
              className="mb-6 p-6 bg-green-50 border-2 border-green-200 rounded-2xl flex items-start shadow-lg" 
              data-testid="success-message"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
            >
              <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-800 font-semibold">{successMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div 
              className="mb-6 p-6 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start shadow-lg" 
              data-testid="error-message"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
            >
              <AlertCircle className="w-6 h-6 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800 font-semibold">{errorMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Requirements Check */}
        {(!isPremium || !isVerified) && (
          <motion.div 
            className="mb-8 p-8 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-2xl shadow-2xl relative overflow-hidden" 
            data-testid="requirements-warning"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute right-0 top-0 w-40 h-40 bg-yellow-200/30 rounded-full -mr-20 -mt-20"
            />
            <div className="flex items-start relative z-10">
              <AlertCircle className="w-8 h-8 text-yellow-600 mr-4 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-yellow-900 mb-3">
                  Requirements Not Met
                </h3>
                <p className="text-yellow-800 mb-6 text-lg">
                  To be visible in the reverse marketplace, you need:
                </p>
                <motion.ul 
                  className="space-y-4 mb-6"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  <motion.li 
                    className="flex items-center text-yellow-900 text-lg"
                    variants={fadeInUp}
                    whileHover={{ x: 5 }}
                  >
                    {isPremium ? (
                      <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                    ) : (
                      <Crown className="w-6 h-6 text-yellow-600 mr-3" />
                    )}
                    <span className={isPremium ? 'line-through' : 'font-semibold'}>Premium Subscription</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-center text-yellow-900 text-lg"
                    variants={fadeInUp}
                    whileHover={{ x: 5 }}
                  >
                    {isVerified ? (
                      <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                    ) : (
                      <Shield className="w-6 h-6 text-yellow-600 mr-3" />
                    )}
                    <span className={isVerified ? 'line-through' : 'font-semibold'}>Verified Renter Status</span>
                  </motion.li>
                </motion.ul>
                <div className="flex gap-4">
                  {!isPremium && (
                    <motion.a
                      href="/renter/subscription"
                      className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-xl transition-colors shadow-xl"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Upgrade to Premium
                    </motion.a>
                  )}
                  {!isVerified && (
                    <motion.a
                      href="/renter/verification"
                      className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-xl transition-colors shadow-xl"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Get Verified
                    </motion.a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Settings Card */}
        <motion.div 
          className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border-2 border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <Lock className="w-6 h-6 mr-3 text-indigo-600" />
            Reverse Marketplace Visibility
          </h2>

          {/* Toggle Setting */}
          <motion.div 
            className="flex items-start justify-between py-6 border-b-2 border-gray-100"
            whileHover={{ backgroundColor: "rgba(99, 102, 241, 0.05)" }}
          >
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <motion.div
                  animate={profileVisibility ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {profileVisibility ? (
                    <Eye className="w-6 h-6 text-indigo-600 mr-3" />
                  ) : (
                    <EyeOff className="w-6 h-6 text-gray-400 mr-3" />
                  )}
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900">
                  Make my profile visible to verified owners
                </h3>
              </div>
              <p className="text-gray-600 ml-9">
                {profileVisibility 
                  ? 'Your anonymized profile is visible in the reverse marketplace'
                  : 'Your profile is hidden from the reverse marketplace'}
              </p>
            </div>
            <div className="ml-6">
              <motion.button
                onClick={() => setProfileVisibility(!profileVisibility)}
                disabled={!isPremium || !isVerified}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2 ${
                  profileVisibility ? 'bg-indigo-600' : 'bg-gray-300'
                } ${(!isPremium || !isVerified) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                data-testid="visibility-toggle"
                whileHover={(!isPremium || !isVerified) ? {} : { scale: 1.05 }}
                whileTap={(!isPremium || !isVerified) ? {} : { scale: 0.95 }}
              >
                <motion.span
                  className="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg"
                  animate={{
                    x: profileVisibility ? 34 : 4
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>
          </motion.div>

          {/* Info Boxes */}
          <motion.div 
            className="mt-8 space-y-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* What's Shared */}
            <motion.div 
              className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-2xl"
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className="flex items-start">
                <Info className="w-6 h-6 text-indigo-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-indigo-900 mb-3 text-lg">What's Shared</h4>
                  <ul className="text-indigo-800 space-y-2">
                    <li className="flex items-center"><span className="w-2 h-2 bg-indigo-600 rounded-full mr-3"/> Anonymous ID (e.g., "Renter #1024")</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-indigo-600 rounded-full mr-3"/> Employment type and income range</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-indigo-600 rounded-full mr-3"/> Property preferences (BHK, budget, locations)</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-indigo-600 rounded-full mr-3"/> Move-in date</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-indigo-600 rounded-full mr-3"/> Verified renter badge status</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* What's Hidden */}
            <motion.div 
              className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl"
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className="flex items-start">
                <Shield className="w-6 h-6 text-green-600 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-green-900 mb-3 text-lg">What's Hidden</h4>
                  <ul className="text-green-800 space-y-2">
                    <li className="flex items-center"><span className="w-2 h-2 bg-green-600 rounded-full mr-3"/> Your name and contact information</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-green-600 rounded-full mr-3"/> Email and phone number</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-green-600 rounded-full mr-3"/> Profile photo</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-green-600 rounded-full mr-3"/> Personal documents</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-green-600 rounded-full mr-3"/> Any other identifying information</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* How It Works */}
            <motion.div 
              className="p-6 bg-gray-50 border-2 border-gray-200 rounded-2xl"
              variants={fadeInUp}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <h4 className="font-bold text-gray-900 mb-3 text-lg">How It Works</h4>
              <p className="text-gray-700 leading-relaxed">
                When you opt-in, verified property owners can see your anonymized profile in the reverse marketplace. 
                If an owner has a property matching your requirements, they can contact you through our platform. 
                Your identity remains protected until you choose to respond.
              </p>
            </motion.div>
          </motion.div>

          {/* Save Button */}
          <motion.div 
            className="mt-8 flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              onClick={handleSave}
              disabled={saving || (!isPremium || !isVerified)}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-xl"
              data-testid="save-settings-button"
              whileHover={(!isPremium || !isVerified) ? {} : { scale: 1.05, y: -2 }}
              whileTap={(!isPremium || !isVerified) ? {} : { scale: 0.95 }}
            >
              {saving ? (
                <span className="flex items-center">
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Saving...
                </span>
              ) : (
                'Save Settings'
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PrivacySettings;
