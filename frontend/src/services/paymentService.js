// =================================================================
// HOMER - PAYMENT SERVICE
// Handles all payment-related API calls with mock/real switchability
// =================================================================

import { USE_MOCK, mockApiCall, mockApiError } from './mockApi';
import axios from 'axios';
import { mockTransactions, getUserById } from './mockData';

// =================================================================
// API ENDPOINT: POST /api/payments/create-order
// =================================================================
export const createPaymentOrder = async (type, metadata) => {
  if (USE_MOCK) {
    const orderId = `mock_order_${Date.now()}`;
    const amount = type === 'renter_subscription' ? 750 : 2000;
    
    return mockApiCall({
      order_id: orderId,
      amount: amount,
      currency: 'INR',
      type: type,
      metadata: metadata,
      is_mock: true,
      payment_gateway_data: {
        key_id: 'mock_razorpay_key',
        name: 'Homer',
        description: type === 'renter_subscription' 
          ? 'Premium Subscription (90 days)' 
          : 'Property Verification'
      }
    });
  }
  
  return axios.post('/api/payments/create-order', { type, metadata });
};

// =================================================================
// API ENDPOINT: POST /api/payments/verify
// =================================================================
export const verifyPayment = async (paymentId, orderId, signature, type) => {
  if (USE_MOCK) {
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('Not authenticated', 401);
    }
    
    const userId = token.split('_')[2];
    
    // Simulate successful payment verification
    const transactionId = `txn_${Date.now()}`;
    
    const transaction = {
      transaction_id: transactionId,
      user_id: userId,
      transaction_type: type,
      amount: type === 'renter_subscription' ? 750 : 2000,
      currency: 'INR',
      payment_gateway: 'razorpay',
      payment_id: paymentId,
      order_id: orderId,
      payment_status: 'success',
      is_mock: true,
      created_at: new Date().toISOString(),
      metadata: {}
    };
    
    mockTransactions.push(transaction);
    
    // Update user if subscription
    if (transaction.transaction_type === 'renter_subscription') {
      const user = JSON.parse(localStorage.getItem('user'));
      user.subscription_tier = 'premium';
      user.subscription_start = new Date().toISOString();
      user.subscription_end = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
      user.contacts_used = 0;
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return mockApiCall({
      success: true,
      transaction_id: transactionId,
      payment_status: 'success'
    });
  }
  
  return axios.post('/api/payments/verify', {
    payment_id: paymentId,
    order_id: orderId,
    signature: signature,
    type: type
  });
};

// =================================================================
// API ENDPOINT: GET /api/payments/history
// =================================================================
export const getPaymentHistory = async () => {
  if (USE_MOCK) {
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('Not authenticated', 401);
    }
    
    const userId = token.split('_')[2];
    
    const userTransactions = mockTransactions.filter(t => t.user_id.includes(userId));
    
    return mockApiCall(userTransactions);
  }
  
  return axios.get('/api/payments/history');
};

// =================================================================
// EXPORT ALL FUNCTIONS
// =================================================================
export default {
  createPaymentOrder,
  verifyPayment,
  getPaymentHistory
};
