import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const PerformanceCard = ({ title, value, subtitle, trend, icon: Icon, color = 'blue' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
      gradient: 'from-blue-500 to-blue-600'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800',
      gradient: 'from-green-500 to-green-600'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800',
      gradient: 'from-purple-500 to-purple-600'
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      text: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-200 dark:border-orange-800',
      gradient: 'from-orange-500 to-orange-600'
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
      gradient: 'from-red-500 to-red-600'
    }
  };

  // Animate counter
  useEffect(() => {
    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
    if (!isNaN(numericValue)) {
      const animation = animate(count, numericValue, {
        duration: 2,
        ease: 'easeOut',
        onUpdate: (latest) => {
          setDisplayValue(Math.round(latest));
        }
      });
      return animation.stop;
    }
  }, [value]);

  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend > 0) {
      return (
        <motion.div
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <TrendingUp className="w-4 h-4 text-green-500" />
        </motion.div>
      );
    } else if (trend < 0) {
      return (
        <motion.div
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <TrendingDown className="w-4 h-4 text-red-500" />
        </motion.div>
      );
    } else {
      return <Minus className="w-4 h-4 text-gray-400 dark:text-gray-500" />;
    }
  };

  const getTrendText = () => {
    if (!trend) return null;
    
    const absValue = Math.abs(trend);
    const color = trend > 0 ? 'text-green-600 dark:text-green-400' : trend < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400';
    
    return (
      <motion.span
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className={`text-xs font-semibold ${color}`}
      >
        {trend > 0 ? '+' : ''}{trend}%
      </motion.span>
    );
  };

  // Progress bar for trend visualization
  const getTrendProgress = () => {
    if (trend === undefined || trend === null) return null;
    
    const absValue = Math.abs(trend);
    const maxTrend = 100;
    const percentage = Math.min((absValue / maxTrend) * 100, 100);
    const progressColor = trend > 0 ? 'bg-green-500' : trend < 0 ? 'bg-red-500' : 'bg-gray-400';
    
    return (
      <div className="mt-3 w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className={`h-full ${progressColor} rounded-full`}
        />
      </div>
    );
  };

  // Sparkline mini chart (simplified)
  const renderSparkline = () => {
    // Mock data for sparkline - in real app, pass historical data
    const points = Array.from({ length: 8 }, () => Math.random() * 100);
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;
    
    return (
      <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        width="100%"
        height="32"
        className="mt-2"
      >
        <motion.polyline
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: 'easeInOut' }}
          fill="none"
          stroke={`rgb(var(--${color}-500))`}
          strokeWidth="2"
          points={points
            .map((point, i) => {
              const x = (i / (points.length - 1)) * 100;
              const y = 32 - ((point - min) / range) * 28;
              return `${x},${y}`;
            })
            .join(' ')}
        />
      </motion.svg>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -4,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
      data-testid="performance-card"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1"
          >
            {title}
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.2,
              type: 'spring',
              stiffness: 200,
              damping: 15
            }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
            data-testid="card-value"
          >
            {typeof value === 'string' && isNaN(parseFloat(value.replace(/[^0-9.-]/g, ''))) 
              ? value 
              : displayValue.toLocaleString()}
          </motion.p>
          
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-gray-500 dark:text-gray-400"
            >
              {subtitle}
            </motion.p>
          )}
          
          {trend !== undefined && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center space-x-1 mt-2"
            >
              {getTrendIcon()}
              {getTrendText()}
              <span className="text-xs text-gray-500 dark:text-gray-400">vs last period</span>
            </motion.div>
          )}
          
          {/* Progress bar */}
          {getTrendProgress()}
        </div>
        
        {Icon && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.2,
              type: 'spring',
              stiffness: 200,
              damping: 15
            }}
            whileHover={{ 
              scale: 1.1,
              rotate: 5
            }}
            className={`p-3 rounded-lg border ${colorClasses[color].bg} ${colorClasses[color].text} ${colorClasses[color].border}`}
          >
            <Icon className="w-6 h-6" />
          </motion.div>
        )}
      </div>
      
      {/* Comparison values */}
      {trend !== undefined && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.5 }}
          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs"
        >
          <div>
            <span className="text-gray-600 dark:text-gray-400">Previous: </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {typeof value === 'number' 
                ? Math.round(value / (1 + trend / 100)).toLocaleString()
                : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Change: </span>
            <span className={`font-semibold ${
              trend > 0 ? 'text-green-600 dark:text-green-400' : 
              trend < 0 ? 'text-red-600 dark:text-red-400' : 
              'text-gray-600 dark:text-gray-400'
            }`}>
              {typeof value === 'number' && trend !== 0
                ? Math.abs(Math.round(value - value / (1 + trend / 100))).toLocaleString()
                : '0'}
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PerformanceCard;