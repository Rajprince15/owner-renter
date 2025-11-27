import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
import DocumentViewer from '../../components/admin/DocumentViewer';
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
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [viewingDocuments, setViewingDocuments] = useState(null);
  const [documentViewerTitle, setDocumentViewerTitle] = useState('');

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
    <motion.div 
      key={verification.verification_id} 
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow" 
      data-testid="verification-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {type === 'renter' && <User className="w-6 h-6 text-blue-600" />}
            {type === 'owner' && <User className="w-6 h-6 text-green-600" />}
            {type === 'property' && <Home className="w-6 h-6 text-purple-600" />}
          </motion.div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {type === 'property' ? verification.property_title : verification.user_name}
            </h3>
            <p className="text-sm text-gray-600">{verification.email || verification.owner_id}</p>
          </div>
        </div>
        <motion.span 
          className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Pending
        </motion.span>
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
        {verification.documents && Object.keys(verification.documents).length > 0 && (
          <motion.button
            onClick={() => {
              setViewingDocuments(verification.documents);
              setDocumentViewerTitle(`${type === 'property' ? verification.property_title : verification.user_name} - Documents`);
              setShowDocumentViewer(true);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            data-testid="view-documents-button"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye className="w-4 h-4" />
            View Documents
          </motion.button>
        )}
        <motion.button
          onClick={() => handleApprove(verification, type)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          data-testid="approve-button"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <CheckCircle className="w-4 h-4\" />
          Approve
        </motion.button>
        <motion.button
          onClick={() => handleReject(verification, type)}
          className=\"flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700\"
          data-testid=\"reject-button\"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <XCircle className=\"w-4 h-4\" />
          Reject
        </motion.button>
      </div>
    </motion.div>
  );

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 p-6" 
      data-testid="verification-management"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            onClick={() => navigate('/admin')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 font-medium"
            data-testid="back-to-admin-button"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </motion.button>
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600"
            whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <motion.h1 
                  className="text-3xl font-bold text-gray-900 flex items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Verification Management
                  <motion.span 
                    className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {verifications.renter.length + verifications.owner.length + verifications.property.length} Pending
                  </motion.span>
                </motion.h1>
                <p className="text-gray-600 mt-2">
                  Review and manage all pending verification requests
                </p>
              </div>
              <motion.button
                onClick={loadVerifications}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md"
                data-testid="refresh-button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95, rotate: 180 }}
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {[
            { label: 'Renter Verifications', value: verifications.renter.length, icon: User, color: 'blue' },
            { label: 'Owner Verifications', value: verifications.owner.length, icon: User, color: 'green' },
            { label: 'Property Verifications', value: verifications.property.length, icon: Home, color: 'purple' }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-lg shadow p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (index * 0.1) }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">{stat.label}</p>
                  <motion.p 
                    className={`text-2xl font-bold text-${stat.color}-600`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + (index * 0.1) }}
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex gap-2 border-b border-gray-200">
            {[
              { key: 'renter', label: 'Renter Verifications', color: 'blue', count: verifications.renter.length },
              { key: 'owner', label: 'Owner Verifications', color: 'green', count: verifications.owner.length },
              { key: 'property', label: 'Property Verifications', color: 'purple', count: verifications.property.length }
            ].map((tab) => (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 font-semibold ${activeTab === tab.key ? `border-b-2 border-${tab.color}-600 text-${tab.color}-600` : 'text-gray-600 hover:text-gray-900'}`}
                data-testid={`${tab.key}-tab`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.label} ({tab.count})
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Verification Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-12 w-12 border-b-2 border-blue-600"
            />
          </div>
        ) : verifications[activeTab].length === 0 ? (
          <motion.div 
            className="bg-white rounded-lg shadow p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            </motion.div>
            <p className="text-gray-600 text-lg">No pending {activeTab} verifications</p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {verifications[activeTab].map((verification) => renderVerificationCard(verification, activeTab))}
          </motion.div>
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
      <AnimatePresence>
        {showRejectModal && verificationToReject && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" 
            data-testid="reject-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-lg p-6 max-w-md w-full"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
            >
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
                <motion.button
                  onClick={() => {
                    setShowRejectModal(false);
                    setVerificationToReject(null);
                    setRejectionReason('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={confirmReject}
                  disabled={!rejectionReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="confirm-reject-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reject Verification
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Viewer */}
      <DocumentViewer
        isOpen={showDocumentViewer}
        onClose={() => {
          setShowDocumentViewer(false);
          setViewingDocuments(null);
          setDocumentViewerTitle('');
        }}
        documents={viewingDocuments}
        title={documentViewerTitle}
      />
    </div>
  );
};

export default VerificationManagement;
