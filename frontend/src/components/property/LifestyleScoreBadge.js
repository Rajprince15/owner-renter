import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Volume2, TrendingUp, Trees, Info } from 'lucide-react';

const LifestyleScoreBadge = ({ type, value, size = 'medium', showLabel = true }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Good', ring: 'ring-green-400' };
    if (aqi <= 100) return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'Moderate', ring: 'ring-yellow-400' };
    if (aqi <= 150) return { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', label: 'Unhealthy for Sensitive', ring: 'ring-orange-400' };
    return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Unhealthy', ring: 'ring-red-400' };
  };

  const getNoiseColor = (noise) => {
    if (noise <= 50) return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Quiet', ring: 'ring-green-400' };
    if (noise <= 65) return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'Moderate', ring: 'ring-yellow-400' };
    return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Loud', ring: 'ring-red-400' };
  };

  const getWalkabilityColor = (score) => {
    if (score >= 80) return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Excellent', ring: 'ring-green-400' };
    if (score >= 60) return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'Good', ring: 'ring-blue-400' };
    if (score >= 40) return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'Fair', ring: 'ring-yellow-400' };
    return { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', label: 'Limited', ring: 'ring-orange-400' };
  };

  const getConfig = () => {
    switch (type) {
      case 'aqi':
        const aqiColors = getAQIColor(value);
        return {
          icon: Wind,
          label: 'AQI',
          value: value,
          ...aqiColors,
          tooltip: `Air Quality Index: ${value} - ${aqiColors.label}. Lower is better.`,
          animateIcon: { rotate: [0, 360] },
          animationDuration: 3
        };
      case 'noise':
        const noiseColors = getNoiseColor(value);
        return {
          icon: Volume2,
          label: 'Noise',
          value: `${value}dB`,
          ...noiseColors,
          tooltip: `Noise Level: ${value}dB - ${noiseColors.label}. Lower is better.`,
          animateIcon: { scale: [1, 1.2, 1] },
          animationDuration: 1.5
        };
      case 'walkability':
        const walkColors = getWalkabilityColor(value);
        return {
          icon: TrendingUp,
          label: 'Walkability',
          value: value,
          ...walkColors,
          tooltip: `Walkability Score: ${value}/100 - ${walkColors.label}. Higher is better.`,
          animateIcon: { y: [-2, 2, -2] },
          animationDuration: 2
        };
      case 'parks':
        return {
          icon: Trees,
          label: 'Near Parks',
          value: value,
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-700 dark:text-green-400',
          ring: 'ring-green-400',
          tooltip: `${value} park(s) nearby within 2km radius.`,
          animateIcon: { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] },
          animationDuration: 2.5
        };
      default:
        return null;
    }
  };

  const config = getConfig();
  if (!config) return null;

  const Icon = config.icon;

  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    medium: 'text-sm px-3 py-1.5',
    large: 'text-base px-4 py-2'
  };

  return (
    <div 
      data-testid={`lifestyle-badge-${type}`}
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <motion.span
        className={`inline-flex items-center gap-1.5 ${config.bg} ${config.text} font-medium rounded-lg ${sizeClasses[size]} shadow-sm border border-current/20 transition-colors duration-200`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Animated Icon */}
        <motion.div
          animate={config.animateIcon}
          transition={{
            duration: config.animationDuration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Icon className="w-4 h-4" />
        </motion.div>
        
        {showLabel && <span className="text-xs">{config.label}:</span>}
        
        {/* Animated Value */}
        <motion.span
          className="font-bold"
          key={config.value}
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
        >
          {config.value}
        </motion.span>
      </motion.span>
      
      {/* Tooltip with Animation */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg shadow-2xl whitespace-nowrap border border-gray-700"
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex items-start gap-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              </motion.div>
              <span>{config.tooltip}</span>
            </div>
            
            {/* Tooltip Arrow */}
            <motion.div
              className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            />
            
            {/* Pulsing Ring Effect */}
            <motion.div
              className={`absolute inset-0 rounded-lg ring-2 ${config.ring} opacity-50`}
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LifestyleScoreBadge;