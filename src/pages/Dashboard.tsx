import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { tours, tourRequests } from '../data/mock';
import { Plus, Users, DollarSign, Star, Send, Calendar, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'tours' | 'requests' | 'offers'>('tours');
  const [showAddTour, setShowAddTour] = useState(false);
  const [localTours, setLocalTours] = useState(tours.slice(0, 3));
  const [localRequests, setLocalRequests] = useState(tourRequests);
  const [offerForm, setOfferForm] = useState<{ requestId: string; price: string; message: string }>({ requestId: '', price: '', message: '' });

  const stats = [
    { icon: <Calendar size={20} />, label: t('dashboard.stats.totalTours'), value: localTours.length.toString(), color: 'bg-blue-50 text-blue-600' },
    { icon: <Users size={20} />, label: t('dashboard.stats.activeBookings'), value: '23', color: 'bg-green-50 text-green-600' },
    { icon: <DollarSign size={20} />, label: t('dashboard.stats.totalRevenue'), value: '$12,450', color: 'bg-amber-50 text-amber-600' },
    { icon: <Star size={20} />, label: t('dashboard.stats.avgRating'), value: '4.8', color: 'bg-purple-50 text-purple-600' },
  ];

  const handleSendOffer = (requestId: string) => {
    if (!offerForm.price || !offerForm.message) return;
    setLocalRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          offers: [...(r.offers || []), {
            id: `o${Date.now()}`,
            requestId,
            agencyId: '1',
            agencyName: 'Silk Road Adventures',
            price: Number(offerForm.price),
            message: offerForm.message,
            status: 'PENDING' as const,
          }]
        };
      }
      return r;
    }));
    setOfferForm({ requestId: '', price: '', message: '' });
  };

  const handleUpdateSeats = (tourId: string, newSeats: number) => {
    setLocalTours(prev => prev.map(t =>
      t.id === tourId ? { ...t, availableSeats: newSeats } : t
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('dashboard.title')}</h1>
            <p className="text-indigo-200">Boshqaruv paneli</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
          {[
            { key: 'tours' as const, label: t('dashboard.tours') },
            { key: 'requests' as const, label: t('dashboard.requests') },
            { key: 'offers' as const, label: t('dashboard.offers') },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tours Tab */}
        {activeTab === 'tours' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.tours')}</h2>
              <button
                onClick={() => setShowAddTour(!showAddTour)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                <Plus size={16} />
                {t('dashboard.addTour')}
              </button>
            </div>

            {showAddTour && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Create New Tour</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Tour title" className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <input type="number" placeholder="Price (USD)" className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <input type="number" placeholder="Total seats" className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <input type="date" className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <textarea placeholder="Description" className="md:col-span-2 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" rows={3} />
                </div>
                <div className="flex gap-3 mt-4">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium">Save Tour</button>
                  <button onClick={() => setShowAddTour(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium">Cancel</button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {localTours.map((tour) => (
                <div key={tour.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{tour.image}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{tour.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(tour.startDate).toLocaleDateString()} - {new Date(tour.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">${tour.price}</div>
                      <div className="text-sm text-gray-500">{t('common.perPerson')}</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">
                          <Users size={14} className="inline mr-1" />
                          {tour.availableSeats}/{tour.totalSeats} {t('tours.seats')}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-400 rounded-full"
                          style={{ width: `${(tour.availableSeats / tour.totalSeats) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max={tour.totalSeats}
                        defaultValue={tour.availableSeats}
                        className="w-20 px-2 py-1 text-sm border border-gray-200 rounded-lg"
                        onBlur={(e) => handleUpdateSeats(tour.id, Number(e.target.value))}
                      />
                      <button
                        onClick={() => {
                          const input = document.querySelector(`input[data-tour="${tour.id}"]`) as HTMLInputElement;
                          if (input) handleUpdateSeats(tour.id, Number(input.value));
                        }}
                        className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100"
                      >
                        {t('dashboard.updateSeats')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {localRequests.map((req) => (
              <div key={req.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{req.touristName}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        req.status === 'PENDING' ? 'bg-amber-50 text-amber-700' :
                        req.status === 'ACCEPTED' ? 'bg-green-50 text-green-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      <Calendar size={12} className="inline mr-1" />
                      {req.startDate} → {req.endDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">${req.budget}</div>
                    <div className="text-xs text-gray-500">budget</div>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700">Interests: </span>
                  <span className="text-sm text-gray-500">{req.interests}</span>
                </div>

                {/* Existing Offers */}
                {(req.offers || []).length > 0 && (
                  <div className="mb-4 space-y-2">
                    <span className="text-sm font-medium text-gray-700">Offers received:</span>
                    {(req.offers || []).map((offer) => (
                      <div key={offer.id} className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium">{offer.agencyName}</span>
                          <span className="text-sm text-gray-500 ml-2">${offer.price}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          offer.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                          offer.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {offer.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Send Offer Form */}
                {req.status === 'PENDING' && (
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex gap-3 mb-3">
                      <input
                        type="number"
                        placeholder="Your price (USD)"
                        value={offerForm.requestId === req.id ? offerForm.price : ''}
                        onChange={(e) => setOfferForm({ ...offerForm, requestId: req.id, price: e.target.value })}
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <textarea
                      placeholder="Your offer message..."
                      value={offerForm.requestId === req.id ? offerForm.message : ''}
                      onChange={(e) => setOfferForm({ ...offerForm, requestId: req.id, message: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-3"
                      rows={2}
                    />
                    <button
                      onClick={() => handleSendOffer(req.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      <Send size={14} />
                      {t('dashboard.sendOffer')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Offers Tab */}
        {activeTab === 'offers' && (
          <div className="space-y-4">
            {localRequests.flatMap(r => (r.offers || []).map(o => ({ ...o, request: r }))).map((offer) => (
              <div key={offer.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">Offer for {offer.request.touristName}</h3>
                    <p className="text-sm text-gray-500">{offer.request.interests}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    offer.status === 'PENDING' ? 'bg-amber-50 text-amber-700' :
                    offer.status === 'ACCEPTED' ? 'bg-green-50 text-green-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    {offer.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">${offer.price}</span>
                    <p className="text-sm text-gray-500 mt-1">{offer.message}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                      <CheckCircle size={18} />
                    </button>
                    <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {localRequests.flatMap(r => r.offers).length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Clock size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">No offers sent yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
