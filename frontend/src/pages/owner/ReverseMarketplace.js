import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, AlertCircle, CheckCircle } from 'lucide-react';
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
      
      // Check for specific error cases
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
      
      // Navigate to chats after 2 seconds
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

  // Check if user is verified owner
  const isVerifiedOwner = user?.is_verified_owner;

  return (
    <div className="min-h-screen bg-gray-50 py-8" data-testid="reverse-marketplace-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Users className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Reverse Marketplace</h1>
          </div>
          <p className="text-gray-600">
            Browse verified premium renters looking for properties. Pitch your property directly to potential tenants.
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-green-800 font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Not Verified Warning */}
        {!isVerifiedOwner && (
          <div className="mb-6 p-6 bg-yellow-50 border border-yellow-200 rounded-lg" data-testid="not-verified-warning">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  Verification Required
                </h3>
                <p className="text-yellow-800 mb-4">
                  Only verified owners can access the reverse marketplace. This ensures trust and safety for both renters and owners.
                </p>
                <button
                  onClick={() => navigate('/owner/verification')}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors"
                  data-testid="verify-now-button"
                >
                  Get Verified Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Main Content - Only show if verified */}
        {isVerifiedOwner && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <RenterFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </div>

            {/* Renters Grid */}
            <div className="lg:col-span-3">
              {/* Sort and Count */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600" data-testid="renter-count">
                  {renters.length} {renters.length === 1 ? 'renter' : 'renters'} found
                </p>
                <div className="flex items-center">
                  <label className="text-sm text-gray-600 mr-2">Sort by:</label>
                  <select
                    value={filters.sort_by}
                    onChange={handleSortChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    data-testid="sort-select"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="budget_low">Budget: Low to High</option>
                    <option value="budget_high">Budget: High to Low</option>
                    <option value="move_in_date">Move-in Date</option>
                  </select>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600">Loading renters...</p>
                </div>
              )}

              {/* No Results */}
              {!loading && renters.length === 0 && (
                <div className="text-center py-12" data-testid="no-renters-message">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No renters found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or check back later for new profiles.
                  </p>
                </div>
              )}

              {/* Renters Grid */}
              {!loading && renters.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="renters-grid">
                  {renters.map((renter) => (
                    <AnonymousRenterCard
                      key={renter.renter_id}
                      renter={renter}
                      onContact={handleContactClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

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
