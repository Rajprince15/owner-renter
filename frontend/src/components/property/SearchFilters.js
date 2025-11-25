import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
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

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden text-gray-600 hover:text-gray-900"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Filters Body */}
      {showFilters && (
        <div className="p-4 space-y-4" data-testid="search-filters">
          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <select
              value={filters.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="filter-city"
            >
              {CITIES.map(city => (
                <option key={city.value} value={city.value}>{city.label}</option>
              ))}
            </select>
          </div>

          {/* Location/Locality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location/Locality
            </label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="e.g., Koramangala, Indiranagar"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="filter-location"
            />
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range (₹/month)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={filters.min_price}
                onChange={(e) => handleInputChange('min_price', e.target.value)}
                placeholder="Min"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="filter-min-price"
              />
              <input
                type="number"
                value={filters.max_price}
                onChange={(e) => handleInputChange('max_price', e.target.value)}
                placeholder="Max"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="filter-max-price"
              />
            </div>
          </div>

          {/* BHK Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              BHK Type
            </label>
            <select
              value={filters.bhk_type}
              onChange={(e) => handleInputChange('bhk_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="filter-bhk-type"
            >
              <option value="">All</option>
              {BHK_TYPES.map(bhk => (
                <option key={bhk.value} value={bhk.value}>{bhk.label}</option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type
            </label>
            <select
              value={filters.property_type}
              onChange={(e) => handleInputChange('property_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="filter-property-type"
            >
              <option value="">All</option>
              {PROPERTY_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Furnishing */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Furnishing
            </label>
            <select
              value={filters.furnishing}
              onChange={(e) => handleInputChange('furnishing', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="filter-furnishing"
            >
              <option value="">All</option>
              {FURNISHING_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={filters.sort_by}
              onChange={(e) => handleInputChange('sort_by', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="filter-sort-by"
            >
              <option value="default">Relevance (Verified First)</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="recent">Newest First</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleApplyFilters}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="apply-filters-btn"
            >
              <Search className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
            <Button
              onClick={handleResetFilters}
              variant="outline"
              className="px-4"
              data-testid="reset-filters-btn"
            >
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
