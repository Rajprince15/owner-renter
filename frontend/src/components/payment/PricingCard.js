import React from 'react';
import { Check, Star } from 'lucide-react';
import Button from '../common/Button';

const PricingCard = ({ 
  title, 
  price, 
  duration, 
  features, 
  isPopular, 
  isCurrent,
  onUpgrade,
  buttonText = 'Upgrade Now',
  disabled = false
}) => {
  return (
    <div 
      className={`relative bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 ${
        isPopular ? 'border-2 border-blue-500' : 'border border-gray-200'
      }`}
      data-testid={`pricing-card-${title.toLowerCase()}`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-xs font-semibold rounded-bl-lg">
          <Star className="w-3 h-3 inline mr-1" />
          RECOMMENDED
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrent && (
        <div className="absolute top-0 left-0 bg-green-500 text-white px-4 py-1 text-xs font-semibold rounded-br-lg">
          CURRENT PLAN
        </div>
      )}

      <div className="p-6">
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-gray-900">₹{price}</span>
            {duration && (
              <span className="ml-2 text-gray-600">/ {duration}</span>
            )}
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${
                isPopular ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <span className={`text-sm ${
                isPopular ? 'text-gray-700 font-medium' : 'text-gray-600'
              }`}>
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* Action Button */}
        <Button
          onClick={onUpgrade}
          disabled={disabled || isCurrent}
          className={`w-full ${
            isPopular 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
          }`}
          data-testid={`upgrade-button-${title.toLowerCase()}`}
        >
          {isCurrent ? 'Current Plan' : buttonText}
        </Button>
      </div>
    </div>
  );
};

export default PricingCard;
