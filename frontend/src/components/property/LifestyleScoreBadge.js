import React, { useState } from 'react';
import { Wind, Volume2, TrendingUp, Trees, Info } from 'lucide-react';

const LifestyleScoreBadge = ({ type, value, size = 'medium', showLabel = true }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return { bg: 'bg-green-100', text: 'text-green-700', label: 'Good' };
    if (aqi <= 100) return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Moderate' };
    if (aqi <= 150) return { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Unhealthy for Sensitive' };
    return { bg: 'bg-red-100', text: 'text-red-700', label: 'Unhealthy' };
  };

  const getNoiseColor = (noise) => {
    if (noise <= 50) return { bg: 'bg-green-100', text: 'text-green-700', label: 'Quiet' };
    if (noise <= 65) return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Moderate' };
    return { bg: 'bg-red-100', text: 'text-red-700', label: 'Loud' };
  };

  const getWalkabilityColor = (score) => {
    if (score >= 80) return { bg: 'bg-green-100', text: 'text-green-700', label: 'Excellent' };
    if (score >= 60) return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Good' };
    if (score >= 40) return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Fair' };
    return { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Limited' };
  };

  const getConfig = () => {
    switch (type) {
      case 'aqi':
        const aqiColors = getAQIColor(value);
        return {
          icon: <Wind className="w-4 h-4" />,
          label: 'AQI',
          value: value,
          ...aqiColors,
          tooltip: `Air Quality Index: ${value} - ${aqiColors.label}. Lower is better.`
        };
      case 'noise':
        const noiseColors = getNoiseColor(value);
        return {
          icon: <Volume2 className="w-4 h-4" />,
          label: 'Noise',
          value: `${value}dB`,
          ...noiseColors,
          tooltip: `Noise Level: ${value}dB - ${noiseColors.label}. Lower is better.`
        };
      case 'walkability':
        const walkColors = getWalkabilityColor(value);
        return {
          icon: <TrendingUp className="w-4 h-4" />,
          label: 'Walkability',
          value: value,
          ...walkColors,
          tooltip: `Walkability Score: ${value}/100 - ${walkColors.label}. Higher is better.`
        };
      case 'parks':
        return {
          icon: <Trees className="w-4 h-4" />,
          label: 'Near Parks',
          value: value,
          bg: 'bg-green-100',
          text: 'text-green-700',
          tooltip: `${value} park(s) nearby within 2km radius.`
        };
      default:
        return null;
    }
  };

  const config = getConfig();
  if (!config) return null;

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
      <span className={`inline-flex items-center gap-1.5 ${config.bg} ${config.text} font-medium rounded-lg ${sizeClasses[size]}`}>
        {config.icon}
        {showLabel && <span className="text-xs">{config.label}:</span>}
        <span className="font-semibold">{config.value}</span>
      </span>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap">
          <Info className="w-3 h-3 inline mr-1" />
          {config.tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default LifestyleScoreBadge;
