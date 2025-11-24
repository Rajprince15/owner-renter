import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, Briefcase, DollarSign, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DocumentUpload from '../../components/verification/DocumentUpload';
import VerificationStatusTracker from '../../components/verification/VerificationStatusTracker';
import Button from '../../components/common/Button';
import { 
  submitRenterVerification, 
  getMyVerificationStatus,
  uploadDocument 
} from '../../services/verificationService';

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

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

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

      return uploadedFile;
    } catch (error) {
      throw new Error('Failed to upload document');
    }
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

      // Update user context
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

  return (
    <div className="min-h-screen bg-gray-50 py-8" data-testid="renter-verification-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 rounded-full">
              <Shield className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Renter Verification</h1>
              <p className="text-gray-600 mt-1">
                Get verified to unlock premium benefits and gain owner's trust
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        {!isVerified && status === 'none' && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 mb-6 text-white">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2" />
              Benefits of Verification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Higher Priority</p>
                  <p className="text-indigo-100 text-sm">Owners prioritize verified renters</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Verified Badge</p>
                  <p className="text-indigo-100 text-sm">Stand out from other renters</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Reverse Marketplace Access</p>
                  <p className="text-indigo-100 text-sm">Let verified owners find you</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Faster Responses</p>
                  <p className="text-indigo-100 text-sm">Verified renters get quicker replies</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Tracker */}
        {status !== 'none' && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Verification Status</h2>
            <VerificationStatusTracker
              status={status}
              rejectionReason={verificationStatus?.verification?.rejection_reason}
              submittedAt={verificationStatus?.verification?.submitted_at}
              reviewedAt={verificationStatus?.verification?.reviewed_at}
            />
          </div>
        )}

        {/* Verification Form */}
        {canSubmit && (
          <form onSubmit={handleSubmit}>
            {/* Document Upload Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <User className="w-6 h-6 mr-2 text-indigo-600" />
                Identity Documents
              </h2>

              <div className="space-y-6">
                <DocumentUpload
                  label="ID Proof (Aadhaar Card)"
                  documentType="id_proof"
                  onUpload={handleDocumentUpload}
                  acceptedFormats=".pdf,.jpg,.jpeg,.png"
                  required={true}
                  existingFile={documents.id_proof}
                />

                <DocumentUpload
                  label="Income Proof (Salary Slip / Bank Statement)"
                  documentType="income_proof"
                  onUpload={handleDocumentUpload}
                  acceptedFormats=".pdf,.jpg,.jpeg,.png"
                  required={true}
                  existingFile={documents.income_proof}
                />
              </div>
            </div>

            {/* Employment Details Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Briefcase className="w-6 h-6 mr-2 text-indigo-600" />
                Employment Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={employmentDetails.company_name}
                    onChange={(e) => handleEmploymentChange('company_name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter company name"
                    required
                    data-testid="company-name-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={employmentDetails.designation}
                    onChange={(e) => handleEmploymentChange('designation', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your designation"
                    required
                    data-testid="designation-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={employmentDetails.employment_type}
                    onChange={(e) => handleEmploymentChange('employment_type', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    data-testid="employment-type-select"
                  >
                    <option value="salaried">Salaried</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="business">Business Owner</option>
                    <option value="freelancer">Freelancer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Income (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={employmentDetails.annual_income}
                      onChange={(e) => handleEmploymentChange('annual_income', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter annual income"
                      min="0"
                      required
                      data-testid="annual-income-input"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={employmentDetails.years_of_experience}
                    onChange={(e) => handleEmploymentChange('years_of_experience', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter years of experience"
                    min="0"
                    data-testid="experience-input"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    By submitting, you agree to our verification process and data usage policy.
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  data-testid="submit-verification-button"
                >
                  {loading ? 'Submitting...' : 'Submit for Verification'}
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Already Verified Message */}
        {isVerified && status === 'verified' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">You're Verified!</h3>
              <p className="text-gray-600 mb-6">
                You can now enjoy all premium benefits including reverse marketplace access.
              </p>
              <Button onClick={() => navigate('/renter/dashboard')}>Go to Dashboard</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationUpload;
