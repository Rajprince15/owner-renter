import React from 'react';
import { Check, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <motion.div 
      className={`relative bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
        isPopular ? 'border-2 border-blue-500' : 'border border-gray-200'
      }`}
      data-testid={`pricing-card-${title.toLowerCase()}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        boxShadow: isPopular 
          ? '0 20px 40px rgba(59, 130, 246, 0.3)'
          : '0 20px 40px rgba(0, 0, 0, 0.1)'
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Popular Badge */}
      {isPopular && (
        <motion.div 
          className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-1 text-xs font-semibold rounded-bl-lg"
          initial={{ x: 100, y: -100 }}
          animate={{ x: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        >
          <motion.div 
            className="flex items-center"
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Star className="w-3 h-3 inline mr-1" />
            RECOMMENDED
          </motion.div>
        </motion.div>
      )}

      {/* Current Plan Badge */}
      {isCurrent && (
        <motion.div 
          className="absolute top-0 left-0 bg-green-500 text-white px-4 py-1 text-xs font-semibold rounded-br-lg"
          initial={{ x: -100, y: -100 }}
          animate={{ x: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        >
          CURRENT PLAN
        </motion.div>
      )}

      <div className="p-6">
        {/* Title */}
        <motion.h3 
          className="text-2xl font-bold text-gray-900 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {title}
        </motion.h3>

        {/* Price */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-baseline">
            <motion.span 
              className="text-4xl font-bold text-gray-900"
              animate={isPopular ? { 
                scale: [1, 1.05, 1],
                color: ['#111827', '#2563EB', '#111827']
              } : {}}
              transition={isPopular ? { duration: 3, repeat: Infinity } : {}}
            >
              ₹{price}
            </motion.span>
            {duration && (
              <span className="ml-2 text-gray-600">/ {duration}</span>
            )}
          </div>
        </motion.div>

        {/* Features */}
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <motion.li 
              key={index} 
              className="flex items-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                <Check className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${
                  isPopular ? 'text-blue-600' : 'text-gray-400'
                }`} />
              </motion.div>
              <span className={`text-sm ${
                isPopular ? 'text-gray-700 font-medium' : 'text-gray-600'
              }`}>
                {feature}
              </span>
            </motion.li>
          ))}
        </ul>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            onClick={onUpgrade}
            disabled={disabled || isCurrent}
            className={`w-full relative overflow-hidden ${
              isPopular 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
            }`}
            data-testid={`upgrade-button-${title.toLowerCase()}`}
          >
            {isPopular && !isCurrent && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center">
              {isPopular && !isCurrent && <Zap className="w-4 h-4 mr-2" />}
              {isCurrent ? 'Current Plan' : buttonText}
            </span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PricingCard;