import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { RequestProvider } from './context/RequestContext';

// Layouts
import TouristLayout from './layouts/TouristLayout';
import AgencyLayout from './layouts/AgencyLayout';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Tourist Pages
import Home from './pages/Home';
import Agencies from './pages/Agencies';
import AgencyProfile from './pages/AgencyProfile';
import Tours from './pages/Tours';
import Places from './pages/Places';
import Restaurants from './pages/Restaurants';
import RequestTour from './pages/RequestTour';
import Requests from './pages/Requests';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Agency Pages
import Dashboard from './pages/Dashboard';
import Offers from './pages/Offers';

// Admin Pages
import Admin from './pages/Admin';

// Placeholder Pages for new routes
function AgencyPlaceholder({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-500">Bu sahifa hozirda ishlab chiqilmoqda...</p>
    </div>
  );
}

function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-500">Bu sahifa hozirda ishlab chiqilmoqda...</p>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <RequestProvider>
          <BrowserRouter>
            <Routes>
              {/* Tourist Routes - Public */}
              <Route element={<TouristLayout><Outlet /></TouristLayout>}>
                <Route path="/" element={<Home />} />
                <Route path="/agencies" element={<Agencies />} />
                <Route path="/agencies/:id" element={<AgencyProfile />} />
                <Route path="/tours" element={<Tours />} />
                <Route path="/places" element={<Places />} />
                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/request" element={<RequestTour />} />
                <Route path="/requests" element={<Requests />} />
              </Route>

              {/* Auth Routes - No Header/Footer */}
              <Route element={<AuthLayout><Outlet /></AuthLayout>}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Agency Routes - Protected */}
              <Route element={
                <ProtectedRoute allowedRoles={['AGENCY']}>
                  <AgencyLayout><Outlet /></AgencyLayout>
                </ProtectedRoute>
              }>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/offers" element={<Offers />} />
                <Route path="/dashboard/tours" element={<AgencyPlaceholder title="Mening turlarim" />} />
                <Route path="/dashboard/requests" element={<AgencyPlaceholder title="Mijoz so'rovlari" />} />
                <Route path="/dashboard/seats" element={<AgencyPlaceholder title="Bo'sh joylar" />} />
                <Route path="/dashboard/settings" element={<AgencyPlaceholder title="Sozlamalar" />} />
              </Route>

              {/* Admin Routes - Protected */}
              <Route element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminLayout><Outlet /></AdminLayout>
                </ProtectedRoute>
              }>
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/agencies" element={<AdminPlaceholder title="Agentliklar ro'yxati" />} />
                <Route path="/admin/users" element={<AdminPlaceholder title="Foydalanuvchilar" />} />
                <Route path="/admin/places" element={<AdminPlaceholder title="Obyektlar" />} />
                <Route path="/admin/moderation" element={<AdminPlaceholder title="Moderatsiya" />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </RequestProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
