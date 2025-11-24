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

// Owner Pages
import OwnerDashboard from './pages/owner/Dashboard';
import MyProperties from './pages/owner/MyProperties';
import AddProperty from './pages/owner/AddProperty';
import EditProperty from './pages/owner/EditProperty';

// Renter Pages
import RenterDashboard from './pages/renter/Dashboard';
import RenterShortlists from './pages/renter/Shortlists';

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
              
              {/* Renter Subscription (placeholder for Phase 6) */}
              <Route path="/renter/subscription" element={
                <ProtectedRoute userType="renter">
                  <div className="min-h-screen flex items-center justify-center bg-slate-50">
                    <div className="text-center">
                      <h1 className="text-3xl font-bold text-slate-900 mb-4">Subscription</h1>
                      <p className="text-slate-600">Coming in Phase 6</p>
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              
              {/* Renter Verification (placeholder for Phase 8) */}
              <Route path="/renter/verification" element={
                <ProtectedRoute userType="renter">
                  <div className="min-h-screen flex items-center justify-center bg-slate-50">
                    <div className="text-center">
                      <h1 className="text-3xl font-bold text-slate-900 mb-4">Verification</h1>
                      <p className="text-slate-600">Coming in Phase 8</p>
                    </div>
                  </div>
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
              
              {/* Owner Verification (placeholder for future phase) */}
              <Route path="/owner/verification" element={
                <ProtectedRoute userType="owner">
                  <div className="min-h-screen flex items-center justify-center bg-slate-50">
                    <div className="text-center">
                      <h1 className="text-3xl font-bold text-slate-900 mb-4">Property Verification</h1>
                      <p className="text-slate-600">Coming in Phase 8</p>
                    </div>
                  </div>
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
