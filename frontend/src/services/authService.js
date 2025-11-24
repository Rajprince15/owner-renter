import { USE_MOCK, mockApiCall, mockApiError } from './mockApi';
import axios from 'axios';

// MOCK DATA STORE (in-memory for testing)
// These users match the quick login buttons and SQL sample_data.sql schema
let mockUsers = [
  {
    user_id: 'admin_001',
    email: 'admin@homer.com',
    phone: '+919999999999',
    password_hash: 'admin@123', // In real backend, this is bcrypt hashed
    user_type: 'admin',
    full_name: 'System Administrator',
    is_admin: true,
    admin_role: 'super_admin',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    user_id: 'user_001_renter_free',
    email: 'renter.free@homer.com',
    phone: '+919876543210',
    password_hash: 'password123',
    user_type: 'renter',
    full_name: 'Raj Kumar',
    subscription_tier: 'free',
    contacts_used: 2,
    is_verified_renter: false,
    renter_verification_status: 'none',
    is_admin: false,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    user_id: 'user_002_renter_premium',
    email: 'renter.premium@homer.com',
    phone: '+919876543211',
    password_hash: 'password123',
    user_type: 'renter',
    full_name: 'Priya Sharma',
    subscription_tier: 'premium',
    subscription_start: new Date().toISOString(),
    subscription_end: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    contacts_used: 15,
    is_verified_renter: true,
    renter_verification_status: 'verified',
    is_admin: false,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    user_id: 'user_004_owner_verified',
    email: 'owner.verified@homer.com',
    phone: '+919876543213',
    password_hash: 'password123',
    user_type: 'owner',
    full_name: 'Sunita Reddy',
    is_verified_owner: true,
    owner_verification_status: 'verified',
    is_admin: false,
    is_active: true,
    created_at: new Date().toISOString()
  }
];

// API ENDPOINT: POST /api/auth/register
export const register = async (userData) => {
  if (USE_MOCK) {
    // Check if email/phone already exists
    const existingUser = mockUsers.find(
      u => u.email === userData.email || u.phone === userData.phone
    );
    
    if (existingUser) {
      return mockApiError('Email or phone already registered', 400);
    }
    
    // Create new user
    const newUser = {
      user_id: `user_${Date.now()}`,
      ...userData,
      password_hash: userData.password, // Mock - real backend hashes this
      subscription_tier: userData.user_type === 'renter' ? 'free' : null,
      contacts_used: 0,
      is_verified_renter: false,
      is_verified_owner: false,
      renter_verification_status: 'none',
      owner_verification_status: 'none',
      is_active: true,
      created_at: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    
    // Generate mock JWT token
    const token = `mock_jwt_${newUser.user_id}_${Date.now()}`;
    
    return mockApiCall({
      user_id: newUser.user_id,
      token: token,
      user_type: newUser.user_type,
      user: { ...newUser, password_hash: undefined }
    });
  }
  
  // Real API call
  return axios.post('/api/auth/register', userData);
};

// API ENDPOINT: POST /api/auth/login
export const login = async (credentials) => {
  if (USE_MOCK) {
    // Find user by email or phone
    const user = mockUsers.find(
      u => (u.email === credentials.email || u.phone === credentials.email) &&
           u.password_hash === credentials.password
    );
    
    if (!user) {
      return mockApiError('Invalid credentials', 401);
    }
    
    // Generate mock JWT token
    const token = `mock_jwt_${user.user_id}_${Date.now()}`;
    
    return mockApiCall({
      user_id: user.user_id,
      token: token,
      user_type: user.user_type,
      user: { ...user, password_hash: undefined }
    });
  }
  
  // Real API call
  return axios.post('/api/auth/login', credentials);
};

// API ENDPOINT: POST /api/auth/logout
export const logout = async () => {
  if (USE_MOCK) {
    return mockApiCall({ message: 'Logged out successfully' });
  }
  
  return axios.post('/api/auth/logout');
};

// API ENDPOINT: GET /api/auth/me
export const getCurrentUser = async () => {
  if (USE_MOCK) {
    // Get user from token stored in localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('Not authenticated', 401);
    }
    
    // Extract user_id from mock token
    const userId = token.split('_')[2];
    const user = mockUsers.find(u => u.user_id.includes(userId));
    
    if (!user) {
      return mockApiError('User not found', 404);
    }
    
    return mockApiCall({ ...user, password_hash: undefined });
  }
  
  return axios.get('/api/auth/me');
};