import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { createProperty } from '../../services/propertyService';
import { getMyProperties } from '../../services/propertyService';
import PropertyForm from '../../components/property/PropertyForm';
import Button from '../../components/common/Button';
import VerificationBenefitsModal from '../../components/owner/VerificationBenefitsModal';
import { pageTransition } from '../../utils/motionConfig';

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
    <motion.div 
      className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200" 
      data-testid="add-property-page"
      {...pageTransition}
    >
      <div className="container-custom py-8">
        {/* Header with Animation */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/owner/dashboard')}
              className="mb-4"
              data-testid="back-to-dashboard-btn"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </motion.div>
          <motion.h1 
            className="text-3xl font-bold text-slate-900 dark:text-white mb-2" 
            data-testid="page-title"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            Add New Property
          </motion.h1>
          <motion.p 
            className="text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Fill in the details to list your property
          </motion.p>
        </motion.div>

        {/* Progress Steps with Animations */}
        <motion.div 
          className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <motion.div 
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                      currentStep > step.id
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                        : currentStep === step.id
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/50'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                    data-testid={`step-indicator-${step.id}`}
                    animate={currentStep === step.id ? {
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                        '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: currentStep === step.id ? Infinity : 0 }}
                  >
                    {currentStep > step.id ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <Check className="w-5 h-5" />
                      </motion.div>
                    ) : step.id}
                  </motion.div>
                  <div className="text-center mt-2">
                    <p className={`text-xs font-medium transition-colors ${
                      currentStep >= step.id ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {step.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{step.description}</p>
                  </div>
                </motion.div>
                {index < STEPS.length - 1 && (
                  <motion.div
                    className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: currentStep > step.id ? 1 : 0.3 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* Form Content with Step Transitions */}
        <motion.div 
          className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 transition-colors duration-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PropertyForm
                formData={formData}
                errors={errors}
                currentStep={currentStep}
                onInputChange={handleInputChange}
                onNestedChange={handleNestedChange}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons with Animations */}
          <motion.div 
            className="flex justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                data-testid="previous-step-btn"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            </motion.div>
            
            {currentStep < STEPS.length ? (
              <motion.div
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="primary"
                  onClick={handleNext}
                  data-testid="next-step-btn"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={submitting ? {} : {
                  boxShadow: [
                    '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    '0 10px 15px -3px rgba(59, 130, 246, 0.4)',
                    '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={submitting}
                  data-testid="submit-property-btn"
                >
                  {submitting ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Property
                      <Check className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Verification Benefits Modal */}
      <VerificationBenefitsModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onVerifyNow={handleVerifyNow}
      />
    </motion.div>
  );
};

export default AddProperty;
