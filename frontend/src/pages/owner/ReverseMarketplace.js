import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, AlertCircle, CheckCircle, Filter, TrendingUp, Star, Award, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAnonymousRenters, contactRenter } from '../../services/reverseMarketplaceService';
import AnonymousRenterCard from '../../components/marketplace/AnonymousRenterCard';
import RenterFilters from '../../components/marketplace/RenterFilters';
import ContactRenterModal from '../../components/marketplace/ContactRenterModal';

const ReverseMarketplace = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [renters, setRenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    budget_min: 0,
    budget_max: 0,
    bhk_type: [],
    location: '',
    employment_type: '',
    sort_by: 'recent'
  });
  
  const [selectedRenter, setSelectedRenter] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadRenters();
  }, [filters]);

  const loadRenters = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getAnonymousRenters(filters);
      setRenters(response.data.renters || []);
    } catch (err) {
      console.error('Error loading renters:', err);
      
      if (err.response?.status === 403) {
        setError(err.response.data.message || 'Access denied. Only verified owners can browse reverse marketplace.');
      } else if (err.response?.status === 401) {
        setError('Please login to access the reverse marketplace.');
      } else {
        setError('Failed to load renters. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      budget_min: 0,
      budget_max: 0,
      bhk_type: [],
      location: '',
      employment_type: '',
      sort_by: 'recent'
    });
  };

  const handleSortChange = (e) => {
    setFilters({ ...filters, sort_by: e.target.value });
  };

  const handleContactClick = (renter) => {
    setSelectedRenter(renter);
    setShowContactModal(true);
  };

  const handleContactSubmit = async (renterId, propertyId, message) => {
    try {
      setLoading(true);
      
      const response = await contactRenter(renterId, propertyId, message);
      
      setShowContactModal(false);
      setSuccessMessage('Message sent successfully! You can view the conversation in your chats.');
      
      setTimeout(() => {
        navigate('/owner/chats');
      }, 2000);
    } catch (err) {
      console.error('Error contacting renter:', err);
      alert(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isVerifiedOwner = user?.is_verified_owner;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 relative overflow-hidden" data-testid="reverse-marketplace-page">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          y: [0, 100, 0],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          y: [0, -100, 0],
          x: [0, -50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center mb-2">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
              className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mr-3 shadow-lg"
            >
              <Users className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Reverse Marketplace
            </h1>
          </div>
          <p className="text-gray-600 ml-14">
            Browse verified premium renters looking for properties. Pitch your property directly to potential tenants.
          </p>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl flex items-start shadow-lg"
            >
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-green-800 font-medium">{successMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Not Verified Warning */}
        {!isVerifiedOwner && (
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            className="mb-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl shadow-xl relative overflow-hidden"
            data-testid="not-verified-warning"
          >
            <motion.div
              className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-200 rounded-full opacity-20"
              animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <div className="flex items-start relative z-10">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  Verification Required
                </h3>
                <p className="text-yellow-800 mb-4">
                  Only verified owners can access the reverse marketplace. This ensures trust and safety for both renters and owners.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/owner/verification')}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-medium rounded-lg transition-colors shadow-lg"
                  data-testid="verify-now-button"
                >
                  Get Verified Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl shadow-lg"
          >
            <p className="text-sm text-red-600">{error}</p>
          </motion.div>
        )}

        {/* Main Content */}
        {isVerifiedOwner && (
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="sticky top-4 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-indigo-100"
              >
                <div className="flex items-center mb-4">
                  <Filter className="w-5 h-5 text-indigo-600 mr-2" />
                  <h3 className="font-bold text-gray-900">Filters</h3>
                </div>
                <RenterFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </motion.div>
            </div>

            {/* Renters Grid */}
            <div className="lg:col-span-3">
              {/* Sort and Count */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center mb-6 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-4"
              >
                <p className="text-gray-600 flex items-center" data-testid="renter-count">
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"
                  />
                  {renters.length} {renters.length === 1 ? 'renter' : 'renters'} found
                </p>
                <div className="flex items-center">
                  <label className="text-sm text-gray-600 mr-2">Sort by:</label>
                  <motion.select
                    whileHover={{ scale: 1.02 }}
                    value={filters.sort_by}
                    onChange={handleSortChange}
                    className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
                    data-testid="sort-select"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="budget_low">Budget: Low to High</option>
                    <option value="budget_high">Budget: High to Low</option>
                    <option value="move_in_date">Move-in Date</option>
                  </motion.select>
                </div>
              </motion.div>

              {/* Loading State */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"
                  />
                  <p className="mt-4 text-gray-600">Loading renters...</p>
                </motion.div>
              )}

              {/* No Results */}
              {!loading && renters.length === 0 && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8"
                  data-testid="no-renters-message"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No renters found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or check back later for new profiles.
                  </p>
                </motion.div>
              )}

              {/* Renters Grid */}
              {!loading && renters.length > 0 && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  data-testid="renters-grid"
                >
                  {renters.map((renter, index) => (
                    <motion.div
                      key={renter.renter_id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.03, y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AnonymousRenterCard
                        renter={renter}
                        onContact={handleContactClick}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Contact Renter Modal */}
      {selectedRenter && (
        <ContactRenterModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          renter={selectedRenter}
          onSubmit={handleContactSubmit}
        />
      )}
    </div>
  );
};

export default ReverseMarketplace;