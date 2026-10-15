import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { TourRequest } from '../lib/types';
import { Calendar, DollarSign, MessageSquare, Send, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function Offers() {
  const { user } = useAuth();
  const { getPendingRequests, getMyOffers } = useRequests();
  const [selectedRequest, setSelectedRequest] = useState<TourRequest | null>(null);
  const [offerForm, setOfferForm] = useState({ price: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'sent'>('pending');

  const pendingRequests = getPendingRequests();
  const myOffers = getMyOffers();

  const { createOffer } = useRequests();

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    setSubmitting(true);
    
    const result = await createOffer(selectedRequest.id, {
      price: Number(offerForm.price),
      message: offerForm.message,
    });

    setSubmitting(false);

    if (result.success) {
      setSelectedRequest(null);
      setOfferForm({ price: '', message: '' });
      alert('Taklif muvaffaqiyatli yuborildi!');
    } else {
      alert(result.error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      ACCEPTED: 'bg-green-100 text-green-800 border-green-200',
      REJECTED: 'bg-red-100 text-red-800 border-red-200',
    };
    const labels = {
      PENDING: 'Kutilmoqda',
      ACCEPTED: 'Qabul qilingan',
      REJECTED: 'Rad etilgan',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (!user || user.role !== 'AGENCY') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ruxsat yo'q</h2>
          <p className="text-gray-500">Bu sahifaga faqat agentliklar kirishi mumkin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Takliflar</h1>
          <p className="text-gray-600">So'rovlarni ko'ring va taklif yuboring</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Kutayotgan so'rovlar ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'sent'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Yuborilgan takliflar ({myOffers.length})
          </button>
        </div>

        {/* Pending Requests Tab */}
        {activeTab === 'pending' && (
          <>
            {pendingRequests.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">So'rovlar yo'q</h3>
                <p className="text-gray-500">Hali hech qanday so'rov kelmagan</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          So'rov #{request.id.slice(-6)}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(request.startDate!).toLocaleDateString('uz-UZ')} - {new Date(request.endDate!).toLocaleDateString('uz-UZ')}
                          </span>
                          {request.budget && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              Byudjet: ${request.budget}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        Taklif yuborish
                      </button>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Qiziqishlar:</h4>
                      <p className="text-gray-600">{request.interests}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Sent Offers Tab */}
        {activeTab === 'sent' && (
          <>
            {myOffers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-6xl mb-4">📤</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Takliflar yo'q</h3>
                <p className="text-gray-500">Hali hech qanday taklif yubormagansiz</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myOffers.map((offer) => (
                  <div key={offer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Taklif #{offer.id.slice(-6)}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(offer.status)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">${offer.price}</div>
                        <div className="text-sm text-gray-500">taklif narxi</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Xabar:</h4>
                      <p className="text-gray-600">{offer.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Offer Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Taklif yuborish</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Request Info */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">So'rov ma'lumotlari</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(selectedRequest.startDate!).toLocaleDateString('uz-UZ')} - {new Date(selectedRequest.endDate!).toLocaleDateString('uz-UZ')}
                    </span>
                  </div>
                  {selectedRequest.budget && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Byudjet: ${selectedRequest.budget}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Qiziqishlar:</span> {selectedRequest.interests}
                  </div>
                </div>
              </div>

              {/* Offer Form */}
              <form onSubmit={handleSubmitOffer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Narx ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={offerForm.price}
                    onChange={(e) => setOfferForm({ ...offerForm, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masalan: 500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xabar *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={offerForm.message}
                    onChange={(e) => setOfferForm({ ...offerForm, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Taklifingiz haqida batafsil yozing..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Yuborilmoqda...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Taklif yuborish
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
