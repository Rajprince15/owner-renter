import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Home, TrendingUp, Eye, Users, AlertCircle, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getMyProperties } from '../../services/propertyService';
import Button from '../../components/common/Button';
import VerificationStatusWidget from '../../components/owner/VerificationStatusWidget';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    unverified: 0,
    totalViews: 0,
    totalContacts: 0
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await getMyProperties();
      const props = response.data;
      setProperties(props);
      
      // Calculate stats
      const verified = props.filter(p => p.is_verified).length;
      const totalViews = props.reduce((sum, p) => sum + (p.analytics?.total_views || 0), 0);
      const totalContacts = props.reduce((sum, p) => sum + (p.analytics?.total_contacts || 0), 0);
      
      setStats({
        total: props.length,
        verified: verified,
        unverified: props.length - verified,
        totalViews: totalViews,
        totalContacts: totalContacts
      });
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="owner-dashboard">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2" data-testid="dashboard-title">
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-slate-600">Manage your properties and track performance</p>
        </div>

        {/* Verification Status Widget */}
        <div className="mb-8">
          <VerificationStatusWidget properties={properties} user={user} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Home className="w-6 h-6" />}
            title="Total Properties"
            value={stats.total}
            color="blue"
            testId="stat-total-properties"
          />
          <StatCard
            icon={<Eye className="w-6 h-6" />}
            title="Total Views"
            value={stats.totalViews}
            color="green"
            testId="stat-total-views"
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Total Contacts"
            value={stats.totalContacts}
            color="purple"
            testId="stat-total-contacts"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Verified Properties"
            value={stats.verified}
            color="indigo"
            testId="stat-verified-properties"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="primary"
              to="/owner/property/add"
              data-testid="add-property-btn"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Property
            </Button>
            <Button
              variant="outline"
              to="/owner/properties"
              data-testid="view-all-properties-btn"
            >
              <Home className="w-5 h-5 mr-2" />
              View All Properties
            </Button>
            <Button
              variant="outline"
              to="/owner/chats"
              data-testid="view-chats-btn"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              View Messages
            </Button>
            {user?.is_verified_owner && (
              <Button
                variant="outline"
                to="/owner/reverse-marketplace"
                data-testid="reverse-marketplace-btn"
              >
                <Users className="w-5 h-5 mr-2" />
                Browse Renters
              </Button>
            )}
            {stats.unverified > 0 && (
              <Button
                variant="outline"
                to="/owner/verification"
                data-testid="get-verified-btn"
              >
                <AlertCircle className="w-5 h-5 mr-2" />
                Get Properties Verified ({stats.unverified})
              </Button>
            )}
          </div>
        </div>

        {/* Recent Properties */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Properties</h2>
            <Link
              to="/owner/properties"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="text-slate-600 mt-4">Loading properties...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12" data-testid="no-properties-message">
              <Home className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No properties yet</h3>
              <p className="text-slate-600 mb-6">Start by adding your first property to get renters interested!</p>
              <Button variant="primary" to="/owner/property/add">
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Property
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {properties.slice(0, 3).map((property) => (
                <PropertyListItem key={property.property_id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, color, testId }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    indigo: 'bg-indigo-100 text-indigo-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6" data-testid={testId}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Property List Item Component
const PropertyListItem = ({ property }) => {
  return (
    <Link
      to={`/owner/property/${property.property_id}/edit`}
      className="block p-4 border border-slate-200 rounded-lg hover:border-primary-300 hover:shadow-md transition"
      data-testid={`property-item-${property.property_id}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-slate-900">{property.title}</h3>
            {!property.is_verified && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <AlertCircle className="w-3 h-3 mr-1" />
                Not Verified
              </span>
            )}
            {property.is_verified && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✓ Verified
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 mb-2">
            {property.location.locality}, {property.location.city}
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>{property.bhk_type}</span>
            <span>•</span>
            <span>₹{property.rent.toLocaleString()}/month</span>
            <span>•</span>
            <span>{property.analytics?.total_views || 0} views</span>
            <span>•</span>
            <span>{property.analytics?.total_contacts || 0} contacts</span>
          </div>
        </div>
        <div className="ml-4">
          {property.images && property.images.length > 0 && (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-24 h-24 rounded-lg object-cover"
            />
          )}
        </div>
      </div>
    </Link>
  );
};

export default OwnerDashboard;
