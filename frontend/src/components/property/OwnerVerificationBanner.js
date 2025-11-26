import React from 'react';
import { Shield, AlertCircle, CheckCircle, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const OwnerVerificationBanner = ({ property }) => {
  if (!property || property.is_verified) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-amber-900/30 dark:via-orange-900/30 dark:to-amber-900/30 border-2 border-amber-300 dark:border-amber-700 rounded-xl p-6 mb-6 shadow-lg transition-colors duration-200" data-testid="owner-verification-banner">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-full flex-shrink-0">
          <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-1">
                ⚠️ This Property is Not Verified
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Unverified properties get 90% fewer views and rank at the bottom of search results
              </p>
            </div>
          </div>

          {/* Stats Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-amber-200 dark:border-amber-700 transition-colors duration-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">Current Status</span>
                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-semibold rounded">
                  Bottom Rank
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {property.analytics?.total_views || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Views</div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-3 text-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-green-100">After Verification</span>
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold">
                {(property.analytics?.total_views || 0) * 5}+
              </div>
              <div className="text-xs text-green-100">Estimated Views (5X)</div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-amber-200 dark:border-amber-700 transition-colors duration-200">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">You'll Get</div>
              <ul className="space-y-1">
                <li className="flex items-center text-xs text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-3 h-3 mr-1 text-green-600 dark:text-green-400" />
                  Top search rank
                </li>
                <li className="flex items-center text-xs text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-3 h-3 mr-1 text-green-600 dark:text-green-400" />
                  Lifestyle data
                </li>
                <li className="flex items-center text-xs text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-3 h-3 mr-1 text-green-600 dark:text-green-400" />
                  Premium renters
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center space-x-4">
            <Link
              to="/owner/verification"
              state={{ propertyId: property.property_id }}
            >
              <Button 
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md"
                data-testid="verify-property-cta"
              >
                <Shield className="w-4 h-4 mr-2" />
                Verify This Property Now (₹2,000)
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <div className="text-sm text-amber-700 dark:text-amber-300">
              <strong>24-48 hour</strong> verification • <strong>12X ROI</strong> on average
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerVerificationBanner;