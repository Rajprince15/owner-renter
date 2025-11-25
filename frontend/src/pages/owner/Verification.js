import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, CheckCircle, AlertCircle, CreditCard, Building } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DocumentUpload from '../../components/verification/DocumentUpload';
import Button from '../../components/common/Button';
import MockPaymentModal from '../../components/payment/MockPaymentModal';
import { 
  submitPropertyVerification,
  uploadDocument 
} from '../../services/verificationService';
import { getMyProperties } from '../../services/propertyService';
import { createPaymentOrder, verifyPayment } from '../../services/paymentService';

const Verification = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
    
    // Check if propertyId was passed from another page
    if (location.state?.propertyId) {
      const propId = location.state.propertyId;
      // Will select the property once properties are loaded
      setSelectedProperty({ property_id: propId });
    }
  }, []);

  useEffect(() => {
    // Once properties are loaded, select the property if propertyId was passed
    if (location.state?.propertyId && properties.length > 0) {
      const prop = properties.find(p => p.property_id === location.state.propertyId);
      if (prop && !prop.is_verified) {
        setSelectedProperty(prop);
        setCurrentStep(2);
      }
    }
  }, [properties]);

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
      // Create payment order
      const orderResponse = await createPaymentOrder({
        amount: 2000,
        type: 'property_verification',
        metadata: {
          property_id: selectedProperty.property_id
        }
      });

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
      // Verify payment
      await verifyPayment({
        order_id: orderData.order_id,
        payment_id: paymentData.payment_id
      });

      // Submit verification request
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
      navigate('/owner/properties');
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

  return (
    <div className="min-h-screen bg-gray-50 py-8" data-testid="verification-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Property Verification</h1>
              <p className="text-gray-600 mt-1">
                Verify your property to unlock lifestyle data and 5X more views
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        {currentStep === 1 && unverifiedProperties.length > 0 && (
          <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg shadow-lg p-6 mb-6 text-white">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2" />
              Benefits of Property Verification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">5X More Views</p>
                  <p className="text-green-100 text-sm">Verified properties get priority placement</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Lifestyle Data</p>
                  <p className="text-green-100 text-sm">AQI, noise level, walkability scores</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Premium Renters</p>
                  <p className="text-green-100 text-sm">Attract verified, high-quality tenants</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Trust Badge</p>
                  <p className="text-green-100 text-sm">Green verified badge on your listing</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-green-400">
              <p className="text-lg font-bold">One-time fee: ₹2,000 per property</p>
            </div>
          </div>
        )}

        {/* Step 1: Select Property */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Building className="w-6 h-6 mr-2 text-green-600" />
              Select Property to Verify
            </h2>

            {unverifiedProperties.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  You don't have any unverified properties.
                </p>
                <Button onClick={() => navigate('/owner/property/add')}>
                  Add New Property
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {unverifiedProperties.map((property) => (
                  <div
                    key={property.property_id}
                    onClick={() => handlePropertySelect(property)}
                    className="border border-gray-200 rounded-lg p-4 hover:border-green-500 hover:bg-green-50 cursor-pointer transition-all"
                    data-testid={`property-card-${property.property_id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {property.images && property.images[0] && (
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{property.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {property.location?.locality}, {property.location?.city}
                          </p>
                          <p className="text-sm font-medium text-green-600 mt-2">
                            ₹{property.rent?.toLocaleString('en-IN')}/month
                          </p>
                        </div>
                      </div>
                      <Button size="sm">Select</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Upload Documents */}
        {currentStep === 2 && selectedProperty && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Upload Documents</h2>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Change Property
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-gray-900">{selectedProperty.title}</p>
                <p className="text-sm text-gray-600">
                  {selectedProperty.location?.locality}, {selectedProperty.location?.city}
                </p>
              </div>

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
                <Button onClick={handleDocumentsNext} className="w-full" data-testid="documents-next-button">
                  Continue to Payment
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {currentStep === 3 && selectedProperty && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <CreditCard className="w-6 h-6 mr-2 text-green-600" />
                Payment
              </h2>
              <button
                onClick={() => setCurrentStep(2)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Back to Documents
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700">Verification Fee</span>
                <span className="text-2xl font-bold text-gray-900">₹2,000</span>
              </div>
              <p className="text-sm text-gray-600">
                One-time fee for property verification. After payment, our team will review your documents within 24-48 hours.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p>Your documents will be reviewed by our verification team</p>
              </div>
              <div className="flex items-start space-x-3 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p>Verified properties get 5X more views</p>
              </div>
              <div className="flex items-start space-x-3 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p>Lifestyle data will be automatically calculated</p>
              </div>
            </div>

            <div className="mt-8">
              <Button
                onClick={handlePaymentInit}
                disabled={loading}
                className="w-full"
                data-testid="pay-now-button"
              >
                {loading ? 'Processing...' : 'Pay ₹2,000 Now'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && orderData && (
        <MockPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          orderData={orderData}
          amount={2000}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Verification;
