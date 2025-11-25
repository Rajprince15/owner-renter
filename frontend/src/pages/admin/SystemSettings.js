import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" data-testid="system-settings">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            data-testid="back-to-admin-button"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
              <p className="text-gray-600 mt-1">
                Configure platform settings and features
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="save-settings-button"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {hasChanges && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 font-semibold">⚠️ Unsaved Changes</p>
            <p className="text-yellow-700 text-sm">You have unsaved changes. Don't forget to save before leaving.</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Platform Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Platform Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                <input
                  type="text"
                  value={settings?.platform?.name || ''}
                  onChange={(e) => updateSetting('platform', 'name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="platform-name-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={settings?.platform?.contactEmail || ''}
                  onChange={(e) => updateSetting('platform', 'contactEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="contact-email-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
                <input
                  type="tel"
                  value={settings?.platform?.supportPhone || ''}
                  onChange={(e) => updateSetting('platform', 'supportPhone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="support-phone-input"
                />
              </div>
            </div>
          </div>

          {/* Pricing Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Pricing Settings</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Renter Subscription Price (₹)</label>
                <input
                  type="number"
                  value={settings?.pricing?.renterSubscriptionPrice || 0}
                  onChange={(e) => updateSetting('pricing', 'renterSubscriptionPrice', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="renter-subscription-price-input"
                />
                <p className="text-sm text-gray-600 mt-1">Price for 90-day premium subscription</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Verification Price (₹)</label>
                <input
                  type="number"
                  value={settings?.pricing?.propertyVerificationPrice || 0}
                  onChange={(e) => updateSetting('pricing', 'propertyVerificationPrice', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="property-verification-price-input"
                />
                <p className="text-sm text-gray-600 mt-1">One-time verification fee per property</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  value={settings?.pricing?.currency || 'INR'}
                  onChange={(e) => updateSetting('pricing', 'currency', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  data-testid="currency-select"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Feature Flags */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Power className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Feature Flags</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <span className="font-medium text-gray-900">Lifestyle Search</span>
                  <p className="text-sm text-gray-600">Enable advanced lifestyle-based property search</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings?.features?.lifestyleSearch || false}
                  onChange={(e) => updateSetting('features', 'lifestyleSearch', e.target.checked)}
                  className="w-5 h-5"
                  data-testid="lifestyle-search-toggle"
                />
              </label>
              <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <span className="font-medium text-gray-900">Reverse Marketplace</span>
                  <p className="text-sm text-gray-600">Allow owners to browse verified renters</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings?.features?.reverseMarketplace || false}
                  onChange={(e) => updateSetting('features', 'reverseMarketplace', e.target.checked)}
                  className="w-5 h-5"
                  data-testid="reverse-marketplace-toggle"
                />
              </label>
              <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <span className="font-medium text-gray-900">Chat System</span>
                  <p className="text-sm text-gray-600">Enable real-time chat between users</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings?.features?.chatEnabled || false}
                  onChange={(e) => updateSetting('features', 'chatEnabled', e.target.checked)}
                  className="w-5 h-5"
                  data-testid="chat-enabled-toggle"
                />
              </label>
              <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <span className="font-medium text-gray-900">Maintenance Mode</span>
                  <p className="text-sm text-gray-600 text-red-600">Disable all user access (admin only)</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings?.features?.maintenanceMode || false}
                  onChange={(e) => updateSetting('features', 'maintenanceMode', e.target.checked)}
                  className="w-5 h-5"
                  data-testid="maintenance-mode-toggle"
                />
              </label>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-yellow-600" />
              <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <span className="font-medium text-gray-900">Email Notifications</span>
                  <p className="text-sm text-gray-600">Send email notifications to users</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings?.notifications?.emailNotifications || false}
                  onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                  className="w-5 h-5"
                  data-testid="email-notifications-toggle"
                />
              </label>
              <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <span className="font-medium text-gray-900">Push Notifications</span>
                  <p className="text-sm text-gray-600">Send browser push notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings?.notifications?.pushNotifications || false}
                  onChange={(e) => updateSetting('notifications', 'pushNotifications', e.target.checked)}
                  className="w-5 h-5"
                  data-testid="push-notifications-toggle"
                />
              </label>
              <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <span className="font-medium text-gray-900">SMS Notifications</span>
                  <p className="text-sm text-gray-600">Send SMS alerts to users</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings?.notifications?.smsNotifications || false}
                  onChange={(e) => updateSetting('notifications', 'smsNotifications', e.target.checked)}
                  className="w-5 h-5"
                  data-testid="sms-notifications-toggle"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
