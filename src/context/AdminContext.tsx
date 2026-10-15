import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Agency } from '../lib/types';
import { useAuth } from './AuthContext';
import { useAuditLog } from './AuditLogContext';

export interface AgencyWithStatus extends Agency {
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

interface AdminContextType {
  pendingAgencies: AgencyWithStatus[];
  approvedAgencies: AgencyWithStatus[];
  rejectedAgencies: AgencyWithStatus[];
  loading: boolean;
  approveAgency: (agencyId: string) => Promise<{ success: boolean; error?: string }>;
  rejectAgency: (agencyId: string, reason?: string) => Promise<{ success: boolean; error?: string }>;
  refreshAgencies: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Mock agencies for admin review
const mockAgenciesForReview: AgencyWithStatus[] = [
  {
    id: 'agency-pending-1',
    name: 'Samarkand Dreams',
    description: 'Premium tours in Samarkand with experienced guides',
    logo: '🕌',
    isVerified: false,
    userId: 'user-pending-1',
    rating: 0,
    reviewCount: 0,
    email: 'info@samarkanddreams.uz',
    phone: '+998 66 123 45 67',
    address: 'Samarkand, Registon ko\'chasi, 15-uy',
    website: 'www.samarkanddreams.uz',
    establishedYear: 2020,
    languages: ['English', 'Russian', 'Uzbek'],
    specialties: ['Historical Tours', 'Cultural Heritage'],
    workingHours: 'Dushanba - Shanba: 09:00 - 18:00',
    about: 'Samarkand Dreams provides premium historical tours with expert guides.',
    status: 'pending',
    submittedAt: '2026-03-15T10:00:00Z',
  },
  {
    id: 'agency-pending-2',
    name: 'Bukhara Explorer',
    description: 'Authentic Bukhara experience with local guides',
    logo: '🏛️',
    isVerified: false,
    userId: 'user-pending-2',
    rating: 0,
    reviewCount: 0,
    email: 'contact@bukharaexplorer.uz',
    phone: '+998 65 987 65 43',
    address: 'Bukhara, Lyabi-Hauz yonida',
    website: 'www.bukharaexplorer.uz',
    establishedYear: 2021,
    languages: ['English', 'Russian', 'Uzbek', 'French'],
    specialties: ['Cultural Tours', 'Food Tours'],
    workingHours: 'Har kuni: 08:00 - 20:00',
    about: 'Bukhara Explorer offers authentic cultural experiences.',
    status: 'pending',
    submittedAt: '2026-03-18T14:30:00Z',
  },
  {
    id: 'agency-approved-1',
    name: 'Silk Road Adventures',
    description: 'Premium tours along the ancient Silk Road',
    logo: '🏛️',
    isVerified: true,
    userId: 'u2',
    rating: 4.8,
    reviewCount: 156,
    email: 'info@silkradventures.uz',
    phone: '+998 71 234 56 78',
    address: 'Toshkent sh., Amir Temur ko\'chasi, 107-uy',
    website: 'www.silkradventures.uz',
    establishedYear: 2015,
    languages: ['English', 'Russian', 'Uzbek'],
    specialties: ['Historical Tours', 'Silk Road', 'Cultural Heritage'],
    workingHours: 'Dushanba - Shanba: 09:00 - 18:00',
    about: 'Silk Road Adventures provides premium tours since 2015.',
    status: 'approved',
    submittedAt: '2025-01-10T09:00:00Z',
    reviewedAt: '2025-01-12T10:00:00Z',
    reviewedBy: 'Admin User',
  },
];

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { addLog } = useAuditLog();
  const [agencies, setAgencies] = useState<AgencyWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load agencies
    const stored = localStorage.getItem('admin_agencies');
    if (stored) {
      try {
        setAgencies(JSON.parse(stored));
      } catch (e) {
        setAgencies(mockAgenciesForReview);
      }
    } else {
      setAgencies(mockAgenciesForReview);
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever agencies change
  useEffect(() => {
    if (agencies.length > 0) {
      localStorage.setItem('admin_agencies', JSON.stringify(agencies));
    }
  }, [agencies]);

  const refreshAgencies = () => {
    const stored = localStorage.getItem('admin_agencies');
    if (stored) {
      try {
        setAgencies(JSON.parse(stored));
      } catch (e) {
        setAgencies(mockAgenciesForReview);
      }
    }
  };

  const approveAgency = async (agencyId: string) => {
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: 'Ruxsat yo\'q' };
    }

    const agency = agencies.find(a => a.id === agencyId);
    if (!agency) {
      return { success: false, error: 'Agentlik topilmadi' };
    }

    if (agency.status === 'approved') {
      return { success: false, error: 'Agentlik allaqachon tasdiqlangan' };
    }

    // Update agency status
    setAgencies(prev => prev.map(a => 
      a.id === agencyId 
        ? { 
            ...a, 
            status: 'approved' as const, 
            isVerified: true,
            reviewedAt: new Date().toISOString(),
            reviewedBy: user.name,
          }
        : a
    ));

    // Audit log
    await addLog(
      'AGENCY_APPROVED',
      'Agency',
      agencyId,
      {
        agencyName: agency.name,
        approvedBy: user.name,
        approvedAt: new Date().toISOString(),
      }
    );

    return { success: true };
  };

  const rejectAgency = async (agencyId: string, reason?: string) => {
    if (!user || user.role !== 'ADMIN') {
      return { success: false, error: 'Ruxsat yo\'q' };
    }

    const agency = agencies.find(a => a.id === agencyId);
    if (!agency) {
      return { success: false, error: 'Agentlik topilmadi' };
    }

    if (agency.status === 'rejected') {
      return { success: false, error: 'Agentlik allaqachon rad etilgan' };
    }

    // Update agency status
    setAgencies(prev => prev.map(a => 
      a.id === agencyId 
        ? { 
            ...a, 
            status: 'rejected' as const, 
            isVerified: false,
            reviewedAt: new Date().toISOString(),
            reviewedBy: user.name,
          }
        : a
    ));

    // Audit log
    await addLog(
      'AGENCY_REJECTED',
      'Agency',
      agencyId,
      {
        agencyName: agency.name,
        rejectedBy: user.name,
        rejectedAt: new Date().toISOString(),
        reason: reason || 'Sabab ko\'rsatilmagan',
      }
    );

    return { success: true };
  };

  const pendingAgencies = agencies.filter(a => a.status === 'pending');
  const approvedAgencies = agencies.filter(a => a.status === 'approved');
  const rejectedAgencies = agencies.filter(a => a.status === 'rejected');

  return (
    <AdminContext.Provider value={{
      pendingAgencies,
      approvedAgencies,
      rejectedAgencies,
      loading,
      approveAgency,
      rejectAgency,
      refreshAgencies,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}
