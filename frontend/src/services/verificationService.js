// =================================================================
// HOMER - VERIFICATION SERVICE
// Handles all verification-related API calls with mock/real switchability
// =================================================================

import { USE_MOCK, mockApiCall, mockApiError } from './mockApi';
import axios from 'axios';
import { mockUsers, mockProperties } from './mockData';

// Mock verification requests storage
let mockVerificationRequests = [
  {
    verification_id: 'verify_001',
    user_id: 'user_002_renter_premium',
    verification_type: 'renter',
    status: 'verified',
    documents: {
      id_proof: {
        type: 'aadhaar',
        file_name: 'aadhaar_card.pdf',
        file_url: '/uploads/verification/verify_001/aadhaar.pdf',
        uploaded_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      },
      income_proof: {
        type: 'salary_slip',
        file_name: 'salary_slip.pdf',
        file_url: '/uploads/verification/verify_001/salary.pdf',
        uploaded_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      }
    },
    employment_details: {
      company_name: 'Tech Corp',
      designation: 'Senior Engineer',
      employment_type: 'salaried',
      annual_income: 1500000,
      years_of_experience: 5
    },
    submitted_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    reviewed_at: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000).toISOString(),
    reviewed_by: 'admin_001',
    rejection_reason: null,
    is_mock: true
  },
  {
    verification_id: 'verify_002',
    property_id: 'prop_002_verified',
    owner_id: 'user_004_owner_verified',
    verification_type: 'property',
    status: 'verified',
    documents: {
      owner_id_proof: {
        type: 'aadhaar',
        file_name: 'owner_aadhaar.pdf',
        file_url: '/uploads/verification/verify_002/owner_aadhaar.pdf',
        uploaded_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      },
      ownership_proof: {
        type: 'property_tax',
        file_name: 'property_tax_receipt.pdf',
        file_url: '/uploads/verification/verify_002/property_tax.pdf',
        uploaded_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      }
    },
    payment_id: 'txn_002_verification',
    payment_status: 'success',
    submitted_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    reviewed_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    reviewed_by: 'admin_001',
    rejection_reason: null,
    is_mock: true
  }
];

// =================================================================
// API ENDPOINT: POST /api/verification/renter/submit
// =================================================================
export const submitRenterVerification = async (verificationData) => {
  if (USE_MOCK) {
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('Not authenticated', 401);
    }
    
    const userId = token.split('_')[2];
    const user = mockUsers.find(u => u.user_id.includes(userId));
    
    if (!user) {
      return mockApiError('User not found', 404);
    }
    
    // Create new verification request
    const newVerification = {
      verification_id: `verify_${Date.now()}`,
      user_id: user.user_id,
      verification_type: 'renter',
      status: 'pending',
      documents: verificationData.documents,
      employment_details: verificationData.employment_details,
      submitted_at: new Date().toISOString(),
      reviewed_at: null,
      reviewed_by: null,
      rejection_reason: null,
      is_mock: true
    };
    
    mockVerificationRequests.push(newVerification);
    
    // Update user status
    user.renter_verification_status = 'pending';
    user.employment_info = verificationData.employment_details;
    
    return mockApiCall({
      verification_id: newVerification.verification_id,
      status: 'pending',
      message: 'Verification request submitted successfully'
    });
  }
  
  return axios.post('/api/verification/renter/submit', verificationData);
};

// =================================================================
// API ENDPOINT: POST /api/verification/property/submit
// =================================================================
export const submitPropertyVerification = async (verificationData) => {
  if (USE_MOCK) {
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('Not authenticated', 401);
    }
    
    const userId = token.split('_')[2];
    const user = mockUsers.find(u => u.user_id.includes(userId));
    
    if (!user) {
      return mockApiError('User not found', 404);
    }
    
    // Find property
    const property = mockProperties.find(p => p.property_id === verificationData.property_id);
    if (!property) {
      return mockApiError('Property not found', 404);
    }
    
    // Check ownership
    if (property.owner_id !== user.user_id) {
      return mockApiError('Not authorized', 403);
    }
    
    // Create new verification request
    const newVerification = {
      verification_id: `verify_${Date.now()}`,
      property_id: verificationData.property_id,
      owner_id: user.user_id,
      verification_type: 'property',
      status: 'pending',
      documents: verificationData.documents,
      payment_id: verificationData.payment_id,
      payment_status: verificationData.payment_status,
      submitted_at: new Date().toISOString(),
      reviewed_at: null,
      reviewed_by: null,
      rejection_reason: null,
      is_mock: true
    };
    
    mockVerificationRequests.push(newVerification);
    
    // Update property status
    property.verification_tier = 'pending';
    property.verification_fee_paid = verificationData.payment_status === 'success';
    
    return mockApiCall({
      verification_id: newVerification.verification_id,
      status: 'pending',
      message: 'Property verification request submitted successfully'
    });
  }
  
  return axios.post('/api/verification/property/submit', verificationData);
};

// =================================================================
// API ENDPOINT: GET /api/verification/status/:verification_id
// =================================================================
export const getVerificationStatus = async (verificationId) => {
  if (USE_MOCK) {
    const verification = mockVerificationRequests.find(
      v => v.verification_id === verificationId
    );
    
    if (!verification) {
      return mockApiError('Verification request not found', 404);
    }
    
    return mockApiCall(verification);
  }
  
  return axios.get(`/api/verification/status/${verificationId}`);
};

// =================================================================
// API ENDPOINT: GET /api/verification/my-status
// =================================================================
export const getMyVerificationStatus = async (verificationType = 'renter') => {
  if (USE_MOCK) {
    const token = localStorage.getItem('token');
    if (!token) {
      return mockApiError('Not authenticated', 401);
    }
    
    const userId = token.split('_')[2];
    const user = mockUsers.find(u => u.user_id.includes(userId));
    
    if (!user) {
      return mockApiError('User not found', 404);
    }
    
    if (verificationType === 'renter') {
      const verification = mockVerificationRequests.find(
        v => v.user_id === user.user_id && v.verification_type === 'renter'
      );
      
      return mockApiCall({
        status: user.renter_verification_status || 'none',
        is_verified: user.is_verified_renter || false,
        verification: verification || null
      });
    } else {
      return mockApiCall({
        status: user.owner_verification_status || 'none',
        is_verified: user.is_verified_owner || false
      });
    }
  }
  
  return axios.get(`/api/verification/my-status?type=${verificationType}`);
};

// =================================================================
// API ENDPOINT: GET /api/verification/admin/pending
// =================================================================
export const getPendingVerifications = async () => {
  if (USE_MOCK) {
    const pendingVerifications = mockVerificationRequests.filter(
      v => v.status === 'pending'
    );
    
    // Enrich with user/property data
    const enrichedVerifications = pendingVerifications.map(v => {
      if (v.verification_type === 'renter') {
        const user = mockUsers.find(u => u.user_id === v.user_id);
        return {
          ...v,
          user_name: user?.full_name,
          user_email: user?.email
        };
      } else {
        const property = mockProperties.find(p => p.property_id === v.property_id);
        const owner = mockUsers.find(u => u.user_id === v.owner_id);
        return {
          ...v,
          property_title: property?.title,
          owner_name: owner?.full_name,
          owner_email: owner?.email
        };
      }
    });
    
    return mockApiCall(enrichedVerifications);
  }
  
  return axios.get('/api/verification/admin/pending');
};

// =================================================================
// API ENDPOINT: POST /api/verification/admin/approve
// =================================================================
export const approveVerification = async (verificationId) => {
  if (USE_MOCK) {
    const verification = mockVerificationRequests.find(
      v => v.verification_id === verificationId
    );
    
    if (!verification) {
      return mockApiError('Verification request not found', 404);
    }
    
    // Update verification status
    verification.status = 'verified';
    verification.reviewed_at = new Date().toISOString();
    verification.reviewed_by = 'admin_001';
    
    // Update user/property status
    if (verification.verification_type === 'renter') {
      const user = mockUsers.find(u => u.user_id === verification.user_id);
      if (user) {
        user.is_verified_renter = true;
        user.renter_verification_status = 'verified';
      }
    } else if (verification.verification_type === 'property') {
      const property = mockProperties.find(p => p.property_id === verification.property_id);
      if (property) {
        property.is_verified = true;
        property.verification_tier = 'verified';
        property.verification_date = new Date().toISOString();
        property.verification_documents = verification.documents;
      }
      
      const owner = mockUsers.find(u => u.user_id === verification.owner_id);
      if (owner) {
        owner.is_verified_owner = true;
        owner.owner_verification_status = 'verified';
      }
    }
    
    return mockApiCall({
      message: 'Verification approved successfully',
      verification
    });
  }
  
  return axios.post(`/api/verification/admin/approve/${verificationId}`);
};

// =================================================================
// API ENDPOINT: POST /api/verification/admin/reject
// =================================================================
export const rejectVerification = async (verificationId, reason) => {
  if (USE_MOCK) {
    const verification = mockVerificationRequests.find(
      v => v.verification_id === verificationId
    );
    
    if (!verification) {
      return mockApiError('Verification request not found', 404);
    }
    
    // Update verification status
    verification.status = 'rejected';
    verification.reviewed_at = new Date().toISOString();
    verification.reviewed_by = 'admin_001';
    verification.rejection_reason = reason;
    
    // Update user/property status
    if (verification.verification_type === 'renter') {
      const user = mockUsers.find(u => u.user_id === verification.user_id);
      if (user) {
        user.renter_verification_status = 'rejected';
      }
    } else if (verification.verification_type === 'property') {
      const property = mockProperties.find(p => p.property_id === verification.property_id);
      if (property) {
        property.verification_tier = 'free';
      }
    }
    
    return mockApiCall({
      message: 'Verification rejected',
      verification
    });
  }
  
  return axios.post(`/api/verification/admin/reject/${verificationId}`, { reason });
};

// =================================================================
// API ENDPOINT: POST /api/verification/upload-document
// =================================================================
export const uploadDocument = async (file, documentType) => {
  if (USE_MOCK) {
    // Simulate file upload
    return mockApiCall({
      file_name: file.name,
      file_url: `/uploads/verification/mock_${Date.now()}_${file.name}`,
      file_size: file.size,
      file_type: file.type,
      uploaded_at: new Date().toISOString()
    }, 1500); // Simulate longer upload time
  }
  
  const formData = new FormData();
  formData.append('document', file);
  formData.append('document_type', documentType);
  
  return axios.post('/api/verification/upload-document', formData);
};

// =================================================================
// EXPORT ALL FUNCTIONS
// =================================================================
export default {
  submitRenterVerification,
  submitPropertyVerification,
  getVerificationStatus,
  getMyVerificationStatus,
  getPendingVerifications,
  approveVerification,
  rejectVerification,
  uploadDocument
};
