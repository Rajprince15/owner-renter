import React from 'react';
import { BadgeCheck } from 'lucide-react';

const VerifiedBadge = ({ size = 'md', showText = true, className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`inline-flex items-center space-x-1 ${className}`}>
      <BadgeCheck className={`${sizes[size]} text-green-600 dark:text-green-400`} />
      {showText && (
        <span className={`${textSizes[size]} font-medium text-green-700 dark:text-green-400`}>
          Verified
        </span>
      )}
    </div>
  );
};

export default VerifiedBadge;
