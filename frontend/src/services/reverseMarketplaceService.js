// =================================================================
// HOMER - REVERSE MARKETPLACE SERVICE
// Handles reverse marketplace API calls (owners browse renters)
// =================================================================

import { USE_MOCK, mockApiCall, mockApiError } from './mockApi';
import axios from 'axios';
import { mockUsers } from './mockData';

// =================================================================
// API ENDPOINT: GET /api/reverse-marketplace/renters
// =================================================================
export const getAnonymousRenters = async (filters = {}) => {
  if (USE_MOCK) {
    // Filter renters who are premium, verified, and opted in
    let renters = mockUsers.filter(u => 
      (u.user_type === 'renter' || u.user_type === 'both') &&
      u.subscription_tier === 'premium' &&
      u.is_verified_renter &&
      u.profile_visibility
    );

    // Apply filters
    if (filters.min_budget && filters.max_budget) {
      renters = renters.filter(r => 
        r.preferences?.budget_min >= filters.min_budget &&
        r.preferences?.budget_max <= filters.max_budget
      );
    }

    if (filters.bhk_type) {
      renters = renters.filter(r => 
        r.preferences?.bhk_preference?.includes(filters.bhk_type)
      );
    }

    if (filters.location) {
      renters = renters.filter(r => 
        r.preferences?.preferred_locations?.some(loc => 
          loc.toLowerCase().includes(filters.location.toLowerCase())
        )
      );
    }

    if (filters.employment_type) {
      renters = renters.filter(r => 
        r.employment_details?.employment_type === filters.employment_type
      );
    }

    // Create anonymous profiles
    const anonymousRenters = renters.map((renter, index) => ({
      renter_id: renter.user_id,
      anonymous_id: `RENTER-${1000 + index}`,
      employment_type: renter.employment_details?.employment_type || 'Unknown',
      income_range: renter.employment_details?.income_range || 'Not specified',
      bhk_preference: renter.preferences?.bhk_preference || [],
      budget_range: {
        min: renter.preferences?.budget_min || 0,
        max: renter.preferences?.budget_max || 0
      },
      preferred_locations: renter.preferences?.preferred_locations || [],
      move_in_date: renter.preferences?.move_in_date || 'Flexible',
      is_verified: renter.is_verified,
      created_at: renter.created_at
    }));

    return mockApiCall(anonymousRenters);
  }
  
  return axios.get('/api/reverse-marketplace/renters', { params: filters });
};

// =================================================================
// API ENDPOINT: POST /api/reverse-marketplace/contact
// =================================================================
export const contactRenter = async (renterId, propertyId, message) => {
  if (USE_MOCK) {
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('Not authenticated', 401);
    }

    // Simulate chat creation
    const chatId = `chat_${Date.now()}`;
    
    return mockApiCall({
      chat_id: chatId,
      message: 'Chat initiated successfully',
      renter_id: renterId,
      property_id: propertyId
    });
  }
  
  return axios.post('/api/reverse-marketplace/contact', {
    renter_id: renterId,
    property_id: propertyId,
    message
  });
};

// =================================================================
// API ENDPOINT: PUT /api/reverse-marketplace/privacy
// =================================================================
export const updatePrivacySettings = async (optedIn) => {
  if (USE_MOCK) {
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('Not authenticated', 401);
    }

    const userId = token.split('_')[2];
    const user = mockUsers.find(u => u.user_id.includes(userId));
    
    if (user) {
      user.profile_visibility = optedIn;
    }

    return mockApiCall({
      message: 'Privacy settings updated',
      profile_visibility: optedIn
    });
  }
  
  return axios.put('/api/reverse-marketplace/privacy', { profile_visibility: optedIn });
};

// =================================================================
// API ENDPOINT: GET /api/reverse-marketplace/privacy
// =================================================================
export const getPrivacySettings = async () => {
  if (USE_MOCK) {
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('Not authenticated', 401);
    }

    const userId = token.split('_')[2];
    const user = mockUsers.find(u => u.user_id.includes(userId));
    
    return mockApiCall({
      profile_visibility: user?.profile_visibility || false,
      can_participate: user?.subscription_tier === 'premium' && user?.is_verified_renter
    });
  }
  
  return axios.get('/api/reverse-marketplace/privacy');
};

// =================================================================
// EXPORT ALL FUNCTIONS
// =================================================================
export default {
  getAnonymousRenters,
  contactRenter,
  updatePrivacySettings,
  getPrivacySettings
};
