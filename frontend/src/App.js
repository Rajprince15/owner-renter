import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Search from './pages/Search';
import PropertyDetail from './pages/PropertyDetail';
import LifestyleSearch from './pages/LifestyleSearch';

// Owner Pages
import OwnerDashboard from './pages/owner/Dashboard';
import MyProperties from './pages/owner/MyProperties';
import AddProperty from './pages/owner/AddProperty';
import EditProperty from './pages/owner/EditProperty';
import OwnerChats from './pages/owner/Chats';

// Renter Pages
import RenterDashboard from './pages/renter/Dashboard';
import RenterShortlists from './pages/renter/Shortlists';
import RenterChats from './pages/renter/Chats';
import RenterSubscription from './pages/renter/Subscription';

// Owner Pages - Additional
import OwnerVerification from './pages/owner/Verification';
import PropertyVerification from './pages/owner/PropertyVerification';
import ReverseMarketplace from './pages/owner/ReverseMarketplace';

// Renter Pages - Additional
import RenterVerificationUpload from './pages/renter/VerificationUpload';
import RenterPrivacySettings from './pages/renter/PrivacySettings';

// Admin Pages
import AdminVerificationReview from './pages/admin/VerificationReview';

// Payment Pages
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Protected Route
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/search" element={<Search />} />
              <Route path="/lifestyle-search" element={<LifestyleSearch />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              
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
              
              {/* Owner Verification */}
              <Route path="/owner/verification" element={
                <ProtectedRoute userType="owner">
                  <OwnerVerification />
                </ProtectedRoute>
              } />
              
              {/* Property Verification */}
              <Route path="/owner/property-verification" element={
                <ProtectedRoute userType="owner">
                  <PropertyVerification />
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
              <Route path="/admin/verification-review" element={
                <AdminVerificationReview />
              } />
              
              {/* Payment Result Pages */}
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/failure" element={<PaymentFailure />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
