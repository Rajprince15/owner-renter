import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import LandingPage from './pages/LandingPage';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Placeholder routes for Phase 1 */}
            <Route path="/login" element={
              <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-slate-900 mb-4">Login Page</h1>
                  <p className="text-slate-600">Coming in Phase 2</p>
                </div>
              </div>
            } />
            <Route path="/signup" element={
              <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-slate-900 mb-4">Signup Page</h1>
                  <p className="text-slate-600">Coming in Phase 2</p>
                </div>
              </div>
            } />
            <Route path="/search" element={
              <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-slate-900 mb-4">Search Page</h1>
                  <p className="text-slate-600">Coming in Phase 4</p>
                </div>
              </div>
            } />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
