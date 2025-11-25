import React from 'react';
import { CheckCircle, Circle, FileText, Briefcase, Send } from 'lucide-react';

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

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6" data-testid="verification-steps">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Verification Progress</h2>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200" style={{ zIndex: 0 }}>
          <div 
            className="h-full bg-indigo-600 transition-all duration-500"
            style={{ 
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              zIndex: 0
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between" style={{ zIndex: 1 }}>
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = step.completed;
            const isActive = step.active;
            
            return (
              <div key={step.id} className="flex flex-col items-center" style={{ flex: 1 }}>
                {/* Step Circle */}
                <div 
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
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <Icon 
                      className={`w-5 h-5 ${
                        isActive ? 'text-white' : 'text-gray-400'
                      }`} 
                    />
                  )}
                </div>

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
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        {currentStep === 1 && (
          <div className="text-sm">
            <p className="text-gray-700 font-medium">📤 Upload your documents</p>
            <p className="text-gray-500 text-xs mt-1">
              Documents are uploaded immediately and stored securely on our server
            </p>
          </div>
        )}
        {currentStep === 2 && documentsComplete && (
          <div className="text-sm">
            <p className="text-gray-700 font-medium">✍️ Fill in your employment details</p>
            <p className="text-gray-500 text-xs mt-1">
              Your documents are already uploaded. Just complete this form to continue.
            </p>
          </div>
        )}
        {currentStep === 2 && !documentsComplete && (
          <div className="text-sm">
            <p className="text-gray-700 font-medium">⏳ Complete document upload first</p>
            <p className="text-gray-500 text-xs mt-1">
              Upload all required documents before proceeding to employment details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationSteps;
