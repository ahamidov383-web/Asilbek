import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Building2, Shield, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Role } from '../types';

type LoginType = 'tourist' | 'agency' | 'admin';

export default function Login() {
  const [activeTab, setActiveTab] = useState<LoginType>('tourist');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') navigate('/admin', { replace: true });
      else if (user.role === 'AGENCY') navigate('/dashboard', { replace: true });
      else navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'access_denied') {
      setError("Bu bo'limga kirish uchun ruxsatingiz yo'q!");
    }
  }, [searchParams]);

  const tabs = [
    { id: 'tourist' as const, label: 'Turist', icon: User, color: 'from-blue-500 to-cyan-500' },
    { id: 'agency' as const, label: 'Agentlik', icon: Building2, color: 'from-emerald-500 to-teal-500' },
    { id: 'admin' as const, label: 'Admin', icon: Shield, color: 'from-red-500 to-rose-500' },
  ];

  const currentTab = tabs.find(t => t.id === activeTab)!;

  const fillDemoCredentials = (tab: LoginType) => {
    const credentials = {
      tourist: { email: 'tourist@test.com', password: 'tourist123' },
      agency: { email: 'agency@test.com', password: 'agency123' },
      admin: { email: 'admin@test.com', password: 'admin123' },
    };
    setEmail(credentials[tab].email);
    setPassword(credentials[tab].password);
  };

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
      setTimeout(() => {
        if (activeTab === 'admin') navigate('/admin');
        else if (activeTab === 'agency') navigate('/dashboard');
        else navigate('/');
      }, 300);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tizimga kirish</h1>
        <p className="text-gray-500">Hisobingizga kirish uchun ma'lumotlaringizni kiriting</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-2xl p-1.5 mb-6">
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
                  ? 'bg-white shadow-lg text-gray-900 scale-105' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
            >
              <Icon className={`w-5 h-5 mb-1 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:shadow-lg transition-all"
              placeholder="sizning@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Parol</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-11 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:shadow-lg transition-all"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 rounded-xl text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl
            bg-gradient-to-r ${currentTab.color}
            hover:scale-[1.02] active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Kirilmoqda...</span>
            </>
          ) : (
            <>
              <span>Kirish</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* Demo Credentials */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <p className="text-xs font-semibold text-gray-700 mb-2">Demo hisoblar:</p>
        <div className="space-y-1 text-xs text-gray-600">
          <div><strong>Turist:</strong> tourist@test.com / tourist123</div>
          <div><strong>Agentlik:</strong> agency@test.com / agency123</div>
          <div><strong>Admin:</strong> admin@test.com / admin123</div>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600 mt-6">
        Akkountingiz yo'qmi?{' '}
        <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700">
          Ro'yxatdan o'tish →
        </Link>
      </p>
    </div>
  );
}
