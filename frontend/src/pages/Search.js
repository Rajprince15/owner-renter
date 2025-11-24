import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, AlertCircle } from 'lucide-react';
import SearchFilters from '../components/property/SearchFilters';
import PropertyCard from '../components/property/PropertyCard';
import { searchProperties } from '../services/propertyService';
import { addToShortlist, removeFromShortlistByPropertyId, isPropertyShortlisted } from '../services/shortlistService';
import { useAuth } from '../context/AuthContext';

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
    page: 1,
    limit: 20
  });
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [shortlistedProperties, setShortlistedProperties] = useState(new Set());

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
      
      // Check which properties are shortlisted
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

  // Load properties on mount and when filters change
  useEffect(() => {
    fetchProperties(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    fetchProperties(updatedFilters);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="search-page-title">
              Find Your Perfect Home
            </h1>
            <p className="text-gray-600">
              {totalCount} properties available in {filters.city}
            </p>
          </div>
          
          {/* Premium Lifestyle Search Button */}
          {user && user.subscription_tier === 'premium' && (
            <button
              onClick={() => navigate('/lifestyle-search')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              data-testid="lifestyle-search-btn"
            >
              <SearchIcon className="w-4 h-4" />
              Lifestyle Search
            </button>
          )}
        </div>

        {/* Upgrade Banner for Free Users */}
        {user && user.subscription_tier === 'free' && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <SearchIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900 mb-1">
                  🌟 Unlock Lifestyle Search with Premium
                </h3>
                <p className="text-sm text-blue-800 mb-2">
                  Search by air quality, noise levels, walkability, and more! Plus unlimited contacts and verified badge.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('/lifestyle-search')}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 underline"
                  >
                    Learn More →
                  </button>
                  <button
                    onClick={() => navigate('/renter/subscription')}
                    className="text-sm font-medium px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <SearchFilters 
              onFilterChange={handleFilterChange} 
              initialFilters={filters}
            />
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              /* Loading State */
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              /* Error State */
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <p className="text-red-800 font-medium mb-2">Oops! Something went wrong</p>
                <p className="text-red-600 text-sm mb-4">{error}</p>
                <button
                  onClick={() => fetchProperties(filters)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            ) : properties.length === 0 ? (
              /* No Results */
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters to see more results
                </p>
                <button
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
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              /* Properties Grid */
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" data-testid="properties-grid">
                  {properties.map((property) => (
                    <PropertyCard
                      key={property.property_id}
                      property={property}
                      onShortlist={handleShortlist}
                      isShortlisted={shortlistedProperties.has(property.property_id)}
                    />
                  ))}
                </div>

                {/* Pagination Info */}
                {hasMore && (
                  <div className="mt-8 text-center">
                    <p className="text-gray-600 mb-4">
                      Showing {properties.length} of {totalCount} properties
                    </p>
                    <button
                      onClick={() => {
                        const nextFilters = { ...filters, page: filters.page + 1 };
                        setFilters(nextFilters);
                        fetchProperties(nextFilters);
                      }}
                      className="px-6 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 font-medium"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
