import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Search as SearchIcon, AlertCircle, Sparkles, ChevronUp, SlidersHorizontal, Grid, List } from 'lucide-react';
import SearchFilters from '../components/property/SearchFilters';
import PropertyCard from '../components/property/PropertyCard';
import NaturalLanguageSearch from '../components/search/NaturalLanguageSearch';
import AdvancedFiltersPanel from '../components/property/AdvancedFiltersPanel';
import LifestyleScoreBadge from '../components/property/LifestyleScoreBadge';
import { searchProperties, lifestyleSearch } from '../services/propertyService';
import { addToShortlist, removeFromShortlistByPropertyId, isPropertyShortlisted } from '../services/shortlistService';
import { useAuth } from '../context/AuthContext';
import { fadeInUp, staggerContainer, staggerItem, slideInLeft, slideInRight } from '../utils/motionConfig';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || 'Bangalore',
    location: searchParams.get('location') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    bhk_type: searchParams.get('bhk_type') || '',
    property_type: searchParams.get('property_type') || '',
    furnishing: searchParams.get('furnishing') || '',
    sort_by: searchParams.get('sort_by') || 'default',
    max_aqi: searchParams.get('max_aqi') || 100,
    max_noise: searchParams.get('max_noise') || 70,
    min_walkability: searchParams.get('min_walkability') || 50,
    near_parks: searchParams.get('near_parks') === 'true',
    pet_friendly: searchParams.get('pet_friendly') === 'true',
    page: 1,
    limit: 20
  });
  const [lifestyleFilters, setLifestyleFilters] = useState({
    max_aqi: 100,
    max_noise: 70,
    min_walkability: 50,
    near_parks: false,
    pet_friendly: false
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [shortlistedProperties, setShortlistedProperties] = useState(new Set());
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Intersection observer for scroll animations
  const [resultsRef, resultsInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Fetch properties
  const fetchProperties = async (currentFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchProperties(currentFilters);
      const data = response.data;
      
      setProperties(data.properties || []);
      setTotalCount(data.total_count || 0);
      setHasMore(data.has_more || false);
      
      if (user) {
        const shortlisted = new Set();
        data.properties.forEach(prop => {
          if (isPropertyShortlisted(prop.property_id)) {
            shortlisted.add(prop.property_id);
          }
        });
        setShortlistedProperties(shortlisted);
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(filters);
  }, []);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    fetchProperties(updatedFilters);
  };

  const handleLifestyleFiltersChange = (newLifestyleFilters) => {
    setLifestyleFilters(newLifestyleFilters);
  };

  const handleApplyLifestyleFilters = (newLifestyleFilters) => {
    setLifestyleFilters(newLifestyleFilters);
    const updatedFilters = { ...filters, ...newLifestyleFilters, page: 1 };
    setFilters(updatedFilters);
    fetchProperties(updatedFilters);
  };

  const handleNaturalLanguageSearch = (extractedFilters, query) => {
    const combinedFilters = { ...filters, ...extractedFilters, page: 1 };
    setFilters(combinedFilters);
    fetchProperties(combinedFilters);
  };

  const handleShortlist = async (propertyId, add) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (add) {
        await addToShortlist(propertyId, '');
        setShortlistedProperties(prev => new Set([...prev, propertyId]));
      } else {
        await removeFromShortlistByPropertyId(propertyId);
        setShortlistedProperties(prev => {
          const newSet = new Set(prev);
          newSet.delete(propertyId);
          return newSet;
        });
      }
    } catch (err) {
      console.error('Error toggling shortlist:', err);
      alert(err.response?.data?.message || 'Failed to update shortlist');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Animation */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3"
            data-testid="search-page-title"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <SearchIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </motion.div>
            Find Your Perfect Home
            {user && user.subscription_tier === 'premium' && (
              <motion.span
                className="text-lg text-blue-600 dark:text-blue-400 flex items-center gap-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.3 }}
              >
                <Sparkles className="w-5 h-5" />
                Premium Search
              </motion.span>
            )}
          </motion.h1>
          <motion.p
            className="text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {totalCount} properties available in {filters.city}
          </motion.p>
        </motion.div>

        {/* Natural Language Search for Premium Users */}
        {user && user.subscription_tier === 'premium' && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <NaturalLanguageSearch
              onSearch={handleNaturalLanguageSearch}
              isPremium={true}
            />
          </motion.div>
        )}

        {/* Upgrade Banner for Free Users */}
        <AnimatePresence>
          {user && user.subscription_tier === 'free' && (
            <motion.div
              className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6 transition-colors duration-200"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-start gap-3">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    🌟 Unlock Premium Lifestyle Search Features
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                    Get access to advanced lifestyle search with natural language, lifestyle filters (air quality, noise levels, walkability), and see detailed lifestyle scores for each property!
                  </p>
                  <ul className="text-sm text-blue-700 dark:text-blue-400 mb-4 space-y-1 ml-5 list-disc">
                    <li>Lifestyle Search - describe your ideal home naturally</li>
                    <li>Filter by Air Quality, Noise Levels, and Walkability Scores</li>
                    <li>View detailed lifestyle metrics on every property</li>
                    <li>Plus: Unlimited contacts and verified renter badge</li>
                  </ul>
                  <motion.button
                    onClick={() => navigate('/renter/subscription')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-sm font-medium px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors"
                    data-testid="upgrade-to-premium-btn"
                  >
                    Upgrade to Premium - ₹750 / 90 days
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Advanced Lifestyle Filters Toggle */}
        {user && user.subscription_tier === 'premium' && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/40 dark:hover:to-indigo-900/40 transition-colors"
              data-testid="toggle-advanced-filters-btn"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                      Advanced Lifestyle Filters
                    </h3>
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      Fine-tune your search with air quality, noise, and walkability filters
                    </p>
                  </div>
                </div>
                <motion.span
                  className="text-sm font-medium text-blue-600 dark:text-blue-400"
                  animate={{ rotate: showAdvancedFilters ? 180 : 0 }}
                >
                  <ChevronUp className="w-5 h-5" />
                </motion.span>
              </div>
            </motion.button>
          </motion.div>
        )}

        {/* View Mode Toggle & Filter Toggle */}
        <motion.div
          className="mb-6 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </motion.button>
          <div className="flex gap-2 ml-auto">
            <motion.button
              onClick={() => setViewMode('grid')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-lg ${
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Grid className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={() => setViewMode('list')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-lg ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <List className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar with Slide Animation */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 1024) && (
              <motion.div
                className="lg:col-span-1 space-y-6"
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <SearchFilters 
                  onFilterChange={handleFilterChange} 
                  initialFilters={filters}
                />
                
                {user && user.subscription_tier === 'premium' && showAdvancedFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <AdvancedFiltersPanel
                      filters={lifestyleFilters}
                      onFiltersChange={handleLifestyleFiltersChange}
                      onApply={handleApplyLifestyleFilters}
                    />
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Properties Grid/List */}
          <div className="lg:col-span-3">
            {loading ? (
              /* Loading Skeleton */
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                initial="initial"
                animate="animate"
                variants={staggerContainer}
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    variants={staggerItem}
                    className="bg-white dark:bg-slate-800 rounded-lg p-4 animate-pulse"
                  >
                    <div className="bg-slate-200 dark:bg-slate-700 h-48 rounded-lg mb-4" />
                    <div className="bg-slate-200 dark:bg-slate-700 h-4 rounded mb-2" />
                    <div className="bg-slate-200 dark:bg-slate-700 h-4 rounded w-2/3" />
                  </motion.div>
                ))}
              </motion.div>
            ) : error ? (
              /* Error State */
              <motion.div
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center transition-colors duration-200"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400 mx-auto mb-3" />
                </motion.div>
                <p className="text-red-800 dark:text-red-300 font-medium mb-2">Oops! Something went wrong</p>
                <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>
                <motion.button
                  onClick={() => fetchProperties(filters)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-md transition-colors"
                >
                  Try Again
                </motion.button>
              </motion.div>
            ) : properties.length === 0 ? (
              /* No Results */
              <motion.div
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-12 text-center transition-colors duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <SearchIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  No properties found
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Try adjusting your filters to see more results
                </p>
                <motion.button
                  onClick={() => {
                    const resetFilters = {
                      city: 'Bangalore',
                      location: '',
                      min_price: '',
                      max_price: '',
                      bhk_type: '',
                      property_type: '',
                      furnishing: '',
                      sort_by: 'default',
                      page: 1,
                      limit: 20
                    };
                    setFilters(resetFilters);
                    fetchProperties(resetFilters);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md transition-colors"
                >
                  Reset Filters
                </motion.button>
              </motion.div>
            ) : (
              /* Properties Grid/List with Stagger Animation */
              <div ref={resultsRef}>
                <motion.div
                  className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-6"}
                  data-testid="properties-grid"
                  initial="initial"
                  animate={resultsInView ? "animate" : "initial"}
                  variants={staggerContainer}
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
                        isShortlisted={shortlistedProperties.has(property.property_id)}
                      />
                      {user && user.subscription_tier === 'premium' && property.lifestyle_data && (
                        <motion.div
                          className="mt-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-sm transition-colors duration-200"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Lifestyle Scores:</p>
                          <div className="flex flex-wrap gap-2">
                            {property.lifestyle_data.aqi_score && (
                              <LifestyleScoreBadge
                                type="aqi"
                                value={property.lifestyle_data.aqi_score}
                                size="small"
                              />
                            )}
                            {property.lifestyle_data.noise_level && (
                              <LifestyleScoreBadge
                                type="noise"
                                value={property.lifestyle_data.noise_level}
                                size="small"
                              />
                            )}
                            {property.lifestyle_data.walkability_score && (
                              <LifestyleScoreBadge
                                type="walkability"
                                value={property.lifestyle_data.walkability_score}
                                size="small"
                              />
                            )}
                            {property.lifestyle_data.nearby_parks?.length > 0 && (
                              <LifestyleScoreBadge
                                type="parks"
                                value={property.lifestyle_data.nearby_parks.length}
                                size="small"
                              />
                            )}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination Info with Smooth Transition */}
                <AnimatePresence>
                  {hasMore && (
                    <motion.div
                      className="mt-8 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                    >
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Showing {properties.length} of {totalCount} properties
                      </p>
                      <motion.button
                        onClick={() => {
                          const nextFilters = { ...filters, page: filters.page + 1 };
                          setFilters(nextFilters);
                          fetchProperties(nextFilters);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                      >
                        Load More
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-8 right-8 p-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg z-50"
            data-testid="scroll-to-top-btn"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search;
