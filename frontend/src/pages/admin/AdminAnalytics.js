import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Calculate growth percentages
  const userGrowth = stats.totalUsers > 0 ? ((stats.totalUsers - stats.totalRenters) / stats.totalUsers * 100).toFixed(1) : 0;
  const propertyGrowth = stats.totalProperties > 0 ? ((stats.activeProperties / stats.totalProperties) * 100).toFixed(1) : 0;
  const verificationRate = stats.totalProperties > 0 ? ((stats.verifiedProperties / stats.totalProperties) * 100).toFixed(1) : 0;
  const premiumConversionRate = stats.totalUsers > 0 ? ((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6" data-testid="admin-analytics">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            data-testid="back-to-admin-button"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
              <p className="text-gray-600 mt-1">
                Comprehensive insights and performance metrics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                data-testid="time-range-select"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="1year">Last Year</option>
              </select>
              <button
                onClick={loadAnalytics}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                data-testid="refresh-analytics-button"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-green-600 text-sm font-semibold flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{userGrowth}%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            <p className="text-xs text-gray-500 mt-2">
              {stats.totalRenters} renters, {stats.totalOwners} owners
            </p>
          </div>

          {/* Total Properties */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Home className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-green-600 text-sm font-semibold flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{propertyGrowth}%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Properties</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalProperties}</p>
            <p className="text-xs text-gray-500 mt-2">
              {stats.activeProperties} active listings
            </p>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-green-600 text-sm font-semibold flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12.5%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">
              ₹{stats.revenueThisMonth.toLocaleString()} this month
            </p>
          </div>

          {/* Verification Rate */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-green-600 text-sm font-semibold flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +8.2%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Verification Rate</h3>
            <p className="text-3xl font-bold text-gray-900">{verificationRate}%</p>
            <p className="text-xs text-gray-500 mt-2">
              {stats.verifiedProperties} verified properties
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">User Growth Trend</h2>
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Renters</span>
                  <span className="font-semibold text-gray-900">{stats.totalRenters}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all" 
                    style={{ width: `${(stats.totalRenters / stats.totalUsers) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Owners</span>
                  <span className="font-semibold text-gray-900">{stats.totalOwners}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-600 h-3 rounded-full transition-all" 
                    style={{ width: `${(stats.totalOwners / stats.totalUsers) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Premium Users</span>
                  <span className="font-semibold text-gray-900">{stats.premiumUsers}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-purple-600 h-3 rounded-full transition-all" 
                    style={{ width: `${(stats.premiumUsers / stats.totalUsers) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Property Status Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Property Distribution</h2>
              <PieChart className="w-6 h-6 text-green-600" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Active Properties</span>
                  <span className="font-semibold text-gray-900">{stats.activeProperties}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-600 h-3 rounded-full transition-all" 
                    style={{ width: `${(stats.activeProperties / stats.totalProperties) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Verified Properties</span>
                  <span className="font-semibold text-gray-900">{stats.verifiedProperties}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all" 
                    style={{ width: `${(stats.verifiedProperties / stats.totalProperties) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Pending Verifications</span>
                  <span className="font-semibold text-gray-900">{stats.pendingVerifications}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-yellow-600 h-3 rounded-full transition-all" 
                    style={{ width: `${(stats.pendingVerifications / (stats.totalProperties || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Engagement Metrics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Engagement Metrics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Total Chats</span>
                <span className="text-lg font-bold text-gray-900">{stats.totalChats}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Total Shortlists</span>
                <span className="text-lg font-bold text-gray-900">{stats.totalShortlists}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Avg Chats/User</span>
                <span className="text-lg font-bold text-gray-900">
                  {stats.totalUsers > 0 ? (stats.totalChats / stats.totalUsers).toFixed(1) : 0}
                </span>
              </div>
            </div>
          </div>

          {/* Conversion Metrics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Conversion Metrics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Premium Conversion</span>
                <span className="text-lg font-bold text-purple-600">{premiumConversionRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Verification Rate</span>
                <span className="text-lg font-bold text-blue-600">{verificationRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Active Listings</span>
                <span className="text-lg font-bold text-green-600">{propertyGrowth}%</span>
              </div>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Breakdown</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">This Month</span>
                <span className="text-lg font-bold text-green-600">₹{stats.revenueThisMonth.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">All Time</span>
                <span className="text-lg font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Avg/Premium User</span>
                <span className="text-lg font-bold text-blue-600">
                  ₹{stats.premiumUsers > 0 ? Math.round(stats.totalRevenue / stats.premiumUsers).toLocaleString() : 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Health */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Health Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.activeProperties}</div>
              <div className="text-sm text-gray-600">Active Listings</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.verifiedProperties}</div>
              <div className="text-sm text-gray-600">Verified Properties</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.premiumUsers}</div>
              <div className="text-sm text-gray-600">Premium Users</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.pendingVerifications}</div>
              <div className="text-sm text-gray-600">Pending Verifications</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
