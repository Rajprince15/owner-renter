import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const MenuCard = ({ icon: Icon, label, description, path, color = 'blue', count = null }) => {
  const navigate = useNavigate();

  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-600 border-blue-200',
    green: 'bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-600 border-green-200',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-600 border-purple-200',
    yellow: 'bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 text-yellow-600 border-yellow-200',
    red: 'bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-600 border-red-200',
    indigo: 'bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 text-indigo-600 border-indigo-200',
    gray: 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-600 border-gray-200'
  };

  return (
    <motion.div
      onClick={() => navigate(path)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className={`${colorClasses[color]} rounded-xl p-6 cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl border group relative overflow-hidden`}
      data-testid={`menu-card-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/50 to-white/0 opacity-0 group-hover:opacity-100"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {Icon && (
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-8 h-8" />
                </motion.div>
              )}
              {count !== null && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  className="bg-white px-3 py-1 rounded-full text-sm font-bold shadow-sm"
                >
                  {count}
                </motion.span>
              )}
            </div>
            <motion.h3
              className="text-lg font-bold mb-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {label}
            </motion.h3>
            {description && (
              <motion.p
                className="text-sm opacity-80 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.2 }}
              >
                {description}
              </motion.p>
            )}
          </div>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="group-hover:translate-x-2 transition-transform duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;