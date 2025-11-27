import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Check, X, Calendar, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PricingCard from '../../components/payment/PricingCard';
import MockPaymentModal from '../../components/payment/MockPaymentModal';
import Button from '../../components/common/Button';
import { createPaymentOrder, verifyPayment, getPaymentHistory } from '../../services/paymentService';

const Subscription = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const isPremium = user?.subscription_tier === 'premium';

  useEffect(() => {
    // Load payment history
    const loadTransactions = async () => {
      try {
        const response = await getPaymentHistory();
        setTransactions(response.data || []);
      } catch (error) {
        console.error('Error loading transactions:', error);
      }
    };
    loadTransactions();
  }, []);

  const freeFeatures = [
    '2 property contacts',
    'Basic search filters',
    'Browse all listings',
    'Shortlist properties',
    'Basic chat functionality'
  ];

  const premiumFeatures = [
    'Unlimited property contacts',
    'Verified Renter badge',
    'Advanced lifestyle search',
    'Lifestyle search with AI',
    'AQI, noise, walkability filters',
    'Reverse marketplace visibility',
    'Priority customer support',
    'Early access to new features'
  ];

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // Create payment order
      const response = await createPaymentOrder('renter_subscription', {
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
        'renter_subscription'
      );

      if (response.data.success) {
        // Update user context
        updateUser({
          subscription_tier: 'premium',
          subscription_start: new Date().toISOString(),
          subscription_end: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          contacts_used: 0
        });

        setShowPaymentModal(false);
        navigate('/payment/success', { 
          state: { 
            type: 'subscription',
            amount: 750
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" data-testid="subscription-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600">
            Unlock premium features and find your perfect home faster
          </p>
        </div>

        {/* Current Plan Status */}
        {isPremium && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Crown className="w-8 h-8 text-yellow-600 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900">Premium Member</h3>
                  <p className="text-sm text-yellow-700">
                    Active until {formatDate(user.subscription_end)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-900">₹750</p>
                <p className="text-xs text-yellow-700">per 90 days</p>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <PricingCard
            title="Free"
            price="0"
            duration="forever"
            features={freeFeatures}
            isPopular={false}
            isCurrent={!isPremium}
            buttonText="Current Plan"
            disabled={true}
          />

          {/* Premium Plan */}
          <PricingCard
            title="Premium"
            price="750"
            duration="90 days"
            features={premiumFeatures}
            isPopular={true}
            isCurrent={isPremium}
            onUpgrade={handleUpgrade}
            buttonText={loading ? 'Processing...' : 'Upgrade to Premium'}
            disabled={loading || isPremium}
          />
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Upgrade to Premium?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Unlimited Contacts</h3>
              <p className="text-sm text-gray-600">
                Contact as many property owners as you want without any restrictions
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Verified Badge</h3>
              <p className="text-sm text-gray-600">
                Get a verified renter badge that makes owners trust you more
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Advanced Search</h3>
              <p className="text-sm text-gray-600">
                Use lifestyle filters like AQI, noise levels, and walkability scores
              </p>
            </div>
          </div>
        </div>

        {/* Payment History */}
        {transactions.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Payment History
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((txn) => (
                    <tr key={txn.transaction_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(txn.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {txn.transaction_type === 'renter_subscription' ? 'Premium Subscription' : txn.transaction_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ₹{txn.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          txn.payment_status === 'success' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {txn.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600">
            Questions? Contact our support team at{' '}
            <a href="mailto:support@homer.com" className="text-blue-600 hover:underline">
              support@homer.com
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

export default Subscription;
