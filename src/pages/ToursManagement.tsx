import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAgency } from '../context/AgencyContext';
import { Tour } from '../lib/types';
import { Plus, Edit, Trash2, Calendar, Users, DollarSign, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

export default function Tours() {
  const { tours, deleteTour, loading, error } = useAgency();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = async (tourId: string) => {
    setDeleting(tourId);
    const result = await deleteTour(tourId);
    setDeleting(null);
    setConfirmDelete(null);

    if (!result.success) {
      alert(result.error);
    }
  };

  const getTourStatus = (tour: Tour) => {
    const now = new Date();
    const startDate = new Date(tour.startDate);
    const endDate = new Date(tour.endDate);

    if (endDate < now) return { label: 'Tugagan', color: 'bg-gray-100 text-gray-700', type: 'expired' };
    if (tour.availableSeats === 0) return { label: 'To\'lgan', color: 'bg-red-100 text-red-700', type: 'full' };
    if (startDate > now) return { label: 'Rejalashtirilgan', color: 'bg-blue-100 text-blue-700', type: 'upcoming' };
    return { label: 'Faol', color: 'bg-green-100 text-green-700', type: 'active' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mening turlarim</h1>
            <p className="text-gray-600">Barcha turlaringizni boshqaring</p>
          </div>
          <Link
            to="/dashboard/tours/new"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Yangi tur
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Holat:</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg">
                  Barchasi ({tours.length})
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
                  Faol ({tours.filter(t => getTourStatus(t).type === 'active').length})
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
                  Tugagan ({tours.filter(t => getTourStatus(t).type === 'expired').length})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tours List */}
        {tours.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Turlar yo'q</h3>
            <p className="text-gray-600 mb-6">Hali hech qanday tur qo'shilmagan</p>
            <Link
              to="/dashboard/tours/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Birinchi tur qo'shish
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {tours.map((tour) => {
              const status = getTourStatus(tour);
              const occupancy = ((tour.totalSeats - tour.availableSeats) / tour.totalSeats) * 100;

              return (
                <div key={tour.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-teal-100 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                        {tour.image}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{tour.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">{tour.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(tour.startDate).toLocaleDateString('uz-UZ')} - {new Date(tour.endDate).toLocaleDateString('uz-UZ')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {tour.availableSeats}/{tour.totalSeats} joy
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            ${tour.price}
                          </span>
                        </div>

                        {/* Occupancy Bar */}
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Bron qilingan</span>
                            <span>{Math.round(occupancy)}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                occupancy === 100 ? 'bg-red-500' :
                                occupancy > 75 ? 'bg-amber-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${occupancy}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        to={`/dashboard/tours/${tour.id}/edit`}
                        className="flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Tahrirlash
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(tour.id)}
                        disabled={deleting === tour.id}
                        className="flex items-center gap-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        {deleting === tour.id ? '...' : 'O\'chirish'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Tur o'chirish</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Bu turni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting !== null}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting === confirmDelete ? 'O\'chirilmoqda...' : 'O\'chirish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
