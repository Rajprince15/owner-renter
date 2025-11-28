import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Briefcase, DollarSign, User, Eye, Award, Zap, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DocumentUpload from '../../components/verification/DocumentUpload';
import VerificationStatusTracker from '../../components/verification/VerificationStatusTracker';
import UploadStatusIndicator from '../../components/verification/UploadStatusIndicator';
import VerificationSteps from '../../components/verification/VerificationSteps';
import DocumentPreview from '../../components/verification/DocumentPreview';
import Button from '../../components/common/Button';
import { 
  submitRenterVerification, 
  getMyVerificationStatus,
  uploadDocument 
} from '../../services/verificationService';
import { pageTransition, fadeInUp, staggerContainer } from '../../utils/motionConfig';

const VerificationUpload = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [documents, setDocuments] = useState({
    id_proof: null,
    income_proof: null
  });
  const [employmentDetails, setEmploymentDetails] = useState({
    company_name: '',
    designation: '',
    employment_type: 'salaried',
    annual_income: '',
    years_of_experience: ''
  });
  const [previewDocument, setPreviewDocument] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const uploadedCount = Object.values(documents).filter(doc => doc !== null).length;
      
      if (uploadedCount > 0 && hasUnsavedChanges) {
        const message = 'You have uploaded documents that haven\'t been submitted yet. Are you sure you want to leave?';
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [documents, hasUnsavedChanges]);

  const fetchVerificationStatus = async () => {
    try {
      const response = await getMyVerificationStatus('renter');
      setVerificationStatus(response.data);
    } catch (error) {
      console.error('Failed to fetch verification status:', error);
    }
  };

  const handleDocumentUpload = async (file, documentType) => {
    try {
      const response = await uploadDocument(file, documentType);
      const uploadedFile = response.data;

      setDocuments(prev => ({
        ...prev,
        [documentType]: uploadedFile
      }));

      setHasUnsavedChanges(true);
      return uploadedFile;
    } catch (error) {
      throw new Error('Failed to upload document');
    }
  };

  const handlePreviewDocument = (documentType) => {
    const document = documents[documentType];
    if (document) {
      setPreviewDocument(document);
    }
  };

  const handleClosePreview = () => {
    setPreviewDocument(null);
  };

  const handleReupload = (documentType) => {
    setDocuments(prev => ({
      ...prev,
      [documentType]: null
    }));
    setPreviewDocument(null);
  };

  const handleEmploymentChange = (field, value) => {
    setEmploymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!documents.id_proof) {
      alert('Please upload ID proof');
      return false;
    }

    if (!documents.income_proof) {
      alert('Please upload income proof');
      return false;
    }

    if (!employmentDetails.company_name.trim()) {
      alert('Please enter company name');
      return false;
    }

    if (!employmentDetails.designation.trim()) {
      alert('Please enter designation');
      return false;
    }

    if (!employmentDetails.annual_income || employmentDetails.annual_income <= 0) {
      alert('Please enter valid annual income');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const verificationData = {
        documents: {
          id_proof: {
            type: 'aadhaar',
            ...documents.id_proof
          },
          income_proof: {
            type: 'salary_slip',
            ...documents.income_proof
          }
        },
        employment_details: {
          ...employmentDetails,
          annual_income: parseInt(employmentDetails.annual_income),
          years_of_experience: parseInt(employmentDetails.years_of_experience || 0)
        }
      };

      await submitRenterVerification(verificationData);

      setHasUnsavedChanges(false);

      await updateUser({
        ...user,
        renter_verification_status: 'pending'
      });

      alert('Verification request submitted successfully! We will review your documents within 24-48 hours.');
      fetchVerificationStatus();
    } catch (error) {
      console.error('Failed to submit verification:', error);
      alert('Failed to submit verification request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isVerified = user?.is_verified_renter;
  const status = verificationStatus?.status || 'none';
  const canSubmit = status === 'none' || status === 'rejected';
  
  const uploadedCount = Object.values(documents).filter(doc => doc !== null).length;
  const totalRequired = Object.keys(documents).length;
  const documentsComplete = uploadedCount === totalRequired;
  const getCurrentStep = () => {
    if (!documentsComplete) return 1;
    return 2;
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8" 
      data-testid="renter-verification-page"
      {...pageTransition}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border-2 border-indigo-100 relative overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute right-0 top-0 w-40 h-40 bg-indigo-200/30 rounded-full -mr-20 -mt-20"
          />
          <div className="flex items-center space-x-4 relative z-10">
            <motion.div 
              className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl"
              animate={{ 
                boxShadow: [
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  '0 20px 25px -5px rgba(99, 102, 241, 0.4)',
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Renter Verification</h1>
              <motion.p 
                className="text-gray-600 mt-2 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Get verified to unlock premium benefits and gain owner's trust
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Progress Steps */}
        {canSubmit && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <VerificationSteps 
              currentStep={getCurrentStep()} 
              documents={documents}
            />
          </motion.div>
        )}

        {/* Upload Status Indicator */}
        {canSubmit && uploadedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <UploadStatusIndicator documents={documents} />
          </motion.div>
        )}

        {/* Benefits Section */}
        {!isVerified && status === 'none' && (
          <motion.div 
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -right-20 -bottom-20 w-60 h-60 bg-white/10 rounded-full"
            />
            <h2 className="text-2xl font-bold mb-6 flex items-center relative z-10">
              <Award className="w-8 h-8 mr-3" />
              Benefits of Verification
            </h2>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {[
                { icon: TrendingUp, title: 'Higher Priority', desc: 'Owners prioritize verified renters' },
                { icon: CheckCircle, title: 'Verified Badge', desc: 'Stand out from other renters' },
                { icon: Users, title: 'Reverse Marketplace', desc: 'Let verified owners find you' },
                { icon: Zap, title: 'Faster Responses', desc: 'Verified renters get quicker replies' }
              ].map((benefit, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start space-x-3"
                  variants={fadeInUp}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    <benefit.icon className="w-6 h-6 mt-1 flex-shrink-0" />
                  </motion.div>
                  <div>
                    <p className="font-bold text-lg">{benefit.title}</p>
                    <p className="text-indigo-100">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Status Tracker */}
        {status !== 'none' && (
          <motion.div 
            className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border-2 border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Verification Status</h2>
            <VerificationStatusTracker
              status={status}
              rejectionReason={verificationStatus?.verification?.rejection_reason}
              submittedAt={verificationStatus?.verification?.submitted_at}
              reviewedAt={verificationStatus?.verification?.reviewed_at}
            />
          </motion.div>
        )}

        {/* Verification Form */}
        {canSubmit && (
          <form onSubmit={handleSubmit}>
            {/* Document Upload Section */}
            <motion.div 
              className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border-2 border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <User className="w-7 h-7 mr-3 text-indigo-600" />
                Identity Documents
              </h2>

              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <DocumentUpload
                    label="ID Proof (Aadhaar Card)"
                    documentType="id_proof"
                    onUpload={handleDocumentUpload}
                    acceptedFormats=".pdf,.jpg,.jpeg,.png"
                    required={true}
                    existingFile={documents.id_proof}
                  />
                  {documents.id_proof && (
                    <motion.button
                      type="button"
                      onClick={() => handlePreviewDocument('id_proof')}
                      className="mt-3 flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                      data-testid="preview-id-proof-button"
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview Document</span>
                    </motion.button>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <DocumentUpload
                    label="Income Proof (Salary Slip / Bank Statement)"
                    documentType="income_proof"
                    onUpload={handleDocumentUpload}
                    acceptedFormats=".pdf,.jpg,.jpeg,.png"
                    required={true}
                    existingFile={documents.income_proof}
                  />
                  {documents.income_proof && (
                    <motion.button
                      type="button"
                      onClick={() => handlePreviewDocument('income_proof')}
                      className="mt-3 flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                      data-testid="preview-income-proof-button"
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview Document</span>
                    </motion.button>
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Employment Details Section */}
            <motion.div 
              className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border-2 border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <Briefcase className="w-7 h-7 mr-3 text-indigo-600" />
                Employment Details
              </h2>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <motion.div variants={fadeInUp}>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <motion.input
                    type="text"
                    value={employmentDetails.company_name}
                    onChange={(e) => handleEmploymentChange('company_name', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Enter company name"
                    required
                    data-testid="company-name-input"
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <motion.input
                    type="text"
                    value={employmentDetails.designation}
                    onChange={(e) => handleEmploymentChange('designation', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Enter your designation"
                    required
                    data-testid="designation-input"
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Employment Type <span className="text-red-500">*</span>
                  </label>
                  <motion.select
                    value={employmentDetails.employment_type}
                    onChange={(e) => handleEmploymentChange('employment_type', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                    data-testid="employment-type-select"
                    whileFocus={{ scale: 1.02 }}
                  >
                    <option value="salaried">Salaried</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="business">Business Owner</option>
                    <option value="freelancer">Freelancer</option>
                  </motion.select>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Annual Income (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <motion.input
                      type="number"
                      value={employmentDetails.annual_income}
                      onChange={(e) => handleEmploymentChange('annual_income', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="Enter annual income"
                      min="0"
                      required
                      data-testid="annual-income-input"
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <motion.input
                    type="number"
                    value={employmentDetails.years_of_experience}
                    onChange={(e) => handleEmploymentChange('years_of_experience', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Enter years of experience"
                    min="0"
                    data-testid="experience-input"
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Submit Button */}
            <motion.div 
              className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center justify-between">
                <motion.p 
                  className="text-sm text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  By submitting, you agree to our verification process and data usage policy.
                </motion.p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    data-testid="submit-verification-button"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Submitting...
                      </span>
                    ) : (
                      'Submit for Verification'
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </form>
        )}

        {/* Already Verified Message */}
        {isVerified && status === 'verified' && (
          <motion.div 
            className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-green-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-center py-12">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
              </motion.div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">You're Verified!</h3>
              <p className="text-gray-600 mb-8 text-lg">
                You can now enjoy all premium benefits including reverse marketplace access.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button onClick={() => navigate('/renter/dashboard')}>Go to Dashboard</Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Document Preview Modal */}
        {previewDocument && (
          <DocumentPreview
            document={previewDocument}
            onClose={handleClosePreview}
            onReupload={() => {
              const documentType = Object.keys(documents).find(
                key => documents[key] === previewDocument
              );
              if (documentType) {
                handleReupload(documentType);
              }
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default VerificationUpload;
