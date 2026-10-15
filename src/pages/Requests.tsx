import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { TourRequest, Offer } from '../lib/types';
import { Calendar, DollarSign, MessageSquare, CheckCircle, XCircle, Clock, Send } from 'lucide-react';

export default function Requests() {
  const { user } = useAuth();
  const { getMyRequests, respondToOffer } = useRequests();
  const [responding, setResponding] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ offerId: string; action: 'ACCEPTED' | 'REJECTED' } | null>(null);

  const myRequests = getMyRequests();

  const handleRespond = async (offerId: string, action: 'ACCEPTED' | 'REJECTED') => {
    setConfirmModal({ offerId, action });
  };

  const confirmRespond = async () => {
    if (!confirmModal) return;
    
    setResponding(confirmModal.offerId);
    const result = await respondToOffer(confirmModal.offerId, confirmModal.action);
    setResponding(null);
    setConfirmModal(null);

    if (!result.success) {
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

  if (!user || user.role !== 'TOURIST') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ruxsat yo'q</h2>
          <p className="text-gray-500">Bu sahifaga faqat turistlar kirishi mumkin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mening so'rovlarim</h1>
          <p className="text-gray-600">Yuborgan so'rovlaringiz va kelgan takliflarni ko'ring</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Jami so'rovlar</p>
                <p className="text-3xl font-bold text-gray-900">{myRequests.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Send className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Kutilmoqda</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {myRequests.filter(r => r.status === 'PENDING').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Qabul qilingan</p>
                <p className="text-3xl font-bold text-green-600">
                  {myRequests.filter(r => r.status === 'ACCEPTED').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Requests List */}
        {myRequests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">So'rovlar yo'q</h3>
            <p className="text-gray-500 mb-6">Hali hech qanday so'rov yubormagansiz</p>
            <a
              href="/request"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="w-5 h-5" />
              Yangi so'rov yuborish
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {myRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Request Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
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
                            ${request.budget}
                          </span>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </div>

                {/* Request Details */}
                <div className="px-6 py-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Qiziqishlar:</h4>
                    <p className="text-gray-600">{request.interests}</p>
                  </div>

                  {/* Offers */}
                  {(request.offers && request.offers.length > 0) ? (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Kelgan takliflar ({request.offers.length}):
                      </h4>
                      <div className="space-y-3">
                        {request.offers.map((offer) => (
                          <div
                            key={offer.id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                          >
                            <div className="flex items-start justify-between flex-wrap gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h5 className="font-semibold text-gray-900">{offer.agencyName}</h5>
                                  {getStatusBadge(offer.status)}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="w-4 h-4" />
                                    <span className="font-semibold text-lg">${offer.price}</span>
                                  </span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                                  <p className="text-gray-600 text-sm">{offer.message}</p>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              {offer.status === 'PENDING' && request.status === 'PENDING' && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleRespond(offer.id, 'ACCEPTED')}
                                    disabled={responding === offer.id}
                                    className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Qabul qilish
                                  </button>
                                  <button
                                    onClick={() => handleRespond(offer.id, 'REJECTED')}
                                    disabled={responding === offer.id}
                                    className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Rad etish
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>Hali takliflar yo'q</p>
                      <p className="text-sm">Agentliklar tez orada taklif yuboradi</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {confirmModal.action === 'ACCEPTED' ? 'Taklifni qabul qilish' : 'Taklifni rad etish'}
            </h3>
            <p className="text-gray-600 mb-6">
              {confirmModal.action === 'ACCEPTED'
                ? 'Bu taklifni qabul qilmoqchimisiz? Boshqa takliflar avtomatik rad etiladi.'
                : 'Bu taklifni rad etmoqchimisiz?'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={confirmRespond}
                disabled={responding !== null}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${
                  confirmModal.action === 'ACCEPTED'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {responding !== null ? '...' : 'Tasdiqlash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
