import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, Search, AlertCircle } from 'lucide-react';
import PropertyCard from '../../components/property/PropertyCard';
import { getShortlists, removeFromShortlist } from '../../services/shortlistService';
import Button from '../../components/common/Button';

const Shortlists = () => {
  const navigate = useNavigate();
  const [shortlists, setShortlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    fetchShortlists();
  }, []);

  const fetchShortlists = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getShortlists();
      setShortlists(response.data || []);
    } catch (err) {
      console.error('Error fetching shortlists:', err);
      setError('Failed to load shortlists');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveShortlist = async (shortlistId, propertyId) => {
    if (removingId) return;
    
    if (!window.confirm('Remove this property from your shortlist?')) {
      return;
    }

    setRemovingId(shortlistId);
    try {
      await removeFromShortlist(shortlistId);
      setShortlists(prev => prev.filter(s => s.shortlist_id !== shortlistId));
    } catch (err) {
      console.error('Error removing shortlist:', err);
      alert('Failed to remove from shortlist');
    } finally {
      setRemovingId(null);
    }
  };

  const handleShortlistToggle = async (propertyId, shouldAdd) => {
    // This function is called from PropertyCard
    if (!shouldAdd) {
      // Find the shortlist for this property
      const shortlist = shortlists.find(s => s.property_id === propertyId);
      if (shortlist) {
        await handleRemoveShortlist(shortlist.shortlist_id, propertyId);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900" data-testid="shortlists-page-title">
              My Shortlists
            </h1>
          </div>
          <p className="text-gray-600">
            {shortlists.length} {shortlists.length === 1 ? 'property' : 'properties'} saved
          </p>
        </div>

        {/* Content */}
        {error ? (
          /* Error State */
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-800 font-medium mb-2">Oops! Something went wrong</p>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <Button onClick={fetchShortlists}>Try Again</Button>
          </div>
        ) : shortlists.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Properties Shortlisted Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start browsing properties and add them to your shortlist to keep track of your favorites.
            </p>
            <Button
              onClick={() => navigate('/search')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="browse-properties-btn"
            >
              <Search className="w-5 h-5 mr-2" />
              Browse Properties
            </Button>
          </div>
        ) : (
          /* Shortlisted Properties Grid */
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="shortlists-grid">
              {shortlists.map((shortlist) => {
                if (!shortlist.property) return null;
                
                return (
                  <div key={shortlist.shortlist_id} className="relative">
                    {/* Remove button overlay */}
                    <button
                      onClick={() => handleRemoveShortlist(shortlist.shortlist_id, shortlist.property_id)}
                      disabled={removingId === shortlist.shortlist_id}
                      className="absolute top-2 right-2 z-10 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50"
                      title="Remove from shortlist"
                      data-testid={`remove-shortlist-${shortlist.shortlist_id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <PropertyCard
                      property={shortlist.property}
                      onShortlist={handleShortlistToggle}
                      isShortlisted={true}
                    />

                    {/* Notes (if any) */}
                    {shortlist.notes && (
                      <div className="mt-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Note:</span> {shortlist.notes}
                        </p>
                      </div>
                    )}

                    {/* Added date */}
                    <div className="mt-2 px-4 text-xs text-gray-500">
                      Added on {new Date(shortlist.created_at).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex justify-center gap-4">
              <Button
                onClick={() => navigate('/search')}
                variant="outline"
              >
                <Search className="w-5 h-5 mr-2" />
                Find More Properties
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shortlists;
