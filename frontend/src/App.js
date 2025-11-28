import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Context
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';

// Common components - loaded immediately
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';
import LoadingSpinner from './components/common/LoadingSpinner';

// Code splitting: Lazy load pages for better performance
// Public Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Search = lazy(() => import('./pages/Search'));
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'));
const Pricing = lazy(() => import('./pages/Pricing'));

// Payment Pages
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PaymentFailure = lazy(() => import('./pages/PaymentFailure'));

// Owner Pages
const OwnerDashboard = lazy(() => import('./pages/owner/Dashboard'));
const MyProperties = lazy(() => import('./pages/owner/MyProperties'));
const AddProperty = lazy(() => import('./pages/owner/AddProperty'));
const EditProperty = lazy(() => import('./pages/owner/EditProperty'));
const OwnerChats = lazy(() => import('./pages/owner/Chats'));
const PropertyAnalytics = lazy(() => import('./pages/owner/PropertyAnalytics'));
const OwnerVerification = lazy(() => import('./pages/owner/Verification'));
const ReverseMarketplace = lazy(() => import('./pages/owner/ReverseMarketplace'));

// Renter Pages
const RenterDashboard = lazy(() => import('./pages/renter/Dashboard'));
const RenterShortlists = lazy(() => import('./pages/renter/Shortlists'));
const RenterChats = lazy(() => import('./pages/renter/Chats'));
const RenterSubscription = lazy(() => import('./pages/renter/Subscription'));
const RenterVerificationUpload = lazy(() => import('./pages/renter/VerificationUpload'));
const RenterPrivacySettings = lazy(() => import('./pages/renter/PrivacySettings'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const PropertyManagement = lazy(() => import('./pages/admin/PropertyManagement'));
const VerificationManagement = lazy(() => import('./pages/admin/VerificationManagement'));
const TransactionManagement = lazy(() => import('./pages/admin/TransactionManagement'));
const DatabaseTools = lazy(() => import('./pages/admin/DatabaseTools'));
const SystemSettings = lazy(() => import('./pages/admin/SystemSettings'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <ToastProvider>
              {/* Skip to main content link for accessibility */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:shadow-lg"
                data-testid="skip-to-main"
              >
                Skip to main content
              </a>
              
              <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-200">
                <Navbar />
                
                <main id="main-content" className="flex-grow" tabIndex={-1}>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/search" element={<Search />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/pricing" element={<Pricing />} />
              
              {/* Protected Renter Routes */}
              <Route path="/renter/dashboard" element={
                <ProtectedRoute userType="renter">
                  <RenterDashboard />
                </ProtectedRoute>
              } />
              <Route path="/renter/shortlists" element={
                <ProtectedRoute userType="renter">
                  <RenterShortlists />
                </ProtectedRoute>
              } />
              
              {/* Renter Chats */}
              <Route path="/renter/chats" element={
                <ProtectedRoute userType="renter">
                  <RenterChats />
                </ProtectedRoute>
              } />
              <Route path="/renter/chats/:chatId" element={
                <ProtectedRoute userType="renter">
                  <RenterChats />
                </ProtectedRoute>
              } />
              
              {/* Renter Subscription */}
              <Route path="/renter/subscription" element={
                <ProtectedRoute userType="renter">
                  <RenterSubscription />
                </ProtectedRoute>
              } />
              
              {/* Renter Verification */}
              <Route path="/renter/verification" element={
                <ProtectedRoute userType="renter">
                  <RenterVerificationUpload />
                </ProtectedRoute>
              } />
              
              {/* Protected Owner Routes */}
              <Route path="/owner/dashboard" element={
                <ProtectedRoute userType="owner">
                  <OwnerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/owner/properties" element={
                <ProtectedRoute userType="owner">
                  <MyProperties />
                </ProtectedRoute>
              } />
              <Route path="/owner/property/add" element={
                <ProtectedRoute userType="owner">
                  <AddProperty />
                </ProtectedRoute>
              } />
              <Route path="/owner/property/:id/edit" element={
                <ProtectedRoute userType="owner">
                  <EditProperty />
                </ProtectedRoute>
              } />
              
              {/* Owner Chats */}
              <Route path="/owner/chats" element={
                <ProtectedRoute userType="owner">
                  <OwnerChats />
                </ProtectedRoute>
              } />
              <Route path="/owner/chats/:chatId" element={
                <ProtectedRoute userType="owner">
                  <OwnerChats />
                </ProtectedRoute>
              } />
              
              {/* Owner Verification - Unified Route */}
              <Route path="/owner/verification" element={
                <ProtectedRoute userType="owner">
                  <OwnerVerification />
                </ProtectedRoute>
              } />
              
              {/* Legacy redirect for old property-verification route */}
              <Route path="/owner/property-verification" element={
                <ProtectedRoute userType="owner">
                  <OwnerVerification />
                </ProtectedRoute>
              } />
              
              {/* Reverse Marketplace */}
              <Route path="/owner/reverse-marketplace" element={
                <ProtectedRoute userType="owner">
                  <ReverseMarketplace />
                </ProtectedRoute>
              } />
              
              {/* Renter Privacy Settings */}
              <Route path="/renter/privacy" element={
                <ProtectedRoute userType="renter">
                  <RenterPrivacySettings />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute userType="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/analytics" element={
                <ProtectedRoute userType="admin">
                  <AdminAnalytics />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute userType="admin">
                  <UserManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/properties" element={
                <ProtectedRoute userType="admin">
                  <PropertyManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/verifications" element={
                <ProtectedRoute userType="admin">
                  <VerificationManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/transactions" element={
                <ProtectedRoute userType="admin">
                  <TransactionManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/database" element={
                <ProtectedRoute userType="admin">
                  <DatabaseTools />
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute userType="admin">
                  <SystemSettings />
                </ProtectedRoute>
              } />
              
              {/* Payment Result Pages */}
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/failure" element={<PaymentFailure />} />
              
              {/* Property Analytics */}
              <Route path="/owner/property/:propertyId/analytics" element={
                <ProtectedRoute userType="owner">
                  <PropertyAnalytics />
                </ProtectedRoute>
              } />
                    </Routes>
                  </Suspense>
                </main>
                
                <Footer />
              </div>
            </ToastProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
