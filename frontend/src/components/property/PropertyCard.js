import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BedDouble, Heart } from 'lucide-react';
import VerifiedBadge from '../common/VerifiedBadge';
import LifestyleScoreBadge from './LifestyleScoreBadge';

const PropertyCard = ({ property, onShortlist, isShortlisted = false }) => {
  const [shortlisted, setShortlisted] = useState(isShortlisted);
  const [isLoading, setIsLoading] = useState(false);

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
    <div 
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
      data-testid={`property-card-${property_id}`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={images && images[0] ? images[0] : 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        
        {/* Verification badge */}
        <div className="absolute top-2 right-2">
          <VerifiedBadge isVerified={is_verified} size="small" />
        </div>
        
        {/* Shortlist button */}
        <button
          onClick={handleShortlistClick}
          disabled={isLoading}
          className="absolute top-2 left-2 bg-white dark:bg-slate-800 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition disabled:opacity-50"
          data-testid={`shortlist-btn-${property_id}`}
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${
              shortlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <Link to={`/property/${property_id}`}>
        <div className="p-4">
          {/* Title and Price */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
              {title}
            </h3>
            <div className="text-right ml-2">
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">₹{rent?.toLocaleString()}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">per month</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="text-sm truncate">
              {location?.locality}, {location?.city}
            </span>
          </div>

          {/* Details */}
          <div className="flex items-center text-gray-700 dark:text-gray-300 mb-3 text-sm">
            <BedDouble className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{bhk_type}</span>
            <span className="mx-2">•</span>
            <span className="capitalize">{details?.furnishing}</span>
            <span className="mx-2">•</span>
            <span>{details?.carpet_area} sq.ft</span>
          </div>

          {/* Lifestyle scores (if verified) */}
          {lifestyle_data && (
            <div className="flex flex-wrap gap-2">
              <LifestyleScoreBadge 
                type="aqi" 
                value={lifestyle_data.aqi_score} 
                size="small"
                showLabel={false}
              />
              <LifestyleScoreBadge 
                type="walkability" 
                value={lifestyle_data.walkability_score} 
                size="small"
                showLabel={false}
              />
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
