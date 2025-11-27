import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Check, X, Calendar, CreditCard, Sparkles, Zap, Shield, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PricingCard from '../../components/payment/PricingCard';
import MockPaymentModal from '../../components/payment/MockPaymentModal';
import Button from '../../components/common/Button';
import { createPaymentOrder, verifyPayment, getPaymentHistory } from '../../services/paymentService';
import { pageTransition, fadeInUp, staggerContainer } from '../../utils/motionConfig';

const Subscription = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [billingCycle, setBillingCycle] = useState('90days'); // '90days' or 'annual'

  const isPremium = user?.subscription_tier === 'premium';

  useEffect(() => {
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
      const response = await verifyPayment(
        paymentData.payment_id,
        paymentData.order_id,
        paymentData.signature,
        'renter_subscription'
      );

      if (response.data.success) {
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
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-8" 
      data-testid="subscription-page"
      {...pageTransition}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <Crown className="w-16 h-16 text-yellow-600 mx-auto" />
          </motion.div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Unlock premium features and find your perfect home faster
          </p>
        </motion.div>

        {/* Current Plan Status */}
        {isPremium && (
          <motion.div 
            className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-2xl p-8 mb-12 shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute right-0 top-0 w-40 h-40 bg-yellow-200/30 rounded-full -mr-20 -mt-20"
            />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center">
                <motion.div
                  animate={{ 
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Crown className="w-12 h-12 text-yellow-600 mr-6" />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold text-yellow-900 mb-1">Premium Member ✨</h3>
                  <p className="text-sm text-yellow-700 font-medium">
                    Active until {formatDate(user.subscription_end)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-yellow-900">₹750</p>
                <p className="text-xs text-yellow-700 font-medium">per 90 days</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Billing Cycle Toggle */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white rounded-2xl p-2 shadow-lg border-2 border-gray-100 inline-flex">
            <motion.button
              onClick={() => setBillingCycle('90days')}
              className={`px-8 py-3 rounded-xl font-bold transition-all ${billingCycle === '90days' ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg' : 'text-gray-600 hover:text-gray-900'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              90 Days
            </motion.button>
            <motion.button
              onClick={() => setBillingCycle('annual')}
              className={`px-8 py-3 rounded-xl font-bold transition-all relative ${billingCycle === 'annual' ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg' : 'text-gray-600 hover:text-gray-900'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">Save 20%</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div 
          className="grid md:grid-cols-2 gap-8 mb-16"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Free Plan */}
          <motion.div variants={fadeInUp}>
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
          </motion.div>

          {/* Premium Plan */}
          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -10, scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <PricingCard
              title="Premium"
              price={billingCycle === '90days' ? '750' : '2400'}
              duration={billingCycle === '90days' ? '90 days' : 'year'}
              features={premiumFeatures}
              isPopular={true}
              isCurrent={isPremium}
              onUpgrade={handleUpgrade}
              buttonText={loading ? 'Processing...' : 'Upgrade to Premium'}
              disabled={loading || isPremium}
            />
          </motion.div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div 
          className="bg-white rounded-2xl shadow-2xl p-12 mb-16 border-2 border-gray-100"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Upgrade to Premium? 🚀
          </h2>
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <BenefitCard
              icon={<Zap className="w-10 h-10" />}
              title="Unlimited Contacts"
              description="Contact as many property owners as you want without any restrictions"
              color="blue"
            />
            <BenefitCard
              icon={<Crown className="w-10 h-10" />}
              title="Verified Badge"
              description="Get a verified renter badge that makes owners trust you more"
              color="yellow"
            />
            <BenefitCard
              icon={<Sparkles className="w-10 h-10" />}
              title="Advanced Search"
              description="Use lifestyle filters like AQI, noise levels, and walkability scores"
              color="purple"
            />
          </motion.div>
        </motion.div>

        {/* Payment History */}
        {transactions.length > 0 && (
          <motion.div 
            className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border-2 border-gray-100"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-600" />
              Payment History
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((txn, index) => (
                    <motion.tr 
                      key={txn.transaction_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatDate(txn.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {txn.transaction_type === 'renter_subscription' ? 'Premium Subscription' : txn.transaction_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        ₹{txn.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <motion.span 
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${txn.payment_status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                          whileHover={{ scale: 1.1 }}
                        >
                          {txn.payment_status}
                        </motion.span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* FAQ */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <p className="text-sm text-gray-600">
            Questions? Contact our support team at{' '}
            <a href="mailto:support@homer.com" className="text-blue-600 hover:text-blue-700 underline font-medium">
              support@homer.com
            </a>
          </p>
        </motion.div>
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
    </motion.div>
  );
};

// Benefit Card Component
const BenefitCard = ({ icon, title, description, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    yellow: 'from-yellow-500 to-orange-600',
    purple: 'from-purple-500 to-pink-600',
  };

  return (
    <motion.div 
      className="text-center group"
      variants={fadeInUp}
      whileHover={{ y: -10 }}
    >
      <motion.div 
        className={`w-20 h-20 bg-gradient-to-br ${colorClasses[color]} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl text-white`}
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.6 }}
      >
        {icon}
      </motion.div>
      <h3 className="font-bold text-gray-900 text-xl mb-3 group-hover:text-blue-600 transition-colors">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default Subscription;