import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerTouristSchema,
  registerAgencySchema,
  createTourSchema,
  createRequestSchema,
  createOfferSchema,
  validateData,
} from '../lib/validations';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const result = validateData(loginSchema, {
        email: 'test@example.com',
        password: 'password123',
        role: 'TOURIST',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = validateData(loginSchema, {
        email: 'invalid-email',
        password: 'password123',
        role: 'TOURIST',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const result = validateData(loginSchema, {
        email: 'test@example.com',
        password: '',
        role: 'TOURIST',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid role', () => {
      const result = validateData(loginSchema, {
        email: 'test@example.com',
        password: 'password123',
        role: 'INVALID_ROLE',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('registerTouristSchema', () => {
    it('should validate correct registration data', () => {
      const result = validateData(registerTouristSchema, {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject password mismatch', () => {
      const result = validateData(registerTouristSchema, {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        confirmPassword: 'DifferentPassword123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short name', () => {
      const result = validateData(registerTouristSchema, {
        name: 'J',
        email: 'john@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject weak password', () => {
      const result = validateData(registerTouristSchema, {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'weak',
        confirmPassword: 'weak',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('registerAgencySchema', () => {
    it('should validate correct agency registration', () => {
      const result = validateData(registerAgencySchema, {
        agencyName: 'Test Agency',
        name: 'John Doe',
        email: 'agency@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        agreeTerms: true,
      });
      expect(result.success).toBe(true);
    });

    it('should reject if terms not agreed', () => {
      const result = validateData(registerAgencySchema, {
        agencyName: 'Test Agency',
        name: 'John Doe',
        email: 'agency@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        agreeTerms: false,
      });
      expect(result.success).toBe(false);
    });

    it('should reject short agency name', () => {
      const result = validateData(registerAgencySchema, {
        agencyName: 'AB',
        name: 'John Doe',
        email: 'agency@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        agreeTerms: true,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('createTourSchema', () => {
    it('should validate correct tour data', () => {
      const result = validateData(createTourSchema, {
        title: 'Test Tour',
        description: 'This is a test tour description',
        price: 100,
        totalSeats: 10,
        startDate: '2026-05-01',
        endDate: '2026-05-10',
      });
      expect(result.success).toBe(true);
    });

    it('should reject negative price', () => {
      const result = validateData(createTourSchema, {
        title: 'Test Tour',
        description: 'This is a test tour description',
        price: -50,
        totalSeats: 10,
        startDate: '2026-05-01',
        endDate: '2026-05-10',
      });
      expect(result.success).toBe(false);
    });

    it('should reject end date before start date', () => {
      const result = validateData(createTourSchema, {
        title: 'Test Tour',
        description: 'This is a test tour description',
        price: 100,
        totalSeats: 10,
        startDate: '2026-05-10',
        endDate: '2026-05-01',
      });
      expect(result.success).toBe(false);
    });

    it('should reject zero seats', () => {
      const result = validateData(createTourSchema, {
        title: 'Test Tour',
        description: 'This is a test tour description',
        price: 100,
        totalSeats: 0,
        startDate: '2026-05-01',
        endDate: '2026-05-10',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('createRequestSchema', () => {
    it('should validate correct request data', () => {
      const result = validateData(createRequestSchema, {
        interests: 'History, Culture',
        startDate: '2026-06-01',
        endDate: '2026-06-10',
      });
      expect(result.success).toBe(true);
    });

    it('should validate with optional budget', () => {
      const result = validateData(createRequestSchema, {
        budget: 1000,
        interests: 'History, Culture',
        startDate: '2026-06-01',
        endDate: '2026-06-10',
      });
      expect(result.success).toBe(true);
    });

    it('should reject negative budget', () => {
      const result = validateData(createRequestSchema, {
        budget: -500,
        interests: 'History, Culture',
        startDate: '2026-06-01',
        endDate: '2026-06-10',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('createOfferSchema', () => {
    it('should validate correct offer data', () => {
      const result = validateData(createOfferSchema, {
        requestId: 'req-123',
        price: 500,
        message: 'We offer a great tour package',
      });
      expect(result.success).toBe(true);
    });

    it('should reject negative price', () => {
      const result = validateData(createOfferSchema, {
        requestId: 'req-123',
        price: -100,
        message: 'We offer a great tour package',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short message', () => {
      const result = validateData(createOfferSchema, {
        requestId: 'req-123',
        price: 500,
        message: 'Short',
      });
      expect(result.success).toBe(false);
    });
  });
});
