import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const VerifiedBadge = ({ isVerified, size = 'medium', showText = true, className = '' }) => {
  const sizeClasses = {
    small: 'text-xs px-2 py-0.5',
    medium: 'text-sm px-3 py-1',
    large: 'text-base px-4 py-2'
  };

  const iconSizes = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
  };

  if (isVerified) {
    return (
      <span 
        data-testid="verified-badge"
        className={`inline-flex items-center gap-1 bg-green-100 text-green-700 font-semibold rounded-full ${sizeClasses[size]} ${className}`}
      >
        <CheckCircle className={`${iconSizes[size]} fill-green-500 text-white`} />
        {showText && 'Verified'}
      </span>
    );
  }

  return (
    <span 
      data-testid="unverified-badge"
      className={`inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 font-semibold rounded-full ${sizeClasses[size]} ${className}`}
    >
      <AlertCircle className={`${iconSizes[size]}`} />
      {showText && 'Not Verified'}
    </span>
  );
};

export default VerifiedBadge;
