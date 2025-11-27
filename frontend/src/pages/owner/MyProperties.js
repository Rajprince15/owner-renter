import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Users, AlertCircle, CheckCircle, BarChart3, Shield } from 'lucide-react';
import { getMyProperties, deleteProperty } from '../../services/propertyService';
import Button from '../../components/common/Button';

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
    <div className="min-h-screen bg-slate-50" data-testid="my-properties-page">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2" data-testid="page-title">
              My Properties
            </h1>
            <p className="text-slate-600">
              Manage and track all your listed properties
            </p>
          </div>
          <Button
            variant="primary"
            to="/owner/property/add"
            data-testid="add-property-btn"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Property
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-4">
            <FilterTab
              label="All Properties"
              count={properties.length}
              active={filter === 'all'}
              onClick={() => setFilter('all')}
              testId="filter-all"
            />
            <FilterTab
              label="Verified"
              count={properties.filter(p => p.is_verified).length}
              active={filter === 'verified'}
              onClick={() => setFilter('verified')}
              testId="filter-verified"
            />
            <FilterTab
              label="Unverified"
              count={properties.filter(p => !p.is_verified).length}
              active={filter === 'unverified'}
              onClick={() => setFilter('unverified')}
              testId="filter-unverified"
            />
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="text-slate-600 mt-4">Loading properties...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center" data-testid="no-properties-message">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {filter === 'all' ? 'No properties yet' : `No ${filter} properties`}
            </h3>
            <p className="text-slate-600 mb-6">
              {filter === 'all'
                ? 'Start by adding your first property to attract renters'
                : `You don't have any ${filter} properties at the moment`}
            </p>
            {filter === 'all' && (
              <Button variant="primary" to="/owner/property/add">
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Property
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.property_id}
                property={property}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Filter Tab Component
const FilterTab = ({ label, count, active, onClick, testId }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition ${
        active
          ? 'bg-primary-100 text-primary-700'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
      data-testid={testId}
    >
      {label} <span className="ml-1">({count})</span>
    </button>
  );
};

// Property Card Component
const PropertyCard = ({ property, onDelete }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
      data-testid={`property-card-${property.property_id}`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.images?.[0] || 'https://via.placeholder.com/400x300'}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          {property.is_verified ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <AlertCircle className="w-3 h-3 mr-1" />
              Not Verified
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-1">
          {property.title}
        </h3>
        <p className="text-sm text-slate-600 mb-3">
          {property.location.locality}, {property.location.city}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xl font-bold text-primary-600">
              ₹{property.rent.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">per month</p>
          </div>
          <div className="text-sm text-slate-600">
            {property.bhk_type}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{property.analytics?.total_views || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{property.analytics?.total_contacts || 0}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Link
              to={`/owner/property/${property.property_id}/edit`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium"
              data-testid={`edit-btn-${property.property_id}`}
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={() => onDelete(property.property_id)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              data-testid={`delete-btn-${property.property_id}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          {/* Show Verify button for unverified properties */}
          {!property.is_verified ? (
            <Link
              to="/owner/verification"
              state={{ propertyId: property.property_id }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition text-sm font-semibold shadow-md"
              data-testid={`verify-btn-${property.property_id}`}
            >
              <CheckCircle className="w-4 h-4" />
              Verify Property (₹1,500)
            </Link>
          ) : (
            <Link
              to={`/owner/property/${property.property_id}/analytics`}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
              data-testid={`analytics-btn-${property.property_id}`}
            >
              <BarChart3 className="w-4 h-4" />
              View Analytics
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProperties;
