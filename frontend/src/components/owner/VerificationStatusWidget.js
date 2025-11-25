import React from 'react';
import { Shield, AlertCircle, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const VerificationStatusWidget = ({ properties, user }) => {
  const unverifiedCount = properties.filter(p => !p.is_verified).length;
  const verifiedCount = properties.filter(p => p.is_verified).length;
  const pendingCount = properties.filter(p => p.owner_verification_status === 'pending').length;

  // If all properties are verified, show success state
  if (properties.length > 0 && unverifiedCount === 0) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6" data-testid="verification-widget-success">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-900 mb-1">
                All Properties Verified! 🎉
              </h3>
              <p className="text-sm text-green-700 mb-3">
                Your {verifiedCount} {verifiedCount === 1 ? 'property is' : 'properties are'} getting maximum visibility
              </p>
              <Link 
                to="/owner/reverse-marketplace"
                className="text-sm font-medium text-green-600 hover:text-green-700 inline-flex items-center"
              >
                Browse Premium Renters <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no properties, show onboarding
  if (properties.length === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6" data-testid="verification-widget-onboarding">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
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
      </div>
    );
  }

  // Show verification CTA for unverified properties
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6" data-testid="verification-widget-cta">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="p-3 bg-amber-100 rounded-full">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-amber-900 mb-1">
              {unverifiedCount} Unverified {unverifiedCount === 1 ? 'Property' : 'Properties'}
            </h3>
            <p className="text-sm text-amber-700 mb-3">
              Unverified properties get 90% fewer views. Get verified to unlock:
            </p>
            <ul className="space-y-1 mb-4">
              <li className="text-sm text-amber-700 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-amber-600" />
                5X more views & top search ranking
              </li>
              <li className="text-sm text-amber-700 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-amber-600" />
                Lifestyle data & premium renter access
              </li>
              <li className="text-sm text-amber-700 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-amber-600" />
                Verified badge & enhanced trust
              </li>
            </ul>
            <div className="flex items-center space-x-3">
              <Button 
                to="/owner/verification"
                variant="primary"
                size="sm"
                className="bg-amber-600 hover:bg-amber-700"
                data-testid="verify-properties-btn"
              >
                <Shield className="w-4 h-4 mr-2" />
                Verify Now (₹2,000 per property)
              </Button>
              {pendingCount > 0 && (
                <span className="text-xs text-amber-600 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {pendingCount} pending verification
                </span>
              )}
            </div>
          </div>
        </div>
        {verifiedCount > 0 && (
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{verifiedCount}</div>
            <div className="text-xs text-green-700">Verified</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationStatusWidget;