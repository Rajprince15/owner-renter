import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const MenuCard = ({ icon: Icon, label, description, path, color = 'blue', count = null }) => {
  const navigate = useNavigate();

  const colorClasses = {
    blue: 'bg-blue-50 hover:bg-blue-100 text-blue-600',
    green: 'bg-green-50 hover:bg-green-100 text-green-600',
    purple: 'bg-purple-50 hover:bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-600',
    red: 'bg-red-50 hover:bg-red-100 text-red-600',
    indigo: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600',
    gray: 'bg-gray-50 hover:bg-gray-100 text-gray-600'
  };

  return (
    <div
      onClick={() => navigate(path)}
      className={`${colorClasses[color]} rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-lg group`}
      data-testid={`menu-card-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {Icon && <Icon className="w-8 h-8" />}
            {count !== null && (
              <span className="bg-white px-2 py-1 rounded-full text-sm font-semibold">
                {count}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold mb-1">{label}</h3>
          {description && <p className="text-sm opacity-80">{description}</p>}
        </div>
        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export default MenuCard;
