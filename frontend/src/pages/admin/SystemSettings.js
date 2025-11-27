import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Save, ChevronLeft, DollarSign, 
  Bell, Mail, MessageSquare, Power 
} from 'lucide-react';
import { 
  getSystemSettings, 
  updateSystemSettings,
  logAdminAction 
} from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const SystemSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/login');
      return;
    }
    loadSettings();
  }, [user, navigate]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await getSystemSettings();
      setSettings(response.data);
      setHasChanges(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      showToast('Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSystemSettings(settings);
      logAdminAction(user.user_id, 'system_settings_update', 'settings', null, {
        changes: settings
      });
      showToast('Settings saved successfully', 'success');
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-b-2 border-blue-600"
        />
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 p-6" 
      data-testid="system-settings"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            onClick={() => navigate('/admin')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 font-medium"
            data-testid="back-to-admin-button"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </motion.button>
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-600"
            whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <motion.h1 
                  className="text-3xl font-bold text-gray-900 flex items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Settings className="w-8 h-8 text-gray-700" />
                  System Settings
                </motion.h1>
                <p className="text-gray-600 mt-2">
                  Configure platform settings and features
                </p>
              </div>
              <motion.button
                onClick={handleSave}
                disabled={!hasChanges || saving}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                data-testid="save-settings-button"
                whileHover={hasChanges && !saving ? { scale: 1.05, y: -2 } : {}}
                whileTap={hasChanges && !saving ? { scale: 0.95 } : {}}
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {hasChanges && (
            <motion.div 
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <p className="text-yellow-800 font-semibold">⚠️ Unsaved Changes</p>
              <p className="text-yellow-700 text-sm">You have unsaved changes. Don't forget to save before leaving.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="space-y-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Platform Settings */}
          <motion.div 
            className="bg-white rounded-lg shadow p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Platform Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                <motion.input
                  type="text"
                  value={settings?.platform?.name || ''}
                  onChange={(e) => updateSetting('platform', 'name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="platform-name-input"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <motion.input
                  type="email"
                  value={settings?.platform?.contactEmail || ''}
                  onChange={(e) => updateSetting('platform', 'contactEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="contact-email-input"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
                <motion.input
                  type="tel"
                  value={settings?.platform?.supportPhone || ''}
                  onChange={(e) => updateSetting('platform', 'supportPhone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="support-phone-input"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Pricing Settings */}
          <motion.div 
            className="bg-white rounded-lg shadow p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Pricing Settings</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Renter Subscription Price (₹)</label>
                <motion.input
                  type="number"
                  value={settings?.pricing?.renterSubscriptionPrice || 0}
                  onChange={(e) => updateSetting('pricing', 'renterSubscriptionPrice', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="renter-subscription-price-input"
                  whileFocus={{ scale: 1.01 }}
                />
                <p className="text-sm text-gray-600 mt-1">Price for 90-day premium subscription</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Verification Price (₹)</label>
                <motion.input
                  type="number"
                  value={settings?.pricing?.propertyVerificationPrice || 0}
                  onChange={(e) => updateSetting('pricing', 'propertyVerificationPrice', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="property-verification-price-input"
                  whileFocus={{ scale: 1.01 }}
                />
                <p className="text-sm text-gray-600 mt-1">One-time verification fee per property</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <motion.select
                  value={settings?.pricing?.currency || 'INR'}
                  onChange={(e) => updateSetting('pricing', 'currency', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="currency-select"
                  whileHover={{ scale: 1.01 }}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </motion.select>
              </div>
            </div>
          </motion.div>

          {/* Feature Flags */}
          <motion.div 
            className="bg-white rounded-lg shadow p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Power className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Feature Flags</h2>
            </div>
            <div className="space-y-3">
              {[
                { key: 'lifestyleSearch', label: 'Lifestyle Search', desc: 'Enable advanced lifestyle-based property search' },
                { key: 'reverseMarketplace', label: 'Reverse Marketplace', desc: 'Allow owners to browse verified renters' },
                { key: 'chatEnabled', label: 'Chat System', desc: 'Enable real-time chat between users' },
                { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Disable all user access (admin only)', danger: true }
              ].map((feature, index) => (
                <motion.label 
                  key={feature.key}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (index * 0.05) }}
                  whileHover={{ x: 5, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                >
                  <div>
                    <span className="font-medium text-gray-900">{feature.label}</span>
                    <p className={`text-sm ${feature.danger ? 'text-red-600' : 'text-gray-600'}`}>{feature.desc}</p>
                  </div>
                  <motion.input
                    type="checkbox"
                    checked={settings?.features?.[feature.key] || false}
                    onChange={(e) => updateSetting('features', feature.key, e.target.checked)}
                    className="w-5 h-5"
                    data-testid={`${feature.key}-toggle`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                </motion.label>
              ))}
            </div>
          </motion.div>

          {/* Notification Settings */}
          <motion.div 
            className="bg-white rounded-lg shadow p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-yellow-600" />
              <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
            </div>
            <div className="space-y-3">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send email notifications to users' },
                { key: 'pushNotifications', label: 'Push Notifications', desc: 'Send browser push notifications' },
                { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Send SMS alerts to users' }
              ].map((notification, index) => (
                <motion.label 
                  key={notification.key}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + (index * 0.05) }}
                  whileHover={{ x: 5, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                >
                  <div>
                    <span className="font-medium text-gray-900">{notification.label}</span>
                    <p className="text-sm text-gray-600">{notification.desc}</p>
                  </div>
                  <motion.input
                    type="checkbox"
                    checked={settings?.notifications?.[notification.key] || false}
                    onChange={(e) => updateSetting('notifications', notification.key, e.target.checked)}
                    className="w-5 h-5"
                    data-testid={`${notification.key}-toggle`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                </motion.label>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SystemSettings;
