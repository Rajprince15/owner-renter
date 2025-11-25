import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Home, CheckCircle, DollarSign, 
  Settings, Database, Shield, BarChart3, FileText 
} from 'lucide-react';
import { getAdminStats } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/admin/StatCard';
import MenuCard from '../../components/admin/MenuCard';
import ActivityLog from '../../components/admin/ActivityLog';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRenters: 0,
    totalOwners: 0,
    premiumUsers: 0,
    totalProperties: 0,
    activeProperties: 0,
    verifiedProperties: 0,
    pendingVerifications: 0,
    totalRevenue: 0,
    revenueThisMonth: 0,
    totalChats: 0,
    totalShortlists: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!user?.is_admin) {
      navigate('/login');
      return;
    }
    
    loadStats();
  }, [user, navigate]);

  const loadStats = async () => {
    try {
      const response = await getAdminStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { 
      icon: Users, 
      label: 'User Management', 
      description: 'Manage all users, renters, and owners',
      path: '/admin/users', 
      color: 'blue',
      count: stats.totalUsers
    },
    { 
      icon: Home, 
      label: 'Property Management', 
      description: 'View and manage all properties',
      path: '/admin/properties', 
      color: 'green',
      count: stats.totalProperties
    },
    { 
      icon: CheckCircle, 
      label: 'Verifications', 
      description: 'Review pending verifications',
      path: '/admin/verifications', 
      color: 'purple',
      count: stats.pendingVerifications
    },
    { 
      icon: DollarSign, 
      label: 'Transactions', 
      description: 'View transactions and revenue',
      path: '/admin/transactions', 
      color: 'yellow'
    },
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      description: 'View system analytics',
      path: '/admin/analytics', 
      color: 'red'
    },
    { 
      icon: Database, 
      label: 'Database Tools', 
      description: 'Query and manage database',
      path: '/admin/database', 
      color: 'indigo'
    },
    { 
      icon: Settings, 
      label: 'System Settings', 
      description: 'Configure platform settings',
      path: '/admin/settings', 
      color: 'gray'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6" data-testid="admin-dashboard">
      <div className="max-w-7xl mx-auto">
        {/* Header with Admin Badge */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-red-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  Admin Control Panel
                  <span className="text-sm bg-red-600 text-white px-3 py-1 rounded-full font-semibold">
                    ADMIN ACCESS
                  </span>
                </h1>
                <p className="text-gray-600 mt-1">Full system control and management capabilities</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-lg">
              <div className="text-right">
                <p className="text-xs text-gray-500">Logged in as</p>
                <p className="font-semibold text-gray-900">{user?.full_name}</p>
                <p className="text-xs text-red-600 font-semibold">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            ⚡ Quick Admin Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/admin/verifications')}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 text-left transition-all hover:scale-105"
              data-testid="quick-action-verifications"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/30 p-2 rounded-lg">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold">Review Verifications</p>
                  <p className="text-sm text-white/80">{stats.pendingVerifications} pending</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => navigate('/admin/users')}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 text-left transition-all hover:scale-105"
              data-testid="quick-action-users"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/30 p-2 rounded-lg">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold">Manage Users</p>
                  <p className="text-sm text-white/80">{stats.totalUsers} total users</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => navigate('/admin/properties')}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 text-left transition-all hover:scale-105"
              data-testid="quick-action-properties"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/30 p-2 rounded-lg">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold">Manage Properties</p>
                  <p className="text-sm text-white/80">{stats.totalProperties} total properties</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            label="Total Users" 
            value={stats.totalUsers} 
            icon={Users} 
            color="blue" 
          />
          <StatCard 
            label="Total Properties" 
            value={stats.totalProperties} 
            icon={Home} 
            color="green" 
          />
          <StatCard 
            label="Pending Verifications" 
            value={stats.pendingVerifications} 
            icon={CheckCircle} 
            color="purple" 
          />
          <StatCard 
            label="Total Revenue" 
            value={`₹${stats.totalRevenue.toLocaleString()}`} 
            icon={DollarSign} 
            color="yellow" 
          />
        </div>

        {/* System Overview - Enhanced */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            System Overview
          </h2>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">User Breakdown</h3>
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="text-gray-700 font-medium">Renters:</span>
                <span className="font-bold text-blue-600">{stats.totalRenters}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-gray-700 font-medium">Owners:</span>
                <span className="font-bold text-green-600">{stats.totalOwners}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                <span className="text-gray-700 font-medium">Premium Users:</span>
                <span className="font-bold text-purple-600">{stats.premiumUsers}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Property Status</h3>
              <Home className="w-6 h-6 text-green-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-gray-700 font-medium">Active:</span>
                <span className="font-bold text-green-600">{stats.activeProperties}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="text-gray-700 font-medium">Verified:</span>
                <span className="font-bold text-blue-600">{stats.verifiedProperties}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-gray-700 font-medium">Total:</span>
                <span className="font-bold text-gray-900">{stats.totalProperties}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Revenue & Activity</h3>
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-gray-700 font-medium">This Month:</span>
                <span className="font-bold text-green-600">₹{stats.revenueThisMonth.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                <span className="text-gray-700 font-medium">All Time:</span>
                <span className="font-bold text-yellow-600">₹{stats.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="text-gray-700 font-medium">Total Chats:</span>
                <span className="font-bold text-blue-600">{stats.totalChats}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Tools Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="w-6 h-6 text-gray-700" />
            Administrative Tools
          </h2>
          <p className="text-gray-600 mb-4">Access all system management and control features</p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {menuItems.map((item, index) => (
            <MenuCard key={index} {...item} />
          ))}
        </div>

        {/* Activity Log */}
        <ActivityLog limit={10} />
      </div>
    </div>
  );
};

export default AdminDashboard;
