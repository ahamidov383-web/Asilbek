import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { User, Building2, Shield, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, MapPin, Phone, FileText } from 'lucide-react';

type RegisterType = 'tourist' | 'agency';

export default function Register() {
  const [activeTab, setActiveTab] = useState<RegisterType>('tourist');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);

  const { t } = useLanguage();
  const navigate = useNavigate();

  // Tourist form
  const [touristForm, setTouristForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: '',
  });

  // Agency form
  const [agencyForm, setAgencyForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agencyName: '',
    description: '',
    phone: '',
    address: '',
    license: '',
    agreeTerms: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    { 
      id: 'tourist' as const, 
      label: 'Turist', 
      icon: User, 
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-500',
      description: 'Sayohat qilish uchun ro\'yxatdan o\'ting'
    },
    { 
      id: 'agency' as const, 
      label: 'Agentlik', 
      icon: Building2, 
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-500',
      description: 'Turlarni sotish uchun qo\'shiling'
    },
  ];

  const currentTab = tabs.find(t => t.id === activeTab)!;

  const handleTouristSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (touristForm.password !== touristForm.confirmPassword) {
      alert('Parollar mos kelmaydi!');
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => navigate('/login'), 2000);
  };

  const handleAgencySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (agencyForm.password !== agencyForm.confirmPassword) {
      alert('Parollar mos kelmaydi!');
      return;
    }
    if (!agencyForm.agreeTerms) {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full animate-scale-in">
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
          <div className="mt-6 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-progress" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 p-4 py-8">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-200 rounded-full opacity-10 blur-3xl" />
      </div>

      <div className={`w-full max-w-lg relative z-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {/* Header */}
          <div className={`bg-gradient-to-r ${currentTab.color} p-6 text-white relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative">
              <div className="flex items-center justify-center mb-3">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <currentTab.icon className="w-8 h-8" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-center">Ro'yxatdan o'tish</h1>
              <p className="text-center text-white/80 text-sm mt-1">{currentTab.description}</p>
            </div>
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
                      setStep(1);
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

            {/* Progress Steps for Agency */}
            {activeTab === 'agency' && (
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2].map((s) => (
                  <React.Fragment key={s}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      step >= s ? `bg-gradient-to-r ${currentTab.color} text-white shadow-md` : 'bg-gray-200 text-gray-400'
                    }`}>
                      {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                    </div>
                    {s < 2 && <div className={`w-12 h-1 rounded-full transition-all ${step > s ? `bg-gradient-to-r ${currentTab.color}` : 'bg-gray-200'}`} />}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Tourist Form */}
            {activeTab === 'tourist' && (
              <form onSubmit={handleTouristSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <User className="w-4 h-4 inline mr-1" />
                    To'liq ism
                  </label>
                  <input
                    type="text"
                    required
                    value={touristForm.name}
                    onChange={(e) => setTouristForm({ ...touristForm, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:shadow-lg transition-all bg-gray-50/50 focus:bg-white"
                    placeholder="Ismingiz Familyangiz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={touristForm.email}
                    onChange={(e) => setTouristForm({ ...touristForm, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:shadow-lg transition-all bg-gray-50/50 focus:bg-white"
                    placeholder="sizning@email.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={touristForm.phone}
                      onChange={(e) => setTouristForm({ ...touristForm, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:shadow-lg transition-all bg-gray-50/50 focus:bg-white"
                      placeholder="+998 90 123 45 67"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Davlat
                    </label>
                    <input
                      type="text"
                      value={touristForm.country}
                      onChange={(e) => setTouristForm({ ...touristForm, country: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:shadow-lg transition-all bg-gray-50/50 focus:bg-white"
                      placeholder="O'zbekiston"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <Lock className="w-4 h-4 inline mr-1" />
                    Parol
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={touristForm.password}
                      onChange={(e) => setTouristForm({ ...touristForm, password: e.target.value })}
                      className="w-full px-4 py-3 pr-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:shadow-lg transition-all bg-gray-50/50 focus:bg-white"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <Lock className="w-4 h-4 inline mr-1" />
                    Parolni tasdiqlang
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={touristForm.confirmPassword}
                    onChange={(e) => setTouristForm({ ...touristForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:shadow-lg transition-all bg-gray-50/50 focus:bg-white"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl
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
            {activeTab === 'agency' && step === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <Building2 className="w-4 h-4 inline mr-1" />
                    Agentlik nomi
                  </label>
                  <input
                    type="text"
                    required
                    value={agencyForm.agencyName}
                    onChange={(e) => setAgencyForm({ ...agencyForm, agencyName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:shadow-lg transition-all bg-gray-50/50 focus:bg-white"
                    placeholder="Masalan: Silk Road Tours"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Qisqacha tavsif
                  </label>
                  <textarea
                    value={agencyForm.description}
                    onChange={(e) => setAgencyForm({ ...agencyForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:shadow-lg transition-all bg-gray-50/50 focus:bg-white resize-none"
                    placeholder="Agentligingiz haqida qisqacha..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Telefon
                    </label>
                    <input
                      type="tel"
                      required
                      value={agencyForm.phone}
                      onChange={(e) => setAgencyForm({ ...agencyForm, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:shadow-lg transition-all bg-gray-50/50 focus:bg-white"
                      placeholder="+998 71 123 45 67"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      <FileText className="w-4 h-4 inline mr-1" />
                      Litsenziya №
                    </label>
                    <input
                      type="text"
                      value={agencyForm.license}
                      onChange={(e) => setAgencyForm({ ...agencyForm, license: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:shadow-lg transition-all bg-gray-50/50 focus:bg-white"
                      placeholder="LT-001234"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Manzil
                  </label>
                  <input
                    type="text"
                    value={agencyForm.address}
                    onChange={(e) => setAgencyForm({ ...agencyForm, address: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:shadow-lg transition-all bg-gray-50/50 focus:bg-white"
                    placeholder="Toshkent sh., Amir Temur ko'chasi, 10-uy"
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl
                    bg-gradient-to-r ${currentTab.color}
                    hover:scale-[1.02] active:scale-[0.98]
                    flex items-center justify-center gap-2 mt-6`}
                >
                  <span>Davom etish</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}

            {activeTab === 'agency' && step === 2 && (
              <form onSubmit={handleAgencySubmit} className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
                  <p className="text-sm text-emerald-700 font-medium">
                    ✓ Ma'lumotlaringiz admin tomonidan tekshiriladi
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <User className="w-4 h-4 inline mr-1" />
                    Mas'ul shaxs ismi
                  </label>
                  <input
                    type="text"
                    required
                    value={agencyForm.name}
                    onChange={(e) => setAgencyForm({ ...agencyForm, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:shadow-lg transition-all bg-gray-50/50 focus:bg-white"
                    placeholder="Ismingiz Familyangiz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={agencyForm.email}
                    onChange={(e) => setAgencyForm({ ...agencyForm, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:shadow-lg transition-all bg-gray-50/50 focus:bg-white"
                    placeholder="agentlik@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <Lock className="w-4 h-4 inline mr-1" />
                    Parol
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={agencyForm.password}
                      onChange={(e) => setAgencyForm({ ...agencyForm, password: e.target.value })}
                      className="w-full px-4 py-3 pr-11 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:shadow-lg transition-all bg-gray-50/50 focus:bg-white"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <Lock className="w-4 h-4 inline mr-1" />
                    Parolni tasdiqlang
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={agencyForm.confirmPassword}
                    onChange={(e) => setAgencyForm({ ...agencyForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:shadow-lg transition-all bg-gray-50/50 focus:bg-white"
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

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all"
                  >
                    ← Orqaga
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !agencyForm.agreeTerms}
                    className={`flex-1 py-4 rounded-xl text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl
                      bg-gradient-to-r ${currentTab.color}
                      hover:scale-[1.02] active:scale-[0.98]
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                      flex items-center justify-center gap-2`}
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
                </div>
              </form>
            )}

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">YOKI</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600">
              Allaqachon hisobingiz bormi?{' '}
              <Link 
                to="/login" 
                className={`font-bold bg-gradient-to-r ${currentTab.color} bg-clip-text text-transparent hover:opacity-80 transition-opacity`}
              >
                Kirish →
              </Link>
            </p>
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
