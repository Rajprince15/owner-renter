import React from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const VerificationStatusTracker = ({ status, rejectionReason, submittedAt, reviewedAt }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'verified':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-500',
          title: 'Verified',
          message: 'Your verification has been approved! You can now enjoy all premium benefits.',
          showEstimate: false
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          borderColor: 'border-yellow-500',
          title: 'Under Review',
          message: 'Our team is reviewing your documents. This usually takes 24-48 hours.',
          showEstimate: true
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-500',
          title: 'Rejected',
          message: rejectionReason || 'Your verification request was rejected. Please resubmit with correct documents.',
          showEstimate: false
        };
      case 'none':
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-300',
          title: 'Not Submitted',
          message: 'You haven\'t submitted verification documents yet.',
          showEstimate: false
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const steps = [
    {
      title: 'Documents Submitted',
      completed: status !== 'none',
      active: status === 'none'
    },
    {
      title: 'Under Review',
      completed: status === 'verified' || status === 'rejected',
      active: status === 'pending'
    },
    {
      title: status === 'rejected' ? 'Rejected' : 'Verified',
      completed: status === 'verified',
      active: false,
      failed: status === 'rejected'
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedTime = () => {
    if (!submittedAt) return null;
    const submitted = new Date(submittedAt);
    const estimated = new Date(submitted.getTime() + 48 * 60 * 60 * 1000); // Add 48 hours
    return formatDate(estimated);
  };

  return (
    <div className="w-full" data-testid="verification-status-tracker">
      {/* Status Card */}
      <motion.div 
        className={`border-2 ${config.borderColor} rounded-lg p-6 ${config.bgColor} mb-6`}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <div className="flex items-start space-x-4">
          <motion.div 
            className={`p-3 rounded-full ${config.bgColor}`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <motion.div
              animate={
                status === 'pending'
                  ? { rotate: 360 }
                  : status === 'rejected'
                  ? { rotate: [0, -10, 10, -10, 10, 0] }
                  : {}
              }
              transition={
                status === 'pending'
                  ? { duration: 2, repeat: Infinity, ease: "linear" }
                  : status === 'rejected'
                  ? { duration: 0.5, delay: 0.5 }
                  : {}
              }
            >
              <Icon className={`w-8 h-8 ${config.color}`} />
            </motion.div>
          </motion.div>
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className={`text-xl font-bold ${config.color} mb-2`} data-testid="status-title">
              {config.title}
            </h3>
            <p className="text-gray-700 mb-4" data-testid="status-message">
              {config.message}
            </p>

            {/* Timeline Info */}
            <motion.div 
              className="space-y-2 text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {submittedAt && (
                <p>
                  <span className="font-medium">Submitted:</span> {formatDate(submittedAt)}
                </p>
              )}
              {reviewedAt && (
                <p>
                  <span className="font-medium">Reviewed:</span> {formatDate(reviewedAt)}
                </p>
              )}
              {config.showEstimate && (
                <p>
                  <span className="font-medium">Estimated completion:</span> {getEstimatedTime()}
                </p>
              )}
            </motion.div>

            {/* Rejection Reason */}
            {status === 'rejected' && rejectionReason && (
              <motion.div 
                className="mt-4 p-4 bg-white border border-red-200 rounded-lg" 
                data-testid="rejection-reason"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: 0.6 }}
              >
                <p className="font-medium text-red-900 mb-1">Rejection Reason:</p>
                <p className="text-red-700">{rejectionReason}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Progress Steps */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="relative flex items-center" 
              data-testid={`progress-step-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <motion.div
                className={`
                  relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2
                  ${step.completed ? 'bg-green-500 border-green-500' : ''}
                  ${step.active ? 'bg-yellow-500 border-yellow-500' : ''}
                  ${step.failed ? 'bg-red-500 border-red-500' : ''}
                  ${!step.completed && !step.active && !step.failed ? 'bg-white border-gray-300' : ''}
                `}
                animate={
                  step.active
                    ? {
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          '0 0 0 0 rgba(234, 179, 8, 0.4)',
                          '0 0 0 10px rgba(234, 179, 8, 0)',
                          '0 0 0 0 rgba(234, 179, 8, 0)'
                        ]
                      }
                    : {}
                }
                transition={
                  step.active
                    ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.3 }
                }
              >
                {step.completed && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle className="w-6 h-6 text-white" />
                  </motion.div>
                )}
                {step.active && <Clock className="w-6 h-6 text-white" />}
                {step.failed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <XCircle className="w-6 h-6 text-white" />
                  </motion.div>
                )}
                {!step.completed && !step.active && !step.failed && (
                  <span className="text-gray-400 font-medium">{index + 1}</span>
                )}
              </motion.div>

              <div className="ml-4">
                <p
                  className={`
                    font-medium
                    ${step.completed ? 'text-green-700' : ''}
                    ${step.active ? 'text-yellow-700' : ''}
                    ${step.failed ? 'text-red-700' : ''}
                    ${!step.completed && !step.active && !step.failed ? 'text-gray-500' : ''}
                  `}
                >
                  {step.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VerificationStatusTracker;