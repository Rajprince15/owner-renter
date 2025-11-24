import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const PerformanceCard = ({ title, value, subtitle, trend, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200'
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend > 0) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (trend < 0) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    } else {
      return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendText = () => {
    if (!trend) return null;
    
    const absValue = Math.abs(trend);
    const color = trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500';
    
    return (
      <span className={`text-xs font-medium ${color}`}>
        {trend > 0 ? '+' : ''}{trend}%
      </span>
    );
  };

  return (
    <div 
      className="bg-white rounded-lg shadow border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
      data-testid="performance-card"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2" data-testid="card-value">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className="flex items-center space-x-1 mt-2">
              {getTrendIcon()}
              {getTrendText()}
              <span className="text-xs text-gray-500">vs last period</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceCard;
