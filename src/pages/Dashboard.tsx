import React from 'react';
import { Link } from 'react-router-dom';
import { useAgency } from '../context/AgencyContext';
import { useRequests } from '../context/RequestContext';
import { Calendar, DollarSign, Users, TrendingUp, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { agency, tours, loading, error } = useAgency();
  const { getMyOffers } = useRequests();

  const myOffers = getMyOffers();

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 max-w-md w-full">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Xatolik yuz berdi</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <a href="/login" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Qayta kirish
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🏢</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Agentlik topilmadi</h2>
          <p className="text-gray-600 mb-6">Sizning hisobingizga agentlik biriktirilmagan</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalTours = tours.length;
  const activeTours = tours.filter(t => new Date(t.endDate) > new Date() && t.availableSeats > 0).length;
  const expiredTours = tours.filter(t => new Date(t.endDate) < new Date()).length;
  const fullTours = tours.filter(t => t.availableSeats === 0).length;
  const totalSeats = tours.reduce((sum, t) => sum + t.availableSeats, 0);
  const totalRevenue = tours.reduce((sum, t) => sum + (t.totalSeats - t.availableSeats) * t.price, 0);
  const pendingOffers = myOffers.filter(o => o.status === 'PENDING').length;
  const acceptedOffers = myOffers.filter(o => o.status === 'ACCEPTED').length;

  const stats = [
    {
      label: 'Jami turlar',
      value: totalTours,
      icon: MapPin,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Faol turlar',
      value: activeTours,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      label: 'Mavjud joylar',
      value: totalSeats,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      label: 'Umumiy daromad',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-3xl">
              {agency.logo}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{agency.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                {agency.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    Tasdiqlangan
                  </span>
                )}
                <span className="text-sm text-gray-500">
                  {agency.establishedYear}-yildan beri
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/dashboard/tours/new"
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Yangi tur qo'shish</h3>
            </div>
            <p className="text-blue-100 text-sm">Yangi sayohat paketini yarating</p>
          </Link>

          <Link
            to="/dashboard/offers"
            className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Takliflarni boshqarish</h3>
            </div>
            <p className="text-green-100 text-sm">{pendingOffers} ta kutayotgan taklif</p>
          </Link>

          <Link
            to="/dashboard/settings"
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Sozlamalar</h3>
            </div>
            <p className="text-purple-100 text-sm">Agentlik ma'lumotlarini yangilang</p>
          </Link>
        </div>

        {/* Recent Tours */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">So'nggi turlar</h2>
            <Link to="/dashboard/tours" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Barchasini ko'rish →
            </Link>
          </div>

          {tours.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Turlar yo'q</h3>
              <p className="text-gray-600 mb-6">Hali hech qanday tur qo'shilmagan</p>
              <Link
                to="/dashboard/tours/new"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Birinchi tur qo'shish
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {tours.slice(0, 3).map((tour) => {
                const isExpired = new Date(tour.endDate) < new Date();
                const isFull = tour.availableSeats === 0;
                const status = isExpired ? 'expired' : isFull ? 'full' : 'active';

                return (
                  <div key={tour.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-lg flex items-center justify-center text-3xl">
                          {tour.image}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{tour.title}</h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-1">{tour.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(tour.startDate).toLocaleDateString('uz-UZ')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {tour.availableSeats}/{tour.totalSeats} joy
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 mb-1">${tour.price}</div>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          status === 'active' ? 'bg-green-100 text-green-700' :
                          status === 'full' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {status === 'active' ? 'Faol' : status === 'full' ? 'To\'lgan' : 'Tugagan'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Offers Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Takliflar statistikasi</h2>
            <Link to="/dashboard/offers" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Batafsil →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600 mb-1">{pendingOffers}</div>
              <div className="text-sm text-gray-600">Kutilmoqda</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-1">{acceptedOffers}</div>
              <div className="text-sm text-gray-600">Qabul qilingan</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-1">{myOffers.length}</div>
              <div className="text-sm text-gray-600">Jami takliflar</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
