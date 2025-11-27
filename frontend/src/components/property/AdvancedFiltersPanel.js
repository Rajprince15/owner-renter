import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Lock, Wind, Volume2, TrendingUp, Trees, Dog, X, Save } from 'lucide-react';
import Button from '../common/Button';

const AdvancedFiltersPanel = ({ filters, onFiltersChange, onApply, onClose }) => {
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

  const [showSaveAnimation, setShowSaveAnimation] = useState(false);

  useEffect(() => {
    // Only update if filters actually changed
    const newFilters = {
      max_aqi: filters?.max_aqi || 100,
      max_noise: filters?.max_noise || 70,
      min_walkability: filters?.min_walkability || 50,
      near_parks: filters?.near_parks || false,
      pet_friendly: filters?.pet_friendly || false,
      ...filters
    };
    
    // Check if there are actual changes before updating state
    if (JSON.stringify(newFilters) !== JSON.stringify(localFilters)) {
      setLocalFilters(newFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleSave = () => {
    setShowSaveAnimation(true);
    setTimeout(() => setShowSaveAnimation(false), 2000);
    // Add save logic here
  };

  const getAQIColor = (value) => {
    if (value <= 50) return 'text-green-600 dark:text-green-400';
    if (value <= 100) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getNoiseColor = (value) => {
    if (value <= 50) return 'text-green-600 dark:text-green-400';
    if (value <= 65) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getWalkabilityColor = (value) => {
    if (value >= 80) return 'text-green-600 dark:text-green-400';
    if (value >= 60) return 'text-blue-600 dark:text-blue-400';
    return 'text-yellow-600 dark:text-yellow-400';
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Panel sliding from right */}
        <motion.div
          data-testid="advanced-filters-panel"
          className="relative h-full w-full max-w-md bg-white dark:bg-slate-800 shadow-2xl overflow-y-auto"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          {/* Header */}
          <motion.div
            className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 z-10"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </motion.div>
                Advanced Lifestyle Filters
              </h3>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </motion.button>
            </div>
            {!isPremium && (
              <motion.span
                className="inline-flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.4 }}
              >
                <Lock className="w-3 h-3" />
                Premium Feature
              </motion.span>
            )}
          </motion.div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div className={`relative ${!isPremium ? 'opacity-50 pointer-events-none' : ''}`}>
              {/* AQI Filter */}
              <motion.div
                className="space-y-3"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Wind className="w-5 h-5 text-blue-500" />
                    </motion.div>
                    Air Quality Index
                  </label>
                  <motion.span
                    className={`text-lg font-bold ${getAQIColor(localFilters.max_aqi)}`}
                    key={localFilters.max_aqi}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    {localFilters.max_aqi}
                  </motion.span>
                </div>
                <motion.input
                  type="range"
                  min="0"
                  max="200"
                  step="10"
                  value={localFilters.max_aqi}
                  onChange={(e) => handleSliderChange('max_aqi', parseInt(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-lg appearance-none cursor-pointer slider-thumb"
                  data-testid="aqi-slider"
                  whileFocus={{ scale: 1.05 }}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>0 (Best)</span>
                  <span>100</span>
                  <span>200 (Poor)</span>
                </div>
              </motion.div>

              {/* Noise Level Filter */}
              <motion.div
                className="space-y-3 mt-6"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Volume2 className="w-5 h-5 text-orange-500" />
                    </motion.div>
                    Noise Level
                  </label>
                  <motion.span
                    className={`text-lg font-bold ${getNoiseColor(localFilters.max_noise)}`}
                    key={localFilters.max_noise}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    {localFilters.max_noise}dB
                  </motion.span>
                </div>
                <motion.input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={localFilters.max_noise}
                  onChange={(e) => handleSliderChange('max_noise', parseInt(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-lg appearance-none cursor-pointer slider-thumb"
                  data-testid="noise-slider"
                  whileFocus={{ scale: 1.05 }}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>0 (Silent)</span>
                  <span>50</span>
                  <span>100 (Loud)</span>
                </div>
              </motion.div>

              {/* Walkability Filter */}
              <motion.div
                className="space-y-3 mt-6"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <motion.div
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </motion.div>
                    Walkability Score
                  </label>
                  <motion.span
                    className={`text-lg font-bold ${getWalkabilityColor(localFilters.min_walkability)}`}
                    key={localFilters.min_walkability}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    {localFilters.min_walkability}
                  </motion.span>
                </div>
                <motion.input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={localFilters.min_walkability}
                  onChange={(e) => handleSliderChange('min_walkability', parseInt(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-red-400 via-yellow-400 to-green-500 rounded-lg appearance-none cursor-pointer slider-thumb"
                  data-testid="walkability-slider"
                  whileFocus={{ scale: 1.05 }}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>0 (Poor)</span>
                  <span>50</span>
                  <span>100 (Best)</span>
                </div>
              </motion.div>

              {/* Checkbox Filters */}
              <motion.div
                className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.label
                  className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.input
                    type="checkbox"
                    checked={localFilters.near_parks}
                    onChange={(e) => handleCheckboxChange('near_parks', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    data-testid="near-parks-checkbox"
                    whileHover={{ scale: 1.1 }}
                  />
                  <Trees className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Near parks (within 2km)</span>
                </motion.label>

                <motion.label
                  className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.input
                    type="checkbox"
                    checked={localFilters.pet_friendly}
                    onChange={(e) => handleCheckboxChange('pet_friendly', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    data-testid="pet-friendly-checkbox"
                    whileHover={{ scale: 1.1 }}
                  />
                  <Dog className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pet friendly</span>
                </motion.label>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="flex gap-3 pt-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full"
                    data-testid="reset-filters-btn"
                  >
                    Reset
                  </Button>
                </motion.div>
                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleSave}
                    variant="outline"
                    className="w-full"
                    data-testid="save-search-btn"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </motion.div>
                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => onApply(localFilters)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    data-testid="apply-filters-btn"
                  >
                    Apply
                  </Button>
                </motion.div>
              </motion.div>

              {/* Save Animation */}
              <AnimatePresence>
                {showSaveAnimation && (
                  <motion.div
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                  >
                    <span className="text-sm font-semibold">✓ Search Saved!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Upgrade Prompt for Free Users */}
            {!isPremium && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="text-center p-8 max-w-sm"
                  initial={{ scale: 0.8, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", delay: 0.6 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Lock className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                  </motion.div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Premium Feature</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                    Upgrade to Premium to access advanced lifestyle filters and find your perfect home based on air quality, noise levels, and walkability.
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => window.location.href = '/renter/subscription'}
                      className="bg-blue-600 hover:bg-blue-700 w-full"
                      data-testid="upgrade-to-premium-btn"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdvancedFiltersPanel;