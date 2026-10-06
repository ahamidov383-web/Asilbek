import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Agencies from './pages/Agencies';
import Tours from './pages/Tours';
import Places from './pages/Places';
import Restaurants from './pages/Restaurants';
import RequestTour from './pages/RequestTour';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import AgencyProfile from './pages/AgencyProfile';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/agencies" element={<Agencies />} />
                <Route path="/agencies/:id" element={<AgencyProfile />} />
                <Route path="/tours" element={<Tours />} />
                <Route path="/places" element={<Places />} />
                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/request" element={<RequestTour />} />
                
                {/* Protected Routes - Agency */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['AGENCY']}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                
                {/* Protected Routes - Admin */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
