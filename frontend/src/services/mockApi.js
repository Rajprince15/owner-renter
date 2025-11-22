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

export { USE_MOCK, API_BASE_URL, mockApiCall, mockApiError };