import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Heart, MessageCircle, 
  AlertCircle, Crown, CheckCircle, MapPin, Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getShortlists } from '../../services/shortlistService';
import { searchProperties } from '../../services/propertyService';
import PropertyCard from '../../components/property/PropertyCard';
import ContactLimitIndicator from '../../components/upsell/ContactLimitIndicator';
import Button from '../../components/common/Button';

const RenterDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [shortlistedProperties, setShortlistedProperties] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactsRemaining, setContactsRemaining] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      try {
        // Fetch shortlisted properties
        const shortlistsResponse = await getShortlists();
        const shortlists = shortlistsResponse.data || [];
        setShortlistedProperties(shortlists.slice(0, 3)); // Show only 3

        // Fetch recent properties (verified first)
        const propertiesResponse = await searchProperties({ 
          city: 'Bangalore',
          limit: 6,
          sort_by: 'default'
        });
        setRecentProperties(propertiesResponse.data.properties || []);

        // Calculate contacts remaining
        if (user) {
          const isPremium = user.subscription_tier === 'premium';
          const used = user.contacts_used || 0;
          const remaining = isPremium ? 'Unlimited' : Math.max(0, 5 - used);
          setContactsRemaining(remaining);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const isPremium = user?.subscription_tier === 'premium';
  const isVerified = user?.is_verified_renter;

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="renter-dashboard-title">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Renter'}!
          </h1>
          <p className="text-gray-600">Find your perfect home with Homer</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Subscription Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Crown className="w-6 h-6 text-blue-600" />
              </div>
              {isPremium && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  Active
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {isPremium ? 'Premium' : 'Free'}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {isPremium ? 'All features unlocked' : 'Limited features'}
            </p>
            {!isPremium && (
              <button
                onClick={() => navigate('/renter/subscription')}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Upgrade Now →
              </button>
            )}
          </div>

          {/* Contacts Remaining */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1" data-testid="contacts-remaining">
              {contactsRemaining}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {isPremium ? 'Unlimited contacts' : `Contacts remaining`}
            </p>
            {!isPremium && contactsRemaining < 3 && (
              <p className="text-xs text-orange-600 font-medium mb-2">
                <AlertCircle className="w-3 h-3 inline mr-1" />
                Running low on contacts
              </p>
            )}
            <button
              onClick={() => navigate('/renter/chats')}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
              data-testid="view-chats-btn"
            >
              View Messages →
            </button>
          </div>

          {/* Shortlisted Properties */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {shortlistedProperties.length}
            </h3>
            <p className="text-sm text-gray-600 mb-3">Shortlisted homes</p>
            <button
              onClick={() => navigate('/renter/shortlists')}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
              data-testid="view-shortlists-btn"
            >
              View All →
            </button>
          </div>

          {/* Verification Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${
                isVerified ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                <CheckCircle className={`w-6 h-6 ${
                  isVerified ? 'text-green-600' : 'text-yellow-600'
                }`} />
              </div>
              {isVerified && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                  Verified
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {isVerified ? 'Verified' : 'Not Verified'}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {isVerified ? 'Profile verified' : 'Profile not verified'}
            </p>
            {!isVerified && (
              <button
                onClick={() => navigate('/renter/verification')}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Get Verified →
              </button>
            )}
          </div>
        </div>

        {/* Contact Limit Indicator */}
        {user && (
          <ContactLimitIndicator
            contactsUsed={user.contacts_used || 0}
            contactsLimit={isPremium ? 'unlimited' : 5}
            isPremium={isPremium}
            className="mb-8"
          />
        )}

        {/* Upgrade Banner (for free users) */}
        {!isPremium && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 mb-8 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Upgrade to Premium</h2>
                <p className="text-blue-100 mb-4">
                  Get unlimited property contacts, advanced lifestyle search, verified badge, and more!
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Unlimited property contacts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Advanced lifestyle search filters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Verified Renter badge</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Reverse marketplace visibility</span>
                  </li>
                </ul>
                <Button
                  onClick={() => navigate('/renter/subscription')}
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  Upgrade Now - ₹750 for 90 days
                </Button>
              </div>
              <div className="hidden lg:block">
                <Crown className="w-32 h-32 text-blue-400 opacity-20" />
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => navigate('/search')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left group"
            data-testid="quick-action-search"
          >
            <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4 group-hover:bg-blue-200 transition-colors">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Search Properties</h3>
            <p className="text-sm text-gray-600">Browse thousands of verified properties</p>
          </button>

          <button
            onClick={() => navigate('/renter/shortlists')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left group"
          >
            <div className="p-3 bg-red-100 rounded-lg w-fit mb-4 group-hover:bg-red-200 transition-colors">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">My Shortlists</h3>
            <p className="text-sm text-gray-600">View your saved properties</p>
          </button>

          <button
            onClick={() => navigate('/renter/chats')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left group"
            data-testid="quick-action-messages"
          >
            <div className="p-3 bg-green-100 rounded-lg w-fit mb-4 group-hover:bg-green-200 transition-colors">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Messages</h3>
            <p className="text-sm text-gray-600">Chat with property owners</p>
          </button>

          {isPremium && isVerified && (
            <button
              onClick={() => navigate('/renter/privacy')}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left group"
              data-testid="quick-action-privacy"
            >
              <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4 group-hover:bg-purple-200 transition-colors">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy Settings</h3>
              <p className="text-sm text-gray-600">Manage reverse marketplace visibility</p>
            </button>
          )}
        </div>

        {/* Search Suggestions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Search Suggestions</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { location: 'Koramangala', bhk: '2BHK' },
              { location: 'Indiranagar', bhk: '3BHK' },
              { location: 'HSR Layout', bhk: '1BHK' },
              { location: 'Whitefield', bhk: '2BHK' },
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => navigate(`/search?location=${suggestion.location}&bhk_type=${suggestion.bhk}`)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-full hover:border-blue-600 hover:text-blue-600 transition-colors"
              >
                <MapPin className="w-4 h-4 inline mr-2" />
                {suggestion.bhk} in {suggestion.location}
              </button>
            ))}
          </div>
        </div>

        {/* Shortlisted Properties */}
        {shortlistedProperties.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Your Shortlisted Properties</h2>
              <button
                onClick={() => navigate('/renter/shortlists')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View All →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shortlistedProperties.map((shortlist) => (
                shortlist.property && (
                  <PropertyCard
                    key={shortlist.shortlist_id}
                    property={shortlist.property}
                    onShortlist={() => {}}
                    isShortlisted={true}
                  />
                )
              ))}
            </div>
          </div>
        )}

        {/* Recent Properties */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Recently Added Properties</h2>
            <button
              onClick={() => navigate('/search')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="recent-properties-grid">
            {recentProperties.map((property) => (
              <PropertyCard
                key={property.property_id}
                property={property}
                onShortlist={() => {}}
                isShortlisted={false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenterDashboard;
