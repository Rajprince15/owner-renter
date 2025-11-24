import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, AlertCircle, Upload, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import MockPaymentModal from '../../components/payment/MockPaymentModal';
import { createPaymentOrder, verifyPayment } from '../../services/paymentService';

const Verification = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock properties owned by user (in real app, fetch from API)
  const myProperties = [
    { id: 'prop_001', title: 'Spacious 2BHK in Koramangala', isVerified: false },
    { id: 'prop_005', title: 'Affordable 3BHK in Marathahalli', isVerified: false }
  ];

  const isVerified = user?.is_verified_owner;

  const verificationSteps = [
    {
      title: 'Submit Documents',
      description: 'Upload your ID proof and property ownership documents',
      icon: Upload,
      status: 'pending'
    },
    {
      title: 'Pay Verification Fee',
      description: '₹2000 one-time fee per property',
      icon: CreditCard,
      status: 'pending'
    },
    {
      title: 'Admin Review',
      description: 'Our team will verify your documents within 24-48 hours',
      icon: Shield,
      status: 'pending'
    },
    {
      title: 'Get Verified',
      description: 'Receive your verified badge and enhanced listing visibility',
      icon: CheckCircle,
      status: 'pending'
    }
  ];

  const benefits = [
    'Get verified badge on all your properties',
    '5X more visibility in search results',
    'Appear in lifestyle search (premium feature)',
    'Access to property analytics dashboard',
    'Higher trust from potential renters',
    'Priority listing in search rankings'
  ];

  const handleInitiateVerification = async () => {
    if (!selectedProperty) {
      alert('Please select a property to verify');
      return;
    }

    setLoading(true);
    try {
      // Create payment order
      const response = await createPaymentOrder('property_verification', {
        property_id: selectedProperty,
        user_id: user.user_id
      });
      
      setOrderData(response.data);
      setShowPaymentModal(true);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create payment order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      // Verify payment
      const response = await verifyPayment(
        paymentData.payment_id,
        paymentData.order_id,
        paymentData.signature,
        'property_verification'
      );

      if (response.data.success) {
        setShowPaymentModal(false);
        navigate('/payment/success', { 
          state: { 
            type: 'verification',
            amount: 2000,
            propertyId: selectedProperty
          } 
        });
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      setShowPaymentModal(false);
      navigate('/payment/failure', {
        state: {
          error: error.message || 'Payment verification failed'
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" data-testid="verification-page">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Property Verification
          </h1>
          <p className="text-lg text-gray-600">
            Get verified to increase trust and visibility
          </p>
        </div>

        {/* Verified Status */}
        {isVerified ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-green-900">You are Verified!</h3>
                <p className="text-sm text-green-700">
                  Your properties have enhanced visibility and trust
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-yellow-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900">Not Verified Yet</h3>
                <p className="text-sm text-yellow-700">
                  Complete verification to unlock premium features and increase visibility
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Verification Steps */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Verification Process</h2>
          <div className="space-y-6">
            {verificationSteps.map((step, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Verification Benefits</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Property Selection */}
        {!isVerified && myProperties.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Property to Verify</h2>
            <div className="space-y-3">
              {myProperties.map((property) => (
                <div
                  key={property.id}
                  onClick={() => setSelectedProperty(property.id)}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedProperty === property.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  data-testid={`property-option-${property.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                          selectedProperty === property.id
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedProperty === property.id && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{property.title}</span>
                    </div>
                    {property.isVerified ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                        Verified
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                        Not Verified
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing & CTA */}
        {!isVerified && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Verification Fee</h3>
                <p className="text-blue-100">One-time payment per property</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">₹2,000</div>
                <p className="text-sm text-blue-100">+ GST</p>
              </div>
            </div>
            <div className="mt-6">
              <Button
                onClick={handleInitiateVerification}
                disabled={!selectedProperty || loading}
                className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3"
                data-testid="initiate-verification-button"
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </Button>
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600">
            Questions about verification?{' '}
            <a href="mailto:verification@homer.com" className="text-blue-600 hover:underline">
              Contact our verification team
            </a>
          </p>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && orderData && (
        <MockPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          amount={orderData.amount}
          orderData={orderData}
        />
      )}
    </div>
  );
};

export default Verification;
