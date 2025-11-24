import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BedDouble, Heart, CheckCircle, AlertCircle } from 'lucide-react';

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
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
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
          {is_verified ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <AlertCircle className="w-3 h-3 mr-1" />
              Not Verified
            </span>
          )}
        </div>
        
        {/* Shortlist button */}
        <button
          onClick={handleShortlistClick}
          disabled={isLoading}
          className="absolute top-2 left-2 bg-white p-2 rounded-full hover:bg-red-50 transition disabled:opacity-50"
          data-testid={`shortlist-btn-${property_id}`}
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${
              shortlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <Link to={`/property/${property_id}`}>
        <div className="p-4">
          {/* Title and Price */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
              {title}
            </h3>
            <div className="text-right ml-2">
              <p className="text-xl font-bold text-blue-600">₹{rent?.toLocaleString()}</p>
              <p className="text-xs text-gray-500">per month</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="text-sm truncate">
              {location?.locality}, {location?.city}
            </span>
          </div>

          {/* Details */}
          <div className="flex items-center text-gray-700 mb-3 text-sm">
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
              {/* AQI Badge */}
              <span 
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  lifestyle_data.aqi_score <= 50 ? 'bg-green-100 text-green-800' :
                  lifestyle_data.aqi_score <= 100 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}
              >
                AQI: {lifestyle_data.aqi_score}
              </span>
              
              {/* Walkability Badge */}
              <span 
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  lifestyle_data.walkability_score >= 70 ? 'bg-green-100 text-green-800' :
                  lifestyle_data.walkability_score >= 40 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}
              >
                Walk: {lifestyle_data.walkability_score}/100
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
