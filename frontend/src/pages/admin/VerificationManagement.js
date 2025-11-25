import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, XCircle, Eye, ChevronLeft, RefreshCw, 
  FileText, User, Home, AlertCircle 
} from 'lucide-react';
import { 
  getPendingVerifications, 
  approveVerification,
  rejectVerification,
  logAdminAction 
} from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { useToast } from '../../context/ToastContext';

const VerificationManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [verifications, setVerifications] = useState({
    renter: [],
    owner: [],
    property: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('renter');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [verificationToReject, setVerificationToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [verificationToApprove, setVerificationToApprove] = useState(null);

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/login');
      return;
    }
    loadVerifications();
  }, [user, navigate]);

  const loadVerifications = async () => {
    try {
      setLoading(true);
      const response = await getPendingVerifications();
      setVerifications(response.data);
    } catch (error) {
      console.error('Error loading verifications:', error);
      showToast('Failed to load verifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (verification, verificationType) => {
    setVerificationToApprove({ verification, verificationType });
    setShowApproveConfirm(true);
  };

  const confirmApprove = async () => {
    try {
      await approveVerification(
        verificationToApprove.verification.verification_id,
        verificationToApprove.verificationType
      );
      logAdminAction(user.user_id, 'verification_approve', 'verification', 
        verificationToApprove.verification.verification_id, {
        type: verificationToApprove.verificationType
      });
      showToast('Verification approved successfully', 'success');
      setShowApproveConfirm(false);
      setVerificationToApprove(null);
      loadVerifications();
    } catch (error) {
      console.error('Error approving verification:', error);
      showToast('Failed to approve verification', 'error');
    }
  };

  const handleReject = (verification, verificationType) => {
    setVerificationToReject({ verification, verificationType });
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    try {
      await rejectVerification(
        verificationToReject.verification.verification_id,
        verificationToReject.verificationType,
        rejectionReason
      );
      logAdminAction(user.user_id, 'verification_reject', 'verification', 
        verificationToReject.verification.verification_id, {
        type: verificationToReject.verificationType,
        reason: rejectionReason
      });
      showToast('Verification rejected', 'success');
      setShowRejectModal(false);
      setVerificationToReject(null);
      setRejectionReason('');
      loadVerifications();
    } catch (error) {
      console.error('Error rejecting verification:', error);
      showToast('Failed to reject verification', 'error');
    }
  };

  const renderVerificationCard = (verification, type) => (
    <div key={verification.verification_id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow" data-testid="verification-card">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {type === 'renter' && <User className="w-6 h-6 text-blue-600" />}
          {type === 'owner' && <User className="w-6 h-6 text-green-600" />}
          {type === 'property' && <Home className="w-6 h-6 text-purple-600" />}
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {type === 'property' ? verification.property_title : verification.user_name}
            </h3>
            <p className="text-sm text-gray-600">{verification.email || verification.owner_id}</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
          Pending
        </span>
      </div>

      {verification.documents && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Documents Submitted:</h4>
          <div className="space-y-2">
            {Object.keys(verification.documents).map((docKey) => (
              <div key={docKey} className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span className="capitalize">{docKey.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600 mb-4">
        <p>Submitted: {new Date(verification.submitted_at).toLocaleDateString()}</p>
        {type === 'property' && <p>Property ID: {verification.property_id}</p>}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => handleApprove(verification, type)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          data-testid="approve-button"
        >
          <CheckCircle className="w-4 h-4" />
          Approve
        </button>
        <button
          onClick={() => handleReject(verification, type)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          data-testid="reject-button"
        >
          <XCircle className="w-4 h-4" />
          Reject
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6" data-testid="verification-management">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            data-testid="back-to-admin-button"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Verification Management</h1>
              <p className="text-gray-600 mt-1">
                Review and manage pending verifications
              </p>
            </div>
            <button
              onClick={loadVerifications}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              data-testid="refresh-button"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Renter Verifications</p>
                <p className="text-2xl font-bold text-blue-600">{verifications.renter.length}</p>
              </div>
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Owner Verifications</p>
                <p className="text-2xl font-bold text-green-600">{verifications.owner.length}</p>
              </div>
              <User className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Property Verifications</p>
                <p className="text-2xl font-bold text-purple-600">{verifications.property.length}</p>
              </div>
              <Home className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('renter')}
              className={`px-6 py-3 font-semibold ${activeTab === 'renter' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              data-testid="renter-tab"
            >
              Renter Verifications ({verifications.renter.length})
            </button>
            <button
              onClick={() => setActiveTab('owner')}
              className={`px-6 py-3 font-semibold ${activeTab === 'owner' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600 hover:text-gray-900'}`}
              data-testid="owner-tab"
            >
              Owner Verifications ({verifications.owner.length})
            </button>
            <button
              onClick={() => setActiveTab('property')}
              className={`px-6 py-3 font-semibold ${activeTab === 'property' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
              data-testid="property-tab"
            >
              Property Verifications ({verifications.property.length})
            </button>
          </div>
        </div>

        {/* Verification Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : verifications[activeTab].length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No pending {activeTab} verifications</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {verifications[activeTab].map((verification) => renderVerificationCard(verification, activeTab))}
          </div>
        )}
      </div>

      {/* Approve Confirmation */}
      {showApproveConfirm && verificationToApprove && (
        <ConfirmDialog
          title="Approve Verification"
          message={`Are you sure you want to approve this ${verificationToApprove.verificationType} verification?`}
          confirmText="Approve"
          confirmColor="green"
          onConfirm={confirmApprove}
          onCancel={() => {
            setShowApproveConfirm(false);
            setVerificationToApprove(null);
          }}
        />
      )}

      {/* Reject Modal */}
      {showRejectModal && verificationToReject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="reject-modal">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Reject Verification</h2>
            <p className="text-gray-700 mb-4">
              Please provide a reason for rejecting this verification. The user will see this message.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
              rows={4}
              data-testid="rejection-reason-input"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setVerificationToReject(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="confirm-reject-button"
              >
                Reject Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationManagement;
