import React from 'react';
import { CheckCircle, Circle, FileText, Briefcase, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const VerificationSteps = ({ currentStep, documents }) => {
  const uploadedCount = Object.values(documents).filter(doc => doc !== null).length;
  const totalRequired = Object.keys(documents).length;
  const documentsComplete = uploadedCount === totalRequired;

  const steps = [
    {
      id: 1,
      title: 'Upload Documents',
      description: 'ID proof & income proof',
      icon: FileText,
      completed: documentsComplete,
      active: currentStep === 1
    },
    {
      id: 2,
      title: 'Employment Details',
      description: 'Company & income information',
      icon: Briefcase,
      completed: currentStep > 2,
      active: currentStep === 2
    },
    {
      id: 3,
      title: 'Review & Submit',
      description: 'Finalize verification',
      icon: Send,
      completed: currentStep > 3,
      active: currentStep === 3
    }
  ];

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm p-6 mb-6" 
      data-testid="verification-steps"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-lg font-semibold text-gray-900 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        Verification Progress
      </motion.h2>
      
      <div className="relative">
        {/* Progress Line Background */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200" style={{ zIndex: 0 }} />
        
        {/* Animated Progress Line */}
        <motion.div 
          className="absolute top-5 left-0 h-0.5 bg-indigo-600"
          style={{ zIndex: 0 }}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Steps */}
        <div className="relative flex justify-between" style={{ zIndex: 1 }}>
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = step.completed;
            const isActive = step.active;
            
            return (
              <motion.div 
                key={step.id} 
                className="flex flex-col items-center" 
                style={{ flex: 1 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {/* Step Circle */}
                <motion.div 
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                    ${
                      isCompleted 
                        ? 'bg-green-500 border-green-500' 
                        : isActive 
                        ? 'bg-indigo-600 border-indigo-600' 
                        : 'bg-white border-gray-300'
                    }
                  `}
                  style={{ zIndex: 2 }}
                  animate={
                    isActive 
                      ? { scale: [1, 1.1, 1], boxShadow: [
                          '0 0 0 0 rgba(99, 102, 241, 0.4)',
                          '0 0 0 10px rgba(99, 102, 241, 0)',
                          '0 0 0 0 rgba(99, 102, 241, 0)'
                        ]}
                      : isCompleted
                      ? { scale: 1 }
                      : { scale: 1 }
                  }
                  transition={
                    isActive 
                      ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 0.3 }
                  }
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle className="w-6 h-6 text-white" />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={isActive ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      <Icon 
                        className={`w-5 h-5 ${
                          isActive ? 'text-white' : 'text-gray-400'
                        }`} 
                      />
                    </motion.div>
                  )}
                </motion.div>

                {/* Step Info */}
                <div className="mt-3 text-center max-w-[120px]">
                  <p 
                    className={`text-sm font-medium ${
                      isCompleted || isActive ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Current Step Info */}
      <motion.div 
        className="mt-6 pt-4 border-t border-gray-200"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {currentStep === 1 && (
          <motion.div 
            className="text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-700 font-medium">📤 Upload your documents</p>
            <p className="text-gray-500 text-xs mt-1">
              Documents are uploaded immediately and stored securely on our server
            </p>
          </motion.div>
        )}
        {currentStep === 2 && documentsComplete && (
          <motion.div 
            className="text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-700 font-medium">✍️ Fill in your employment details</p>
            <p className="text-gray-500 text-xs mt-1">
              Your documents are already uploaded. Just complete this form to continue.
            </p>
          </motion.div>
        )}
        {currentStep === 2 && !documentsComplete && (
          <motion.div 
            className="text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-700 font-medium">⏳ Complete document upload first</p>
            <p className="text-gray-500 text-xs mt-1">
              Upload all required documents before proceeding to employment details
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default VerificationSteps;