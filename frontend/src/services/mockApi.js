// Mock API Configuration
const USE_MOCK = process.env.REACT_APP_USE_MOCK_DATA === 'true';
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

// Simulated network delay for realistic testing
const MOCK_DELAY = 800; // milliseconds

// Helper to simulate API call
const mockApiCall = (data, delay = MOCK_DELAY) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data }), delay);
  });
};

// Helper to simulate API error
const mockApiError = (message, status = 400, delay = MOCK_DELAY) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject({ 
      response: { 
        data: { message }, 
        status 
      } 
    }), delay);
  });
};

// Helper to extract user_id from mock token
// Token format: mock_jwt_user_004_owner_verified_1234567890
const getUserIdFromToken = (token) => {
  if (!token) return null;
  const parts = token.split('_');
  // Extract everything from index 2 to second-to-last
  return parts.slice(2, -1).join('_');
};

export { USE_MOCK, API_BASE_URL, mockApiCall, mockApiError, getUserIdFromToken };