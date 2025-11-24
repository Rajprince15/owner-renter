// =================================================================
// HOMER - SHORTLIST SERVICE
// Handles property shortlisting
// =================================================================

import { USE_MOCK, mockApiCall, mockApiError } from './mockApi';
import axios from 'axios';
import { mockShortlists, mockProperties } from './mockData';

// =================================================================
// API ENDPOINT: POST /api/shortlists/add
// =================================================================
export const addToShortlist = async (propertyId, notes = '') => {
  if (USE_MOCK) {
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('Not authenticated', 401);
    }
    
    const userId = token.split('_')[2];
    
    // Check if already shortlisted
    const existing = mockShortlists.find(
      s => s.property_id === propertyId && s.user_id.includes(userId)
    );
    
    if (existing) {
      return mockApiError('Property already in shortlist', 400);
    }
    
    const shortlist = {
      shortlist_id: `shortlist_${Date.now()}`,
      user_id: userId,
      property_id: propertyId,
      notes: notes,
      created_at: new Date().toISOString()
    };
    
    mockShortlists.push(shortlist);
    
    // Update property shortlist count
    const property = mockProperties.find(p => p.property_id === propertyId);
    if (property && property.analytics) {
      property.analytics.shortlisted_count++;
    }
    
    return mockApiCall({ shortlist_id: shortlist.shortlist_id });
  }
  
  return axios.post('/api/shortlists/add', { property_id: propertyId, notes });
};

// =================================================================
// API ENDPOINT: GET /api/shortlists
// =================================================================
export const getShortlists = async () => {
  if (USE_MOCK) {
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('Not authenticated', 401);
    }
    
    const userId = token.split('_')[2];
    const userShortlists = mockShortlists.filter(s => s.user_id.includes(userId));
    
    // Attach property details to each shortlist
    const shortlistsWithProperties = userShortlists.map(shortlist => {
      const property = mockProperties.find(p => p.property_id === shortlist.property_id);
      return {
        ...shortlist,
        property
      };
    });
    
    return mockApiCall(shortlistsWithProperties);
  }
  
  return axios.get('/api/shortlists');
};

// =================================================================
// API ENDPOINT: DELETE /api/shortlists/:shortlist_id
// =================================================================
export const removeFromShortlist = async (shortlistId) => {
  if (USE_MOCK) {
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('Not authenticated', 401);
    }
    
    const index = mockShortlists.findIndex(s => s.shortlist_id === shortlistId);
    
    if (index === -1) {
      return mockApiError('Shortlist not found', 404);
    }
    
    // Update property shortlist count
    const shortlist = mockShortlists[index];
    const property = mockProperties.find(p => p.property_id === shortlist.property_id);
    if (property && property.analytics && property.analytics.shortlisted_count > 0) {
      property.analytics.shortlisted_count--;
    }
    
    mockShortlists.splice(index, 1);
    
    return mockApiCall({ message: 'Removed from shortlist' });
  }
  
  return axios.delete(`/api/shortlists/${shortlistId}`);
};

// =================================================================
// API ENDPOINT: DELETE /api/shortlists/property/:property_id
// Remove shortlist by property ID
// =================================================================
export const removeFromShortlistByPropertyId = async (propertyId) => {
  if (USE_MOCK) {
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('Not authenticated', 401);
    }
    
    const userId = token.split('_')[2];
    const index = mockShortlists.findIndex(
      s => s.property_id === propertyId && s.user_id.includes(userId)
    );
    
    if (index === -1) {
      return mockApiError('Shortlist not found', 404);
    }
    
    // Update property shortlist count
    const property = mockProperties.find(p => p.property_id === propertyId);
    if (property && property.analytics && property.analytics.shortlisted_count > 0) {
      property.analytics.shortlisted_count--;
    }
    
    mockShortlists.splice(index, 1);
    
    return mockApiCall({ message: 'Removed from shortlist' });
  }
  
  return axios.delete(`/api/shortlists/property/${propertyId}`);
};

// =================================================================
// Check if property is shortlisted
// =================================================================
export const isPropertyShortlisted = (propertyId) => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  const userId = token.split('_')[2];
  return mockShortlists.some(
    s => s.property_id === propertyId && s.user_id.includes(userId)
  );
};

export default {
  addToShortlist,
  getShortlists,
  removeFromShortlist,
  removeFromShortlistByPropertyId,
  isPropertyShortlisted
};
