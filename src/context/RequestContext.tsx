import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { TourRequest, Offer, RequestStatus, OfferStatus } from '../lib/types';
import { createRequestSchema, createOfferSchema, validateData } from '../lib/validations';
import { ValidationError, NotFoundError, AuthorizationError } from '../lib/errors';

interface RequestContextType {
  requests: TourRequest[];
  offers: Offer[];
  createRequest: (data: { budget?: number; interests: string; startDate: string; endDate: string; notes?: string }) => Promise<{ success: boolean; error?: string; requestId?: string }>;
  createOffer: (requestId: string, data: { price: number; message: string }) => Promise<{ success: boolean; error?: string }>;
  respondToOffer: (offerId: string, response: 'ACCEPTED' | 'REJECTED') => Promise<{ success: boolean; error?: string }>;
  getMyRequests: () => TourRequest[];
  getPendingRequests: () => TourRequest[];
  getMyOffers: () => Offer[];
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export function RequestProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [requests, setRequests] = useState<TourRequest[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);

  // Load from localStorage
  useEffect(() => {
    const storedRequests = localStorage.getItem('tour_requests');
    const storedOffers = localStorage.getItem('tour_offers');
    if (storedRequests) setRequests(JSON.parse(storedRequests));
    if (storedOffers) setOffers(JSON.parse(storedOffers));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('tour_requests', JSON.stringify(requests));
    localStorage.setItem('tour_offers', JSON.stringify(offers));
  }, [requests, offers]);

  /**
   * Turist so'rov yaratadi
   * XAVFSIZLIK: Faqat TOURIST roli yaratishi mumkin
   */
  const createRequest = async (data: { budget?: number; interests: string; startDate: string; endDate: string; notes?: string }) => {
    // Autentifikatsiya tekshiruvi
    if (!isAuthenticated || !user) {
      return { success: false, error: 'Tizimga kirish talab qilinadi' };
    }

    if (user.role !== 'TOURIST') {
      return { success: false, error: 'Faqat turistlar so\'rov yarata oladi' };
    }

    // Validatsiya
    const validation = validateData(createRequestSchema, data);
    if (!validation.success) {
      return { success: false, error: Object.values(validation.errors).flat().join(', ') };
    }

    // Yangi so'rov yaratish
    const newRequest: TourRequest = {
      id: `req_${Date.now()}`,
      touristId: user.id,
      touristName: user.name,
      budget: data.budget || null,
      interests: data.interests,
      startDate: data.startDate,
      endDate: data.endDate,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      offers: [],
    };

    setRequests(prev => [newRequest, ...prev]);

    return { success: true, requestId: newRequest.id };
  };

  /**
   * Agentlik taklif yuboradi
   * XAVFSIZLIK: Faqat AGENCY roli yuborishi mumkin
   * XAVFSIZLIK: Bir agentlik bir so'rovga faqat bir marta taklif yuborishi mumkin
   */
  const createOffer = async (requestId: string, data: { price: number; message: string }) => {
    // Autentifikatsiya tekshiruvi
    if (!isAuthenticated || !user) {
      return { success: false, error: 'Tizimga kirish talab qilinadi' };
    }

    if (user.role !== 'AGENCY') {
      return { success: false, error: 'Faqat agentliklar taklif yubora oladi' };
    }

    // So'rov mavjudligini tekshirish
    const request = requests.find(r => r.id === requestId);
    if (!request) {
      return { success: false, error: 'So\'rov topilmadi' };
    }

    // So'rov holatini tekshirish
    if (request.status !== 'PENDING') {
      return { success: false, error: 'Bu so\'rov allaqachon qabul qilingan yoki rad etilgan' };
    }

    // Validatsiya
    const validation = validateData(createOfferSchema, { requestId, ...data });
    if (!validation.success) {
      return { success: false, error: Object.values(validation.errors).flat().join(', ') };
    }

    // Takroriy taklif tekshiruvi
    const existingOffer = offers.find(o => o.requestId === requestId && o.agencyId === user.id);
    if (existingOffer) {
      return { success: false, error: 'Siz bu so\'rovga allaqachon taklif yuborgansiz' };
    }

    // Yangi taklif yaratish
    const newOffer: Offer = {
      id: `offer_${Date.now()}`,
      requestId,
      agencyId: user.id,
      agencyName: user.name,
      price: data.price,
      message: data.message,
      status: 'PENDING',
    };

    setOffers(prev => [newOffer, ...prev]);

    // So'rovga taklifni qo'shish
    setRequests(prev => prev.map(r => 
      r.id === requestId 
        ? { ...r, offers: [...(r.offers || []), newOffer] }
        : r
    ));

    return { success: true };
  };

  /**
   * Turist taklifni qabul/rad etadi
   * XAVFSIZLIK: Faqat so'rov egasi javob berishi mumkin
   * XAVFSIZLIK: Agar qabul qilinsa, boshqa takliflar avtomatik rad etiladi
   */
  const respondToOffer = async (offerId: string, response: 'ACCEPTED' | 'REJECTED') => {
    // Autentifikatsiya tekshiruvi
    if (!isAuthenticated || !user) {
      return { success: false, error: 'Tizimga kirish talab qilinadi' };
    }

    // Taklifni topish
    const offer = offers.find(o => o.id === offerId);
    if (!offer) {
      return { success: false, error: 'Taklif topilmadi' };
    }

    // So'rovni topish
    const request = requests.find(r => r.id === offer.requestId);
    if (!request) {
      return { success: false, error: 'So\'rov topilmadi' };
    }

    // Egasini tekshirish
    if (request.touristId !== user.id) {
      return { success: false, error: 'Faqat so\'rov egasi javob berishi mumkin' };
    }

    if (response === 'ACCEPTED') {
      // Taklifni qabul qilish
      setOffers(prev => prev.map(o => 
        o.id === offerId 
          ? { ...o, status: 'ACCEPTED' }
          : o.requestId === offer.requestId && o.status === 'PENDING'
          ? { ...o, status: 'REJECTED' } // Boshqa takliflarni rad etish
          : o
      ));

      // So'rov holatini yangilash
      setRequests(prev => prev.map(r => 
        r.id === offer.requestId 
          ? { ...r, status: 'ACCEPTED' }
          : r
      ));
    } else {
      // Taklifni rad etish
      setOffers(prev => prev.map(o => 
        o.id === offerId ? { ...o, status: 'REJECTED' } : o
      ));
    }

    return { success: true };
  };

  /**
   * Foydalanuvchining so'rovlarini olish
   */
  const getMyRequests = (): TourRequest[] => {
    if (!user) return [];
    if (user.role === 'TOURIST') {
      return requests.filter(r => r.touristId === user.id);
    }
    return [];
  };

  /**
   * Kutayotgan so'rovlar (agentlik uchun)
   */
  const getPendingRequests = (): TourRequest[] => {
    if (!user || user.role !== 'AGENCY') return [];
    return requests.filter(r => r.status === 'PENDING');
  };

  /**
   * Agentlikning takliflarini olish
   */
  const getMyOffers = (): Offer[] => {
    if (!user || user.role !== 'AGENCY') return [];
    return offers.filter(o => o.agencyId === user.id);
  };

  return (
    <RequestContext.Provider value={{
      requests,
      offers,
      createRequest,
      createOffer,
      respondToOffer,
      getMyRequests,
      getPendingRequests,
      getMyOffers,
    }}>
      {children}
    </RequestContext.Provider>
  );
}

export function useRequests() {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequests must be used within RequestProvider');
  }
  return context;
}
