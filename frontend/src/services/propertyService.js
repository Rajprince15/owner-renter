// =================================================================
// HOMER - PROPERTY SERVICE
// Handles all property-related API calls with mock/real switchability
// =================================================================

import { USE_MOCK, mockApiCall, mockApiError, getUserIdFromToken } from './mockApi';
import axios from 'axios';
import {
  mockProperties,
  getPropertyById,
  getPropertiesByOwner,
  generateMockProperty
} from './mockData';

// =================================================================
// API ENDPOINT: POST /api/properties/create
// =================================================================
export const createProperty = async (propertyData) => {
  if (USE_MOCK) {
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('Not authenticated', 401);
    }
    
    // Extract user_id from token
    const userId = getUserIdFromToken(token);
    
    const newProperty = generateMockProperty(propertyData, userId);
    mockProperties.push(newProperty);
    
    return mockApiCall({
      property_id: newProperty.property_id,
      property: newProperty
    });
  }
  
  return axios.post('/api/properties/create', propertyData);
};

// =================================================================
// API ENDPOINT: GET /api/properties/search
// =================================================================
export const searchProperties = async (filters = {}) => {
  if (USE_MOCK) {
    let results = [...mockProperties];
    
    // Apply filters
    if (filters.city) {
      results = results.filter(p => 
        p.location.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    
    if (filters.min_price) {
      results = results.filter(p => p.rent >= filters.min_price);
    }
    
    if (filters.max_price) {
      results = results.filter(p => p.rent <= filters.max_price);
    }
    
    if (filters.bhk_type) {
      results = results.filter(p => p.bhk_type === filters.bhk_type);
    }
    
    if (filters.location) {
      results = results.filter(p => 
        p.location.locality.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.property_type) {
      results = results.filter(p => p.property_type === filters.property_type);
    }
    
    if (filters.furnishing) {
      results = results.filter(p => p.details.furnishing === filters.furnishing);
    }
    
    // Sort
    if (filters.sort_by === 'price_low') {
      results.sort((a, b) => a.rent - b.rent);
    } else if (filters.sort_by === 'price_high') {
      results.sort((a, b) => b.rent - a.rent);
    } else if (filters.sort_by === 'recent') {
      results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else {
      // Default: verified first, then by date
      results.sort((a, b) => {
        if (a.is_verified && !b.is_verified) return -1;
        if (!a.is_verified && b.is_verified) return 1;
        return new Date(b.created_at) - new Date(a.created_at);
      });
    }
    
    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = results.slice(startIndex, endIndex);
    
    return mockApiCall({
      properties: paginatedResults,
      total_count: results.length,
      page: page,
      has_more: endIndex < results.length
    });
  }
  
  return axios.get('/api/properties/search', { params: filters });
};

// =================================================================
// API ENDPOINT: GET /api/properties/lifestyle-search
// =================================================================
export const lifestyleSearch = async (filters) => {
  if (USE_MOCK) {
    // Check if user is premium (this should be checked by calling getUserById in real app)
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('Not authenticated', 401);
    }
    
    // Only verified properties with lifestyle data
    let results = mockProperties.filter(p => 
      p.is_verified && p.lifestyle_data
    );
    
    // Apply lifestyle filters
    if (filters.max_aqi) {
      results = results.filter(p => p.lifestyle_data.aqi_score <= filters.max_aqi);
    }
    
    if (filters.max_noise) {
      results = results.filter(p => p.lifestyle_data.noise_level <= filters.max_noise);
    }
    
    if (filters.min_walkability) {
      results = results.filter(p => p.lifestyle_data.walkability_score >= filters.min_walkability);
    }
    
    if (filters.near_parks) {
      results = results.filter(p => p.lifestyle_data.nearby_parks.length > 0);
    }
    
    // Apply standard filters
    if (filters.budget) {
      results = results.filter(p => p.rent <= filters.budget);
    }
    
    if (filters.bhk) {
      results = results.filter(p => p.bhk_type === filters.bhk);
    }
    
    if (filters.location) {
      results = results.filter(p => 
        p.location.locality.toLowerCase().includes(filters.location.toLowerCase()) ||
        p.location.city.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    return mockApiCall({
      properties: results,
      total_count: results.length
    });
  }
  
  return axios.get('/api/properties/lifestyle-search', { params: filters });
};

// =================================================================
// API ENDPOINT: GET /api/properties/:property_id
// =================================================================
export const getPropertyDetail = async (propertyId) => {
  if (USE_MOCK) {
    const property = getPropertyById(propertyId);
    
    if (!property) {
      return mockApiError('Property not found', 404);
    }
    
    // Increment view count (simulate)
    property.analytics.total_views++;
    property.analytics.last_viewed = new Date().toISOString();
    
    return mockApiCall(property);
  }
  
  return axios.get(`/api/properties/${propertyId}`);
};

// =================================================================
// API ENDPOINT: PUT /api/properties/:property_id
// =================================================================
export const updateProperty = async (propertyId, propertyData) => {
  if (USE_MOCK) {
    const index = mockProperties.findIndex(p => p.property_id === propertyId);
    
    if (index === -1) {
      return mockApiError('Property not found', 404);
    }
    
    // Check ownership (token-based check in real app)
    const token = localStorage.getItem('token');
    const parts = token.split('_');
    const userId = parts.slice(2, -1).join('_');
    
    if (mockProperties[index].owner_id !== userId) {
      return mockApiError('Not authorized', 403);
    }
    
    mockProperties[index] = {
      ...mockProperties[index],
      ...propertyData,
      updated_at: new Date().toISOString()
    };
    
    return mockApiCall(mockProperties[index]);
  }
  
  return axios.put(`/api/properties/${propertyId}`, propertyData);
};

// =================================================================
// API ENDPOINT: DELETE /api/properties/:property_id
// =================================================================
export const deleteProperty = async (propertyId) => {
  if (USE_MOCK) {
    const index = mockProperties.findIndex(p => p.property_id === propertyId);
    
    if (index === -1) {
      return mockApiError('Property not found', 404);
    }
    
    // Check ownership
    const token = localStorage.getItem('token');
    const parts = token.split('_');
    const userId = parts.slice(2, -1).join('_');
    
    if (mockProperties[index].owner_id !== userId) {
      return mockApiError('Not authorized', 403);
    }
    
    // Soft delete (change status)
    mockProperties[index].status = 'deleted';
    
    return mockApiCall({ message: 'Property deleted successfully' });
  }
  
  return axios.delete(`/api/properties/${propertyId}`);
};

// =================================================================
// API ENDPOINT: GET /api/properties/my-properties
// =================================================================
export const getMyProperties = async () => {
  if (USE_MOCK) {
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('Not authenticated', 401);
    }
    
    // Extract user_id from token: mock_jwt_user_004_owner_verified_timestamp
    // Join from index 2 to second-to-last element
    const userId = getUserIdFromToken(token);
    const myProperties = getPropertiesByOwner(userId);
    
    return mockApiCall(myProperties);
  }
  
  return axios.get('/api/properties/my-properties');
};

// =================================================================
// API ENDPOINT: POST /api/properties/:property_id/upload-images
// =================================================================
export const uploadPropertyImages = async (propertyId, files) => {
  if (USE_MOCK) {
    // Simulate image upload
    const imageUrls = files.map((file, index) => 
      `https://images.unsplash.com/photo-${Date.now()}-${index}?w=800`
    );
    
    const property = getPropertyById(propertyId);
    if (property) {
      property.images = [...(property.images || []), ...imageUrls];
    }
    
    return mockApiCall({ image_urls: imageUrls });
  }
  
  const formData = new FormData();
  files.forEach(file => formData.append('images', file));
  
  return axios.post(`/api/properties/${propertyId}/upload-images`, formData);
};

// =================================================================
// API ENDPOINT: GET /api/properties/:property_id/analytics
// =================================================================
export const getPropertyAnalytics = async (propertyId) => {
  if (USE_MOCK) {
    const property = getPropertyById(propertyId);
    
    if (!property) {
      return mockApiError('Property not found', 404);
    }
    
    // Check ownership
    const token = localStorage.getItem('token');
    const parts = token.split('_');
    const userId = parts.slice(2, -1).join('_');
    
    if (property.owner_id !== userId) {
      return mockApiError('Not authorized', 403);
    }
    
    return mockApiCall(property.analytics);
  }
  
  return axios.get(`/api/properties/${propertyId}/analytics`);
};

// =================================================================
// EXPORT ALL FUNCTIONS
// =================================================================
export default {
  createProperty,
  searchProperties,
  lifestyleSearch,
  getPropertyDetail,
  updateProperty,
  deleteProperty,
  getMyProperties,
  uploadPropertyImages,
  getPropertyAnalytics
};
