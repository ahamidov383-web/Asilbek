import { AuditLog, AuditAction } from './types';

/**
 * Audit Logging Service
 * 
 * Barcha kritik amallar uchun log yozadi.
 * XAVFSIZLIK: Admin panel va muhim o'zgarishlarni kuzatish uchun.
 */

class AuditLogService {
  private logs: AuditLog[] = [];
  private storageKey = 'audit_logs';

  constructor() {
    // Load existing logs from localStorage
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        this.logs = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse audit logs:', e);
        this.logs = [];
      }
    }
  }

  /**
   * Yangi audit log yozish
   */
  async log(
    action: AuditAction,
    entityType: string,
    entityId: string,
    userId: string | null,
    details?: Record<string, any>,
    userName?: string,
    userEmail?: string
  ): Promise<void> {
    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      action,
      entityType,
      entityId,
      details,
      createdAt: new Date().toISOString(),
      userName,
      userEmail,
    };

    this.logs.unshift(newLog); // Yangi loglarni boshiga qo'shish
    
    // Saqlash
    localStorage.setItem(this.storageKey, JSON.stringify(this.logs));
    
    // Console'ga ham yozish (development uchun)
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.log('📝 Audit Log:', {
        action,
        entityType,
        entityId,
        userId,
        details,
      });
    }
  }

  /**
   * Barcha loglarni olish
   */
  getAll(): AuditLog[] {
    return this.logs;
  }

  /**
   * Filter bilan loglarni olish
   */
  getFiltered(filters: {
    action?: AuditAction;
    entityType?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  }): AuditLog[] {
    let filtered = [...this.logs];

    if (filters.action) {
      filtered = filtered.filter(log => log.action === filters.action);
    }

    if (filters.entityType) {
      filtered = filtered.filter(log => log.entityType === filters.entityType);
    }

    if (filters.userId) {
      filtered = filtered.filter(log => log.userId === filters.userId);
    }

    if (filters.startDate) {
      filtered = filtered.filter(log => 
        new Date(log.createdAt) >= new Date(filters.startDate!)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(log => 
        new Date(log.createdAt) <= new Date(filters.endDate!)
      );
    }

    return filtered;
  }

  /**
   * Entity bo'yicha loglarni olish
   */
  getByEntity(entityType: string, entityId: string): AuditLog[] {
    return this.logs.filter(
      log => log.entityType === entityType && log.entityId === entityId
    );
  }

  /**
   * User bo'yicha loglarni olish
   */
  getByUser(userId: string): AuditLog[] {
    return this.logs.filter(log => log.userId === userId);
  }

  /**
   * So'nggi N ta logni olish
   */
  getRecent(limit: number = 10): AuditLog[] {
    return this.logs.slice(0, limit);
  }

  /**
   * Loglarni tozalash (faqat admin uchun)
   */
  clear(): void {
    this.logs = [];
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Statistika olish
   */
  getStats(): {
    total: number;
    byAction: Record<string, number>;
    byEntityType: Record<string, number>;
    today: number;
    thisWeek: number;
  } {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

    const byAction: Record<string, number> = {};
    const byEntityType: Record<string, number> = {};
    let todayCount = 0;
    let weekCount = 0;

    this.logs.forEach(log => {
      // Action bo'yicha
      byAction[log.action] = (byAction[log.action] || 0) + 1;
      
      // Entity type bo'yicha
      byEntityType[log.entityType] = (byEntityType[log.entityType] || 0) + 1;
      
      // Bugungi
      if (new Date(log.createdAt) >= todayStart) {
        todayCount++;
      }
      
      // Shu haftadagi
      if (new Date(log.createdAt) >= weekStart) {
        weekCount++;
      }
    });

    return {
      total: this.logs.length,
      byAction,
      byEntityType,
      today: todayCount,
      thisWeek: weekCount,
    };
  }
}

// Singleton instance
export const auditLogService = new AuditLogService();

/**
 * Helper function: Audit log yozish
 */
export async function createAuditLog(
  action: AuditAction,
  entityType: string,
  entityId: string,
  userId: string | null,
  details?: Record<string, any>,
  userName?: string,
  userEmail?: string
): Promise<void> {
  await auditLogService.log(action, entityType, entityId, userId, details, userName, userEmail);
}
