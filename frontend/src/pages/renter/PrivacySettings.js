import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getPrivacySettings, updatePrivacySettings } from '../../services/reverseMarketplaceService';

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
      
      // Update user context
      updateUser({ profile_visibility: profileVisibility });
      
      setSuccessMessage('Privacy settings updated successfully!');
      
      // Clear success message after 3 seconds
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

  return (
    <div className="min-h-screen bg-gray-50 py-8" data-testid="privacy-settings-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Shield className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Settings</h1>
          </div>
          <p className="text-gray-600">
            Control your visibility in the reverse marketplace
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start" data-testid="success-message">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-green-800 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start" data-testid="error-message">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        )}

        {/* Requirements Check */}
        {(!isPremium || !isVerified) && (
          <div className="mb-6 p-6 bg-yellow-50 border border-yellow-200 rounded-lg" data-testid="requirements-warning">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  Requirements Not Met
                </h3>
                <p className="text-yellow-800 mb-3">
                  To be visible in the reverse marketplace, you need:
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-yellow-800">
                    {isPremium ? (
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-yellow-600 mr-2" />
                    )}
                    <span className={isPremium ? 'line-through' : ''}>Premium Subscription</span>
                  </li>
                  <li className="flex items-center text-yellow-800">
                    {isVerified ? (
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-yellow-600 mr-2" />
                    )}
                    <span className={isVerified ? 'line-through' : ''}>Verified Renter Status</span>
                  </li>
                </ul>
                <div className="flex gap-3">
                  {!isPremium && (
                    <a
                      href="/renter/subscription"
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Upgrade to Premium
                    </a>
                  )}
                  {!isVerified && (
                    <a
                      href="/renter/verification"
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Get Verified
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Settings Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Reverse Marketplace Visibility</h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading settings...</p>
            </div>
          ) : (
            <>
              {/* Toggle Setting */}
              <div className="flex items-start justify-between py-4 border-b border-gray-200">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {profileVisibility ? (
                      <Eye className="w-5 h-5 text-blue-600 mr-2" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-gray-400 mr-2" />
                    )}
                    <h3 className="text-lg font-medium text-gray-900">
                      Make my profile visible to verified owners
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 ml-7">
                    {profileVisibility 
                      ? 'Your anonymized profile is visible in the reverse marketplace'
                      : 'Your profile is hidden from the reverse marketplace'}
                  </p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => setProfileVisibility(!profileVisibility)}
                    disabled={!isPremium || !isVerified}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      profileVisibility ? 'bg-blue-600' : 'bg-gray-200'
                    } ${(!isPremium || !isVerified) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    data-testid="visibility-toggle"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        profileVisibility ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Info Boxes */}
              <div className="mt-6 space-y-4">
                {/* What's Shared */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-2">What's Shared</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Anonymous ID (e.g., "Renter #1024")</li>
                        <li>• Employment type and income range</li>
                        <li>• Property preferences (BHK, budget, locations)</li>
                        <li>• Move-in date</li>
                        <li>• Verified renter badge status</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* What's Hidden */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-green-900 mb-2">What's Hidden</h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Your name and contact information</li>
                        <li>• Email and phone number</li>
                        <li>• Profile photo</li>
                        <li>• Personal documents</li>
                        <li>• Any other identifying information</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* How It Works */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">How It Works</h4>
                  <p className="text-sm text-gray-600">
                    When you opt-in, verified property owners can see your anonymized profile in the reverse marketplace. 
                    If an owner has a property matching your requirements, they can contact you through our platform. 
                    Your identity remains protected until you choose to respond.
                  </p>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving || (!isPremium || !isVerified)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  data-testid="save-settings-button"
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
