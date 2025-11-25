import React from 'react';
import { Crown } from 'lucide-react';

const PremiumBadge = ({ size = 'md', showText = true, className = '' }) => {
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
      <Crown className={`${sizes[size]} text-yellow-600 dark:text-yellow-400`} />
      {showText && (
        <span className={`${textSizes[size]} font-medium text-yellow-700 dark:text-yellow-400`}>
          Premium
        </span>
      )}
    </div>
  );
};

export default PremiumBadge;
