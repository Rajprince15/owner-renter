import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Wind, Volume2, TrendingUp, Trees, Dog } from 'lucide-react';
import Button from '../common/Button';

const AdvancedFiltersPanel = ({ filters, onFiltersChange, onApply }) => {
  const { user } = useAuth();
  const isPremium = user?.subscription_tier === 'premium';

  // Local state for filters
  const [localFilters, setLocalFilters] = useState({
    max_aqi: filters?.max_aqi || 100,
    max_noise: filters?.max_noise || 70,
    min_walkability: filters?.min_walkability || 50,
    near_parks: filters?.near_parks || false,
    pet_friendly: filters?.pet_friendly || false,
    ...filters
  });

  useEffect(() => {
    setLocalFilters({
      max_aqi: filters?.max_aqi || 100,
      max_noise: filters?.max_noise || 70,
      min_walkability: filters?.min_walkability || 50,
      near_parks: filters?.near_parks || false,
      pet_friendly: filters?.pet_friendly || false,
      ...filters
    });
  }, [filters]);

  const handleSliderChange = (key, value) => {
    if (!isPremium) return;
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    onFiltersChange(updated);
  };

  const handleCheckboxChange = (key, checked) => {
    if (!isPremium) return;
    const updated = { ...localFilters, [key]: checked };
    setLocalFilters(updated);
    onFiltersChange(updated);
  };

  const handleReset = () => {
    if (!isPremium) return;
    const resetFilters = {
      max_aqi: 100,
      max_noise: 70,
      min_walkability: 50,
      near_parks: false,
      pet_friendly: false
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const getAQIColor = (value) => {
    if (value <= 50) return 'text-green-600';
    if (value <= 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getNoiseColor = (value) => {
    if (value <= 50) return 'text-green-600';
    if (value <= 65) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getWalkabilityColor = (value) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-blue-600';
    return 'text-yellow-600';
  };

  return (
    <div data-testid="advanced-filters-panel" className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Advanced Lifestyle Filters
        </h3>
        {!isPremium && (
          <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            <Lock className="w-3 h-3" />
            Premium Only
          </span>
        )}
      </div>

      {/* Lock Overlay for Free Users */}
      <div className={`relative ${!isPremium ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* AQI Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Wind className="w-4 h-4" />
              Air Quality Index (AQI)
            </label>
            <span className={`text-sm font-semibold ${getAQIColor(localFilters.max_aqi)}`}>
              Max: {localFilters.max_aqi}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            step="10"
            value={localFilters.max_aqi}
            onChange={(e) => handleSliderChange('max_aqi', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            data-testid="aqi-slider"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0 (Best)</span>
            <span>100 (Moderate)</span>
            <span>200 (Poor)</span>
          </div>
        </div>

        {/* Noise Level Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Noise Level (dB)
            </label>
            <span className={`text-sm font-semibold ${getNoiseColor(localFilters.max_noise)}`}>
              Max: {localFilters.max_noise}dB
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={localFilters.max_noise}
            onChange={(e) => handleSliderChange('max_noise', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            data-testid="noise-slider"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0 (Silent)</span>
            <span>50 (Quiet)</span>
            <span>100 (Loud)</span>
          </div>
        </div>

        {/* Walkability Filter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Walkability Score
            </label>
            <span className={`text-sm font-semibold ${getWalkabilityColor(localFilters.min_walkability)}`}>
              Min: {localFilters.min_walkability}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={localFilters.min_walkability}
            onChange={(e) => handleSliderChange('min_walkability', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            data-testid="walkability-slider"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0 (Poor)</span>
            <span>50 (Average)</span>
            <span>100 (Excellent)</span>
          </div>
        </div>

        {/* Checkbox Filters */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.near_parks}
              onChange={(e) => handleCheckboxChange('near_parks', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              data-testid="near-parks-checkbox"
            />
            <Trees className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-700">Near parks (within 2km)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.pet_friendly}
              onChange={(e) => handleCheckboxChange('pet_friendly', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              data-testid="pet-friendly-checkbox"
            />
            <Dog className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-gray-700">Pet friendly</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1"
            data-testid="reset-filters-btn"
          >
            Reset
          </Button>
          <Button
            onClick={() => onApply(localFilters)}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            data-testid="apply-filters-btn"
          >
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Upgrade Prompt for Free Users */}
      {!isPremium && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
          <div className="text-center p-6 max-w-sm">
            <Lock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Premium Feature</h4>
            <p className="text-sm text-gray-600 mb-4">
              Upgrade to Premium to access advanced lifestyle filters and find your perfect home based on air quality, noise levels, and walkability.
            </p>
            <Button
              onClick={() => window.location.href = '/renter/subscription'}
              className="bg-blue-600 hover:bg-blue-700"
              data-testid="upgrade-to-premium-btn"
            >
              Upgrade to Premium
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFiltersPanel;
