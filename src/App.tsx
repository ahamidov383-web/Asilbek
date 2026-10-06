import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Agencies from './pages/Agencies';
import Tours from './pages/Tours';
import Places from './pages/Places';
import Restaurants from './pages/Restaurants';
import RequestTour from './pages/RequestTour';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/agencies" element={<Agencies />} />
              <Route path="/tours" element={<Tours />} />
              <Route path="/places" element={<Places />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/request" element={<RequestTour />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
