import React from 'react';
import { Star } from 'lucide-react';

const PremiumBadge = ({ size = 'medium', showText = true, className = '' }) => {
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

  return (
    <span 
      data-testid="premium-badge"
      className={`inline-flex items-center gap-1 bg-blue-100 text-blue-700 font-semibold rounded-full ${sizeClasses[size]} ${className}`}
    >
      <Star className={`${iconSizes[size]} fill-blue-500 text-blue-500`} />
      {showText && 'Premium'}
    </span>
  );
};

export default PremiumBadge;
