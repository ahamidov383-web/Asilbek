import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Building2, Shield, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { Role } from '../types';

type LoginType = 'tourist' | 'agency' | 'admin';

export default function Login() {
  const [activeTab, setActiveTab] = useState<LoginType>('tourist');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { login, isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Animatsiya uchun mount effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Agar allaqachon kirgan bo'lsa, tegishli sahifaga yo'naltirish
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'AGENCY') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  // URL dan error parametrlarini tekshirish
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'access_denied') {
      setError("Bu bo'limga kirish uchun ruxsatingiz yo'q!");
    }
  }, [searchParams]);

  const tabs = [
    { 
      id: 'tourist' as const, 
      label: 'Turist', 
      icon: User, 
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-500',
      description: 'Sayohat qiling va kashf eting'
    },
    { 
      id: 'agency' as const, 
      label: 'Agentlik', 
      icon: Building2, 
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-500',
      description: 'Turlarni boshqaring'
    },
    { 
      id: 'admin' as const, 
      label: 'Admin', 
      icon: Shield, 
      color: 'from-red-500 to-rose-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-500',
      description: 'Tizimni boshqaring'
    },
  ];

  const currentTab = tabs.find(t => t.id === activeTab)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const roleMap: Record<LoginType, Role> = {
      tourist: 'TOURIST',
      agency: 'AGENCY',
      admin: 'ADMIN',
    };

    const result = await login(email, password, roleMap[activeTab]);

    if (!result.success) {
      setError(result.error || "Kirishda xatolik yuz berdi");
      setLoading(false);
    } else {
      // Muvaffaqiyatli kirgandan so'ng yo'naltirish
      setTimeout(() => {
        if (activeTab === 'admin') {
          navigate('/admin');
        } else if (activeTab === 'agency') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      }, 300);
    }
  };

  // Demo credentials ni avtomatik to'ldirish
  const fillDemoCredentials = (tab: LoginType) => {
    const credentials = {
      tourist: { email: 'tourist@test.com', password: 'tourist123' },
      agency: { email: 'agency@test.com', password: 'agency123' },
      admin: { email: 'admin@test.com', password: 'admin123' },
    };
    setEmail(credentials[tab].email);
    setPassword(credentials[tab].password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200 rounded-full opacity-20 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full opacity-10 blur-3xl" />
        
        {/* Floating icons */}
        <div className="absolute top-20 left-10 text-4xl opacity-10 animate-bounce" style={{ animationDelay: '0s' }}>🕌</div>
        <div className="absolute top-40 right-20 text-3xl opacity-10 animate-bounce" style={{ animationDelay: '0.5s' }}>🏛️</div>
        <div className="absolute bottom-20 left-1/4 text-3xl opacity-10 animate-bounce" style={{ animationDelay: '1s' }}>🐫</div>
        <div className="absolute bottom-40 right-1/3 text-4xl opacity-10 animate-bounce" style={{ animationDelay: '1.5s' }}>🏰</div>
      </div>

      <div className={`w-full max-w-md relative z-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {/* Header with gradient */}
          <div className={`bg-gradient-to-r ${currentTab.color} p-6 text-white relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative">
              <div className="flex items-center justify-center mb-3">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <currentTab.icon className="w-8 h-8" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-center">Visit Uzbekistan</h1>
              <p className="text-center text-white/80 text-sm mt-1">{currentTab.description}</p>
            </div>
            
            {/* Decorative pattern */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-white/10 rounded-full" />
          </div>

          <div className="p-8">
            {/* Tabs */}
            <div className="flex bg-gray-100/80 rounded-2xl p-1.5 mb-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setError('');
                      fillDemoCredentials(tab.id);
                    }}
                    className={`flex-1 flex flex-col items-center py-3 px-2 rounded-xl text-xs font-medium transition-all duration-300
                      ${isActive 
                        ? `bg-white shadow-lg ${tab.textColor} scale-105` 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                      }`}
                  >
                    <Icon className={`w-5 h-5 mb-1 transition-transform ${isActive ? 'scale-110' : ''}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-3.5 pl-11 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-gray-50/50
                      ${email ? 'border-blue-300 bg-white' : 'border-gray-200'}
                      focus:border-blue-500 focus:bg-white focus:shadow-lg`}
                    placeholder="sizning@email.com"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-600" />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-1" />
                  Parol
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3.5 pl-11 pr-11 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-gray-50/50
                      ${password ? 'border-blue-300 bg-white' : 'border-gray-200'}
                      focus:border-blue-500 focus:bg-white focus:shadow-lg`}
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-600" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Meni eslab qol</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Parolni unutdingizmi?
                </a>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3 animate-shake">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-xs">✕</span>
                  </div>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl
                  bg-gradient-to-r ${currentTab.color}
                  hover:scale-[1.02] active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  flex items-center justify-center gap-2`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Kirilmoqda...</span>
                  </>
                ) : (
                  <>
                    <span>{currentTab.label} sifatida kirish</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">YOKI</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-600">
              Akkountingiz yo'qmi?{' '}
              <Link 
                to="/register" 
                className={`font-bold bg-gradient-to-r ${currentTab.color} bg-clip-text text-transparent hover:opacity-80 transition-opacity`}
              >
                Ro'yxatdan o'tish →
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials Card */}
        <div className={`mt-6 bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '200ms' }}>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className={`w-4 h-4 ${currentTab.textColor}`} />
            <span className="text-sm font-bold text-gray-700">Tezkor kirish (Demo)</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  fillDemoCredentials(tab.id);
                }}
                className={`p-3 rounded-xl border-2 transition-all duration-300 text-center
                  ${activeTab === tab.id 
                    ? `${tab.borderColor} ${tab.bgColor} scale-105 shadow-md` 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <tab.icon className={`w-5 h-5 mx-auto mb-1 ${activeTab === tab.id ? tab.textColor : 'text-gray-400'}`} />
                <div className={`text-xs font-medium ${activeTab === tab.id ? tab.textColor : 'text-gray-500'}`}>
                  {tab.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            ← Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    </div>
  );
}
