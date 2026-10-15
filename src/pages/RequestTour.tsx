import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { Send, CheckCircle, Calendar, DollarSign, Heart, MapPin } from 'lucide-react';

export default function RequestTour() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const { createRequest } = useRequests();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    budget: '',
    interests: '',
    startDate: '',
    endDate: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await createRequest({
      budget: form.budget ? Number(form.budget) : undefined,
      interests: form.interests,
      startDate: form.startDate,
      endDate: form.endDate,
      notes: form.notes,
    });

    setSubmitting(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || 'Xatolik yuz berdi');
    }
  };

  const interestSuggestions = ['Tarix', 'Me\'morchilik', 'Ovqat', 'Tabiat', 'Sarguzasht', 'Foto', 'Xarid', 'Madaniyat', 'Musiqa', 'Hunarmandchilik'];

  // Autentifikatsiya tekshiruvi
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm max-w-md w-full">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Tizimga kiring</h2>
          <p className="text-gray-500 mb-6">So'rov yuborish uchun avval tizimga kirishingiz kerak</p>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Kirish
          </a>
        </div>
      </div>
    );
  }

  if (user?.role !== 'TOURIST') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm max-w-md w-full">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ruxsat yo'q</h2>
          <p className="text-gray-500">Faqat turistlar so'rov yuborishi mumkin</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">So'rov yuborildi!</h2>
          <p className="text-gray-500 mb-6">{t('request.success')}</p>
          <div className="flex gap-3">
            <a
              href="/requests"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              So'rovlarimni ko'rish
            </a>
            <button
              onClick={() => { setSubmitted(false); setForm({ budget: '', interests: '', startDate: '', endDate: '', notes: '' }); }}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Yangi so'rov
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t('request.title')}</h1>
          <p className="text-purple-100 text-lg">{t('request.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          {/* User Info */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Sayyoh:</span> {user?.name} ({user?.email})
            </p>
          </div>

          {/* Budget */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <DollarSign size={16} className="text-green-500" />
              {t('request.budget')}
            </label>
            <input
              type="number"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., 1500"
              min="0"
            />
          </div>

          {/* Interests */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Heart size={16} className="text-pink-500" />
              {t('request.interests')}
            </label>
            <input
              type="text"
              value={form.interests}
              onChange={(e) => setForm({ ...form, interests: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-3"
              placeholder={t('request.interestsPlaceholder')}
            />
            <div className="flex flex-wrap gap-2">
              {interestSuggestions.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => {
                    const current = form.interests;
                    if (current.includes(interest)) {
                      setForm({ ...form, interests: current.replace(interest, '').replace(/,\s*,/g, ',').trim() });
                    } else {
                      setForm({ ...form, interests: current ? `${current}, ${interest}` : interest });
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    form.interests.includes(interest)
                      ? 'bg-purple-500 text-white'
                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-blue-500" />
                {t('request.startDate')}
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-blue-500" />
                {t('request.endDate')}
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Any special requirements, group size, accessibility needs..."
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Yuborilmoqda...
              </>
            ) : (
              <>
                <Send size={18} />
                {t('request.submit')}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
