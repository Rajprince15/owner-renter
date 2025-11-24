// =================================================================
// HOMER - SEARCH SERVICE
// Handles property search with filters
// =================================================================

import { searchProperties } from './propertyService';

// Export searchProperties from propertyService
export const search = searchProperties;

// Additional search utilities can be added here
export default {
  search
};
