import React, { useState, useEffect } from 'react';
import { getAdminAuditLogs } from '../../services/adminService';
import { Clock, User, FileText, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ActivityLog = ({ limit = 10 }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const response = await getAdminAuditLogs();
      setLogs(response.data.slice(0, limit));
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const getActionIcon = (actionType) => {
    if (actionType.includes('delete')) return '🗑️';
    if (actionType.includes('create')) return '✨';
    if (actionType.includes('update') || actionType.includes('edit')) return '✏️';
    if (actionType.includes('verify')) return '✅';
    return '📝';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              className="h-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
      data-testid="activity-log"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <RefreshCw className="w-5 h-5 text-blue-600" />
            </motion.div>
            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full"
          >
            {logs.length} logs
          </motion.div>
        </div>
      </div>

      {/* Activity List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="divide-y divide-gray-100"
      >
        {logs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 text-center text-gray-500"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            </motion.div>
            <p className="font-medium">No recent activity</p>
          </motion.div>
        ) : (
          logs.map((log, index) => (
            <motion.div
              key={log.log_id}
              variants={itemVariants}
              whileHover={{ 
                backgroundColor: 'rgb(249, 250, 251)',
                x: 4,
                transition: { duration: 0.2 }
              }}
              className="p-4 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="text-2xl"
                >
                  {getActionIcon(log.action_type)}
                </motion.span>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {log.action_type.replace(/_/g, ' ').toUpperCase()}
                    </p>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap ${
                        log.status === 'success'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {log.status}
                    </motion.span>
                  </div>
                  
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {log.entity_type}: {log.entity_id}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimestamp(log.timestamp)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Footer with live indicator */}
      {logs.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-4 bg-gray-50 border-t border-gray-200"
        >
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-green-500 rounded-full"
            />
            <span>Live monitoring active</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ActivityLog;
