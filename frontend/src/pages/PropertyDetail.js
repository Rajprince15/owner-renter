import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, BedDouble, Home, Ruler, Car, Heart, MessageCircle, 
  CheckCircle, AlertCircle, User, Phone, Mail,
  Wind, Footprints, Trees, Activity, ArrowLeft
} from 'lucide-react';
import PropertyGallery from '../components/property/PropertyGallery';
import Button from '../components/common/Button';
import UpgradeModal from '../components/upsell/UpgradeModal';
import OwnerVerificationBanner from '../components/property/OwnerVerificationBanner';
import { getPropertyDetail } from '../services/propertyService';
import { addToShortlist, removeFromShortlistByPropertyId, isPropertyShortlisted } from '../services/shortlistService';
import { initiateChat } from '../services/chatService';
import { useAuth } from '../context/AuthContext';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [contactingOwner, setContactingOwner] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await getPropertyDetail(id);
        setProperty(response.data);
        
        // Check if shortlisted
        if (user) {
          setIsShortlisted(isPropertyShortlisted(id));
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Property not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, user]);

  const handleShortlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isShortlisted) {
        await removeFromShortlistByPropertyId(id);
        setIsShortlisted(false);
      } else {
        await addToShortlist(id, '');
        setIsShortlisted(true);
      }
    } catch (err) {
      console.error('Error toggling shortlist:', err);
      alert(err.response?.data?.message || 'Failed to update shortlist');
    }
  };

  const handleContactOwner = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Only renters can contact owners
    if (user.user_type === 'owner') {
      alert('Property owners cannot contact other owners. Please create a renter account.');
      return;
    }
    
    setContactingOwner(true);
    
    try {
      const response = await initiateChat(id);
      const chatId = response.data.chat_id;
      
      // Navigate to the chat
      navigate(`/renter/chats/${chatId}`);
    } catch (err) {
      console.error('Error initiating chat:', err);
      
      // Check if it's a contact limit error
      if (err.response?.status === 403 && err.response?.data?.message?.includes('Contact limit')) {
        // User has reached free tier limit - show upgrade modal
        setShowUpgradeModal(true);
      } else {
        alert(err.response?.data?.message || 'Failed to start chat. Please try again.');
      }
    } finally {
      setContactingOwner(false);
    }
  };

  const handleUpgrade = () => {
    setShowUpgradeModal(false);
    navigate('/renter/subscription');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex justify-center items-center transition-colors duration-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex justify-center items-center transition-colors duration-200">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Property Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The property you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/search')}>Back to Search</Button>
        </div>
      </div>
    );
  }

  const amenityIcons = {
    gym: Activity,
    swimming_pool: Activity,
    lift: Home,
    power_backup: Activity,
    security: CheckCircle,
    park: Trees,
    club_house: Home,
    playground: Trees,
    jogging_track: Footprints
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/search')}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          data-testid="back-to-search-btn"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Search
        </button>

        {/* Gallery */}
        <div className="mb-8">
          <PropertyGallery images={property.images} title={property.title} />
        </div>

        {/* Owner Verification Banner (only show if user is the owner) */}
        {user && user.user_id === property.owner_id && !property.is_verified && (
          <OwnerVerificationBanner property={property} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6 transition-colors duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="property-title">
                      {property.title}
                    </h1>
                    {property.is_verified ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Not Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{property.location.address}, {property.location.locality}, {property.location.city}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-blue-600 dark:text-blue-400" data-testid="property-rent">
                    ₹{property.rent.toLocaleString()}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">per month</span>
                </div>
                <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>Deposit: ₹{property.security_deposit.toLocaleString()}</span>
                  <span>•</span>
                  <span>Maintenance: ₹{property.maintenance_charges.toLocaleString()}/month</span>
                </div>
              </div>
            </div>

            {/* Overview */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6 transition-colors duration-200">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <BedDouble className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{property.bhk_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Ruler className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Area</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{property.details.carpet_area} sq.ft</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Home className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Furnishing</p>
                    <p className="font-semibold text-gray-900 dark:text-white capitalize">{property.details.furnishing}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Car className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Parking</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {property.details.parking.car} Car, {property.details.parking.bike} Bike
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6 transition-colors duration-200">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About Property</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6 transition-colors duration-200">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.details.amenities.map((amenity, index) => {
                  const Icon = amenityIcons[amenity] || CheckCircle;
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-gray-700 dark:text-gray-300 capitalize">{amenity.replace(/_/g, ' ')}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lifestyle Data (if verified) */}
            {property.lifestyle_data && (
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6 transition-colors duration-200">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Lifestyle Scores</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* AQI */}
                  <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Wind className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold text-gray-900 dark:text-white">Air Quality</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{property.lifestyle_data.aqi_score}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">AQI Score</p>
                  </div>

                  {/* Walkability */}
                  <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Footprints className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="font-semibold text-gray-900 dark:text-white">Walkability</span>
                    </div>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{property.lifestyle_data.walkability_score}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">out of 100</p>
                  </div>

                  {/* Noise Level */}
                  <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      <span className="font-semibold text-gray-900 dark:text-white">Noise Level</span>
                    </div>
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{property.lifestyle_data.noise_level} dB</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Average</p>
                  </div>
                </div>

                {/* Nearby Places */}
                {property.lifestyle_data.nearby_parks.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Nearby Parks</h3>
                    <ul className="space-y-1">
                      {property.lifestyle_data.nearby_parks.map((park, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <Trees className="w-4 h-4 text-green-600 dark:text-green-400" />
                          {park.name} - {park.distance} km
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Property Details */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6 transition-colors duration-200">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Property Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Property Type</p>
                  <p className="font-semibold text-gray-900 dark:text-white capitalize">{property.property_type}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Floor</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{property.details.floor_number} of {property.details.total_floors}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Bathrooms</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{property.details.bathrooms}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Balconies</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{property.details.balconies}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Facing</p>
                  <p className="font-semibold text-gray-900 dark:text-white capitalize">{property.details.facing}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Age</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{property.details.age_of_property} years</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Available From</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{new Date(property.details.available_from).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Pets Allowed</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{property.details.pets_allowed ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6 sticky top-4 transition-colors duration-200">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Contact Owner</h3>
              
              {/* Owner info (masked) */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Property Owner</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Verified Owner</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Contact available after connecting
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email available after connecting
                </p>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleContactOwner}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  data-testid="contact-owner-btn"
                  disabled={contactingOwner}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {contactingOwner ? 'Connecting...' : 'Contact Owner'}
                </Button>
                
                <Button
                  onClick={handleShortlist}
                  variant="outline"
                  className="w-full"
                  data-testid="add-to-shortlist-btn"
                >
                  <Heart className={`w-5 h-5 mr-2 ${isShortlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  {isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
                </Button>
              </div>

              {/* Property Stats */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Property Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Views</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{property.analytics.total_views}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shortlisted</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{property.analytics.shortlisted_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Contacts</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{property.analytics.total_contacts}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
        contactsUsed={user?.contacts_used || 0}
        contactsLimit={user?.subscription_tier === 'premium' ? 'unlimited' : 2}
      />
    </div>
  );
};

export default PropertyDetail;
