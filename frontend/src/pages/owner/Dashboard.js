import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Home, TrendingUp, Eye, Users, AlertCircle, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getMyProperties } from '../../services/propertyService';
import Button from '../../components/common/Button';
import VerificationStatusWidget from '../../components/owner/VerificationStatusWidget';
import { pageTransition, staggerContainer, staggerItem, fadeInUp, hoverLift, scaleUp } from '../../utils/motionConfig';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    unverified: 0,
    totalViews: 0,
    totalContacts: 0
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await getMyProperties();
      const props = response.data;
      setProperties(props);
      
      // Calculate stats
      const verified = props.filter(p => p.is_verified).length;
      const totalViews = props.reduce((sum, p) => sum + (p.analytics?.total_views || 0), 0);
      const totalContacts = props.reduce((sum, p) => sum + (p.analytics?.total_contacts || 0), 0);
      
      setStats({
        total: props.length,
        verified: verified,
        unverified: props.length - verified,
        totalViews: totalViews,
        totalContacts: totalContacts
      });
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50" 
      data-testid="owner-dashboard"
      {...pageTransition}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container-custom py-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-4xl font-bold text-slate-900 mb-2" 
            data-testid="dashboard-title"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Welcome back, {user?.full_name}! 👋
          </motion.h1>
          <motion.p 
            className="text-slate-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Manage your properties and track performance
          </motion.p>
        </motion.div>

        {/* Verification Status Widget */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <VerificationStatusWidget properties={properties} user={user} />
        </motion.div>

        {/* Stats Grid with Stagger */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {[
            { icon: <Home className="w-6 h-6" />, title: "Total Properties", value: stats.total, color: "blue", testId: "stat-total-properties" },
            { icon: <Eye className="w-6 h-6" />, title: "Total Views", value: stats.totalViews, color: "green", testId: "stat-total-views" },
            { icon: <Users className="w-6 h-6" />, title: "Total Contacts", value: stats.totalContacts, color: "purple", testId: "stat-total-contacts" },
            { icon: <TrendingUp className="w-6 h-6" />, title: "Verified Properties", value: stats.verified, color: "indigo", testId: "stat-verified-properties" }
          ].map((stat, index) => (
            <motion.div key={index} variants={staggerItem}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-slate-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
          <motion.div 
            className="flex flex-wrap gap-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {[
              { to: "/owner/property/add", icon: Plus, text: "Add New Property", testId: "add-property-btn", variant: "primary" },
              { to: "/owner/properties", icon: Home, text: "View All Properties", testId: "view-all-properties-btn", variant: "outline" },
              { to: "/owner/chats", icon: MessageCircle, text: "View Messages", testId: "view-chats-btn", variant: "outline" },
              ...(user?.is_verified_owner ? [{ to: "/owner/reverse-marketplace", icon: Users, text: "Browse Renters", testId: "reverse-marketplace-btn", variant: "outline" }] : []),
              ...(stats.unverified > 0 ? [{ to: "/owner/verification", icon: AlertCircle, text: `Get Properties Verified (${stats.unverified})`, testId: "get-verified-btn", variant: "outline" }] : [])
            ].map((action, index) => (
              <motion.div key={index} variants={staggerItem}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={action.variant}
                    to={action.to}
                    data-testid={action.testId}
                  >
                    <action.icon className="w-5 h-5 mr-2" />
                    {action.text}
                  </Button>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Recent Properties */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-slate-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Properties</h2>
            <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/owner/properties"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
              >
                View All →
              </Link>
            </motion.div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <motion.div
                className="inline-block h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.p 
                className="text-slate-600 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Loading properties...
              </motion.p>
            </div>
          ) : properties.length === 0 ? (
            <motion.div 
              className="text-center py-12" 
              data-testid="no-properties-message"
              {...fadeInUp}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Home className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No properties yet</h3>
              <p className="text-slate-600 mb-6">Start by adding your first property to get renters interested!</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="primary" to="/owner/property/add">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Property
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-4"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {properties.slice(0, 3).map((property) => (
                <motion.div key={property.property_id} variants={staggerItem}>
                  <PropertyListItem property={property} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Stat Card Component with Animations
const StatCard = ({ icon, title, value, color, testId }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/50',
    green: 'from-green-500 to-emerald-600 shadow-green-500/50',
    purple: 'from-purple-500 to-purple-600 shadow-purple-500/50',
    indigo: 'from-indigo-500 to-indigo-600 shadow-indigo-500/50',
  };

  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;

    const duration = 1000;
    const incrementTime = duration / end;
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 overflow-hidden relative" 
      data-testid={testId}
      whileHover={{ 
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          background: `linear-gradient(135deg, ${color === 'blue' ? '#3B82F6' : color === 'green' ? '#10B981' : color === 'purple' ? '#A855F7' : '#6366F1'} 0%, transparent 100%)`
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      />
      
      <div className="flex items-center justify-between relative z-10">
        <div>
          <motion.p 
            className="text-sm text-slate-600 mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.p>
          <motion.p 
            className="text-3xl font-bold text-slate-900"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
          >
            {count}
          </motion.p>
        </div>
        <motion.div 
          className={`p-4 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}
          whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-white">
            {icon}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Property List Item Component with Animations
const PropertyListItem = ({ property }) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
      }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={`/owner/property/${property.property_id}/edit`}
        className="block p-4 border border-slate-200 rounded-xl bg-white hover:border-primary-300 transition"
        data-testid={`property-item-${property.property_id}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-slate-900">{property.title}</h3>
              {!property.is_verified && (
                <motion.span 
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Not Verified
                </motion.span>
              )}
              {property.is_verified && (
                <motion.span 
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  ✓ Verified
                </motion.span>
              )}
            </div>
            <p className="text-sm text-slate-600 mb-2">
              {property.location.locality}, {property.location.city}
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>{property.bhk_type}</span>
              <span>•</span>
              <span>₹{property.rent.toLocaleString()}/month</span>
              <span>•</span>
              <motion.span 
                className="flex items-center gap-1"
                whileHover={{ scale: 1.1 }}
              >
                <Eye className="w-4 h-4" />
                {property.analytics?.total_views || 0}
              </motion.span>
              <span>•</span>
              <motion.span 
                className="flex items-center gap-1"
                whileHover={{ scale: 1.1 }}
              >
                <MessageCircle className="w-4 h-4" />
                {property.analytics?.total_contacts || 0}
              </motion.span>
            </div>
          </div>
          <div className="ml-4">
            {property.images && property.images.length > 0 && (
              <motion.img
                src={property.images[0]}
                alt={property.title}
                className="w-24 h-24 rounded-xl object-cover shadow-md"
                whileHover={{ scale: 1.1, rotate: 2 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default OwnerDashboard;