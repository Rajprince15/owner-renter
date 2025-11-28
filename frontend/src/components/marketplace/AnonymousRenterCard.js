import React from 'react';
import { MapPin, Briefcase, Calendar, Home, DollarSign, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const infoItems = [
    {
      icon: Briefcase,
      label: 'Employment',
      value: formatEmploymentType(employment_type),
      testId: 'employment-info'
    },
    {
      icon: DollarSign,
      label: 'Annual Income',
      value: income_range,
      testId: 'income-range'
    },
    {
      icon: DollarSign,
      label: 'Budget Range',
      value: `₹${budget_min.toLocaleString()} - ₹${budget_max.toLocaleString()}/month`,
      testId: 'budget-range'
    },
    {
      icon: Calendar,
      label: 'Move-in Date',
      value: formatDate(move_in_date),
      testId: 'move-in-date'
    }
  ];

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
      data-testid="anonymous-renter-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -5, 
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
        transition: { duration: 0.3 }
      }}
      transition={{ duration: 0.4 }}
    >
      {/* Header with ID and Verified Badge */}
      <motion.div 
        className="flex justify-between items-start mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div>
          <h3 className="text-xl font-bold text-gray-900" data-testid="renter-id">
            {anonymous_id}
          </h3>
          {is_verified && (
            <motion.div 
              className="flex items-center mt-1" 
              data-testid="verified-badge"
              initial={{ scale: 0, x: -20 }}
              animate={{ scale: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
              </motion.div>
              <span className="text-sm text-green-600 font-medium">Verified Renter</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Info Items */}
      <div className="space-y-3 mb-4">
        {infoItems.map((item, index) => (
          <motion.div 
            key={index}
            className="flex items-start" 
            data-testid={item.testId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <motion.div
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ duration: 0.2 }}
            >
              <item.icon className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
            </motion.div>
            <div>
              <p className="text-sm text-gray-600">{item.label}</p>
              <p className="text-base font-medium text-gray-900">
                {item.value}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Looking For */}
        {looking_for && looking_for.length > 0 && (
          <motion.div 
            className="flex items-start" 
            data-testid="looking-for"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Home className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
            </motion.div>
            <div>
              <p className="text-sm text-gray-600">Looking For</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {looking_for.map((bhk, index) => (
                  <motion.span
                    key={index}
                    className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {bhk}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Preferred Locations */}
        {preferred_locations && preferred_locations.length > 0 && (
          <motion.div 
            className="flex items-start" 
            data-testid="preferred-locations"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.2, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <MapPin className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
            </motion.div>
            <div>
              <p className="text-sm text-gray-600">Preferred Locations</p>
              <p className="text-base font-medium text-gray-900">
                {preferred_locations.join(', ')}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Contact Button */}
      <motion.button
        onClick={() => onContact(renter)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg relative overflow-hidden"
        data-testid="contact-renter-button"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
        />
        <span className="relative z-10">Contact Renter</span>
      </motion.button>
    </motion.div>
  );
};

export default AnonymousRenterCard;