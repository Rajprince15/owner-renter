import React from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

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
      <div className={`border-2 ${config.borderColor} rounded-lg p-6 ${config.bgColor} mb-6`}>
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-full ${config.bgColor}`}>
            <Icon className={`w-8 h-8 ${config.color}`} />
          </div>
          <div className="flex-1">
            <h3 className={`text-xl font-bold ${config.color} mb-2`} data-testid="status-title">
              {config.title}
            </h3>
            <p className="text-gray-700 mb-4" data-testid="status-message">
              {config.message}
            </p>

            {/* Timeline Info */}
            <div className="space-y-2 text-sm text-gray-600">
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
            </div>

            {/* Rejection Reason */}
            {status === 'rejected' && rejectionReason && (
              <div className="mt-4 p-4 bg-white border border-red-200 rounded-lg" data-testid="rejection-reason">
                <p className="font-medium text-red-900 mb-1">Rejection Reason:</p>
                <p className="text-red-700">{rejectionReason}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="relative flex items-center" data-testid={`progress-step-${index}`}>
              <div
                className={`
                  relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2
                  ${step.completed ? 'bg-green-500 border-green-500' : ''}
                  ${step.active ? 'bg-yellow-500 border-yellow-500' : ''}
                  ${step.failed ? 'bg-red-500 border-red-500' : ''}
                  ${!step.completed && !step.active && !step.failed ? 'bg-white border-gray-300' : ''}
                `}
              >
                {step.completed && <CheckCircle className="w-6 h-6 text-white" />}
                {step.active && <Clock className="w-6 h-6 text-white" />}
                {step.failed && <XCircle className="w-6 h-6 text-white" />}
                {!step.completed && !step.active && !step.failed && (
                  <span className="text-gray-400 font-medium">{index + 1}</span>
                )}
              </div>

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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VerificationStatusTracker;
