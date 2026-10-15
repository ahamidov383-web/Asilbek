import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { agencies, tours } from '../data/mock';
import {
  ArrowLeft, BadgeCheck, Star, MapPin, Phone, Mail, Globe, Calendar,
  Users, Clock, MessageCircle, Instagram, Facebook, Send, Award,
  ChevronRight, Calendar as CalendarIcon, DollarSign, Share2, Heart
} from 'lucide-react';

export default function AgencyProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'about' | 'tours' | 'reviews'>('about');
  const [liked, setLiked] = useState(false);

  const agency = agencies.find(a => a.id === id);

  if (!agency) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Agentlik topilmadi</h2>
          <p className="text-gray-500 mb-6">Siz qidirayotgan agentlik mavjud emas</p>
          <button
            onClick={() => navigate('/agencies')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Agentliklarga qaytish
          </button>
        </div>
      </div>
    );
  }

  const agencyTours = tours.filter(tour => tour.agencyId === agency.id);
  const totalSeats = agencyTours.reduce((sum, tour) => sum + tour.availableSeats, 0);

  // Mock reviews
  const reviews = [
    { id: 1, name: 'John Smith', country: '🇺🇸 USA', rating: 5, date: '2026-02-15', text: 'Amazing experience! The guides were knowledgeable and friendly. Highly recommend!', avatar: '👨' },
    { id: 2, name: 'Maria Garcia', country: '🇪🇸 Spain', rating: 5, date: '2026-01-20', text: 'Perfect organization from start to finish. Every detail was taken care of.', avatar: '👩' },
    { id: 3, name: 'Akira Tanaka', country: '🇯🇵 Japan', rating: 4, date: '2026-01-05', text: 'Very professional service. The historical tours were fascinating.', avatar: '👨' },
    { id: 4, name: 'Anna Mueller', country: '🇩🇪 Germany', rating: 5, date: '2025-12-18', text: 'Best travel agency in Uzbekistan! Will definitely come back.', avatar: '👩' },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 text-9xl">{agency.logo}</div>
        </div>
        
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <button
            onClick={() => navigate('/agencies')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Barcha agentliklar</span>
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Logo */}
            <div className="w-28 h-28 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center text-6xl border border-white/20 shadow-2xl">
              {agency.logo}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">{agency.name}</h1>
                {agency.isVerified && (
                  <div className="flex items-center gap-1 bg-blue-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-blue-400/30">
                    <BadgeCheck size={16} className="text-blue-300" />
                    <span className="text-xs font-medium text-blue-200">Verified</span>
                  </div>
                )}
              </div>
              <p className="text-blue-100 text-lg mb-4 max-w-2xl">{agency.description}</p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-amber-400 fill-amber-400" />
                  <span className="font-bold text-lg">{agency.rating}</span>
                  <span className="text-blue-200">({agency.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-blue-200">
                  <CalendarIcon size={16} />
                  <span>{agency.establishedYear}-yildan beri</span>
                </div>
                <div className="flex items-center gap-2 text-blue-200">
                  <Users size={16} />
                  <span>{agencyTours.length} ta tur</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-800 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg">
                  <Send size={16} />
                  So'rov yuborish
                </button>
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
                    liked
                      ? 'bg-red-500 text-white'
                      : 'bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20'
                  }`}
                >
                  <Heart size={16} className={liked ? 'fill-white' : ''} />
                  {liked ? 'Saqlandi' : 'Saqlash'}
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-all">
                  <Share2 size={16} />
                  Ulashish
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,40 1440,30 L1440,60 L0,60 Z" fill="#f9fafb"/>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-6">
              {[
                { key: 'about' as const, label: 'Haqida', icon: <Award size={16} /> },
                { key: 'tours' as const, label: `Turlar (${agencyTours.length})`, icon: <CalendarIcon size={16} /> },
                { key: 'reviews' as const, label: `Sharhlar (${agency.reviewCount})`, icon: <Star size={16} /> },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    activeTab === tab.key
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                {/* About Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Biz haqimizda</h2>
                  <p className="text-gray-600 leading-relaxed">{agency.about || agency.description}</p>
                </div>

                {/* Specialties */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Ixtisosliklar</h2>
                  <div className="flex flex-wrap gap-2">
                    {agency.specialties?.map((specialty, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-gradient-to-r from-blue-50 to-teal-50 text-blue-700 rounded-xl text-sm font-medium border border-blue-100"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Tillar</h2>
                  <div className="flex flex-wrap gap-2">
                    {agency.languages?.map((lang, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-gray-50 text-gray-700 rounded-xl text-sm font-medium border border-gray-200"
                      >
                        🌐 {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                {agency.achievements && agency.achievements.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Yutuqlarimiz</h2>
                    <div className="space-y-3">
                      {agency.achievements.map((achievement, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Award size={16} className="text-amber-600" />
                          </div>
                          <span className="text-gray-700 font-medium">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tours Tab */}
            {activeTab === 'tours' && (
              <div className="space-y-4">
                {agencyTours.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                    <div className="text-5xl mb-4">🗓️</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Hozircha turlar yo'q</h3>
                    <p className="text-gray-500">Bu agentlik hozircha faol turlar taklif qilmayapti</p>
                  </div>
                ) : (
                  agencyTours.map((tour) => {
                    const isFull = tour.availableSeats === 0;
                    return (
                      <div key={tour.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-48 h-40 sm:h-auto bg-gradient-to-br from-blue-100 to-teal-50 flex items-center justify-center text-5xl">
                            {tour.image}
                          </div>
                          <div className="flex-1 p-5">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{tour.title}</h3>
                              <div className="text-right">
                                <span className="text-xl font-bold text-blue-600">${tour.price}</span>
                                <span className="text-xs text-gray-400 block">/kishi</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{tour.description}</p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {formatDate(tour.startDate)} - {formatDate(tour.endDate)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users size={14} />
                                {tour.availableSeats} joy qoldi
                              </span>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {tour.highlights?.slice(0, 3).map((h, i) => (
                                <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                  {h}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {/* Rating Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-gray-900">{agency.rating}</div>
                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={18}
                            className={star <= Math.round(agency.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{agency.reviewCount} sharh</div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const percentage = star === 5 ? 75 : star === 4 ? 20 : star === 3 ? 3 : star === 2 ? 1 : 1;
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 w-3">{star}</span>
                            <Star size={12} className="text-amber-400 fill-amber-400" />
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-400 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400 w-8">{percentage}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-teal-50 rounded-full flex items-center justify-center text-2xl">
                        {review.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <span className="font-semibold text-gray-900">{review.name}</span>
                            <span className="text-sm text-gray-400 ml-2">{review.country}</span>
                          </div>
                          <span className="text-xs text-gray-400">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600 text-sm">{review.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Bog'lanish</h3>
              <div className="space-y-3">
                {agency.email && (
                  <a href={`mailto:${agency.email}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Mail size={16} className="text-blue-600" />
                    </div>
                    <span className="truncate">{agency.email}</span>
                  </a>
                )}
                {agency.phone && (
                  <a href={`tel:${agency.phone}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
                      <Phone size={16} className="text-green-600" />
                    </div>
                    <span>{agency.phone}</span>
                  </a>
                )}
                {agency.address && (
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin size={16} className="text-amber-600" />
                    </div>
                    <span>{agency.address}</span>
                  </div>
                )}
                {agency.website && (
                  <a href={`https://${agency.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Globe size={16} className="text-purple-600" />
                    </div>
                    <span>{agency.website}</span>
                  </a>
                )}
                {agency.workingHours && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center">
                      <Clock size={16} className="text-teal-600" />
                    </div>
                    <span>{agency.workingHours}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media */}
            {agency.socialMedia && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Ijtimoiy tarmoqlar</h3>
                <div className="flex gap-3">
                  {agency.socialMedia.telegram && (
                    <a
                      href={`https://t.me/${agency.socialMedia.telegram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 bg-blue-500 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <Send size={18} />
                    </a>
                  )}
                  {agency.socialMedia.instagram && (
                    <a
                      href={`https://instagram.com/${agency.socialMedia.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity"
                    >
                      <Instagram size={18} />
                    </a>
                  )}
                  {agency.socialMedia.facebook && (
                    <a
                      href={`https://facebook.com/${agency.socialMedia.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <Facebook size={18} />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold mb-4">Tezkor statistika</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-blue-100 text-sm">Faol turlar</span>
                  <span className="font-bold text-lg">{agencyTours.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100 text-sm">Mavjud joylar</span>
                  <span className="font-bold text-lg">{totalSeats}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100 text-sm">Ishlagan yillar</span>
                  <span className="font-bold text-lg">{new Date().getFullYear() - (agency.establishedYear || 2020)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100 text-sm">Reyting</span>
                  <span className="font-bold text-lg flex items-center gap-1">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    {agency.rating}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-bold text-gray-900 mb-2">Savollaringiz bormi?</h3>
              <p className="text-sm text-gray-500 mb-4">Agentlik bilan bevosita bog'laning</p>
              <a
                href={`tel:${agency.phone}`}
                className="block w-full py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                <Phone size={16} className="inline mr-2" />
                Qo'ng'iroq qilish
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
