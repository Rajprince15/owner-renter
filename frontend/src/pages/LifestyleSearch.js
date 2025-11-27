import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '../context/AuthContext';
import { lifestyleSearch } from '../services/propertyService';
import { TrendingUp, Lock, AlertCircle, Wind, Activity, Footprints, Trees, Zap, Target, Award } from 'lucide-react';

import NaturalLanguageSearch from '../components/search/NaturalLanguageSearch';
import AdvancedFiltersPanel from '../components/property/AdvancedFiltersPanel';
import PropertyCard from '../components/property/PropertyCard';
import LifestyleScoreBadge from '../components/property/LifestyleScoreBadge';
import Button from '../components/common/Button';
import { addToShortlist } from '../services/shortlistService';
import { fadeInUp, staggerContainer, staggerItem, scaleIn } from '../utils/motionConfig';

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

  // Intersection observers for scroll animations
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [resultsRef, resultsInView] = useInView({ triggerOnce: true, threshold: 0.1 });

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

  // Free user - Show upgrade prompt with animations
  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 py-12 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Lock Icon with Animation */}
            <motion.div
              className="mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Lock className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </motion.div>
            </motion.div>

            {/* Heading with Animation */}
            <motion.h1
              className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Lifestyle Search
              <motion.span
                className="block text-2xl text-blue-600 dark:text-blue-400 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Premium Feature
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Find your perfect home based on lifestyle factors like air quality, noise levels, walkability, and proximity to amenities.
            </motion.p>

            {/* Features List with Stagger Animation */}
            <motion.div
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-8 mb-8 transition-colors duration-200"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                What you get with Lifestyle Search:
              </h3>
              <motion.div
                className="grid md:grid-cols-2 gap-4 text-left"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {[
                  { icon: Wind, title: 'Air Quality Filtering', desc: 'Find homes with low AQI scores for healthier living', color: 'blue' },
                  { icon: Activity, title: 'Noise Level Control', desc: 'Choose quiet neighborhoods for peaceful living', color: 'green' },
                  { icon: Footprints, title: 'Walkability Scores', desc: 'Find walkable areas with good connectivity', color: 'purple' },
                  { icon: Zap, title: 'Advanced Lifestyle Search', desc: 'Search using plain English descriptions', color: 'yellow' },
                  { icon: Target, title: 'Verified Properties Only', desc: 'Access only verified properties with accurate data', color: 'red' },
                  { icon: Award, title: 'Detailed Lifestyle Scores', desc: 'See comprehensive lifestyle metrics for each property', color: 'indigo' }
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    variants={staggerItem}
                    whileHover={{ scale: 1.05, x: 5 }}
                    className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                  >
                    <motion.div
                      className={`w-8 h-8 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-full flex items-center justify-center flex-shrink-0`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className={`w-4 h-4 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                    </motion.div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{feature.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* CTA Button with Pulse Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(59, 130, 246, 0)',
                    '0 0 0 20px rgba(59, 130, 246, 0)',
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => navigate('/renter/subscription')}
                    className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
                    data-testid="upgrade-to-premium-cta"
                  >
                    Upgrade to Premium - ₹750 / 90 days
                  </Button>
                </motion.div>
              </motion.div>

              <motion.p
                className="text-sm text-gray-500 dark:text-gray-400 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                Also get unlimited contacts and verified renter badge
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Premium user - Show search interface with animations
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Animation */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </motion.div>
            Lifestyle Search
          </motion.h1>
          <motion.p
            className="text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Find your perfect home based on lifestyle factors. All properties shown are verified with accurate lifestyle data.
          </motion.p>
        </motion.div>

        {/* Natural Language Search with Animation */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <NaturalLanguageSearch
            onSearch={handleNaturalLanguageSearch}
            isPremium={isPremium}
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar with Slide Animation */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="sticky top-4">
              <AdvancedFiltersPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onApply={handleApplyFilters}
              />
            </div>
          </motion.div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Loading State with Spinner Animation */}
            {loading && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"
                />
                <p className="text-gray-600 dark:text-gray-300">Searching verified properties...</p>
              </motion.div>
            )}

            {/* Error State with Shake Animation */}
            {error && (
              <motion.div
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center transition-colors duration-200"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, x: [-5, 5, -5, 5, 0] }}
                transition={{ x: { duration: 0.5 } }}
              >
                <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400 mx-auto mb-3" />
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </motion.div>
            )}

            {/* No Results with Animation */}
            {!loading && !error && hasSearched && properties.length === 0 && (
              <motion.div
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-12 text-center transition-colors duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AlertCircle className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No properties found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your filters to see more results
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
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
                </motion.div>
              </motion.div>
            )}

            {/* Results Header with Animation */}
            {!loading && !error && properties.length > 0 && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-4 flex items-center justify-between transition-colors duration-200">
                  <div>
                    <motion.p
                      className="text-sm text-gray-600 dark:text-gray-300"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <motion.span
                        className="font-semibold text-gray-900 dark:text-white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                      >
                        {properties.length}
                      </motion.span> verified properties found
                    </motion.p>
                    {searchQuery && (
                      <motion.p
                        className="text-xs text-gray-500 dark:text-gray-400 mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        Search: "{searchQuery}"
                      </motion.p>
                    )}
                  </div>
                  <motion.div
                    className="flex gap-2"
                    initial="initial"
                    animate="animate"
                    variants={staggerContainer}
                  >
                    {[
                      { type: 'aqi', value: filters.max_aqi },
                      { type: 'noise', value: filters.max_noise },
                      { type: 'walkability', value: filters.min_walkability }
                    ].map((badge, idx) => (
                      <motion.div key={idx} variants={staggerItem}>
                        <LifestyleScoreBadge type={badge.type} value={badge.value} size="small" />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Properties Grid with Stagger Animation */}
            {!loading && !error && properties.length > 0 && (
              <motion.div
                ref={resultsRef}
                className="grid md:grid-cols-2 gap-6"
                variants={staggerContainer}
                initial="initial"
                animate={resultsInView ? "animate" : "initial"}
              >
                {properties.map((property, index) => (
                  <motion.div
                    key={property.property_id}
                    variants={staggerItem}
                    className="group"
                  >
                    <PropertyCard
                      property={property}
                      onShortlist={handleShortlist}
                    />
                    {/* Lifestyle Scores with Animation */}
                    {property.lifestyle_data && (
                      <motion.div
                        className="mt-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-sm transition-colors duration-200"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -2 }}
                      >
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Lifestyle Scores:</p>
                        <motion.div
                          className="flex flex-wrap gap-2"
                          variants={staggerContainer}
                          initial="initial"
                          animate="animate"
                        >
                          <motion.div variants={staggerItem}>
                            <LifestyleScoreBadge
                              type="aqi"
                              value={property.lifestyle_data.aqi_score}
                              size="small"
                            />
                          </motion.div>
                          <motion.div variants={staggerItem}>
                            <LifestyleScoreBadge
                              type="noise"
                              value={property.lifestyle_data.noise_level}
                              size="small"
                            />
                          </motion.div>
                          <motion.div variants={staggerItem}>
                            <LifestyleScoreBadge
                              type="walkability"
                              value={property.lifestyle_data.walkability_score}
                              size="small"
                            />
                          </motion.div>
                          {property.lifestyle_data.nearby_parks?.length > 0 && (
                            <motion.div variants={staggerItem}>
                              <LifestyleScoreBadge
                                type="parks"
                                value={property.lifestyle_data.nearby_parks.length}
                                size="small"
                              />
                            </motion.div>
                          )}
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifestyleSearch;