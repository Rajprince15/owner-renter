// =================================================================
// ADMIN SERVICE - Complete Database Control
// =================================================================
// This service handles all admin operations including:
// - User management (CRUD)
// - Property management (CRUD)
// - Verification management
// - Transaction management
// - Database tools
// - System settings
// =================================================================

import { USE_MOCK, mockApiCall, mockApiError } from './mockApi';
import axios from 'axios';
import {
  mockUsers,
  mockProperties,
  mockTransactions,
  mockChats,
  mockShortlists,
  mockNotifications,
  getUserById,
  getPropertyById
} from './mockData';

// =================================================================
// ADMIN STATS
// =================================================================

export const getAdminStats = async () => {
  if (USE_MOCK) {
    const stats = {
      totalUsers: mockUsers.filter(u => u.user_type !== 'admin').length,
      totalRenters: mockUsers.filter(u => u.user_type === 'renter' || u.user_type === 'both').length,
      totalOwners: mockUsers.filter(u => u.user_type === 'owner' || u.user_type === 'both').length,
      premiumUsers: mockUsers.filter(u => u.subscription_tier === 'premium').length,
      totalProperties: mockProperties.filter(p => p.status !== 'deleted').length,
      activeProperties: mockProperties.filter(p => p.status === 'active').length,
      verifiedProperties: mockProperties.filter(p => p.is_verified).length,
      pendingVerifications: mockUsers.filter(u => 
        u.renter_verification_status === 'pending' || u.owner_verification_status === 'pending'
      ).length + mockProperties.filter(p => p.verification_tier === 'free' && p.verification_fee_paid).length,
      totalRevenue: mockTransactions
        .filter(t => t.payment_status === 'success')
        .reduce((sum, t) => sum + t.amount, 0),
      revenueThisMonth: mockTransactions
        .filter(t => {
          const txDate = new Date(t.created_at);
          const now = new Date();
          return t.payment_status === 'success' && 
                 txDate.getMonth() === now.getMonth() && 
                 txDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, t) => sum + t.amount, 0),
      totalChats: mockChats.length,
      totalShortlists: mockShortlists.length
    };
    
    return mockApiCall(stats);
  }
  
  return axios.get('/api/admin/stats');
};

// =================================================================
// USER MANAGEMENT
// =================================================================

export const getAllUsers = async (filters = {}) => {
  if (USE_MOCK) {
    let users = [...mockUsers].filter(u => u.user_type !== 'admin');
    
    // Apply filters
    if (filters.user_type && filters.user_type !== 'all') {
      users = users.filter(u => u.user_type === filters.user_type);
    }
    
    if (filters.subscription_tier && filters.subscription_tier !== 'all') {
      users = users.filter(u => u.subscription_tier === filters.subscription_tier);
    }
    
    if (filters.verification_status && filters.verification_status !== 'all') {
      users = users.filter(u => 
        u.renter_verification_status === filters.verification_status ||
        u.owner_verification_status === filters.verification_status
      );
    }
    
    if (filters.is_active !== undefined) {
      users = users.filter(u => u.is_active === filters.is_active);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      users = users.filter(u => 
        u.full_name?.toLowerCase().includes(searchLower) ||
        u.email?.toLowerCase().includes(searchLower) ||
        u.phone?.includes(searchLower)
      );
    }
    
    return mockApiCall(users);
  }
  
  return axios.get('/api/admin/users', { params: filters });
};

export const getUserDetail = async (userId) => {
  if (USE_MOCK) {
    const user = getUserById(userId);
    
    if (!user) {
      return mockApiError('User not found', 404);
    }
    
    return mockApiCall(user);
  }
  
  return axios.get(`/api/admin/users/${userId}`);
};

export const updateUser = async (userId, userData) => {
  if (USE_MOCK) {
    const userIndex = mockUsers.findIndex(u => u.user_id === userId);
    
    if (userIndex === -1) {
      return mockApiError('User not found', 404);
    }
    
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...userData,
      updated_at: new Date().toISOString()
    };
    
    return mockApiCall(mockUsers[userIndex]);
  }
  
  return axios.put(`/api/admin/users/${userId}`, userData);
};

export const deleteUser = async (userId) => {
  if (USE_MOCK) {
    const userIndex = mockUsers.findIndex(u => u.user_id === userId);
    
    if (userIndex === -1) {
      return mockApiError('User not found', 404);
    }
    
    mockUsers.splice(userIndex, 1);
    
    return mockApiCall({ message: 'User deleted successfully' });
  }
  
  return axios.delete(`/api/admin/users/${userId}`);
};

export const forceVerifyUser = async (userId, verificationType) => {
  if (USE_MOCK) {
    const userIndex = mockUsers.findIndex(u => u.user_id === userId);
    
    if (userIndex === -1) {
      return mockApiError('User not found', 404);
    }
    
    if (verificationType === 'renter') {
      mockUsers[userIndex].is_verified_renter = true;
      mockUsers[userIndex].renter_verification_status = 'verified';
    } else if (verificationType === 'owner') {
      mockUsers[userIndex].is_verified_owner = true;
      mockUsers[userIndex].owner_verification_status = 'verified';
    }
    
    return mockApiCall(mockUsers[userIndex]);
  }
  
  return axios.post(`/api/admin/users/${userId}/force-verify`, { verificationType });
};

export const bulkDeleteUsers = async (userIds) => {
  if (USE_MOCK) {
    userIds.forEach(userId => {
      const index = mockUsers.findIndex(u => u.user_id === userId);
      if (index !== -1) {
        mockUsers.splice(index, 1);
      }
    });
    
    return mockApiCall({ message: `${userIds.length} users deleted successfully` });
  }
  
  return axios.post('/api/admin/users/bulk-delete', { userIds });
};

// =================================================================
// PROPERTY MANAGEMENT
// =================================================================

export const getAllProperties = async (filters = {}) => {
  if (USE_MOCK) {
    let properties = [...mockProperties];
    
    // Apply filters
    if (filters.status && filters.status !== 'all') {
      properties = properties.filter(p => p.status === filters.status);
    }
    
    if (filters.verification_status && filters.verification_status !== 'all') {
      if (filters.verification_status === 'verified') {
        properties = properties.filter(p => p.is_verified);
      } else if (filters.verification_status === 'unverified') {
        properties = properties.filter(p => !p.is_verified);
      }
    }
    
    if (filters.owner_id) {
      properties = properties.filter(p => p.owner_id === filters.owner_id);
    }
    
    if (filters.city) {
      properties = properties.filter(p => 
        p.location.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    
    if (filters.min_rent) {
      properties = properties.filter(p => p.rent >= filters.min_rent);
    }
    
    if (filters.max_rent) {
      properties = properties.filter(p => p.rent <= filters.max_rent);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      properties = properties.filter(p => 
        p.title?.toLowerCase().includes(searchLower) ||
        p.location.locality?.toLowerCase().includes(searchLower)
      );
    }
    
    return mockApiCall(properties);
  }
  
  return axios.get('/api/admin/properties', { params: filters });
};

export const getPropertyDetail = async (propertyId) => {
  if (USE_MOCK) {
    const property = getPropertyById(propertyId);
    
    if (!property) {
      return mockApiError('Property not found', 404);
    }
    
    return mockApiCall(property);
  }
  
  return axios.get(`/api/admin/properties/${propertyId}`);
};

export const updateProperty = async (propertyId, propertyData) => {
  if (USE_MOCK) {
    const propertyIndex = mockProperties.findIndex(p => p.property_id === propertyId);
    
    if (propertyIndex === -1) {
      return mockApiError('Property not found', 404);
    }
    
    mockProperties[propertyIndex] = {
      ...mockProperties[propertyIndex],
      ...propertyData,
      updated_at: new Date().toISOString()
    };
    
    return mockApiCall(mockProperties[propertyIndex]);
  }
  
  return axios.put(`/api/admin/properties/${propertyId}`, propertyData);
};

export const deleteProperty = async (propertyId) => {
  if (USE_MOCK) {
    const propertyIndex = mockProperties.findIndex(p => p.property_id === propertyId);
    
    if (propertyIndex === -1) {
      return mockApiError('Property not found', 404);
    }
    
    mockProperties.splice(propertyIndex, 1);
    
    return mockApiCall({ message: 'Property deleted successfully' });
  }
  
  return axios.delete(`/api/admin/properties/${propertyId}`);
};

export const forceVerifyProperty = async (propertyId) => {
  if (USE_MOCK) {
    const propertyIndex = mockProperties.findIndex(p => p.property_id === propertyId);
    
    if (propertyIndex === -1) {
      return mockApiError('Property not found', 404);
    }
    
    mockProperties[propertyIndex].is_verified = true;
    mockProperties[propertyIndex].verification_tier = 'verified';
    mockProperties[propertyIndex].verification_date = new Date().toISOString();
    
    return mockApiCall(mockProperties[propertyIndex]);
  }
  
  return axios.post(`/api/admin/properties/${propertyId}/force-verify`);
};

export const changePropertyStatus = async (propertyId, status) => {
  if (USE_MOCK) {
    const propertyIndex = mockProperties.findIndex(p => p.property_id === propertyId);
    
    if (propertyIndex === -1) {
      return mockApiError('Property not found', 404);
    }
    
    mockProperties[propertyIndex].status = status;
    mockProperties[propertyIndex].updated_at = new Date().toISOString();
    
    return mockApiCall(mockProperties[propertyIndex]);
  }
  
  return axios.post(`/api/admin/properties/${propertyId}/change-status`, { status });
};

export const bulkDeleteProperties = async (propertyIds) => {
  if (USE_MOCK) {
    propertyIds.forEach(propertyId => {
      const index = mockProperties.findIndex(p => p.property_id === propertyId);
      if (index !== -1) {
        mockProperties.splice(index, 1);
      }
    });
    
    return mockApiCall({ message: `${propertyIds.length} properties deleted successfully` });
  }
  
  return axios.post('/api/admin/properties/bulk-delete', { propertyIds });
};

// =================================================================
// VERIFICATION MANAGEMENT
// =================================================================

export const getPendingVerifications = async () => {
  if (USE_MOCK) {
    const renterVerifications = mockUsers
      .filter(u => u.renter_verification_status === 'pending')
      .map(u => ({
        verification_id: `renter_ver_${u.user_id}`,
        type: 'renter',
        user_id: u.user_id,
        user_name: u.full_name,
        email: u.email,
        documents: u.renter_verification_documents,
        submitted_at: u.created_at,
        status: u.renter_verification_status
      }));
    
    const ownerVerifications = mockUsers
      .filter(u => u.owner_verification_status === 'pending')
      .map(u => ({
        verification_id: `owner_ver_${u.user_id}`,
        type: 'owner',
        user_id: u.user_id,
        user_name: u.full_name,
        email: u.email,
        submitted_at: u.created_at,
        status: u.owner_verification_status
      }));
    
    const propertyVerifications = mockProperties
      .filter(p => p.verification_fee_paid && !p.is_verified)
      .map(p => ({
        verification_id: `prop_ver_${p.property_id}`,
        type: 'property',
        property_id: p.property_id,
        property_title: p.title,
        owner_id: p.owner_id,
        documents: p.verification_documents,
        submitted_at: p.created_at,
        status: 'pending'
      }));
    
    return mockApiCall({
      renter: renterVerifications,
      owner: ownerVerifications,
      property: propertyVerifications
    });
  }
  
  return axios.get('/api/admin/verifications/pending');
};

export const approveVerification = async (verificationId, verificationType) => {
  if (USE_MOCK) {
    if (verificationType === 'renter') {
      const userId = verificationId.replace('renter_ver_', '');
      const userIndex = mockUsers.findIndex(u => u.user_id === userId);
      if (userIndex !== -1) {
        mockUsers[userIndex].is_verified_renter = true;
        mockUsers[userIndex].renter_verification_status = 'verified';
      }
    } else if (verificationType === 'owner') {
      const userId = verificationId.replace('owner_ver_', '');
      const userIndex = mockUsers.findIndex(u => u.user_id === userId);
      if (userIndex !== -1) {
        mockUsers[userIndex].is_verified_owner = true;
        mockUsers[userIndex].owner_verification_status = 'verified';
      }
    } else if (verificationType === 'property') {
      const propertyId = verificationId.replace('prop_ver_', '');
      const propertyIndex = mockProperties.findIndex(p => p.property_id === propertyId);
      if (propertyIndex !== -1) {
        mockProperties[propertyIndex].is_verified = true;
        mockProperties[propertyIndex].verification_tier = 'verified';
        mockProperties[propertyIndex].verification_date = new Date().toISOString();
      }
    }
    
    return mockApiCall({ message: 'Verification approved successfully' });
  }
  
  return axios.post('/api/admin/verifications/approve', { verificationId, verificationType });
};

export const rejectVerification = async (verificationId, verificationType, reason) => {
  if (USE_MOCK) {
    if (verificationType === 'renter') {
      const userId = verificationId.replace('renter_ver_', '');
      const userIndex = mockUsers.findIndex(u => u.user_id === userId);
      if (userIndex !== -1) {
        mockUsers[userIndex].renter_verification_status = 'rejected';
        mockUsers[userIndex].rejection_reason = reason;
      }
    } else if (verificationType === 'owner') {
      const userId = verificationId.replace('owner_ver_', '');
      const userIndex = mockUsers.findIndex(u => u.user_id === userId);
      if (userIndex !== -1) {
        mockUsers[userIndex].owner_verification_status = 'rejected';
        mockUsers[userIndex].rejection_reason = reason;
      }
    }
    
    return mockApiCall({ message: 'Verification rejected successfully' });
  }
  
  return axios.post('/api/admin/verifications/reject', { verificationId, verificationType, reason });
};

// =================================================================
// TRANSACTION MANAGEMENT
// =================================================================

export const getAllTransactions = async (filters = {}) => {
  if (USE_MOCK) {
    let transactions = [...mockTransactions];
    
    // Apply filters
    if (filters.transaction_type && filters.transaction_type !== 'all') {
      transactions = transactions.filter(t => t.transaction_type === filters.transaction_type);
    }
    
    if (filters.payment_status && filters.payment_status !== 'all') {
      transactions = transactions.filter(t => t.payment_status === filters.payment_status);
    }
    
    if (filters.user_id) {
      transactions = transactions.filter(t => t.user_id === filters.user_id);
    }
    
    if (filters.date_from) {
      transactions = transactions.filter(t => new Date(t.created_at) >= new Date(filters.date_from));
    }
    
    if (filters.date_to) {
      transactions = transactions.filter(t => new Date(t.created_at) <= new Date(filters.date_to));
    }
    
    return mockApiCall(transactions);
  }
  
  return axios.get('/api/admin/transactions', { params: filters });
};

export const getTransactionDetail = async (transactionId) => {
  if (USE_MOCK) {
    const transaction = mockTransactions.find(t => t.transaction_id === transactionId);
    
    if (!transaction) {
      return mockApiError('Transaction not found', 404);
    }
    
    return mockApiCall(transaction);
  }
  
  return axios.get(`/api/admin/transactions/${transactionId}`);
};

export const refundTransaction = async (transactionId, reason) => {
  if (USE_MOCK) {
    const transactionIndex = mockTransactions.findIndex(t => t.transaction_id === transactionId);
    
    if (transactionIndex === -1) {
      return mockApiError('Transaction not found', 404);
    }
    
    mockTransactions[transactionIndex].payment_status = 'refunded';
    mockTransactions[transactionIndex].refund_reason = reason;
    mockTransactions[transactionIndex].refunded_at = new Date().toISOString();
    
    return mockApiCall(mockTransactions[transactionIndex]);
  }
  
  return axios.post(`/api/admin/transactions/${transactionId}/refund`, { reason });
};

export const getRevenueReport = async (filters = {}) => {
  if (USE_MOCK) {
    const successfulTransactions = mockTransactions.filter(t => t.payment_status === 'success');
    
    const totalRevenue = successfulTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    const revenueByType = {
      renter_subscription: successfulTransactions
        .filter(t => t.transaction_type === 'renter_subscription')
        .reduce((sum, t) => sum + t.amount, 0),
      property_verification: successfulTransactions
        .filter(t => t.transaction_type === 'property_verification')
        .reduce((sum, t) => sum + t.amount, 0)
    };
    
    const revenueByMonth = {};
    successfulTransactions.forEach(t => {
      const date = new Date(t.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + t.amount;
    });
    
    return mockApiCall({
      totalRevenue,
      revenueByType,
      revenueByMonth,
      transactionCount: successfulTransactions.length,
      refundedAmount: mockTransactions
        .filter(t => t.payment_status === 'refunded')
        .reduce((sum, t) => sum + t.amount, 0)
    });
  }
  
  return axios.get('/api/admin/revenue-report', { params: filters });
};

// =================================================================
// DATABASE TOOLS
// =================================================================

export const executeQuery = async (query, readOnly = true) => {
  if (USE_MOCK) {
    // Mock query execution
    const results = {
      query: query,
      rows: [],
      rowCount: 0,
      executedAt: new Date().toISOString(),
      readOnly: readOnly
    };
    
    // Simple mock responses for common queries
    if (query.toLowerCase().includes('select') && query.toLowerCase().includes('users')) {
      results.rows = mockUsers.slice(0, 10);
      results.rowCount = mockUsers.length;
    } else if (query.toLowerCase().includes('select') && query.toLowerCase().includes('properties')) {
      results.rows = mockProperties.slice(0, 10);
      results.rowCount = mockProperties.length;
    }
    
    return mockApiCall(results);
  }
  
  return axios.post('/api/admin/database/query', { query, readOnly });
};

export const getTableSchema = async (tableName) => {
  if (USE_MOCK) {
    const schemas = {
      users: {
        columns: [
          { name: 'user_id', type: 'VARCHAR(36)', nullable: false },
          { name: 'email', type: 'VARCHAR(255)', nullable: false },
          { name: 'phone', type: 'VARCHAR(20)', nullable: false },
          { name: 'user_type', type: 'ENUM', nullable: false },
          { name: 'full_name', type: 'VARCHAR(255)', nullable: true },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false }
        ],
        indexes: ['email', 'phone', 'user_type']
      },
      properties: {
        columns: [
          { name: 'property_id', type: 'VARCHAR(36)', nullable: false },
          { name: 'owner_id', type: 'VARCHAR(36)', nullable: false },
          { name: 'title', type: 'VARCHAR(255)', nullable: false },
          { name: 'rent', type: 'DECIMAL(10,2)', nullable: false },
          { name: 'status', type: 'ENUM', nullable: false },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false }
        ],
        indexes: ['owner_id', 'status', 'rent']
      }
    };
    
    return mockApiCall(schemas[tableName] || { columns: [], indexes: [] });
  }
  
  return axios.get(`/api/admin/database/schema/${tableName}`);
};

export const backupDatabase = async () => {
  if (USE_MOCK) {
    const backup = {
      backupId: `backup_${Date.now()}`,
      timestamp: new Date().toISOString(),
      size: '2.5MB',
      tables: ['users', 'properties', 'chats', 'transactions'],
      downloadUrl: '/api/admin/database/backups/backup_latest.sql'
    };
    
    return mockApiCall(backup);
  }
  
  return axios.post('/api/admin/database/backup');
};

// =================================================================
// SYSTEM SETTINGS
// =================================================================

let systemSettings = {
  platform: {
    name: 'Homer',
    contactEmail: 'support@homer.com',
    supportPhone: '+91-9999999999'
  },
  pricing: {
    renterSubscriptionPrice: 750,
    propertyVerificationPrice: 2000,
    currency: 'INR'
  },
  features: {
    lifestyleSearch: true,
    reverseMarketplace: true,
    chatEnabled: true,
    maintenanceMode: false
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false
  }
};

export const getSystemSettings = async () => {
  if (USE_MOCK) {
    return mockApiCall(systemSettings);
  }
  
  return axios.get('/api/admin/settings');
};

export const updateSystemSettings = async (settings) => {
  if (USE_MOCK) {
    systemSettings = { ...systemSettings, ...settings };
    return mockApiCall(systemSettings);
  }
  
  return axios.put('/api/admin/settings', settings);
};

// =================================================================
// ADMIN AUDIT LOGS
// =================================================================

let adminAuditLogs = [];

export const logAdminAction = (adminId, actionType, entityType, entityId, details) => {
  const log = {
    log_id: `log_${Date.now()}`,
    admin_id: adminId,
    action_type: actionType,
    entity_type: entityType,
    entity_id: entityId,
    action_details: details,
    timestamp: new Date().toISOString(),
    status: 'success'
  };
  
  adminAuditLogs.unshift(log);
  
  // Keep only last 100 logs in mock
  if (adminAuditLogs.length > 100) {
    adminAuditLogs = adminAuditLogs.slice(0, 100);
  }
};

export const getAdminAuditLogs = async (filters = {}) => {
  if (USE_MOCK) {
    let logs = [...adminAuditLogs];
    
    if (filters.admin_id) {
      logs = logs.filter(l => l.admin_id === filters.admin_id);
    }
    
    if (filters.action_type) {
      logs = logs.filter(l => l.action_type === filters.action_type);
    }
    
    if (filters.entity_type) {
      logs = logs.filter(l => l.entity_type === filters.entity_type);
    }
    
    return mockApiCall(logs.slice(0, 50)); // Return last 50 logs
  }
  
  return axios.get('/api/admin/audit-logs', { params: filters });
};

export default {
  getAdminStats,
  getAllUsers,
  getUserDetail,
  updateUser,
  deleteUser,
  forceVerifyUser,
  bulkDeleteUsers,
  getAllProperties,
  getPropertyDetail,
  updateProperty,
  deleteProperty,
  forceVerifyProperty,
  changePropertyStatus,
  bulkDeleteProperties,
  getPendingVerifications,
  approveVerification,
  rejectVerification,
  getAllTransactions,
  getTransactionDetail,
  refundTransaction,
  getRevenueReport,
  executeQuery,
  getTableSchema,
  backupDatabase,
  getSystemSettings,
  updateSystemSettings,
  logAdminAction,
  getAdminAuditLogs
};
