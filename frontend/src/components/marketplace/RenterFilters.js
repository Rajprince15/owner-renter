import React, { useState } from 'react';
import { X, Sliders } from 'lucide-react';
import { motion } from 'framer-motion';

const RenterFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleBudgetMinChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    const updated = { ...localFilters, budget_min: value };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const handleBudgetMaxChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    const updated = { ...localFilters, budget_max: value };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const handleBHKToggle = (bhk) => {
    const currentBHKs = localFilters.bhk_type || [];
    let updated;
    
    if (currentBHKs.includes(bhk)) {
      updated = { 
        ...localFilters, 
        bhk_type: currentBHKs.filter(b => b !== bhk) 
      };
    } else {
      updated = { 
        ...localFilters, 
        bhk_type: [...currentBHKs, bhk] 
      };
    }
    
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const handleLocationChange = (e) => {
    const updated = { ...localFilters, location: e.target.value };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const handleEmploymentTypeChange = (e) => {
    const updated = { ...localFilters, employment_type: e.target.value || undefined };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const handleClearAll = () => {
    const emptyFilters = {
      budget_min: 0,
      budget_max: 0,
      bhk_type: [],
      location: '',
      employment_type: '',
      move_in_after: '',
      move_in_before: ''
    };
    setLocalFilters(emptyFilters);
    onClearFilters();
  };

  const bhkTypes = ['1BHK', '2BHK', '3BHK', '4BHK+'];
  const employmentTypes = [
    { value: '', label: 'All' },
    { value: 'salaried', label: 'Salaried' },
    { value: 'self_employed', label: 'Self Employed' },
    { value: 'business', label: 'Business' },
    { value: 'freelancer', label: 'Freelancer' }
  ];

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-6" 
      data-testid="renter-filters"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center">
          <Sliders className="w-5 h-5 text-gray-700 mr-2" />
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        </div>
        <motion.button
          onClick={handleClearAll}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
          data-testid="clear-filters-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <X className="w-4 h-4 mr-1" />
          Clear All
        </motion.button>
      </motion.div>

      {/* Budget Range */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Budget Range (Monthly)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Min</label>
            <motion.input
              type="number"
              value={localFilters.budget_min || ''}
              onChange={handleBudgetMinChange}
              placeholder="10000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              data-testid="budget-min-input"
              whileFocus={{ scale: 1.02 }}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Max</label>
            <motion.input
              type="number"
              value={localFilters.budget_max || ''}
              onChange={handleBudgetMaxChange}
              placeholder="50000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              data-testid="budget-max-input"
              whileFocus={{ scale: 1.02 }}
            />
          </div>
        </div>
      </motion.div>

      {/* BHK Type */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label className="block text-sm font-medium text-gray-700 mb-3">
          BHK Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {bhkTypes.map((bhk, index) => (
            <motion.button
              key={bhk}
              onClick={() => handleBHKToggle(bhk)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                (localFilters.bhk_type || []).includes(bhk)
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              data-testid={`bhk-filter-${bhk}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {bhk}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Location */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Location
        </label>
        <motion.input
          type="text"
          value={localFilters.location || ''}
          onChange={handleLocationChange}
          placeholder="e.g., Koramangala, HSR Layout"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          data-testid="location-filter-input"
          whileFocus={{ scale: 1.02 }}
        />
      </motion.div>

      {/* Employment Type */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Employment Type
        </label>
        <motion.select
          value={localFilters.employment_type || ''}
          onChange={handleEmploymentTypeChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          data-testid="employment-type-filter"
          whileFocus={{ scale: 1.02 }}
        >
          {employmentTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </motion.select>
      </motion.div>

      {/* Info Box */}
      <motion.div 
        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> All profiles are anonymized. You can only contact verified premium renters who have opted-in to be visible.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default RenterFilters;