import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, AlertCircle, CreditCard, Building, FileCheck, Upload, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DocumentUpload from '../../components/verification/DocumentUpload';
import VerificationStatusTracker from '../../components/verification/VerificationStatusTracker';
import Button from '../../components/common/Button';
import MockPaymentModal from '../../components/payment/MockPaymentModal';
import { 
  submitPropertyVerification,
  uploadDocument 
} from '../../services/verificationService';
import { getMyProperties } from '../../services/propertyService';
import { createPaymentOrder, verifyPayment } from '../../services/paymentService';

const PropertyVerification = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [documents, setDocuments] = useState({
    owner_id_proof: null,
    ownership_proof: null
  });
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await getMyProperties();
      setProperties(response.data || []);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
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

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
    setCurrentStep(2);
  };

  const handleDocumentsNext = () => {
    if (!documents.owner_id_proof) {
      alert('Please upload owner ID proof');
      return;
    }

    if (!documents.ownership_proof) {
      alert('Please upload ownership proof');
      return;
    }

    setCurrentStep(3);
  };

  const handlePaymentInit = async () => {
    setLoading(true);

    try {
      const orderResponse = await createPaymentOrder(
        'property_verification',
        {
          property_id: selectedProperty.property_id
        }
      );

      setOrderData(orderResponse.data);
      setShowPaymentModal(true);
    } catch (error) {
      console.error('Failed to create payment order:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    setLoading(true);

    try {
      await verifyPayment(
        paymentData.payment_id,
        paymentData.order_id,
        paymentData.signature,
        'property_verification'
      );

      const verificationData = {
        property_id: selectedProperty.property_id,
        documents: {
          owner_id_proof: {
            type: 'aadhaar',
            ...documents.owner_id_proof
          },
          ownership_proof: {
            type: 'property_tax',
            ...documents.ownership_proof
          }
        },
        payment_id: paymentData.payment_id,
        payment_status: 'success'
      };

      await submitPropertyVerification(verificationData);

      alert('Property verification request submitted successfully!');
      navigate('/owner/my-properties');
    } catch (error) {
      console.error('Failed to submit verification:', error);
      alert('Failed to submit verification request. Please contact support.');
    } finally {
      setLoading(false);
      setShowPaymentModal(false);
    }
  };

  const getUnverifiedProperties = () => {
    return properties.filter(p => !p.is_verified && p.status === 'active');
  };

  const unverifiedProperties = getUnverifiedProperties();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const stepIcons = {
    1: Building,
    2: Upload,
    3: CreditCard
  };

  const StepIcon = stepIcons[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 relative overflow-hidden" data-testid="property-verification-page">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-10 right-10 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-10 left-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [90, 0, 90],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-6 border border-indigo-100"
        >
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
              className="p-3 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-xl"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Property Verification</h1>
              <p className="text-gray-600 mt-1">
                Verify your property to unlock lifestyle data and 5X more views
              </p>
            </div>
          </div>

          {/* Progress Stepper */}
          <div className="mt-6 flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: step * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep >= step
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {currentStep > step ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      step
                    )}
                  </motion.div>
                  <span className="text-xs mt-2 text-gray-600">
                    {step === 1 ? 'Select' : step === 2 ? 'Documents' : 'Payment'}
                  </span>
                </motion.div>
                {step < 3 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: currentStep > step ? 1 : 0.3 }}
                    className={`flex-1 h-1 mx-2 rounded transition-all ${
                      currentStep > step ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* Benefits Banner */}
        {currentStep === 1 && unverifiedProperties.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 rounded-2xl shadow-2xl p-6 mb-6 text-white relative overflow-hidden"
          >
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full opacity-5"
              animate={{
                scale: [1, 1.5, 1],
                x: [0, 50, 0],
                y: [0, -50, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <h2 className="text-xl font-bold mb-4 flex items-center relative z-10">
              <CheckCircle className="w-6 h-6 mr-2" />
              Benefits of Property Verification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {[
                { title: '5X More Views', desc: 'Verified properties get priority placement' },
                { title: 'Lifestyle Data', desc: 'AQI, noise level, walkability scores' },
                { title: 'Premium Renters', desc: 'Attract verified, high-quality tenants' },
                { title: 'Trust Badge', desc: 'Green verified badge on your listing' }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, x: 5 }}
                  className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3"
                >
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{benefit.title}</p>
                    <p className="text-green-100 text-sm">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 pt-4 border-t border-green-400 relative z-10"
            >
              <p className="text-lg font-bold">One-time fee: ₹1,500 per property</p>
            </motion.div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Select Property */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -50 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Building className="w-6 h-6 mr-2 text-indigo-600" />
                Select Property to Verify
              </h2>

              {unverifiedProperties.length === 0 ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  </motion.div>
                  <p className="text-gray-600 mb-4">
                    You don't have any unverified properties.
                  </p>
                  <Button onClick={() => navigate('/owner/add-property')}>
                    Add New Property
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {unverifiedProperties.map((property, index) => (
                    <motion.div
                      key={property.property_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      onClick={() => handlePropertySelect(property)}
                      className="border-2 border-gray-200 rounded-xl p-4 hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer transition-all shadow-md hover:shadow-xl"
                      data-testid={`property-card-${property.property_id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {property.images && property.images[0] && (
                            <motion.img
                              whileHover={{ scale: 1.1, rotate: 2 }}
                              src={property.images[0]}
                              alt={property.title}
                              className="w-20 h-20 object-cover rounded-lg shadow-lg"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{property.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {property.location?.locality}, {property.location?.city}
                            </p>
                            <p className="text-sm font-medium text-indigo-600 mt-2">
                              ₹{property.rent?.toLocaleString('en-IN')}/month
                            </p>
                          </div>
                        </div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button size="sm">Select</Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Upload Documents */}
          {currentStep === 2 && selectedProperty && (
            <motion.div
              key="step2"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <FileCheck className="w-6 h-6 mr-2 text-purple-600" />
                    Upload Documents
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentStep(1)}
                    className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-lg hover:bg-gray-100"
                  >
                    Change Property
                  </motion.button>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-6 border-2 border-indigo-200"
                >
                  <p className="text-sm font-medium text-gray-900">{selectedProperty.title}</p>
                  <p className="text-sm text-gray-600">
                    {selectedProperty.location?.locality}, {selectedProperty.location?.city}
                  </p>
                </motion.div>

                <div className="space-y-6">
                  <DocumentUpload
                    label="Owner ID Proof (Aadhaar Card)"
                    documentType="owner_id_proof"
                    onUpload={handleDocumentUpload}
                    acceptedFormats=".pdf,.jpg,.jpeg,.png"
                    required={true}
                    existingFile={documents.owner_id_proof}
                  />

                  <DocumentUpload
                    label="Ownership Proof (Property Tax Receipt / Sale Deed / Electricity Bill)"
                    documentType="ownership_proof"
                    onUpload={handleDocumentUpload}
                    acceptedFormats=".pdf,.jpg,.jpeg,.png"
                    required={true}
                    existingFile={documents.ownership_proof}
                  />
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button onClick={handleDocumentsNext} className="w-full" data-testid="documents-next-button">
                      Continue to Payment
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && selectedProperty && (
            <motion.div
              key="step3"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -50 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <CreditCard className="w-6 h-6 mr-2 text-pink-600" />
                  Payment
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentStep(2)}
                  className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-lg hover:bg-gray-100"
                >
                  Back to Documents
                </motion.button>
              </div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 mb-6 border-2 border-indigo-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-700 font-medium">Verification Fee</span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
                  >
                    ₹1,500
                  </motion.span>
                </div>
                <p className="text-sm text-gray-600">
                  One-time fee for property verification. After payment, our team will review your documents within 24-48 hours.
                </p>
              </motion.div>

              <div className="space-y-4">
                {[
                  { icon: FileCheck, text: 'Your documents will be reviewed by our verification team' },
                  { icon: CheckCircle, text: 'Verified properties get 5X more views' },
                  { icon: Clock, text: 'Lifestyle data will be automatically calculated' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5, scale: 1.02 }}
                    className="flex items-start space-x-3 text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-lg p-3 shadow-sm"
                  >
                    <item.icon className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <p>{item.text}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={handlePaymentInit}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow-2xl"
                    data-testid="pay-now-button"
                  >
                    {loading ? 'Processing...' : 'Pay ₹1,500 Now'}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Payment Modal */}
      {showPaymentModal && orderData && (
        <MockPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          orderData={orderData}
          amount={orderData.amount || 2000}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default PropertyVerification;