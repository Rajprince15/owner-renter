import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { lifestyleSearch } from '../services/propertyService';
import { TrendingUp, Lock, AlertCircle } from 'lucide-react';

import NaturalLanguageSearch from '../components/search/NaturalLanguageSearch';
import AdvancedFiltersPanel from '../components/property/AdvancedFiltersPanel';
import PropertyCard from '../components/property/PropertyCard';
import LifestyleScoreBadge from '../components/property/LifestyleScoreBadge';
import Button from '../components/common/Button';
import { addToShortlist } from '../services/shortlistService';

const LifestyleSearch = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const isPremium = user?.subscription_tier === 'premium';

  const [filters, setFilters] = useState({
    max_aqi: 100,
    max_noise: 70,
    min_walkability: 50,
    near_parks: false,
    pet_friendly: false
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Perform initial search with default filters
  useEffect(() => {
    if (isPremium && !hasSearched) {
      handleSearch(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPremium]);

  const handleSearch = async (searchFilters = filters, query = '') => {
    if (!isPremium) return;

    setLoading(true);
    setError(null);
    setSearchQuery(query);
    setHasSearched(true);

    try {
      const response = await lifestyleSearch(searchFilters);
      setProperties(response.data.properties || []);
    } catch (err) {
      console.error('Lifestyle search error:', err);
      setError(err.response?.data?.message || 'Failed to search properties');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    handleSearch(newFilters, searchQuery);
  };

  const handleNaturalLanguageSearch = (extractedFilters, query) => {
    const combinedFilters = { ...filters, ...extractedFilters };
    setFilters(combinedFilters);
    handleSearch(combinedFilters, query);
  };

  const handleShortlist = async (propertyId) => {
    try {
      await addToShortlist(propertyId);
      alert('Property added to shortlist!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to shortlist');
    }
  };

  // Free user - Show upgrade prompt
  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Lock Icon */}
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full">
                <Lock className="w-12 h-12 text-blue-600" />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Lifestyle Search
              <span className="block text-2xl text-blue-600 mt-2">Premium Feature</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              Find your perfect home based on lifestyle factors like air quality, noise levels, walkability, and proximity to amenities.
            </p>

            {/* Features List */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What you get with Lifestyle Search:
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Air Quality Filtering</h4>
                    <p className="text-sm text-gray-600">Find homes with low AQI scores for healthier living</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Noise Level Control</h4>
                    <p className="text-sm text-gray-600">Choose quiet neighborhoods for peaceful living</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Walkability Scores</h4>
                    <p className="text-sm text-gray-600">Find walkable areas with good connectivity</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Natural Language Search</h4>
                    <p className="text-sm text-gray-600">Search using plain English descriptions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Verified Properties Only</h4>
                    <p className="text-sm text-gray-600">Access only verified properties with accurate data</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Detailed Lifestyle Scores</h4>
                    <p className="text-sm text-gray-600">See comprehensive lifestyle metrics for each property</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Button
              onClick={() => navigate('/renter/subscription')}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
              data-testid="upgrade-to-premium-cta"
            >
              Upgrade to Premium - ₹750 / 90 days
            </Button>

            <p className="text-sm text-gray-500 mt-4">
              Also get unlimited contacts and verified renter badge
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Premium user - Show search interface
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            Lifestyle Search
          </h1>
          <p className="text-gray-600">
            Find your perfect home based on lifestyle factors. All properties shown are verified with accurate lifestyle data.
          </p>
        </div>

        {/* Natural Language Search */}
        <div className="mb-6">
          <NaturalLanguageSearch
            onSearch={handleNaturalLanguageSearch}
            isPremium={isPremium}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <AdvancedFiltersPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onApply={handleApplyFilters}
              />
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Searching verified properties...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* No Results */}
            {!loading && !error && hasSearched && properties.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters to see more results
                </p>
                <Button
                  onClick={() => {
                    const resetFilters = {
                      max_aqi: 100,
                      max_noise: 70,
                      min_walkability: 50,
                      near_parks: false,
                      pet_friendly: false
                    };
                    setFilters(resetFilters);
                    handleSearch(resetFilters);
                  }}
                  variant="outline"
                  data-testid="reset-search-btn"
                >
                  Reset Filters
                </Button>
              </div>
            )}

            {/* Results Header */}
            {!loading && !error && properties.length > 0 && (
              <div className="mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">{properties.length}</span> verified properties found
                    </p>
                    {searchQuery && (
                      <p className="text-xs text-gray-500 mt-1">
                        Search: "{searchQuery}"
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <LifestyleScoreBadge type="aqi" value={filters.max_aqi} size="small" />
                    <LifestyleScoreBadge type="noise" value={filters.max_noise} size="small" />
                    <LifestyleScoreBadge type="walkability" value={filters.min_walkability} size="small" />
                  </div>
                </div>
              </div>
            )}

            {/* Properties Grid */}
            {!loading && !error && properties.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {properties.map((property) => (
                  <div key={property.property_id} className="group">
                    <PropertyCard
                      property={property}
                      onShortlist={handleShortlist}
                    />
                    {/* Lifestyle Scores */}
                    {property.lifestyle_data && (
                      <div className="mt-3 bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                        <p className="text-xs font-medium text-gray-700 mb-2">Lifestyle Scores:</p>
                        <div className="flex flex-wrap gap-2">
                          <LifestyleScoreBadge
                            type="aqi"
                            value={property.lifestyle_data.aqi_score}
                            size="small"
                          />
                          <LifestyleScoreBadge
                            type="noise"
                            value={property.lifestyle_data.noise_level}
                            size="small"
                          />
                          <LifestyleScoreBadge
                            type="walkability"
                            value={property.lifestyle_data.walkability_score}
                            size="small"
                          />
                          {property.lifestyle_data.nearby_parks?.length > 0 && (
                            <LifestyleScoreBadge
                              type="parks"
                              value={property.lifestyle_data.nearby_parks.length}
                              size="small"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifestyleSearch;
