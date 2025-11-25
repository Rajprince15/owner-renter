import React from 'react';
import { X, CheckCircle, TrendingUp, Shield, Zap, Eye, Award } from 'lucide-react';
import Button from '../common/Button';

const VerificationBenefitsModal = ({ isOpen, onClose, onVerifyNow }) => {
  if (!isOpen) return null;

  const benefits = [
    {
      icon: TrendingUp,
      title: '5X More Views',
      description: 'Verified properties appear at the top of search results',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Shield,
      title: 'Verified Badge',
      description: 'Green verified badge builds instant trust with renters',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Zap,
      title: 'Lifestyle Data',
      description: 'AQI, noise levels, walkability scores automatically calculated',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Eye,
      title: 'Premium Visibility',
      description: 'Appear in advanced lifestyle searches by premium renters',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      icon: Award,
      title: 'Quality Tenants',
      description: 'Attract verified renters with higher income and better profiles',
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    }
  ];

  const stats = [
    { label: 'Avg. Time to Find Tenant', unverified: '45 days', verified: '7 days', improvement: '84% faster' },
    { label: 'Monthly Views', unverified: '50', verified: '250+', improvement: '5X more' },
    { label: 'Quality Inquiries', unverified: '20%', verified: '80%', improvement: '4X better' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" data-testid="verification-benefits-modal">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition"
              data-testid="close-modal-btn"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-bold mb-2">Supercharge Your Property Listing! 🚀</h2>
            <p className="text-green-100 text-lg">Get verified and reach quality tenants 5X faster</p>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Benefits Grid */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Why Owners Choose Verification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`p-3 rounded-lg ${benefit.bgColor}`}>
                      <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison Stats */}
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Verified vs Unverified - Real Numbers</h3>
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                      <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {stat.improvement}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">Unverified</div>
                        <div className="text-lg font-bold text-gray-400">{stat.unverified}</div>
                      </div>
                      <div className="text-gray-300">→</div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">Verified</div>
                        <div className="text-lg font-bold text-green-600">{stat.verified}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">₹2,000 <span className="text-base font-normal text-gray-600">one-time per property</span></h3>
                  <p className="text-sm text-gray-600">No subscription • No hidden fees • Lifetime verification</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 line-through">₹5,000</div>
                  <div className="text-green-600 font-semibold">Save 60%</div>
                </div>
              </div>
            </div>

            {/* What You Get */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">What's Included:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  'Manual document verification by our team',
                  'Green verified badge on your listing',
                  'Priority ranking in all searches',
                  'Automatic lifestyle data calculation',
                  'Access to reverse marketplace',
                  'Dedicated support from verification team',
                  'Property analytics dashboard',
                  'Verification within 24-48 hours'
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={onVerifyNow}
                variant="primary" 
                size="lg"
                className="flex-1 bg-green-600 hover:bg-green-700"
                data-testid="verify-now-btn"
              >
                <Shield className="w-5 h-5 mr-2" />
                Verify My Property Now
              </Button>
              <Button 
                onClick={onClose}
                variant="outline" 
                size="lg"
                className="flex-1"
              >
                Maybe Later
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500 mt-4">
              🔒 Secure payment • 100% refund if verification fails • Questions? Contact support@homer.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationBenefitsModal;