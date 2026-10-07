import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 text-9xl">🕌</div>
          <div className="absolute bottom-20 right-20 text-8xl">🏛️</div>
          <div className="absolute top-1/2 left-1/3 text-7xl">🐫</div>
          <div className="absolute bottom-1/3 left-20 text-6xl">🏰</div>
          <div className="absolute top-1/3 right-1/4 text-7xl">🍽️</div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-5xl">🇺🇿</span>
              <h1 className="text-4xl font-bold">Visit Uzbekistan</h1>
            </div>
            <p className="text-xl text-blue-100 leading-relaxed">
              O'zbekistonning boy madaniyati, qadimiy tarixi va mehmondo'stligini kashf eting
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
              <p className="text-blue-100">500+ tarixiy obidalar va diqqatga sazovor joylar</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <span className="text-xl">🍜</span>
              </div>
              <p className="text-blue-100">1000+ an'anaviy taomlar va restoranlar</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <span className="text-xl">🏢</span>
              </div>
              <p className="text-blue-100">45+ tasdiqlangan sayyohlik agentliklari</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-sm text-blue-200">Mamnun sayyohlar</div>
            </div>
            <div>
              <div className="text-3xl font-bold">150+</div>
              <div className="text-sm text-blue-200">Turlar</div>
            </div>
            <div>
              <div className="text-3xl font-bold">4.9</div>
              <div className="text-sm text-blue-200">Reyting</div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl" />
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="text-4xl">🇺🇿</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                Visit Uzbekistan
              </span>
            </Link>
          </div>

          {/* Form Content */}
          {children}

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              ← Bosh sahifaga qaytish
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
