import React from 'react';
import { MapPin, Briefcase, Calendar, Home, DollarSign, CheckCircle } from 'lucide-react';

const AnonymousRenterCard = ({ renter, onContact }) => {
  const {
    anonymous_id,
    employment_type,
    income_range,
    looking_for,
    budget_min,
    budget_max,
    preferred_locations,
    move_in_date,
    is_verified
  } = renter;

  const formatEmploymentType = (type) => {
    const types = {
      'salaried': 'Salaried',
      'self_employed': 'Self Employed',
      'business': 'Business',
      'freelancer': 'Freelancer',
      'not_specified': 'Not Specified'
    };
    return types[type] || type;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Flexible';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200"
      data-testid="anonymous-renter-card"
    >
      {/* Header with ID and Verified Badge */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900" data-testid="renter-id">
            {anonymous_id}
          </h3>
          {is_verified && (
            <div className="flex items-center mt-1" data-testid="verified-badge">
              <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600 font-medium">Verified Renter</span>
            </div>
          )}
        </div>
      </div>

      {/* Employment Info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start" data-testid="employment-info">
          <Briefcase className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-600">Employment</p>
            <p className="text-base font-medium text-gray-900">
              {formatEmploymentType(employment_type)}
            </p>
          </div>
        </div>

        {/* Income Range */}
        <div className="flex items-start" data-testid="income-range">
          <DollarSign className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-600">Annual Income</p>
            <p className="text-base font-medium text-gray-900">{income_range}</p>
          </div>
        </div>

        {/* Looking For */}
        {looking_for && looking_for.length > 0 && (
          <div className="flex items-start" data-testid="looking-for">
            <Home className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-600">Looking For</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {looking_for.map((bhk, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded"
                  >
                    {bhk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Budget Range */}
        <div className="flex items-start" data-testid="budget-range">
          <DollarSign className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-600">Budget Range</p>
            <p className="text-base font-medium text-gray-900">
              ₹{budget_min.toLocaleString()} - ₹{budget_max.toLocaleString()}/month
            </p>
          </div>
        </div>

        {/* Preferred Locations */}
        {preferred_locations && preferred_locations.length > 0 && (
          <div className="flex items-start" data-testid="preferred-locations">
            <MapPin className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-600">Preferred Locations</p>
              <p className="text-base font-medium text-gray-900">
                {preferred_locations.join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Move-in Date */}
        <div className="flex items-start" data-testid="move-in-date">
          <Calendar className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-600">Move-in Date</p>
            <p className="text-base font-medium text-gray-900">
              {formatDate(move_in_date)}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Button */}
      <button
        onClick={() => onContact(renter)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        data-testid="contact-renter-button"
      >
        Contact Renter
      </button>
    </div>
  );
};

export default AnonymousRenterCard;
