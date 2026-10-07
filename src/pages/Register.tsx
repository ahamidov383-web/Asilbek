import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Building2, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';

type RegisterType = 'tourist' | 'agency';

export default function Register() {
  const [activeTab, setActiveTab] = useState<RegisterType>('tourist');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const [touristForm, setTouristForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [agencyForm, setAgencyForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agencyName: '',
    agreeTerms: false,
  });

  const tabs = [
    { id: 'tourist' as const, label: 'Turist', icon: User, color: 'from-blue-500 to-cyan-500' },
    { id: 'agency' as const, label: 'Agentlik', icon: Building2, color: 'from-emerald-500 to-teal-500' },
  ];

  const currentTab = tabs.find(t => t.id === activeTab)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = activeTab === 'tourist' ? touristForm : agencyForm;
    if (form.password !== form.confirmPassword) {
      alert('Parollar mos kelmaydi!');
      return;
    }

    if (activeTab === 'agency' && !agencyForm.agreeTerms) {
      alert('Shartlarga rozilik bildiring!');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => navigate('/login'), 2000);
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Muvaffaqiyatli!</h2>
        <p className="text-gray-500 mb-2">
          {activeTab === 'tourist' 
            ? 'Hisobingiz muvaffaqiyatli yaratildi!'
            : 'Arizangiz qabul qilindi. Admin tasdiqlashini kuting.'
          }
        </p>
        <p className="text-sm text-gray-400">Login sahifasiga yo'naltirilmoqdasiz...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ro'yxatdan o'tish</h1>
        <p className="text-gray-500">Yangi hisob yarating va sayohatingizni boshlang</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-2xl p-1.5 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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

      {/* Tourist Form */}
      {activeTab === 'tourist' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">To'liq ism</label>
            <input
              type="text"
              required
              value={touristForm.name}
              onChange={(e) => setTouristForm({ ...touristForm, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:shadow-lg transition-all"
              placeholder="Ismingiz Familyangiz"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={touristForm.email}
              onChange={(e) => setTouristForm({ ...touristForm, email: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:shadow-lg transition-all"
              placeholder="sizning@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Parol</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={touristForm.password}
                onChange={(e) => setTouristForm({ ...touristForm, password: e.target.value })}
                className="w-full px-4 py-3 pr-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:shadow-lg transition-all"
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
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Parolni tasdiqlang</label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={touristForm.confirmPassword}
              onChange={(e) => setTouristForm({ ...touristForm, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:shadow-lg transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl
              bg-gradient-to-r ${currentTab.color}
              hover:scale-[1.02] active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2 mt-6`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Yaratilmoqda...</span>
              </>
            ) : (
              <>
                <span>Ro'yxatdan o'tish</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      )}

      {/* Agency Form */}
      {activeTab === 'agency' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Agentlik nomi</label>
            <input
              type="text"
              required
              value={agencyForm.agencyName}
              onChange={(e) => setAgencyForm({ ...agencyForm, agencyName: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:shadow-lg transition-all"
              placeholder="Masalan: Silk Road Tours"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mas'ul shaxs ismi</label>
            <input
              type="text"
              required
              value={agencyForm.name}
              onChange={(e) => setAgencyForm({ ...agencyForm, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:shadow-lg transition-all"
              placeholder="Ismingiz Familyangiz"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={agencyForm.email}
              onChange={(e) => setAgencyForm({ ...agencyForm, email: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:shadow-lg transition-all"
              placeholder="agentlik@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Parol</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={agencyForm.password}
                onChange={(e) => setAgencyForm({ ...agencyForm, password: e.target.value })}
                className="w-full px-4 py-3 pr-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:shadow-lg transition-all"
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
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Parolni tasdiqlang</label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={agencyForm.confirmPassword}
              onChange={(e) => setAgencyForm({ ...agencyForm, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:shadow-lg transition-all"
              placeholder="••••••••"
            />
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agencyForm.agreeTerms}
              onChange={(e) => setAgencyForm({ ...agencyForm, agreeTerms: e.target.checked })}
              className="w-5 h-5 mt-0.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm text-gray-600">
              Men <a href="#" className="text-emerald-600 font-medium underline">shartlar va qoidalarga</a> roziman
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || !agencyForm.agreeTerms}
            className={`w-full py-3.5 rounded-xl text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl
              bg-gradient-to-r ${currentTab.color}
              hover:scale-[1.02] active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2 mt-6`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Yuborilmoqda...</span>
              </>
            ) : (
              <>
                <span>Ariza yuborish</span>
                <CheckCircle className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      )}

      <p className="text-center text-sm text-gray-600 mt-6">
        Allaqachon hisobingiz bormi?{' '}
        <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700">
          Kirish →
        </Link>
      </p>
    </div>
  );
}
