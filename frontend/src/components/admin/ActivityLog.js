import React, { useState, useEffect } from 'react';
import { getAdminAuditLogs } from '../../services/adminService';
import { Clock, User, FileText } from 'lucide-react';

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
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow" data-testid="activity-log">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {logs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.log_id} className="p-4 hover:bg-gray-50 transition">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getActionIcon(log.action_type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {log.action_type.replace(/_/g, ' ').toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {log.entity_type}: {log.entity_id}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimestamp(log.timestamp)}</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    log.status === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {log.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
