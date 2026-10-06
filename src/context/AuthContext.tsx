import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: Role) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const mockUsers: (User & { password: string })[] = [
  {
    id: 'u1',
    name: 'John Tourist',
    email: 'tourist@test.com',
    password: 'tourist123',
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

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: Role): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const foundUser = mockUsers.find(
      u => u.email === email && u.password === password && u.role === role
    );

    if (!foundUser) {
      return { success: false, error: "Email, parol xato yoki bu bo'lim uchun ruxsatingiz yo'q!" };
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
