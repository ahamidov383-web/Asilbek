import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('AuthContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should login tourist successfully', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await act(async () => {
        const response = await result.current.login('tourist@test.com', 'tourist123', 'TOURIST');
        expect(response.success).toBe(true);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.email).toBe('tourist@test.com');
      expect(result.current.user?.role).toBe('TOURIST');
    });

    it('should login agency successfully', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await act(async () => {
        const response = await result.current.login('agency@test.com', 'agency123', 'AGENCY');
        expect(response.success).toBe(true);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.role).toBe('AGENCY');
    });

    it('should login admin successfully', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await act(async () => {
        const response = await result.current.login('admin@test.com', 'admin123', 'ADMIN');
        expect(response.success).toBe(true);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.role).toBe('ADMIN');
    });

    it('should fail login with wrong password', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await act(async () => {
        const response = await result.current.login('tourist@test.com', 'wrongpassword', 'TOURIST');
        expect(response.success).toBe(false);
        expect(response.error).toBeDefined();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it('should fail login with wrong role', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await act(async () => {
        const response = await result.current.login('tourist@test.com', 'tourist123', 'ADMIN');
        expect(response.success).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should fail login with non-existent email', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await act(async () => {
        const response = await result.current.login('nonexistent@test.com', 'password', 'TOURIST');
        expect(response.success).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      // Login first
      await act(async () => {
        await result.current.login('tourist@test.com', 'tourist123', 'TOURIST');
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_user');
    });
  });

  describe('session persistence', () => {
    it('should restore session from localStorage', async () => {
      // Mock existing session
      const mockUser = {
        id: 'u1',
        name: 'Test User',
        email: 'tourist@test.com',
        role: 'TOURIST' as const,
        createdAt: '2026-01-01',
      };
      const mockSession = {
        user: mockUser,
        expires: new Date(Date.now() + 86400000).toISOString(), // 24 hours
      };

      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === 'auth_user') return JSON.stringify(mockUser);
        if (key === 'auth_session') return JSON.stringify(mockSession);
        return null;
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.email).toBe('tourist@test.com');
    });

    it('should not restore expired session', () => {
      const mockUser = {
        id: 'u1',
        name: 'Test User',
        email: 'tourist@test.com',
        role: 'TOURIST' as const,
        createdAt: '2026-01-01',
      };
      const mockSession = {
        user: mockUser,
        expires: new Date(Date.now() - 86400000).toISOString(), // Expired
      };

      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === 'auth_user') return JSON.stringify(mockUser);
        if (key === 'auth_session') return JSON.stringify(mockSession);
        return null;
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });
});
