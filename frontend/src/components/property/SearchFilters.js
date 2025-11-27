import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../common/Button';
import { CITIES, PROPERTY_TYPES, BHK_TYPES, FURNISHING_TYPES } from '../../constants/propertyConstants';

const SearchFilters = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    location: '',
    city: 'Bangalore',
    min_price: '',
    max_price: '',
    bhk_type: '',
    property_type: '',
    furnishing: '',
    sort_by: 'default',
    ...initialFilters
  });

  const [showFilters, setShowFilters] = useState(true);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    advanced: false
  });

  // Count active filters
  useEffect(() => {
    const count = Object.entries(filters).filter(([key, value]) => {
      if (key === 'city' || key === 'sort_by') return false;
      return value !== '' && value !== null && value !== undefined;
    }).length;
    setActiveFiltersCount(count);
  }, [filters]);

  const handleInputChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    // Clean up empty filters
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    onFilterChange(cleanFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      location: '',
      city: 'Bangalore',
      min_price: '',
      max_price: '',
      bhk_type: '',
      property_type: '',
      furnishing: '',
      sort_by: 'default'
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  // Auto-apply on sort change
  useEffect(() => {
    if (filters.sort_by !== 'default') {
      handleApplyFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.sort_by]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <motion.div
      className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 transition-colors duration-200"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with Animation */}
      <motion.div
        className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: showFilters ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <SlidersHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
          {/* Active Filters Count Badge */}
          <AnimatePresence>
            {activeFiltersCount > 0 && (
              <motion.span
                className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {activeFiltersCount}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <motion.button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Filters Body with Collapsible Animation */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 space-y-4" data-testid="search-filters">
              {/* Basic Filters Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <motion.button
                  onClick={() => toggleSection('basic')}
                  className="w-full flex items-center justify-between mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300"
                  whileHover={{ x: 5 }}
                >
                  <span>Basic Filters</span>
                  <motion.div
                    animate={{ rotate: expandedSections.basic ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {expandedSections.basic && (
                    <motion.div
                      className="space-y-4"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* City */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.05 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          City
                        </label>
                        <motion.select
                          value={filters.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                          data-testid="filter-city"
                          whileFocus={{ scale: 1.02 }}
                        >
                          {CITIES.map(city => (
                            <option key={city.value} value={city.value}>{city.label}</option>
                          ))}
                        </motion.select>
                      </motion.div>

                      {/* Location/Locality */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Location/Locality
                        </label>
                        <motion.input
                          type="text"
                          value={filters.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="e.g., Koramangala, Indiranagar"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                          data-testid="filter-location"
                          whileFocus={{ scale: 1.02 }}
                        />
                      </motion.div>

                      {/* Price Range */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.15 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Price Range (₹/month)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <motion.input
                            type="number"
                            value={filters.min_price}
                            onChange={(e) => handleInputChange('min_price', e.target.value)}
                            placeholder="Min"
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                            data-testid="filter-min-price"
                            whileFocus={{ scale: 1.05 }}
                          />
                          <motion.input
                            type="number"
                            value={filters.max_price}
                            onChange={(e) => handleInputChange('max_price', e.target.value)}
                            placeholder="Max"
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                            data-testid="filter-max-price"
                            whileFocus={{ scale: 1.05 }}
                          />
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Advanced Filters Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.button
                  onClick={() => toggleSection('advanced')}
                  className="w-full flex items-center justify-between mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300"
                  whileHover={{ x: 5 }}
                >
                  <span>Advanced Filters</span>
                  <motion.div
                    animate={{ rotate: expandedSections.advanced ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {expandedSections.advanced && (
                    <motion.div
                      className="space-y-4"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* BHK Type */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.05 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          BHK Type
                        </label>
                        <motion.select
                          value={filters.bhk_type}
                          onChange={(e) => handleInputChange('bhk_type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                          data-testid="filter-bhk-type"
                          whileFocus={{ scale: 1.02 }}
                        >
                          <option value="">All</option>
                          {BHK_TYPES.map(bhk => (
                            <option key={bhk.value} value={bhk.value}>{bhk.label}</option>
                          ))}
                        </motion.select>
                      </motion.div>

                      {/* Property Type */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Property Type
                        </label>
                        <motion.select
                          value={filters.property_type}
                          onChange={(e) => handleInputChange('property_type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                          data-testid="filter-property-type"
                          whileFocus={{ scale: 1.02 }}
                        >
                          <option value="">All</option>
                          {PROPERTY_TYPES.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </motion.select>
                      </motion.div>

                      {/* Furnishing */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.15 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Furnishing
                        </label>
                        <motion.select
                          value={filters.furnishing}
                          onChange={(e) => handleInputChange('furnishing', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                          data-testid="filter-furnishing"
                          whileFocus={{ scale: 1.02 }}
                        >
                          <option value="">All</option>
                          {FURNISHING_TYPES.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </motion.select>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Sort By */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <motion.select
                  value={filters.sort_by}
                  onChange={(e) => handleInputChange('sort_by', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  data-testid="filter-sort-by"
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="default">Relevance (Verified First)</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="recent">Newest First</option>
                </motion.select>
              </motion.div>

              {/* Action Buttons with Stagger Animation */}
              <motion.div
                className="flex gap-2 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleApplyFilters}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    data-testid="apply-filters-btn"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Apply Filters
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleResetFilters}
                    variant="outline"
                    className="px-4"
                    data-testid="reset-filters-btn"
                  >
                    Reset
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchFilters;