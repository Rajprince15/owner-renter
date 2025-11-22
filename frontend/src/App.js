import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';

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
              
              {/* Placeholder routes */}
              <Route path="/search" element={
                <div className="min-h-screen flex items-center justify-center bg-slate-50">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Search Page</h1>
                    <p className="text-slate-600">Coming in Phase 4</p>
                  </div>
                </div>
              } />
              
              {/* Protected Renter Dashboard (placeholder) */}
              <Route path="/renter/dashboard" element={
                <ProtectedRoute userType="renter">
                  <div className="min-h-screen flex items-center justify-center bg-slate-50">
                    <div className="text-center">
                      <h1 className="text-3xl font-bold text-slate-900 mb-4">Renter Dashboard</h1>
                      <p className="text-slate-600">Welcome! This page is coming in Phase 3</p>
                    </div>
                  </div>
                </ProtectedRoute>
              } />
              
              {/* Protected Owner Dashboard (placeholder) */}
              <Route path="/owner/dashboard" element={
                <ProtectedRoute userType="owner">
                  <div className="min-h-screen flex items-center justify-center bg-slate-50">
                    <div className="text-center">
                      <h1 className="text-3xl font-bold text-slate-900 mb-4">Owner Dashboard</h1>
                      <p className="text-slate-600">Welcome! This page is coming in Phase 3</p>
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
