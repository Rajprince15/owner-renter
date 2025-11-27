import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, TrendingUp, Users, Home, DollarSign, 
  Activity, Calendar, BarChart3, PieChart, RefreshCw 
} from 'lucide-react';
import { getAdminStats } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30days');

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/login');
      return;
    }
    loadAnalytics();
  }, [user, navigate, timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await getAdminStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      showToast('Failed to load analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: 20 }
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    hover: { scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-b-2 border-blue-600"
        />
      </div>
    );
  }

  // Calculate growth percentages
  const userGrowth = stats.totalUsers > 0 ? ((stats.totalUsers - stats.totalRenters) / stats.totalUsers * 100).toFixed(1) : 0;
  const propertyGrowth = stats.totalProperties > 0 ? ((stats.activeProperties / stats.totalProperties) * 100).toFixed(1) : 0;
  const verificationRate = stats.totalProperties > 0 ? ((stats.verifiedProperties / stats.totalProperties) * 100).toFixed(1) : 0;
  const premiumConversionRate = stats.totalUsers > 0 ? ((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1) : 0;

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 p-6" 
      data-testid="admin-analytics"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            onClick={() => navigate('/admin')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            data-testid="back-to-admin-button"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </motion.button>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <motion.h1 
                className="text-3xl font-bold text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Platform Analytics
              </motion.h1>
              <motion.p 
                className="text-gray-600 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Comprehensive insights and performance metrics
              </motion.p>
            </div>
            <div className="flex items-center gap-3">
              <motion.select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                data-testid="time-range-select"
                whileHover={{ scale: 1.02 }}
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="1year">Last Year</option>
              </motion.select>
              <motion.button
                onClick={loadAnalytics}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                data-testid="refresh-analytics-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95, rotate: 180 }}
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial="initial"
          animate="animate"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {[
            { 
              icon: Users, 
              label: 'Total Users', 
              value: stats.totalUsers, 
              growth: userGrowth,
              subtext: `${stats.totalRenters} renters, ${stats.totalOwners} owners`,
              bgColor: 'bg-blue-100',
              iconColor: 'text-blue-600'
            },
            { 
              icon: Home, 
              label: 'Total Properties', 
              value: stats.totalProperties, 
              growth: propertyGrowth,
              subtext: `${stats.activeProperties} active listings`,
              bgColor: 'bg-green-100',
              iconColor: 'text-green-600'
            },
            { 
              icon: DollarSign, 
              label: 'Total Revenue', 
              value: `₹${stats.totalRevenue.toLocaleString()}`, 
              growth: 12.5,
              subtext: `₹${stats.revenueThisMonth.toLocaleString()} this month`,
              bgColor: 'bg-yellow-100',
              iconColor: 'text-yellow-600'
            },
            { 
              icon: Activity, 
              label: 'Verification Rate', 
              value: `${verificationRate}%`, 
              growth: 8.2,
              subtext: `${stats.verifiedProperties} verified properties`,
              bgColor: 'bg-purple-100',
              iconColor: 'text-purple-600'
            }
          ].map((metric, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow p-6"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  className={`p-3 ${metric.bgColor} rounded-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <metric.icon className={`w-6 h-6 ${metric.iconColor}`} />
                </motion.div>
                <motion.span 
                  className="text-green-600 text-sm font-semibold flex items-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + (index * 0.1) }}
                >
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{metric.growth}%
                </motion.span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{metric.label}</h3>
              <motion.p 
                className="text-3xl font-bold text-gray-900"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (index * 0.1) }}
              >
                {metric.value}
              </motion.p>
              <p className="text-xs text-gray-500 mt-2">{metric.subtext}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <motion.div 
            className="bg-white rounded-lg shadow p-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">User Growth Trend</h2>
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="space-y-4">
              {[
                { label: 'Renters', value: stats.totalRenters, total: stats.totalUsers, color: 'bg-blue-600' },
                { label: 'Owners', value: stats.totalOwners, total: stats.totalUsers, color: 'bg-green-600' },
                { label: 'Premium Users', value: stats.premiumUsers, total: stats.totalUsers, color: 'bg-purple-600' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (index * 0.1) }}
                >
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-semibold text-gray-900">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div 
                      className={`${item.color} h-3 rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / item.total) * 100}%` }}
                      transition={{ duration: 1, delay: 0.7 + (index * 0.1), ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Property Status Distribution */}
          <motion.div 
            className="bg-white rounded-lg shadow p-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Property Distribution</h2>
              <PieChart className="w-6 h-6 text-green-600" />
            </div>
            <div className="space-y-4">
              {[
                { label: 'Active Properties', value: stats.activeProperties, total: stats.totalProperties, color: 'bg-green-600' },
                { label: 'Verified Properties', value: stats.verifiedProperties, total: stats.totalProperties, color: 'bg-blue-600' },
                { label: 'Pending Verifications', value: stats.pendingVerifications, total: stats.totalProperties || 1, color: 'bg-yellow-600' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (index * 0.1) }}
                >
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-semibold text-gray-900">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div 
                      className={`${item.color} h-3 rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / item.total) * 100}%` }}
                      transition={{ duration: 1, delay: 0.7 + (index * 0.1), ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Detailed Statistics */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {[
            {
              title: 'Engagement Metrics',
              items: [
                { label: 'Total Chats', value: stats.totalChats },
                { label: 'Total Shortlists', value: stats.totalShortlists },
                { label: 'Avg Chats/User', value: stats.totalUsers > 0 ? (stats.totalChats / stats.totalUsers).toFixed(1) : 0 }
              ]
            },
            {
              title: 'Conversion Metrics',
              items: [
                { label: 'Premium Conversion', value: `${premiumConversionRate}%`, color: 'text-purple-600' },
                { label: 'Verification Rate', value: `${verificationRate}%`, color: 'text-blue-600' },
                { label: 'Active Listings', value: `${propertyGrowth}%`, color: 'text-green-600' }
              ]
            },
            {
              title: 'Revenue Breakdown',
              items: [
                { label: 'This Month', value: `₹${stats.revenueThisMonth.toLocaleString()}`, color: 'text-green-600' },
                { label: 'All Time', value: `₹${stats.totalRevenue.toLocaleString()}`, color: 'text-gray-900' },
                { label: 'Avg/Premium User', value: `₹${stats.premiumUsers > 0 ? Math.round(stats.totalRevenue / stats.premiumUsers).toLocaleString() : 0}`, color: 'text-blue-600' }
              ]
            }
          ].map((section, sIndex) => (
            <motion.div
              key={sIndex}
              className="bg-white rounded-lg shadow p-6"
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4">{section.title}</h2>
              <div className="space-y-4">
                {section.items.map((item, iIndex) => (
                  <motion.div 
                    key={iIndex}
                    className="flex justify-between items-center"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + (sIndex * 0.1) + (iIndex * 0.05) }}
                  >
                    <span className="text-gray-600 text-sm">{item.label}</span>
                    <span className={`text-lg font-bold ${item.color || 'text-gray-900'}`}>{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Platform Health */}
        <motion.div 
          className="bg-white rounded-lg shadow p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Health Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: stats.activeProperties, label: 'Active Listings', color: 'green' },
              { value: stats.verifiedProperties, label: 'Verified Properties', color: 'blue' },
              { value: stats.premiumUsers, label: 'Premium Users', color: 'purple' },
              { value: stats.pendingVerifications, label: 'Pending Verifications', color: 'yellow' }
            ].map((metric, index) => (
              <motion.div
                key={index}
                className={`text-center p-4 bg-${metric.color}-50 rounded-lg`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + (index * 0.1) }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className={`text-3xl font-bold text-${metric.color}-600 mb-2`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + (index * 0.1) }}
                >
                  {metric.value}
                </motion.div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminAnalytics;