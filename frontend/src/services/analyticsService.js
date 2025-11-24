// =================================================================
// HOMER - ANALYTICS SERVICE
// Handles all analytics-related API calls with mock/real switchability
// =================================================================

import { USE_MOCK, mockApiCall, mockApiError } from './mockApi';
import axios from 'axios';
import { getPropertyById } from './mockData';

// =================================================================
// API ENDPOINT: GET /api/analytics/property/:property_id
// =================================================================
export const getPropertyAnalytics = async (propertyId) => {
  if (USE_MOCK) {
    const property = getPropertyById(propertyId);
    
    if (!property) {
      return mockApiError('Property not found', 404);
    }
    
    // Check ownership
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('Not authenticated', 401);
    }
    
    const userId = token.split('_')[2];
    
    if (!property.owner_id.includes(userId)) {
      return mockApiError('Not authorized', 403);
    }
    
    return mockApiCall({
      property_id: propertyId,
      property_title: property.title,
      analytics: property.analytics,
      verification_status: property.is_verified,
      created_at: property.created_at
    });
  }
  
  return axios.get(`/api/analytics/property/${propertyId}`);
};

// =================================================================
// API ENDPOINT: GET /api/analytics/comparison
// =================================================================
export const getComparisonStats = async () => {
  if (USE_MOCK) {
    // Mock comparison stats between verified and unverified properties
    return mockApiCall({
      verified_stats: {
        avg_views: 180,
        avg_contacts: 12,
        avg_shortlists: 35,
        conversion_rate: 6.7
      },
      unverified_stats: {
        avg_views: 35,
        avg_contacts: 2,
        avg_shortlists: 8,
        conversion_rate: 5.7
      },
      improvement_multiplier: {
        views: 5.1,
        contacts: 6.0,
        shortlists: 4.4
      }
    });
  }
  
  return axios.get('/api/analytics/comparison');
};

// =================================================================
// API ENDPOINT: GET /api/analytics/overview
// =================================================================
export const getOwnerOverview = async () => {
  if (USE_MOCK) {
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('Not authenticated', 401);
    }
    
    // Mock owner overview stats
    return mockApiCall({
      total_properties: 4,
      verified_properties: 3,
      total_views: 530,
      total_contacts: 33,
      total_shortlists: 78,
      best_performing_property: 'prop_002_verified'
    });
  }
  
  return axios.get('/api/analytics/overview');
};

// =================================================================
// EXPORT ALL FUNCTIONS
// =================================================================
export default {
  getPropertyAnalytics,
  getComparisonStats,
  getOwnerOverview
};
