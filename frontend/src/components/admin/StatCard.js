import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color = 'blue', trend = null }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const controls = useAnimation();

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      gradient: 'from-blue-400 to-blue-600',
      hover: 'hover:shadow-blue-200'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      gradient: 'from-green-400 to-green-600',
      hover: 'hover:shadow-green-200'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      gradient: 'from-purple-400 to-purple-600',
      hover: 'hover:shadow-purple-200'
    },
    yellow: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
      gradient: 'from-yellow-400 to-yellow-600',
      hover: 'hover:shadow-yellow-200'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      gradient: 'from-red-400 to-red-600',
      hover: 'hover:shadow-red-200'
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      gradient: 'from-indigo-400 to-indigo-600',
      hover: 'hover:shadow-indigo-200'
    },
    gray: {
      bg: 'bg-gray-50',
      text: 'text-gray-600',
      gradient: 'from-gray-400 to-gray-600',
      hover: 'hover:shadow-gray-200'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  // Counter animation for numeric values
  useEffect(() => {
    if (typeof value === 'number') {
      const duration = 1500;
      const steps = 50;
      const stepValue = value / steps;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setDisplayValue(Math.floor(stepValue * currentStep));
        } else {
          setDisplayValue(value);
          clearInterval(timer);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [value]);

  // Entrance animation
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    });
  }, [controls]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-xl shadow-lg p-6 transition-shadow duration-300 ${colors.hover} cursor-pointer`}
      data-testid={`stat-card-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-center justify-between mb-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className={`p-3 rounded-xl ${colors.bg} ${colors.text} relative overflow-hidden`}
        >
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-10`} />
          {Icon && <Icon className="w-6 h-6 relative z-10" />}
        </motion.div>
        {trend !== null && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-1"
          >
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className={`text-sm font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {trend > 0 ? '+' : ''}{trend}%
            </motion.span>
          </motion.div>
        )}
      </div>
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-3xl font-bold text-gray-900 mb-1 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text"
      >
        {typeof value === 'number' ? displayValue.toLocaleString() : value}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-sm text-gray-600 font-medium"
      >
        {label}
      </motion.p>

      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
        whileHover={{ opacity: 0.1, x: ['-100%', '100%'] }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
};

export default StatCard;