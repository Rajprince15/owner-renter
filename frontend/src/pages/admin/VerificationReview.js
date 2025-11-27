import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, CheckCircle, XCircle, User, Building, Eye, FileText,
  ChevronLeft, RefreshCw, AlertCircle, Clock, DollarSign, Mail
} from 'lucide-react';
import DocumentViewer from '../../components/admin/DocumentViewer';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { 
  getPendingVerifications,
  approveVerification,
  rejectVerification 
} from '../../services/verificationService';

const VerificationReview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [viewingDocuments, setViewingDocuments] = useState(null);
  const [documentViewerTitle, setDocumentViewerTitle] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [verificationToReject, setVerificationToReject] = useState(null);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [verificationToApprove, setVerificationToApprove] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/login');
      return;
    }
    fetchPendingVerifications();
  }, [user, navigate]);

  const fetchPendingVerifications = async () => {
    setLoading(true);
    try {
      const response = await getPendingVerifications();
      setVerifications(response.data || []);
      showToast('Verifications loaded', 'success');
    } catch (error) {
      console.error('Failed to fetch verifications:', error);
      showToast('Failed to load verifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocuments = (verification) => {
    if (verification.documents && Object.keys(verification.documents).length > 0) {
      setViewingDocuments(verification.documents);
      setDocumentViewerTitle(`${verification.verification_type === 'property' ? verification.property_title : verification.user_name} - Documents`);
      setShowDocumentViewer(true);
    } else {
      showToast('No documents available', 'warning');
    }
  };

  const handleApproveInit = (verification) => {
    setVerificationToApprove(verification);
    setShowApproveConfirm(true);
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await approveVerification(verificationToApprove.verification_id);
      showToast('Verification approved successfully!', 'success');
      setShowApproveConfirm(false);
      setVerificationToApprove(null);
      fetchPendingVerifications();
    } catch (error) {
      console.error('Failed to approve verification:', error);
      showToast('Failed to approve verification', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectInit = (verification) => {
    setVerificationToReject(verification);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      showToast('Please provide a rejection reason', 'warning');
      return;
    }

    setActionLoading(true);
    try {
      await rejectVerification(verificationToReject.verification_id, rejectionReason);
      showToast('Verification rejected successfully!', 'success');
      setShowRejectModal(false);
      setVerificationToReject(null);
      setRejectionReason('');
      fetchPendingVerifications();
    } catch (error) {
      console.error('Failed to reject verification:', error);
      showToast('Failed to reject verification', 'error');
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

  const getRenterVerifications = () => verifications.filter(v => v.verification_type === 'renter');
  const getPropertyVerifications = () => verifications.filter(v => v.verification_type === 'property');
  const getOwnerVerifications = () => verifications.filter(v => v.verification_type === 'owner');

  const getFilteredVerifications = () => {
    if (activeTab === 'all') return verifications;
    if (activeTab === 'renter') return getRenterVerifications();
    if (activeTab === 'owner') return getOwnerVerifications();
    if (activeTab === 'property') return getPropertyVerifications();
    return verifications;
  };

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

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 p-6" 
      data-testid="admin-verification-review-page"
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
              <div className="flex items-center gap-4">
                <motion.div 
                  className="p-3 bg-purple-100 rounded-full"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Shield className="w-8 h-8 text-purple-600" />
                </motion.div>
                <div>
                  <motion.h1 
                    className="text-3xl font-bold text-gray-900 flex items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Verification Review
                    <motion.span 
                      className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {verifications.length} Pending
                    </motion.span>
                  </motion.h1>
                  <p className="text-gray-600 mt-2">
                    Review and approve/reject all verification requests
                  </p>
                </div>
              </div>
              <motion.button
                onClick={fetchPendingVerifications}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md"
                data-testid="refresh-button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95, rotate: 180 }}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {[
            { label: 'Total Pending', value: verifications.length, icon: Shield, color: 'purple', testId: 'total-stat' },
            { label: 'Renter Verifications', value: getRenterVerifications().length, icon: User, color: 'blue', testId: 'renter-stat' },
            { label: 'Owner Verifications', value: getOwnerVerifications().length, icon: User, color: 'green', testId: 'owner-stat' },
            { label: 'Property Verifications', value: getPropertyVerifications().length, icon: Building, color: 'indigo', testId: 'property-stat' }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-lg shadow p-6"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              data-testid={stat.testId}
            >
              <div className="flex items-center justify-between mb-2">
                <motion.div
                  className={`p-2 bg-${stat.color}-100 rounded-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </motion.div>
              </div>
              <p className="text-sm font-semibold text-gray-600">{stat.label}</p>
              <motion.p 
                className={`text-2xl font-bold text-${stat.color}-600`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + (index * 0.1) }}
              >
                {stat.value}
              </motion.p>
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
          <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
            {[
              { key: 'all', label: 'All Verifications', count: verifications.length },
              { key: 'renter', label: 'Renter', count: getRenterVerifications().length },
              { key: 'owner', label: 'Owner', count: getOwnerVerifications().length },
              { key: 'property', label: 'Property', count: getPropertyVerifications().length }
            ].map((tab) => (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 font-semibold whitespace-nowrap ${
                  activeTab === tab.key 
                    ? 'border-b-2 border-purple-600 text-purple-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                data-testid={`${tab.key}-tab`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.label} ({tab.count})
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-12 w-12 border-b-2 border-purple-600"
            />
          </div>
        ) : getFilteredVerifications().length === 0 ? (
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
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-600">There are no pending {activeTab !== 'all' ? activeTab : ''} verification requests.</p>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {getFilteredVerifications().map((verification, index) => (
              <motion.div
                key={verification.verification_id}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500"
                variants={itemVariants}
                whileHover={{ y: -3, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
                transition={{ duration: 0.2 }}
                data-testid={`verification-card-${verification.verification_id}`}
              >
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  {/* Left Section - Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        className={`p-2 rounded-full ${
                          verification.verification_type === 'renter' ? 'bg-blue-100' :
                          verification.verification_type === 'owner' ? 'bg-green-100' : 'bg-purple-100'
                        }`}
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {verification.verification_type === 'property' ? (
                          <Building className="w-6 h-6 text-purple-600" />
                        ) : (
                          <User className={`w-6 h-6 ${
                            verification.verification_type === 'renter' ? 'text-blue-600' : 'text-green-600'
                          }`} />
                        )}
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {verification.verification_type === 'property' 
                            ? verification.property_title 
                            : verification.user_name}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          {verification.user_email || verification.owner_email}
                        </p>
                      </div>
                      <motion.span
                        className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${
                          verification.verification_type === 'renter' ? 'bg-blue-100 text-blue-800' :
                          verification.verification_type === 'owner' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {verification.verification_type.toUpperCase()}
                      </motion.span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {verification.employment_details && (
                        <>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Company</p>
                            <p className="font-medium text-gray-900">{verification.employment_details.company_name || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Designation</p>
                            <p className="font-medium text-gray-900">{verification.employment_details.designation || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              Annual Income
                            </p>
                            <p className="font-medium text-green-600">
                              ₹{verification.employment_details.annual_income?.toLocaleString('en-IN') || 'N/A'}
                            </p>
                          </div>
                        </>
                      )}
                      {verification.payment_status && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Payment Status</p>
                          <p className={`font-medium ${verification.payment_status === 'success' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {verification.payment_status === 'success' ? '✓ Paid' : 'Pending'}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Submitted
                        </p>
                        <p className="font-medium text-gray-900">{formatDate(verification.submitted_at)}</p>
                      </div>
                    </div>

                    {/* Documents Info */}
                    {verification.documents && Object.keys(verification.documents).length > 0 && (
                      <motion.div 
                        className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <FileText className="w-4 h-4" />
                        <span>{Object.keys(verification.documents).length} document(s) attached</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex flex-col gap-2 lg:w-48">
                    <motion.button
                      onClick={() => handleViewDocuments(verification)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      data-testid="view-documents-button"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Eye className="w-4 h-4" />
                      View Docs
                    </motion.button>
                    <motion.button
                      onClick={() => handleApproveInit(verification)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      data-testid="approve-button"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </motion.button>
                    <motion.button
                      onClick={() => handleRejectInit(verification)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      data-testid="reject-button"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Approve Confirmation */}
      {showApproveConfirm && verificationToApprove && (
        <ConfirmDialog
          title="Approve Verification"
          message={`Are you sure you want to approve this ${verificationToApprove.verification_type} verification for ${verificationToApprove.verification_type === 'property' ? verificationToApprove.property_title : verificationToApprove.user_name}?`}
          confirmText="Approve"
          confirmColor="green"
          onConfirm={handleApprove}
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
            onClick={() => setShowRejectModal(false)}
          >
            <motion.div 
              className="bg-white rounded-lg p-6 max-w-md w-full"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <XCircle className="w-6 h-6 text-red-600" />
                Reject Verification
              </h2>
              <p className="text-gray-700 mb-4">
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
              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={actionLoading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleRejectConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={actionLoading || !rejectionReason.trim()}
                  data-testid="confirm-reject-button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {actionLoading ? 'Rejecting...' : 'Reject'}
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
    </motion.div>
  );
};

export default VerificationReview;
