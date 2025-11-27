import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, Search, AlertCircle, Grid, List, SortAsc, Filter, X } from 'lucide-react';
import PropertyCard from '../../components/property/PropertyCard';
import { getShortlists, removeFromShortlist } from '../../services/shortlistService';
import Button from '../../components/common/Button';
import { pageTransition, fadeInUp, staggerContainer } from '../../utils/motionConfig';

const Shortlists = () => {
  const navigate = useNavigate();
  const [shortlists, setShortlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'price-low', 'price-high'
  const [undoStack, setUndoStack] = useState([]);
  const [showUndo, setShowUndo] = useState(false);

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
    
    // Store for undo
    const removedItem = shortlists.find(s => s.shortlist_id === shortlistId);
    setUndoStack([...undoStack, removedItem]);
    setShowUndo(true);
    
    // Optimistically remove from UI
    setShortlists(prev => prev.filter(s => s.shortlist_id !== shortlistId));

    setRemovingId(shortlistId);
    try {
      await removeFromShortlist(shortlistId);
      
      // Auto-hide undo after 5 seconds
      setTimeout(() => {
        setShowUndo(false);
        setUndoStack([]);
      }, 5000);
    } catch (err) {
      console.error('Error removing shortlist:', err);
      // Restore on error
      setShortlists(prev => [...prev, removedItem]);
      alert('Failed to remove from shortlist');
    } finally {
      setRemovingId(null);
    }
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const lastRemoved = undoStack[undoStack.length - 1];
      setShortlists(prev => [...prev, lastRemoved]);
      setUndoStack(undoStack.slice(0, -1));
      setShowUndo(false);
    }
  };

  const handleShortlistToggle = async (propertyId, shouldAdd) => {
    if (!shouldAdd) {
      const shortlist = shortlists.find(s => s.property_id === propertyId);
      if (shortlist) {
        await handleRemoveShortlist(shortlist.shortlist_id, propertyId);
      }
    }
  };

  const getSortedShortlists = () => {
    const sorted = [...shortlists];
    switch(sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => (a.property?.rent || 0) - (b.property?.rent || 0));
      case 'price-high':
        return sorted.sort((a, b) => (b.property?.rent || 0) - (a.property?.rent || 0));
      case 'recent':
      default:
        return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent"
          />
          <p className="mt-4 text-gray-600 font-medium">Loading your shortlists...</p>
        </motion.div>
      </div>
    );
  }

  const sortedShortlists = getSortedShortlists();

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50"
      {...pageTransition}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-10 h-10 text-red-600 fill-red-600" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent" data-testid="shortlists-page-title">
              My Shortlists
            </h1>
          </div>
          <motion.p 
            className="text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {shortlists.length} {shortlists.length === 1 ? 'property' : 'properties'} saved
          </motion.p>
        </motion.div>

        {/* Toolbar */}
        {shortlists.length > 0 && (
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 mr-2">View:</span>
                <motion.button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Grid className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <List className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-3">
                <SortAsc className="w-5 h-5 text-gray-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium bg-white"
                >
                  <option value="recent">Most Recent</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Undo Banner */}
        <AnimatePresence>
          {showUndo && undoStack.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4"
            >
              <p className="font-medium">Property removed from shortlist</p>
              <motion.button
                onClick={handleUndo}
                className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Undo
              </motion.button>
              <button
                onClick={() => {
                  setShowUndo(false);
                  setUndoStack([]);
                }}
                className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        {error ? (
          /* Error State */
          <motion.div 
            className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            </motion.div>
            <p className="text-red-800 font-medium text-xl mb-2">Oops! Something went wrong</p>
            <p className="text-red-600 text-sm mb-6">{error}</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={fetchShortlists}>Try Again</Button>
            </motion.div>
          </motion.div>
        ) : shortlists.length === 0 ? (
          /* Empty State */
          <motion.div 
            className="bg-white rounded-2xl shadow-2xl p-16 text-center border-2 border-gray-100"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Properties Shortlisted Yet
            </h3>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              Start browsing properties and add them to your shortlist to keep track of your favorites.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => navigate('/search')}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold text-lg px-8 py-4 shadow-xl"
                data-testid="browse-properties-btn"
              >
                <Search className="w-6 h-6 mr-2" />
                Browse Properties
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          /* Shortlisted Properties */
          <div>
            <motion.div 
              className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"}
              data-testid="shortlists-grid"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {sortedShortlists.map((shortlist, index) => {
                if (!shortlist.property) return null;
                
                return (
                  <motion.div 
                    key={shortlist.shortlist_id} 
                    className="relative group"
                    variants={fadeInUp}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    layout
                  >
                    {/* Remove button overlay */}
                    <motion.button
                      onClick={() => handleRemoveShortlist(shortlist.shortlist_id, shortlist.property_id)}
                      disabled={removingId === shortlist.shortlist_id}
                      className="absolute top-4 right-4 z-20 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-all shadow-lg disabled:opacity-50"
                      title="Remove from shortlist"
                      data-testid={`remove-shortlist-${shortlist.shortlist_id}`}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>

                    <PropertyCard
                      property={shortlist.property}
                      onShortlist={handleShortlistToggle}
                      isShortlisted={true}
                    />

                    {/* Notes (if any) */}
                    {shortlist.notes && (
                      <motion.div 
                        className="mt-3 px-4 py-3 bg-yellow-50 border-2 border-yellow-200 rounded-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Note:</span> {shortlist.notes}
                        </p>
                      </motion.div>
                    )}

                    {/* Added date */}
                    <motion.div 
                      className="mt-2 px-4 text-xs text-gray-500 flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      Added on {new Date(shortlist.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Action buttons */}
            <motion.div 
              className="mt-12 flex justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => navigate('/search')}
                  variant="outline"
                  className="border-2 border-red-600 text-red-600 hover:bg-red-50 font-bold px-8 py-3 text-lg"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Find More Properties
                </Button>
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Shortlists;