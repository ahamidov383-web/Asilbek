import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Building2, Shield } from 'lucide-react';
import { Role } from '../types';

type LoginType = 'tourist' | 'agency' | 'admin';

export default function Login() {
  const [activeTab, setActiveTab] = useState<LoginType>('tourist');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Agar allaqachon kirgan bo'lsa, tegishli sahifaga yo'naltirish
  React.useEffect(() => {
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
  React.useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'access_denied') {
      setError("Bu bo'limga kirish uchun ruxsatingiz yo'q!");
    }
  }, [searchParams]);

  const tabs = [
    { id: 'tourist' as const, label: 'Turist', icon: User, color: 'text-blue-600 border-blue-600' },
    { id: 'agency' as const, label: 'Agentlik', icon: Building2, color: 'text-green-600 border-green-600' },
    { id: 'admin' as const, label: 'Admin', icon: Shield, color: 'text-red-600 border-red-600' },
  ];

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
      if (activeTab === 'admin') {
        navigate('/admin');
      } else if (activeTab === 'agency') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🇺🇿</div>
          <h1 className="text-2xl font-bold text-gray-900">Visit Uzbekistan</h1>
          <p className="text-gray-500 text-sm mt-1">Tizimga kirish</p>
        </div>

        {/* 3 XIL KIRISH TABLARI */}
        <div className="flex border-b mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center py-3 text-sm font-medium transition-all border-b-2 -mb-px
                  ${activeTab === tab.id ? tab.color : 'text-gray-400 border-transparent hover:text-gray-600'}`}
              >
                <Icon className="w-5 h-5 mb-1" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* LOGIN FORMASI */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="sizning@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parol</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all shadow-md
              ${activeTab === 'admin' ? 'bg-red-600 hover:bg-red-700' : 
                activeTab === 'agency' ? 'bg-green-600 hover:bg-green-700' : 
                'bg-blue-600 hover:bg-blue-700'}
              disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? 'Kirilmoqda...' : `${tabs.find(t => t.id === activeTab)?.label} sifatida kirish`}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs font-semibold text-gray-700 mb-2">Demo hisoblar:</p>
          <div className="space-y-1 text-xs text-gray-600">
            <div><strong>Turist:</strong> tourist@test.com / tourist123</div>
            <div><strong>Agentlik:</strong> agency@test.com / agency123</div>
            <div><strong>Admin:</strong> admin@test.com / admin123</div>
          </div>
        </div>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          Akkountingiz yo'qmi?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700">
            Ro'yxatdan o'tish
          </Link>
        </p>
      </div>
    </div>
  );
}
