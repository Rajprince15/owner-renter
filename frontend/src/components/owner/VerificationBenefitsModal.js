import React from 'react';
import { X, Shield, TrendingUp, Eye, Users, CheckCircle } from 'lucide-react';
import Button from '../common/Button';

const VerificationBenefitsModal = ({ isOpen, onClose, onVerifyNow }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" data-testid="verification-benefits-modal">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
          onClick={onClose}
        />

        {/* Center modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-full mr-4">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">Verify Your Properties!</h2>
                  <p className="text-green-100">Get 5X more views & find tenants faster</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition"
                data-testid="close-modal-button"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Key Benefits */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">5X More Views</h3>
                  <p className="text-sm text-gray-600">
                    Verified properties appear at the top of search results and get dramatically more visibility
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Find Tenants Faster</h3>
                  <p className="text-sm text-gray-600">
                    Verified listings attract quality renters in 7-10 days vs 45 days for unverified
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Premium Renters Access</h3>
                  <p className="text-sm text-gray-600">
                    Get discovered by verified renters and access the reverse marketplace
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Lifestyle Data Enrichment</h3>
                  <p className="text-sm text-gray-600">
                    Automatic AQI, noise level, and walkability scores make your listing stand out
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">One-time fee per property</p>
                  <p className="text-3xl font-bold text-gray-900">₹2,000</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Average ROI</p>
                  <p className="text-2xl font-bold text-green-600">12X</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
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
                onClick={() => {
                  onClose();
                  onVerifyNow();
                }}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                data-testid="verify-now-button"
              >
                <Shield className="w-4 h-4 mr-2" />
                Verify Now
              </Button>
            </div>

            {/* Footer Note */}
            <p className="text-xs text-center text-gray-500 mt-4">
              Verification takes 24-48 hours. You can verify anytime from your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationBenefitsModal;
