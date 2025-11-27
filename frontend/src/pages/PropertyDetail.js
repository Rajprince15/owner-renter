import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  MapPin, BedDouble, Home, Ruler, Car, Heart, MessageCircle, 
  CheckCircle, AlertCircle, User, Phone, Mail,
  Wind, Footprints, Trees, Activity, ArrowLeft, Eye, Share2, X
} from 'lucide-react';
import PropertyGallery from '../components/property/PropertyGallery';
import Button from '../components/common/Button';
import UpgradeModal from '../components/upsell/UpgradeModal';
import OwnerVerificationBanner from '../components/property/OwnerVerificationBanner';
import { getPropertyDetail } from '../services/propertyService';
import { addToShortlist, removeFromShortlistByPropertyId, isPropertyShortlisted } from '../services/shortlistService';
import { initiateChat } from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import { fadeInUp, staggerContainer, staggerItem, slideInLeft, slideInRight, scaleIn } from '../utils/motionConfig';

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
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Intersection observers for scroll animations
  const [overviewRef, overviewInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [amenitiesRef, amenitiesInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [lifestyleRef, lifestyleInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [detailsRef, detailsInView] = useInView({ triggerOnce: true, threshold: 0.1 });

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

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex justify-center items-center transition-colors duration-200">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"
        />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex justify-center items-center transition-colors duration-200">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <AlertCircle className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Property Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The property you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/search')}>Back to Search</Button>
        </motion.div>
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
        {/* Back button with animation */}
        <motion.button
          onClick={() => navigate('/search')}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          data-testid="back-to-search-btn"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Search
        </motion.button>

        {/* Gallery with animation */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PropertyGallery images={property.images} title={property.title} />
        </motion.div>

        {/* Owner Verification Banner (only show if user is the owner) */}
        {user && user.user_id === property.owner_id && !property.is_verified && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <OwnerVerificationBanner property={property} />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header with animation */}
            <motion.div
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6 transition-colors duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <motion.h1
                      className="text-3xl font-bold text-gray-900 dark:text-white"
                      data-testid="property-title"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {property.title}
                    </motion.h1>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.3 }}
                    >
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
                    </motion.span>
                  </div>
                  <motion.div
                    className="flex items-center text-gray-600 dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{property.location.address}, {property.location.locality}, {property.location.city}</span>
                  </motion.div>
                </div>
                <motion.button
                  onClick={handleShare}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Share2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </motion.button>
              </div>

              <motion.div
                className="border-t border-slate-200 dark:border-slate-700 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-baseline gap-2 mb-2">
                  <motion.span
                    className="text-4xl font-bold text-blue-600 dark:text-blue-400"
                    data-testid="property-rent"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.7 }}
                  >
                    ₹{property.rent.toLocaleString()}
                  </motion.span>
                  <span className="text-gray-600 dark:text-gray-400">per month</span>
                </div>
                <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>Deposit: ₹{property.security_deposit.toLocaleString()}</span>
                  <span>•</span>
                  <span>Maintenance: ₹{property.maintenance_charges.toLocaleString()}/month</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Overview with scroll animation */}
            <motion.div
              ref={overviewRef}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6 transition-colors duration-200"
              initial={{ opacity: 0, y: 30 }}
              animate={overviewInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                variants={staggerContainer}
                initial="initial"
                animate={overviewInView ? "animate" : "initial"}
              >
                {[
                  { Icon: BedDouble, label: 'Type', value: property.bhk_type },
                  { Icon: Ruler, label: 'Area', value: `${property.details.carpet_area} sq.ft` },
                  { Icon: Home, label: 'Furnishing', value: property.details.furnishing },
                  { Icon: Car, label: 'Parking', value: `${property.details.parking.car} Car, ${property.details.parking.bike} Bike` }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={staggerItem}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                  >
                    <item.Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
                      <p className="font-semibold text-gray-900 dark:text-white capitalize">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Description with animation */}
            <motion.div
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6 transition-colors duration-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About Property</h2>
              <motion.p
                className="text-gray-700 dark:text-gray-300 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                {property.description}
              </motion.p>
            </motion.div>

            {/* Amenities with stagger animation */}
            <motion.div
              ref={amenitiesRef}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6 transition-colors duration-200"
              initial={{ opacity: 0, y: 30 }}
              animate={amenitiesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Amenities</h2>
              <motion.div
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
                variants={staggerContainer}
                initial="initial"
                animate={amenitiesInView ? "animate" : "initial"}
              >
                {property.details.amenities.map((amenity, index) => {
                  const Icon = amenityIcons[amenity] || CheckCircle;
                  return (
                    <motion.div
                      key={index}
                      variants={staggerItem}
                      whileHover={{ scale: 1.05, x: 5 }}
                      className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                    >
                      <Icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-gray-700 dark:text-gray-300 capitalize">{amenity.replace(/_/g, ' ')}</span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Lifestyle Data with animation */}
            {property.lifestyle_data && (
              <motion.div
                ref={lifestyleRef}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6 transition-colors duration-200"
                initial={{ opacity: 0, y: 30 }}
                animate={lifestyleInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Lifestyle Scores</h2>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  variants={staggerContainer}
                  initial="initial"
                  animate={lifestyleInView ? "animate" : "initial"}
                >
                  {[
                    { Icon: Wind, label: 'Air Quality', value: property.lifestyle_data.aqi_score, unit: 'AQI Score', color: 'blue' },
                    { Icon: Footprints, label: 'Walkability', value: property.lifestyle_data.walkability_score, unit: 'out of 100', color: 'green' },
                    { Icon: Activity, label: 'Noise Level', value: property.lifestyle_data.noise_level, unit: 'dB', color: 'orange' }
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      variants={staggerItem}
                      whileHover={{ y: -8 }}
                      className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <item.Icon className={`w-5 h-5 text-${item.color}-600 dark:text-${item.color}-400`} />
                        <span className="font-semibold text-gray-900 dark:text-white">{item.label}</span>
                      </div>
                      <motion.p
                        className={`text-3xl font-bold text-${item.color}-600 dark:text-${item.color}-400`}
                        initial={{ scale: 0 }}
                        animate={lifestyleInView ? { scale: 1 } : {}}
                        transition={{ type: "spring", delay: 0.2 + idx * 0.1 }}
                      >
                        {item.value}
                      </motion.p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.unit}</p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Nearby Places */}
                {property.lifestyle_data.nearby_parks.length > 0 && (
                  <motion.div
                    className="mt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={lifestyleInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5 }}
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Nearby Parks</h3>
                    <motion.ul
                      className="space-y-1"
                      variants={staggerContainer}
                      initial="initial"
                      animate={lifestyleInView ? "animate" : "initial"}
                    >
                      {property.lifestyle_data.nearby_parks.map((park, index) => (
                        <motion.li
                          key={index}
                          variants={staggerItem}
                          className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"
                        >
                          <Trees className="w-4 h-4 text-green-600 dark:text-green-400" />
                          {park.name} - {park.distance} km
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Property Details with animation */}
            <motion.div
              ref={detailsRef}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6 transition-colors duration-200"
              initial={{ opacity: 0, y: 30 }}
              animate={detailsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Property Details</h2>
              <motion.div
                className="grid grid-cols-2 gap-4 text-sm"
                variants={staggerContainer}
                initial="initial"
                animate={detailsInView ? "animate" : "initial"}
              >
                {[
                  { label: 'Property Type', value: property.property_type },
                  { label: 'Floor', value: `${property.details.floor_number} of ${property.details.total_floors}` },
                  { label: 'Bathrooms', value: property.details.bathrooms },
                  { label: 'Balconies', value: property.details.balconies },
                  { label: 'Facing', value: property.details.facing },
                  { label: 'Age', value: `${property.details.age_of_property} years` },
                  { label: 'Available From', value: new Date(property.details.available_from).toLocaleDateString() },
                  { label: 'Pets Allowed', value: property.details.pets_allowed ? 'Yes' : 'No' }
                ].map((detail, idx) => (
                  <motion.div
                    key={idx}
                    variants={staggerItem}
                    whileHover={{ scale: 1.05 }}
                    className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                  >
                    <p className="text-gray-600 dark:text-gray-400">{detail.label}</p>
                    <p className="font-semibold text-gray-900 dark:text-white capitalize">{detail.value}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Sidebar with slide-in animation */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6 sticky top-4 transition-colors duration-200"
              whileHover={{ boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Contact Owner</h3>
              
              {/* Owner info (masked) */}
              <motion.div
                className="mb-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </motion.div>
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
              </motion.div>

              {/* Action buttons with animation */}
              <motion.div
                className="space-y-3"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <motion.div variants={staggerItem} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleContactOwner}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    data-testid="contact-owner-btn"
                    disabled={contactingOwner}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {contactingOwner ? 'Connecting...' : 'Contact Owner'}
                  </Button>
                </motion.div>
                
                <motion.div variants={staggerItem} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleShortlist}
                    variant="outline"
                    className="w-full"
                    data-testid="add-to-shortlist-btn"
                  >
                    <motion.div
                      animate={isShortlisted ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <Heart className={`w-5 h-5 mr-2 ${isShortlisted ? 'fill-red-500 text-red-500' : ''}`} />
                    </motion.div>
                    {isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
                  </Button>
                </motion.div>
              </motion.div>

              {/* Property Stats with animation */}
              <motion.div
                className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Property Stats</h4>
                <motion.div
                  className="space-y-2 text-sm"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {[
                    { label: 'Views', value: property.analytics.total_views, icon: Eye },
                    { label: 'Shortlisted', value: property.analytics.shortlisted_count, icon: Heart },
                    { label: 'Contacts', value: property.analytics.total_contacts, icon: MessageCircle }
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      variants={staggerItem}
                      className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700 rounded"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        <stat.icon className="w-4 h-4 mr-2" />
                        {stat.label}
                      </span>
                      <motion.span
                        className="font-semibold text-gray-900 dark:text-white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.6 + idx * 0.1 }}
                      >
                        {stat.value}
                      </motion.span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Share Property</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <motion.button
                  onClick={copyToClipboard}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  {copied ? '✓ Copied!' : 'Copy Link'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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