import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  if (loading) {
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

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6" 
      data-testid="admin-dashboard"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with Admin Badge */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-red-600"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                className="bg-red-100 p-3 rounded-full"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Shield className="w-8 h-8 text-red-600" />
              </motion.div>
              <div>
                <motion.h1 
                  className="text-3xl font-bold text-gray-900 flex items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Admin Control Panel
                  <motion.span 
                    className="text-sm bg-red-600 text-white px-3 py-1 rounded-full font-semibold"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ADMIN ACCESS
                  </motion.span>
                </motion.h1>
                <motion.p 
                  className="text-gray-600 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Full system control and management capabilities
                </motion.p>
              </div>
            </div>
            <motion.div 
              className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-right">
                <p className="text-xs text-gray-500">Logged in as</p>
                <p className="font-semibold text-gray-900">{user?.full_name}</p>
                <p className="text-xs text-red-600 font-semibold">Administrator</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Actions Bar */}
        <motion.div 
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            ⚡ Quick Admin Actions
          </h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {[
              { icon: CheckCircle, label: 'Review Verifications', count: stats.pendingVerifications, path: '/admin/verifications', testId: 'quick-action-verifications' },
              { icon: Users, label: 'Manage Users', count: stats.totalUsers, path: '/admin/users', testId: 'quick-action-users' },
              { icon: Home, label: 'Manage Properties', count: stats.totalProperties, path: '/admin/properties', testId: 'quick-action-properties' }
            ].map((action, index) => (
              <motion.button
                key={index}
                onClick={() => navigate(action.path)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 text-left transition-all"
                variants={itemVariants}
                whileHover={{ scale: 1.03, translateY: -3 }}
                whileTap={{ scale: 0.98 }}
                data-testid={action.testId}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/30 p-2 rounded-lg">
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">{action.label}</p>
                    <p className="text-sm text-white/80">{action.count} {action.label.split(' ')[1].toLowerCase()}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'blue' },
            { label: 'Total Properties', value: stats.totalProperties, icon: Home, color: 'green' },
            { label: 'Pending Verifications', value: stats.pendingVerifications, icon: CheckCircle, color: 'purple' },
            { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'yellow' }
          ].map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* System Overview */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            System Overview
          </h2>
        </motion.div>

        {/* Secondary Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {[
            {
              title: 'User Breakdown',
              icon: Users,
              iconColor: 'blue-600',
              borderColor: 'blue-500',
              items: [
                { label: 'Renters:', value: stats.totalRenters, bg: 'blue-50', color: 'blue-600' },
                { label: 'Owners:', value: stats.totalOwners, bg: 'green-50', color: 'green-600' },
                { label: 'Premium Users:', value: stats.premiumUsers, bg: 'purple-50', color: 'purple-600' }
              ]
            },
            {
              title: 'Property Status',
              icon: Home,
              iconColor: 'green-600',
              borderColor: 'green-500',
              items: [
                { label: 'Active:', value: stats.activeProperties, bg: 'green-50', color: 'green-600' },
                { label: 'Verified:', value: stats.verifiedProperties, bg: 'blue-50', color: 'blue-600' },
                { label: 'Total:', value: stats.totalProperties, bg: 'gray-50', color: 'gray-900' }
              ]
            },
            {
              title: 'Revenue & Activity',
              icon: DollarSign,
              iconColor: 'yellow-600',
              borderColor: 'yellow-500',
              items: [
                { label: 'This Month:', value: `₹${stats.revenueThisMonth.toLocaleString()}`, bg: 'green-50', color: 'green-600' },
                { label: 'All Time:', value: `₹${stats.totalRevenue.toLocaleString()}`, bg: 'yellow-50', color: 'yellow-600' },
                { label: 'Total Chats:', value: stats.totalChats, bg: 'blue-50', color: 'blue-600' }
              ]
            }
          ].map((card, index) => (
            <motion.div
              key={index}
              className={`bg-white rounded-xl shadow-lg p-6 border-l-4 border-${card.borderColor} hover:shadow-xl transition-shadow`}
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{card.title}</h3>
                <card.icon className={`w-6 h-6 text-${card.iconColor}`} />
              </div>
              <div className="space-y-3">
                {card.items.map((item, i) => (
                  <motion.div
                    key={i}
                    className={`flex justify-between items-center p-2 bg-${item.bg} rounded`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + (i * 0.1) }}
                  >
                    <span className="text-gray-700 font-medium">{item.label}</span>
                    <span className={`font-bold text-${item.color}`}>{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Admin Tools Section */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="w-6 h-6 text-gray-700" />
            Administrative Tools
          </h2>
          <p className="text-gray-600 mb-4">Access all system management and control features</p>
        </motion.div>

        {/* Menu Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {menuItems.map((item, index) => (
            <motion.div key={index} variants={itemVariants}>
              <MenuCard {...item} />
            </motion.div>
          ))}
        </motion.div>

        {/* Activity Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <ActivityLog limit={10} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;