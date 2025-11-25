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
    <div className="min-h-screen bg-gray-50 p-6" data-testid="admin-dashboard">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Complete system control and management</p>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-12 h-12 text-red-600" />
            <div>
              <p className="text-sm text-gray-600">Logged in as</p>
              <p className="font-semibold text-gray-900">{user?.full_name}</p>
            </div>
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

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">User Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Renters:</span>
                <span className="font-semibold">{stats.totalRenters}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Owners:</span>
                <span className="font-semibold">{stats.totalOwners}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Premium:</span>
                <span className="font-semibold text-purple-600">{stats.premiumUsers}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Property Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Active:</span>
                <span className="font-semibold text-green-600">{stats.activeProperties}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Verified:</span>
                <span className="font-semibold text-blue-600">{stats.verifiedProperties}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Total:</span>
                <span className="font-semibold">{stats.totalProperties}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Revenue</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">This Month:</span>
                <span className="font-semibold text-green-600">₹{stats.revenueThisMonth.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">All Time:</span>
                <span className="font-semibold">₹{stats.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Chats:</span>
                <span className="font-semibold">{stats.totalChats}</span>
              </div>
            </div>
          </div>
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
