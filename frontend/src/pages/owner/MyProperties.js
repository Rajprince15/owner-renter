import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Users, AlertCircle, CheckCircle, BarChart3 } from 'lucide-react';
import { getMyProperties, deleteProperty } from '../../services/propertyService';
import Button from '../../components/common/Button';
import { pageTransition, staggerContainer, staggerItem, fadeInUp, hoverLift } from '../../utils/motionConfig';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, verified, unverified

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await getMyProperties();
      setProperties(response.data);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await deleteProperty(propertyId);
        setProperties(properties.filter(p => p.property_id !== propertyId));
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Failed to delete property');
      }
    }
  };

  const filteredProperties = properties.filter(p => {
    if (filter === 'verified') return p.is_verified;
    if (filter === 'unverified') return !p.is_verified;
    return true;
  });

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50" 
      data-testid="my-properties-page"
      {...pageTransition}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container-custom py-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <motion.h1 
              className="text-4xl font-bold text-slate-900 mb-2" 
              data-testid="page-title"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              My Properties 🏠
            </motion.h1>
            <motion.p 
              className="text-slate-600 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Manage and track all your listed properties
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="primary"
              to="/owner/property/add"
              data-testid="add-property-btn"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Property
            </Button>
          </motion.div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-6 border border-slate-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex gap-4">
            {[
              { key: 'all', label: 'All Properties', count: properties.length },
              { key: 'verified', label: 'Verified', count: properties.filter(p => p.is_verified).length },
              { key: 'unverified', label: 'Unverified', count: properties.filter(p => !p.is_verified).length }
            ].map((tab, index) => (
              <motion.div
                key={tab.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <FilterTab
                  label={tab.label}
                  count={tab.count}
                  active={filter === tab.key}
                  onClick={() => setFilter(tab.key)}
                  testId={`filter-${tab.key}`}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Properties Grid */}
        {loading ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="inline-block h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-slate-600 mt-4">Loading properties...</p>
          </motion.div>
        ) : filteredProperties.length === 0 ? (
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center border border-slate-200" 
            data-testid="no-properties-message"
            {...fadeInUp}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Plus className="w-10 h-10 text-slate-400" />
              </div>
            </motion.div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {filter === 'all' ? 'No properties yet' : `No ${filter} properties`}
            </h3>
            <p className="text-slate-600 mb-6">
              {filter === 'all'
                ? 'Start by adding your first property to attract renters'
                : `You don't have any ${filter} properties at the moment`}
            </p>
            {filter === 'all' && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="primary" to="/owner/property/add">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Property
                </Button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <AnimatePresence mode="popLayout">
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.property_id}
                  variants={staggerItem}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <PropertyCard
                    property={property}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Filter Tab Component
const FilterTab = ({ label, count, active, onClick, testId }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-medium transition-all ${
        active
          ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/50'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
      data-testid={testId}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      animate={active ? {
        boxShadow: [
          '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
          '0 10px 25px -3px rgba(59, 130, 246, 0.5)',
          '0 10px 15px -3px rgba(59, 130, 246, 0.3)'
        ]
      } : {}}
      transition={{ duration: 2, repeat: active ? Infinity : 0 }}
    >
      {label} <span className="ml-1 font-bold">({count})</span>
    </motion.button>
  );
};

// Property Card Component
const PropertyCard = ({ property, onDelete }) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200"
      data-testid={`property-card-${property.property_id}`}
      whileHover={{ 
        y: -8,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden group">
        <motion.img
          src={property.images?.[0] || 'https://via.placeholder.com/400x300'}
          alt={property.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        />
        {/* Gradient Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          {property.is_verified ? (
            <motion.span 
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white shadow-lg backdrop-blur-sm"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified
            </motion.span>
          ) : (
            <motion.span 
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white shadow-lg backdrop-blur-sm"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertCircle className="w-3 h-3 mr-1" />
              Not Verified
            </motion.span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-1">
          {property.title}
        </h3>
        <p className="text-sm text-slate-600 mb-3">
          {property.location.locality}, {property.location.city}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <motion.p 
              className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              ₹{property.rent.toLocaleString()}
            </motion.p>
            <p className="text-xs text-slate-500">per month</p>
          </div>
          <div className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
            {property.bhk_type}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4 pb-4 border-b border-slate-200">
          <motion.div 
            className="flex items-center gap-1"
            whileHover={{ scale: 1.1 }}
          >
            <Eye className="w-4 h-4" />
            <span>{property.analytics?.total_views || 0}</span>
          </motion.div>
          <motion.div 
            className="flex items-center gap-1"
            whileHover={{ scale: 1.1 }}
          >
            <Users className="w-4 h-4" />
            <span>{property.analytics?.total_contacts || 0}</span>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <motion.div className="flex-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={`/owner/property/${property.property_id}/edit`}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition text-sm font-medium shadow-lg shadow-primary-500/30"
                data-testid={`edit-btn-${property.property_id}`}
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>
            </motion.div>
            <motion.button
              onClick={() => onDelete(property.property_id)}
              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-500/30"
              data-testid={`delete-btn-${property.property_id}`}
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
          
          {!property.is_verified ? (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/owner/verification"
                state={{ propertyId: property.property_id }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition text-sm font-semibold shadow-lg shadow-green-500/30"
                data-testid={`verify-btn-${property.property_id}`}
              >
                <CheckCircle className="w-4 h-4" />
                Verify Property (₹1,500)
              </Link>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to={`/owner/property/${property.property_id}/analytics`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition text-sm font-medium"
                data-testid={`analytics-btn-${property.property_id}`}
              >
                <BarChart3 className="w-4 h-4" />
                View Analytics
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MyProperties;