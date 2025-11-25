import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { createProperty } from '../../services/propertyService';
import { getMyProperties } from '../../services/propertyService';
import PropertyForm from '../../components/property/PropertyForm';
import Button from '../../components/common/Button';
import VerificationBenefitsModal from '../../components/owner/VerificationBenefitsModal';

const STEPS = [
  { id: 1, name: 'Basic Info', description: 'Property details' },
  { id: 2, name: 'Location', description: 'Address & locality' },
  { id: 3, name: 'Details', description: 'Amenities & features' },
  { id: 4, name: 'Images', description: 'Property photos' },
  { id: 5, name: 'Preview', description: 'Review & submit' }
];

const AddProperty = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    description: '',
    property_type: 'apartment',
    bhk_type: '2BHK',
    rent: '',
    security_deposit: '',
    maintenance_charges: '',
    
    // Location
    location: {
      address: '',
      city: '',
      state: 'Karnataka',
      pincode: '',
      latitude: 0,
      longitude: 0,
      locality: '',
      landmarks: []
    },
    
    // Details
    details: {
      carpet_area: '',
      total_floors: '',
      floor_number: '',
      furnishing: 'semi-furnished',
      parking: {
        car: 0,
        bike: 0
      },
      amenities: [],
      bathrooms: 1,
      balconies: 0,
      facing: 'north',
      age_of_property: '',
      available_from: '',
      preferred_tenants: [],
      pets_allowed: false,
      vegetarian_only: false
    },
    
    // Images
    images: [],
    video_url: '',
    virtual_tour_url: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.rent || formData.rent <= 0) newErrors.rent = 'Valid rent amount is required';
      if (!formData.security_deposit || formData.security_deposit <= 0) newErrors.security_deposit = 'Valid deposit is required';
    }
    
    if (step === 2) {
      if (!formData.location.address.trim()) newErrors['location.address'] = 'Address is required';
      if (!formData.location.city.trim()) newErrors['location.city'] = 'City is required';
      if (!formData.location.pincode.trim()) newErrors['location.pincode'] = 'Pincode is required';
      if (!formData.location.locality.trim()) newErrors['location.locality'] = 'Locality is required';
    }
    
    if (step === 3) {
      if (!formData.details.carpet_area || formData.details.carpet_area <= 0) {
        newErrors['details.carpet_area'] = 'Valid carpet area is required';
      }
      if (!formData.details.total_floors || formData.details.total_floors <= 0) {
        newErrors['details.total_floors'] = 'Valid number of floors is required';
      }
      if (!formData.details.available_from) {
        newErrors['details.available_from'] = 'Available from date is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const checkIfFirstProperty = async () => {
    try {
      const response = await getMyProperties();
      const properties = response.data || [];
      
      // Check if this is the first property
      if (properties.length === 0) {
        // Check if modal was shown before
        const modalShown = localStorage.getItem('verification_modal_shown');
        if (!modalShown) {
          setShowVerificationModal(true);
          localStorage.setItem('verification_modal_shown', 'true');
        }
      }
    } catch (error) {
      console.error('Error checking properties:', error);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    
    try {
      setSubmitting(true);
      await createProperty(formData);
      
      // Check if this is the first property and show modal
      await checkIfFirstProperty();
      
      alert('Property added successfully!');
      navigate('/owner/properties');
    } catch (error) {
      console.error('Error creating property:', error);
      alert('Failed to create property. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyNow = () => {
    navigate('/owner/verification');
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="add-property-page">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/owner/dashboard')}
            className="mb-4"
            data-testid="back-to-dashboard-btn"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-slate-900 mb-2" data-testid="page-title">
            Add New Property
          </h1>
          <p className="text-slate-600">
            Fill in the details to list your property
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                    data-testid={`step-indicator-${step.id}`}
                  >
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-xs font-medium text-slate-900">{step.name}</p>
                    <p className="text-xs text-slate-500">{step.description}</p>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <PropertyForm
            formData={formData}
            errors={errors}
            currentStep={currentStep}
            onInputChange={handleInputChange}
            onNestedChange={handleNestedChange}
          />

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              data-testid="previous-step-btn"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            {currentStep < STEPS.length ? (
              <Button
                variant="primary"
                onClick={handleNext}
                data-testid="next-step-btn"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={submitting}
                data-testid="submit-property-btn"
              >
                {submitting ? 'Submitting...' : 'Submit Property'}
                <Check className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Verification Benefits Modal */}
      <VerificationBenefitsModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onVerifyNow={handleVerifyNow}
      />
    </div>
  );
};

export default AddProperty;
