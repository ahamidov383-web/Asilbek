import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Agency, Tour } from '../lib/types';
import { createTourSchema, validateData } from '../lib/validations';
import { createAuditLog } from '../lib/audit-log';

interface AgencyContextType {
  agency: Agency | null;
  tours: Tour[];
  loading: boolean;
  error: string | null;
  createTour: (data: { title: string; description: string; price: number; totalSeats: number; startDate: string; endDate: string }) => Promise<{ success: boolean; error?: string }>;
  updateTour: (tourId: string, data: Partial<Tour>) => Promise<{ success: boolean; error?: string }>;
  deleteTour: (tourId: string) => Promise<{ success: boolean; error?: string }>;
  updateSeats: (tourId: string, availableSeats: number) => Promise<{ success: boolean; error?: string }>;
  refreshAgency: () => Promise<void>;
}

const AgencyContext = createContext<AgencyContextType | undefined>(undefined);

// Mock agency data (in real app, this comes from database)
const mockAgencies: Record<string, Agency> = {
  'u2': {
    id: 'agency-1',
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
    socialMedia: {
      telegram: '@silkradventures',
      instagram: '@silkroad_adventures',
    },
    about: 'Silk Road Adventures 2015-yildan beri O\'zbekiston bo\'ylab premium sayohatlar tashkil etib kelmoqda.',
    achievements: ['2023-yilning eng yaxshi tur operatori', '5000+ mamnun mehmon'],
  },
};

const mockTours: Record<string, Tour[]> = {
  'agency-1': [
    {
      id: 'tour-1',
      title: 'Silk Road Grand Tour',
      description: '10 kunlik sayohat: Toshkent - Samarqand - Buxoro - Xiva',
      price: 1200,
      availableSeats: 8,
      totalSeats: 15,
      startDate: '2026-04-15',
      endDate: '2026-04-25',
      agencyId: 'agency-1',
      agencyName: 'Silk Road Adventures',
      agencyVerified: true,
      image: '🏰',
      highlights: ['Samarqand Registan', 'Buxoro eski shahar', 'Xiva Ichon Qala'],
    },
    {
      id: 'tour-2',
      title: 'Samarkand Weekend',
      description: 'Dam olish kunlari Samarqandda: tarixiy joylar va madaniyat',
      price: 450,
      availableSeats: 12,
      totalSeats: 20,
      startDate: '2026-05-10',
      endDate: '2026-05-12',
      agencyId: 'agency-1',
      agencyName: 'Silk Road Adventures',
      agencyVerified: true,
      image: '🕌',
      highlights: ['Registon', 'Gur-i Amir', 'Shohi Zinda'],
    },
    {
      id: 'tour-3',
      title: 'Bukhara Cultural Experience',
      description: 'Buxoroning qadimiy madaniyati va me\'morchiligi',
      price: 680,
      availableSeats: 0,
      totalSeats: 10,
      startDate: '2026-03-01',
      endDate: '2026-03-05',
      agencyId: 'agency-1',
      agencyName: 'Silk Road Adventures',
      agencyVerified: true,
      image: '🏛️',
      highlights: ['Lyabi-Hauz', 'Poi Kalon', 'Chor Minor'],
    },
  ],
};

export function AgencyProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load agency data
  const refreshAgency = async () => {
    if (!isAuthenticated || !user || user.role !== 'AGENCY') {
      setAgency(null);
      setTours([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // SECURITY: Only load agency for current user
      const userAgency = mockAgencies[user.id];
      if (!userAgency) {
        throw new Error('Agentlik topilmadi');
      }

      // SECURITY: Verify ownership
      if (userAgency.userId !== user.id) {
        throw new Error('Ruxsat yo\'q: Bu agentlik sizniki emas');
      }

      setAgency(userAgency);

      // Load tours for this agency
      const agencyTours = mockTours[userAgency.id] || [];
      setTours(agencyTours);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAgency();
  }, [user, isAuthenticated]);

  // SECURITY: Verify agency ownership before any operation
  const verifyOwnership = (tourId: string): Tour | null => {
    if (!agency) return null;
    const tour = tours.find(t => t.id === tourId);
    if (!tour) return null;
    
    // SECURITY: Ensure tour belongs to current agency
    if (tour.agencyId !== agency.id) {
      return null;
    }
    
    return tour;
  };

  const createTour = async (data: { title: string; description: string; price: number; totalSeats: number; startDate: string; endDate: string }) => {
    if (!agency) {
      return { success: false, error: 'Agentlik topilmadi' };
    }

    // Validate with Zod
    const validation = validateData(createTourSchema, data);
    if (!validation.success) {
      return { success: false, error: Object.values(validation.errors).flat().join(', ') };
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const newTour: Tour = {
        id: `tour-${Date.now()}`,
        ...data,
        availableSeats: data.totalSeats,
        agencyId: agency.id,
        agencyName: agency.name,
        agencyVerified: agency.isVerified,
        image: '🗺️',
        highlights: [],
      };

      setTours(prev => [newTour, ...prev]);
      
      // Audit log
      if (user) {
        await createAuditLog(
          'TOUR_CREATED',
          'Tour',
          newTour.id,
          user.id,
          {
            tourTitle: newTour.title,
            tourPrice: newTour.price,
            agencyName: agency.name,
          },
          user.name,
          user.email
        );
      }
      
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Tur yaratishda xatolik' };
    }
  };

  const updateTour = async (tourId: string, data: Partial<Tour>) => {
    const tour = verifyOwnership(tourId);
    if (!tour) {
      return { success: false, error: 'Tur topilmadi yoki ruxsat yo\'q' };
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      setTours(prev => prev.map(t => 
        t.id === tourId ? { ...t, ...data } : t
      ));
      
      // Audit log
      if (user) {
        await createAuditLog(
          'TOUR_UPDATED',
          'Tour',
          tourId,
          user.id,
          {
            tourTitle: tour.title,
            changes: Object.keys(data),
            agencyName: agency?.name,
          },
          user.name,
          user.email
        );
      }
      
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Tur yangilashda xatolik' };
    }
  };

  const deleteTour = async (tourId: string) => {
    const tour = verifyOwnership(tourId);
    if (!tour) {
      return { success: false, error: 'Tur topilmadi yoki ruxsat yo\'q' };
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      setTours(prev => prev.filter(t => t.id !== tourId));
      
      // Audit log
      if (user) {
        await createAuditLog(
          'TOUR_DELETED',
          'Tour',
          tourId,
          user.id,
          {
            tourTitle: tour.title,
            agencyName: agency?.name,
          },
          user.name,
          user.email
        );
      }
      
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Tur o\'chirishda xatolik' };
    }
  };

  const updateSeats = async (tourId: string, availableSeats: number) => {
    const tour = verifyOwnership(tourId);
    if (!tour) {
      return { success: false, error: 'Tur topilmadi yoki ruxsat yo\'q' };
    }

    if (availableSeats < 0 || availableSeats > tour.totalSeats) {
      return { success: false, error: 'Noto\'g\'ri joylar soni' };
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      setTours(prev => prev.map(t => 
        t.id === tourId ? { ...t, availableSeats } : t
      ));
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Joylarni yangilashda xatolik' };
    }
  };

  return (
    <AgencyContext.Provider value={{
      agency,
      tours,
      loading,
      error,
      createTour,
      updateTour,
      deleteTour,
      updateSeats,
      refreshAgency,
    }}>
      {children}
    </AgencyContext.Provider>
  );
}

export function useAgency() {
  const context = useContext(AgencyContext);
  if (!context) {
    throw new Error('useAgency must be used within AgencyProvider');
  }
  return context;
}
