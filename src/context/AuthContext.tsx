import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Role } from '../lib/types';
import { loginSchema, validateData } from '../lib/validations';
import { InvalidCredentialsError, AuthenticationError } from '../lib/errors';
import { Session } from '../lib/auth-guard';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string, role: Role) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
// XAVFSIZLIK: Haqiqiy loyihada parollar bcrypt bilan hash qilinadi!
const mockUsers: (User & { password: string })[] = [
  {
    id: 'u1',
    name: 'John Tourist',
    email: 'tourist@test.com',
    password: 'tourist123', // ❌ Faqat demo uchun! Haqiqiy loyihada hash bo'lishi kerak
    role: 'TOURIST',
    createdAt: '2026-01-01',
  },
  {
    id: 'u2',
    name: 'Silk Road Adventures',
    email: 'agency@test.com',
    password: 'agency123',
    role: 'AGENCY',
    createdAt: '2026-01-15',
  },
  {
    id: 'u3',
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'ADMIN',
    createdAt: '2026-01-01',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    const storedSession = localStorage.getItem('auth_session');
    if (storedUser && storedSession) {
      const parsedSession = JSON.parse(storedSession);
      // Sessiya muddatini tekshirish
      if (new Date(parsedSession.expires) > new Date()) {
        setUser(JSON.parse(storedUser));
        setSession(parsedSession);
      } else {
        // Sessiya tugagan - tozalash
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_session');
      }
    }
  }, []);

  const login = async (email: string, password: string, role: Role): Promise<{ success: boolean; error?: string }> => {
    // XAVFSIZLIK: Input validatsiyasi
    const validation = validateData(loginSchema, { email, password, role });
    if (!validation.success) {
      return { 
        success: false, 
        error: Object.values(validation.errors).flat().join(', ') 
      };
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Foydalanuvchini topish
    const foundUser = mockUsers.find(
      u => u.email === email && u.password === password && u.role === role
    );

    if (!foundUser) {
      // XAVFSIZLIK: Aniq qaysi maydon noto'g'ri ekanligi ko'rsatilmaydi!
      throw new InvalidCredentialsError();
    }

    // XAVFSIZLIK: Parol hech qachon frontend state'ga saqlanmaydi!
    const { password: _, ...userWithoutPassword } = foundUser;
    
    // Sessiya yaratish
    const newSession: Session = {
      user: userWithoutPassword,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 soat
    };

    setUser(userWithoutPassword);
    setSession(newSession);
    localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
    localStorage.setItem('auth_session', JSON.stringify(newSession));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setSession(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_session');
  };

  return (
    <AuthContext.Provider value={{ user, session, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new AuthenticationError('useAuth must be used within AuthProvider');
  }
  return context;
}
