import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, User, Building, Eye, FileText } from 'lucide-react';
import Button from '../../components/common/Button';
import { 
  getPendingVerifications,
  approveVerification,
  rejectVerification 
} from '../../services/verificationService';

const VerificationReview = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  const fetchPendingVerifications = async () => {
    setLoading(true);
    try {
      const response = await getPendingVerifications();
      setVerifications(response.data || []);
    } catch (error) {
      console.error('Failed to fetch verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocuments = (verification) => {
    setSelectedVerification(verification);
    setShowDocumentModal(true);
  };

  const handleApprove = async (verification) => {
    if (!window.confirm('Are you sure you want to approve this verification?')) {
      return;
    }

    setActionLoading(true);
    try {
      await approveVerification(verification.verification_id);
      alert('Verification approved successfully!');
      fetchPendingVerifications();
    } catch (error) {
      console.error('Failed to approve verification:', error);
      alert('Failed to approve verification. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectInit = (verification) => {
    setSelectedVerification(verification);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setActionLoading(true);
    try {
      await rejectVerification(selectedVerification.verification_id, rejectionReason);
      alert('Verification rejected successfully!');
      setShowRejectModal(false);
      fetchPendingVerifications();
    } catch (error) {
      console.error('Failed to reject verification:', error);
      alert('Failed to reject verification. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRenterVerifications = () => {
    return verifications.filter(v => v.verification_type === 'renter');
  };

  const getPropertyVerifications = () => {
    return verifications.filter(v => v.verification_type === 'property');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" data-testid="admin-verification-review-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-100 rounded-full">
                <Shield className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Verification Review</h1>
                <p className="text-gray-600 mt-1">
                  Review and approve/reject verification requests
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{verifications.length}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <Button onClick={fetchPendingVerifications} variant="secondary" size="sm">
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading verifications...</p>
          </div>
        ) : verifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-600">There are no pending verification requests at the moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Renter Verifications */}
            {getRenterVerifications().length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <User className="w-6 h-6 mr-2 text-indigo-600" />
                  Renter Verifications ({getRenterVerifications().length})
                </h2>
                <div className="space-y-4">
                  {getRenterVerifications().map((verification) => (
                    <div
                      key={verification.verification_id}
                      className="bg-white rounded-lg shadow-sm p-6"
                      data-testid={`verification-card-${verification.verification_id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-indigo-100 rounded-full">
                              <User className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{verification.user_name}</h3>
                              <p className="text-sm text-gray-600">{verification.user_email}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Company</p>
                              <p className="font-medium text-gray-900">
                                {verification.employment_details?.company_name || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Designation</p>
                              <p className="font-medium text-gray-900">
                                {verification.employment_details?.designation || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Annual Income</p>
                              <p className="font-medium text-gray-900">
                                ₹{verification.employment_details?.annual_income?.toLocaleString('en-IN') || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Submitted At</p>
                              <p className="font-medium text-gray-900">
                                {formatDate(verification.submitted_at)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 text-sm">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">
                              Documents: ID Proof, Income Proof
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <Button
                            onClick={() => handleViewDocuments(verification)}
                            variant="secondary"
                            size="sm"
                            data-testid="view-documents-button"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Docs
                          </Button>
                          <Button
                            onClick={() => handleApprove(verification)}
                            variant="primary"
                            size="sm"
                            disabled={actionLoading}
                            data-testid="approve-button"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleRejectInit(verification)}
                            variant="danger"
                            size="sm"
                            disabled={actionLoading}
                            data-testid="reject-button"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Property Verifications */}
            {getPropertyVerifications().length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Building className="w-6 h-6 mr-2 text-green-600" />
                  Property Verifications ({getPropertyVerifications().length})
                </h2>
                <div className="space-y-4">
                  {getPropertyVerifications().map((verification) => (
                    <div
                      key={verification.verification_id}
                      className="bg-white rounded-lg shadow-sm p-6"
                      data-testid={`verification-card-${verification.verification_id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-green-100 rounded-full">
                              <Building className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{verification.property_title}</h3>
                              <p className="text-sm text-gray-600">
                                Owner: {verification.owner_name} ({verification.owner_email})
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Payment Status</p>
                              <p className="font-medium text-green-600">
                                {verification.payment_status === 'success' ? '✓ Paid (₹2,000)' : 'Pending'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Submitted At</p>
                              <p className="font-medium text-gray-900">
                                {formatDate(verification.submitted_at)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 text-sm">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">
                              Documents: Owner ID Proof, Ownership Proof
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <Button
                            onClick={() => handleViewDocuments(verification)}
                            variant="secondary"
                            size="sm"
                            data-testid="view-documents-button"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Docs
                          </Button>
                          <Button
                            onClick={() => handleApprove(verification)}
                            variant="primary"
                            size="sm"
                            disabled={actionLoading}
                            data-testid="approve-button"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleRejectInit(verification)}
                            variant="danger"
                            size="sm"
                            disabled={actionLoading}
                            data-testid="reject-button"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Document View Modal */}
      {showDocumentModal && selectedVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-testid="document-modal">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Documents</h3>
                <button
                  onClick={() => setShowDocumentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                  data-testid="close-modal-button"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {Object.entries(selectedVerification.documents || {}).map(([key, doc]) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {key.replace(/_/g, ' ').toUpperCase()}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    File: {doc.file_name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    Type: {doc.type || 'N/A'}
                  </p>
                  <div className="bg-gray-100 rounded p-4 text-center text-sm text-gray-600">
                    [Mock Document Preview - In production, display actual document here]
                    <br />
                    URL: {doc.file_url}
                  </div>
                </div>
              ))}

              {selectedVerification.employment_details && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-3">Employment Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Company</p>
                      <p className="font-medium text-gray-900">
                        {selectedVerification.employment_details.company_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Designation</p>
                      <p className="font-medium text-gray-900">
                        {selectedVerification.employment_details.designation}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Type</p>
                      <p className="font-medium text-gray-900">
                        {selectedVerification.employment_details.employment_type}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Annual Income</p>
                      <p className="font-medium text-gray-900">
                        ₹{selectedVerification.employment_details.annual_income?.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-testid="reject-modal">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <XCircle className="w-6 h-6 mr-2 text-red-600" />
                Reject Verification
              </h3>
              <p className="text-gray-600 mb-4">
                Please provide a reason for rejection. This will be shown to the user.
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-4"
                rows={4}
                placeholder="Enter rejection reason..."
                data-testid="rejection-reason-input"
              />
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowRejectModal(false)}
                  variant="secondary"
                  className="flex-1"
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRejectConfirm}
                  variant="danger"
                  className="flex-1"
                  disabled={actionLoading || !rejectionReason.trim()}
                  data-testid="confirm-reject-button"
                >
                  {actionLoading ? 'Rejecting...' : 'Reject'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationReview;
