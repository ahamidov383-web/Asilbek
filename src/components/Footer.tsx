import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🇺🇿</span>
              <span className="text-lg font-bold text-white">Visit Uzbekistan</span>
            </div>
            <p className="text-sm text-gray-400">
              Your gateway to discovering the beauty, culture, and hospitality of Uzbekistan.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/tours" className="hover:text-white transition-colors">Tours</Link></li>
              <li><Link to="/places" className="hover:text-white transition-colors">Places</Link></li>
              <li><Link to="/restaurants" className="hover:text-white transition-colors">Restaurants</Link></li>
              <li><Link to="/agencies" className="hover:text-white transition-colors">Agencies</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">For Agencies</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Partner Program</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Access</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>📧 info@visituzbekistan.com</li>
              <li>📞 +998 71 123 4567</li>
              <li>📍 Tashkent, Uzbekistan</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          © 2026 Visit Uzbekistan Tourism Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
