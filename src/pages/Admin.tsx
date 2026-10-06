import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { agencies } from '../data/mock';
import { BadgeCheck, XCircle, Shield, Users, FileText, AlertTriangle, CheckCircle, Eye, LogOut } from 'lucide-react';

interface AgencyStatus {
  id: string;
  name: string;
  logo: string;
  isVerified: boolean;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
  description: string;
}

export default function Admin() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'agencies' | 'content' | 'users'>('agencies');
  const [agencyStatuses, setAgencyStatuses] = useState<AgencyStatus[]>([
    { id: '1', name: 'Silk Road Adventures', logo: '🏛️', isVerified: true, status: 'verified', submittedAt: '2026-01-15', description: 'Premium tours along the ancient Silk Road.' },
    { id: '2', name: 'Uzbekistan Explorer', logo: '🧭', isVerified: true, status: 'verified', submittedAt: '2026-01-20', description: 'Local experts offering authentic cultural experiences.' },
    { id: '3', name: 'Samarkand Dreams', logo: '🕌', isVerified: true, status: 'verified', submittedAt: '2026-02-01', description: 'Specializing in historical and architectural tours.' },
    { id: '4', name: 'Nomad Trails', logo: '⛺', isVerified: false, status: 'pending', submittedAt: '2026-03-10', description: 'Adventure and nature tours including mountain trekking.' },
    { id: '5', name: 'Bukhara Heritage', logo: '🎨', isVerified: true, status: 'verified', submittedAt: '2026-02-15', description: 'Deep cultural immersion tours in Bukhara.' },
    { id: '6', name: 'Tashkent Gateway', logo: '✈️', isVerified: true, status: 'verified', submittedAt: '2026-01-10', description: 'Your starting point for Uzbekistan adventures.' },
    { id: '7', name: 'Karakalpakstan Tours', logo: '🏜️', isVerified: false, status: 'pending', submittedAt: '2026-03-20', description: 'New agency specializing in western Uzbekistan.' },
  ]);

  const pendingCount = agencyStatuses.filter(a => a.status === 'pending').length;
  const verifiedCount = agencyStatuses.filter(a => a.status === 'verified').length;

  const handleApprove = (id: string) => {
    setAgencyStatuses(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'verified' as const, isVerified: true } : a
    ));
  };

  const handleReject = (id: string) => {
    setAgencyStatuses(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'rejected' as const, isVerified: false } : a
    ));
  };

  const contentItems = [
    { id: 1, type: 'Place', name: 'Aral Sea Monument', status: 'pending', submittedBy: 'Agency #3' },
    { id: 2, type: 'Restaurant', name: 'New Plov House', status: 'pending', submittedBy: 'User #45' },
    { id: 3, type: 'Tour', name: 'Winter Samarkand', status: 'approved', submittedBy: 'Agency #1' },
    { id: 4, type: 'Place', name: 'Tashkent TV Tower', status: 'pending', submittedBy: 'User #12' },
  ];

  const users = [
    { id: 1, name: 'John Smith', email: 'john@email.com', role: 'TOURIST', joined: '2026-01-05', status: 'active' },
    { id: 2, name: 'Silk Road Adventures', email: 'info@silkrad.com', role: 'AGENCY', joined: '2026-01-15', status: 'active' },
    { id: 3, name: 'Maria Garcia', email: 'maria@email.com', role: 'TOURIST', joined: '2026-02-10', status: 'active' },
    { id: 4, name: 'Nomad Trails', email: 'hello@nomad.uz', role: 'AGENCY', joined: '2026-03-10', status: 'pending' },
    { id: 5, name: 'Akira Tanaka', email: 'akira@email.com', role: 'TOURIST', joined: '2026-03-01', status: 'active' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield size={28} className="text-amber-400" />
                <h1 className="text-3xl font-bold">{t('admin.title')}</h1>
              </div>
              <p className="text-gray-400">Manage agencies, content, and users</p>
            </div>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-sm font-medium text-white hover:bg-white/20 transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden md:inline">Chiqish</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <AlertTriangle size={20} className="text-amber-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{pendingCount}</div>
                <div className="text-sm text-gray-500">{t('admin.pending')}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircle size={20} className="text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{verifiedCount}</div>
                <div className="text-sm text-gray-500">{t('admin.verified')}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users size={20} className="text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{users.length}</div>
                <div className="text-sm text-gray-500">Total Users</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
          {[
            { key: 'agencies' as const, label: t('admin.agencies'), icon: <BadgeCheck size={16} /> },
            { key: 'content' as const, label: t('admin.content'), icon: <FileText size={16} /> },
            { key: 'users' as const, label: t('admin.users'), icon: <Users size={16} /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-gray-800 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Agencies Tab */}
        {activeTab === 'agencies' && (
          <div className="space-y-4">
            {agencyStatuses.filter(a => a.status === 'pending').length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-amber-700 bg-amber-50 px-4 py-2 rounded-lg mb-4 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Pending Verification ({pendingCount})
                </h3>
                <div className="space-y-3">
                  {agencyStatuses.filter(a => a.status === 'pending').map((agency) => (
                    <div key={agency.id} className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-3xl">
                            {agency.logo}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{agency.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{agency.description}</p>
                            <p className="text-xs text-gray-400 mt-2">Submitted: {agency.submittedAt}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(agency.id)}
                            className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
                          >
                            <CheckCircle size={14} />
                            {t('admin.approve')}
                          </button>
                          <button
                            onClick={() => handleReject(agency.id)}
                            className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors"
                          >
                            <XCircle size={14} />
                            {t('admin.reject')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h3 className="text-sm font-semibold text-green-700 bg-green-50 px-4 py-2 rounded-lg mb-4 flex items-center gap-2">
              <CheckCircle size={16} />
              Verified Agencies ({verifiedCount})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agencyStatuses.filter(a => a.status === 'verified').map((agency) => (
                <div key={agency.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">
                      {agency.logo}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{agency.name}</h3>
                        <BadgeCheck size={14} className="text-blue-500" />
                      </div>
                      <p className="text-xs text-gray-400">Since {agency.submittedAt}</p>
                    </div>
                    <button
                      onClick={() => handleReject(agency.id)}
                      className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-3">
            {contentItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.type === 'Place' ? 'bg-amber-50' :
                    item.type === 'Restaurant' ? 'bg-red-50' : 'bg-blue-50'
                  }`}>
                    {item.type === 'Place' ? '📍' : item.type === 'Restaurant' ? '🍽️' : '🗺️'}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-xs text-gray-400">{item.type} • Submitted by {item.submittedBy}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.status === 'pending' ? (
                    <>
                      <button className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600">
                        Approve
                      </button>
                      <button className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600">
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium">
                      Approved
                    </span>
                  )}
                  <button className="p-1.5 bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100">
                    <Eye size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{user.name}</div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'ADMIN' ? 'bg-red-50 text-red-700' :
                          user.role === 'AGENCY' ? 'bg-blue-50 text-blue-700' :
                          'bg-gray-50 text-gray-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.joined}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
