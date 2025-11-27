import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, BedDouble, Heart, Eye } from 'lucide-react';
import VerifiedBadge from '../common/VerifiedBadge';
import LifestyleScoreBadge from './LifestyleScoreBadge';
import { fadeInUp, scaleIn } from '../../utils/motionConfig';

const PropertyCard = ({ property, onShortlist, isShortlisted = false }) => {
  const [shortlisted, setShortlisted] = useState(isShortlisted);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const {
    property_id,
    title,
    rent,
    location,
    bhk_type,
    details,
    images,
    is_verified,
    lifestyle_data
  } = property;

  const handleShortlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await onShortlist(property_id, !shortlisted);
      setShortlisted(!shortlisted);
    } catch (error) {
      console.error('Error toggling shortlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md overflow-hidden transition-all duration-300"
      data-testid={`property-card-${property_id}`}
      variants={fadeInUp}
      whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Image with Hover Overlay */}
      <Link to={`/property/${property_id}`}>
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={images && images[0] ? images[0] : 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Hover Overlay with Details */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="text-white"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Verification badge */}
          <motion.div
            className="absolute top-2 right-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
          >
            <VerifiedBadge isVerified={is_verified} size="small" />
          </motion.div>
          
          {/* Shortlist button with Heart Animation */}
          <motion.button
            onClick={handleShortlistClick}
            disabled={isLoading}
            className="absolute top-2 left-2 bg-white dark:bg-slate-800 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition disabled:opacity-50"
            data-testid={`shortlist-btn-${property_id}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <motion.div
              animate={shortlisted ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart 
                className={`w-5 h-5 transition-colors ${
                  shortlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'
                }`}
              />
            </motion.div>
          </motion.button>
        </div>
      </Link>

      {/* Content with Stagger Animation */}
      <Link to={`/property/${property_id}`}>
        <motion.div
          className="p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Title and Price */}
          <div className="flex justify-between items-start mb-2">
            <motion.h3
              className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {title}
            </motion.h3>
            <motion.div
              className="text-right ml-2"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.p
                className="text-xl font-bold text-blue-600 dark:text-blue-400"
                whileHover={{ scale: 1.05 }}
              >
                ₹{rent?.toLocaleString()}
              </motion.p>
              <p className="text-xs text-gray-500 dark:text-gray-400">per month</p>
            </motion.div>
          </div>

          {/* Location */}
          <motion.div
            className="flex items-center text-gray-600 dark:text-gray-400 mb-3"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="text-sm truncate">
              {location?.locality}, {location?.city}
            </span>
          </motion.div>

          {/* Details */}
          <motion.div
            className="flex items-center text-gray-700 dark:text-gray-300 mb-3 text-sm"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <BedDouble className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{bhk_type}</span>
            <span className="mx-2">•</span>
            <span className="capitalize">{details?.furnishing}</span>
            <span className="mx-2">•</span>
            <span>{details?.carpet_area} sq.ft</span>
          </motion.div>

          {/* Lifestyle scores with Stagger Animation */}
          {lifestyle_data && (
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.7 }}
              >
                <LifestyleScoreBadge 
                  type="aqi" 
                  value={lifestyle_data.aqi_score} 
                  size="small"
                  showLabel={false}
                />
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.75 }}
              >
                <LifestyleScoreBadge 
                  type="walkability" 
                  value={lifestyle_data.walkability_score} 
                  size="small"
                  showLabel={false}
                />
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;