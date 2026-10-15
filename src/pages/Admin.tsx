import React, { useState } from 'react';
import { useAdmin, AgencyWithStatus } from '../context/AdminContext';
import { useAuditLog } from '../context/AuditLogContext';
import { AuditLog } from '../lib/types';
import { 
  Shield, CheckCircle, XCircle, Clock, Building2, 
  AlertCircle, Eye, FileText, Activity, Calendar,
  ChevronDown, ChevronUp, Search
} from 'lucide-react';

export default function Admin() {
  const { 
    pendingAgencies, 
    approvedAgencies, 
    rejectedAgencies, 
    approveAgency, 
    rejectAgency,
    loading 
  } = useAdmin();
  
  const { logs, stats } = useAuditLog();
  const [activeTab, setActiveTab] = useState<'agencies' | 'logs'>('agencies');
  const [agencyTab, setAgencyTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [processing, setProcessing] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ agencyId: string; agencyName: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [logFilter, setLogFilter] = useState<string>('all');

  const handleApprove = async (agencyId: string) => {
    setProcessing(agencyId);
    const result = await approveAgency(agencyId);
    setProcessing(null);
    if (!result.success) {
      alert(result.error);
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setProcessing(rejectModal.agencyId);
    const result = await rejectAgency(rejectModal.agencyId, rejectReason);
    setProcessing(null);
    setRejectModal(null);
    setRejectReason('');
    if (!result.success) {
      alert(result.error);
    }
  };

  const filteredLogs = logFilter === 'all' 
    ? logs 
    : logs.filter(log => log.action === logFilter);

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      'AGENCY_APPROVED': 'Agentlik tasdiqlandi',
      'AGENCY_REJECTED': 'Agentlik rad etildi',
      'TOUR_CREATED': 'Tur yaratildi',
      'TOUR_UPDATED': 'Tur yangilandi',
      'TOUR_DELETED': 'Tur o\'chirildi',
      'OFFER_CREATED': 'Taklif yaratildi',
      'OFFER_ACCEPTED': 'Taklif qabul qilindi',
      'OFFER_REJECTED': 'Taklif rad etildi',
      'REQUEST_CREATED': 'So\'rov yaratildi',
      'USER_LOGIN': 'Foydalanuvchi kirdi',
      'USER_LOGOUT': 'Foydalanuvchi chiqdi',
      'USER_REGISTERED': 'Foydalanuvchi ro\'yxatdan o\'tdi',
    };
    return labels[action] || action;
  };

  const getActionColor = (action: string) => {
    if (action.includes('APPROVED') || action.includes('ACCEPTED')) return 'bg-green-100 text-green-700';
    if (action.includes('REJECTED') || action.includes('DELETED')) return 'bg-red-100 text-red-700';
    if (action.includes('CREATED')) return 'bg-blue-100 text-blue-700';
    if (action.includes('UPDATED')) return 'bg-amber-100 text-amber-700';
    return 'bg-gray-100 text-gray-700';
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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-amber-500" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <p className="text-gray-600">Tizimni boshqarish va kuzatish</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{pendingAgencies.length}</div>
            <div className="text-sm text-gray-600">Kutilayotgan agentliklar</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{approvedAgencies.length}</div>
            <div className="text-sm text-gray-600">Tasdiqlangan agentliklar</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.today}</div>
            <div className="text-sm text-gray-600">Bugungi harakatlar</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600">Jami audit loglar</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('agencies')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'agencies'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Building2 className="w-5 h-5 inline mr-2" />
            Agentliklar
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'logs'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <FileText className="w-5 h-5 inline mr-2" />
            Audit Loglar
          </button>
        </div>

        {/* Agencies Tab */}
        {activeTab === 'agencies' && (
          <div>
            {/* Sub-tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setAgencyTab('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  agencyTab === 'pending'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Kutilmoqda ({pendingAgencies.length})
              </button>
              <button
                onClick={() => setAgencyTab('approved')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  agencyTab === 'approved'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Tasdiqlangan ({approvedAgencies.length})
              </button>
              <button
                onClick={() => setAgencyTab('rejected')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  agencyTab === 'rejected'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Rad etilgan ({rejectedAgencies.length})
              </button>
            </div>

            {/* Agency List */}
            {agencyTab === 'pending' && (
              <div className="space-y-4">
                {pendingAgencies.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Barcha agentliklar ko'rib chiqilgan</h3>
                    <p className="text-gray-600">Kutilayotgan agentliklar yo'q</p>
                  </div>
                ) : (
                  pendingAgencies.map((agency) => (
                    <AgencyCard
                      key={agency.id}
                      agency={agency}
                      onApprove={handleApprove}
                      onReject={(id, name) => setRejectModal({ agencyId: id, agencyName: name })}
                      processing={processing === agency.id}
                    />
                  ))
                )}
              </div>
            )}

            {agencyTab === 'approved' && (
              <div className="space-y-4">
                {approvedAgencies.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Tasdiqlangan agentliklar yo'q</h3>
                  </div>
                ) : (
                  approvedAgencies.map((agency) => (
                    <AgencyCard
                      key={agency.id}
                      agency={agency}
                      processing={false}
                    />
                  ))
                )}
              </div>
            )}

            {agencyTab === 'rejected' && (
              <div className="space-y-4">
                {rejectedAgencies.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Rad etilgan agentliklar yo'q</h3>
                  </div>
                ) : (
                  rejectedAgencies.map((agency) => (
                    <AgencyCard
                      key={agency.id}
                      agency={agency}
                      processing={false}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'logs' && (
          <div>
            {/* Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-sm font-medium text-gray-700">Filter:</span>
                <select
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Barcha harakatlar</option>
                  <option value="AGENCY_APPROVED">Agentlik tasdiqlandi</option>
                  <option value="AGENCY_REJECTED">Agentlik rad etildi</option>
                  <option value="TOUR_CREATED">Tur yaratildi</option>
                  <option value="TOUR_UPDATED">Tur yangilandi</option>
                  <option value="TOUR_DELETED">Tur o'chirildi</option>
                  <option value="OFFER_CREATED">Taklif yaratildi</option>
                  <option value="OFFER_ACCEPTED">Taklif qabul qilindi</option>
                  <option value="OFFER_REJECTED">Taklif rad etildi</option>
                  <option value="REQUEST_CREATED">So'rov yaratildi</option>
                  <option value="USER_LOGIN">Foydalanuvchi kirdi</option>
                  <option value="USER_LOGOUT">Foydalanuvchi chiqdi</option>
                  <option value="USER_REGISTERED">Foydalanuvchi ro'yxatdan o'tdi</option>
                </select>
                <span className="text-sm text-gray-500">
                  {filteredLogs.length} ta log
                </span>
              </div>
            </div>

            {/* Logs List */}
            <div className="space-y-3">
              {filteredLogs.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Audit loglar yo'q</h3>
                  <p className="text-gray-600">Hali hech qanday harakat qayd etilmagan</p>
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <LogCard
                    key={log.id}
                    log={log}
                    expanded={expandedLog === log.id}
                    onToggle={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                    getActionLabel={getActionLabel}
                    getActionColor={getActionColor}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Agentlikni rad etish</h3>
                <p className="text-sm text-gray-500">{rejectModal.agencyName}</p>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rad etish sababi (ixtiyoriy)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Sababni kiriting..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setRejectModal(null);
                  setRejectReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleReject}
                disabled={processing !== null}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {processing !== null ? 'Rad etilmoqda...' : 'Rad etish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Agency Card Component
function AgencyCard({ 
  agency, 
  onApprove, 
  onReject, 
  processing 
}: { 
  agency: AgencyWithStatus;
  onApprove?: (id: string) => void;
  onReject?: (id: string, name: string) => void;
  processing: boolean;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-lg flex items-center justify-center text-3xl">
            {agency.logo}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-semibold text-gray-900">{agency.name}</h3>
              {agency.status === 'approved' && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Tasdiqlangan
                </span>
              )}
              {agency.status === 'rejected' && (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                  Rad etilgan
                </span>
              )}
              {agency.status === 'pending' && (
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                  Kutilmoqda
                </span>
              )}
            </div>
            <p className="text-gray-600 mb-3">{agency.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-500">
              <div>📧 {agency.email}</div>
              <div>📞 {agency.phone}</div>
              <div>📍 {agency.address}</div>
              <div>🌐 {agency.website}</div>
              <div>📅 {agency.establishedYear}-yildan beri</div>
              <div>🗣️ {agency.languages?.join(', ')}</div>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              Yuborilgan: {new Date(agency.submittedAt).toLocaleString('uz-UZ')}
            </div>
            {agency.reviewedAt && (
              <div className="text-xs text-gray-400">
                Ko'rib chiqilgan: {new Date(agency.reviewedAt).toLocaleString('uz-UZ')} by {agency.reviewedBy}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {agency.status === 'pending' && onApprove && onReject && (
          <div className="flex gap-2">
            <button
              onClick={() => onApprove(agency.id)}
              disabled={processing}
              className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              {processing ? '...' : 'Tasdiqlash'}
            </button>
            <button
              onClick={() => onReject(agency.id, agency.name)}
              disabled={processing}
              className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              {processing ? '...' : 'Rad etish'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Log Card Component
function LogCard({ 
  log, 
  expanded, 
  onToggle, 
  getActionLabel, 
  getActionColor 
}: { 
  log: AuditLog;
  expanded: boolean;
  onToggle: () => void;
  getActionLabel: (action: string) => string;
  getActionColor: (action: string) => string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getActionColor(log.action)}`}>
              {getActionLabel(log.action)}
            </span>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                {log.entityType}: {log.entityId}
              </div>
              <div className="text-xs text-gray-500">
                {log.userName || 'Tizim'} • {new Date(log.createdAt).toLocaleString('uz-UZ')}
              </div>
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
      
      {expanded && log.details && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Batafsil ma'lumot:</div>
          <pre className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 overflow-x-auto">
            {JSON.stringify(log.details, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
