import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Globe, LogOut, User } from 'lucide-react';
import { Language } from '../types';

export default function TouristLayout({ children }: { children: React.ReactNode }) {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Bosh sahifa' },
    { path: '/places', label: 'Obyektlar' },
    { path: '/restaurants', label: 'Restoranlar' },
    { path: '/agencies', label: 'Agentliklar' },
    { path: '/tours', label: 'Turlar' },
    { path: '/requests', label: 'So\'rovlarim' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'ru', label: 'RU', flag: '🇷🇺' },
    { code: 'uz', label: 'UZ', flag: '🇺🇿' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🇺🇿</span>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                Visit Uzbekistan
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Language Switcher + Auth + Mobile Menu */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                      language === lang.code
                        ? 'bg-white shadow text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className="mr-1">{lang.flag}</span>
                    {lang.label}
                  </button>
                ))}
              </div>

              {/* Auth Section */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {user.name}
                    </span>
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      {user.role === 'AGENCY' && (
                        <Link
                          to="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Kabinet
                        </Link>
                      )}
                      {user.role === 'ADMIN' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Admin panel
                        </Link>
                      )}
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut size={14} />
                        Chiqish
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                  >
                    Kirish
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Ro'yxatdan o'tish
                  </Link>
                </div>
              )}

              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t bg-white">
            <nav className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-center text-blue-600 border border-blue-600 rounded-lg text-sm font-medium"
                  >
                    Kirish
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-center bg-blue-600 text-white rounded-lg text-sm font-medium"
                  >
                    Ro'yxatdan o'tish
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🇺🇿</span>
                <span className="text-lg font-bold text-white">Visit Uzbekistan</span>
              </div>
              <p className="text-sm text-gray-400">
                O'zbekiston go'zalliklarini kashf eting!
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Sayt bo'limlari</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/tours" className="hover:text-white transition-colors">Turlar</Link></li>
                <li><Link to="/places" className="hover:text-white transition-colors">Obyektlar</Link></li>
                <li><Link to="/restaurants" className="hover:text-white transition-colors">Restoranlar</Link></li>
                <li><Link to="/agencies" className="hover:text-white transition-colors">Agentliklar</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Agentliklar uchun</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Kabinet</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Hamkorlik dasturi</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Bog'lanish</h4>
              <ul className="space-y-2 text-sm">
                <li>📧 info@visituzbekistan.com</li>
                <li>📞 +998 71 123 4567</li>
                <li>📍 Toshkent, O'zbekiston</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            © 2026 Visit Uzbekistan Tourism Platform. Barcha huquqlar himoyalangan.
          </div>
        </div>
      </footer>
    </div>
  );
}
