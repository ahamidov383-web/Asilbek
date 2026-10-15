import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuditLog, AuditAction } from '../lib/types';
import { auditLogService } from '../lib/audit-log';
import { useAuth } from './AuthContext';

interface AuditLogContextType {
  logs: AuditLog[];
  stats: {
    total: number;
    byAction: Record<string, number>;
    byEntityType: Record<string, number>;
    today: number;
    thisWeek: number;
  };
  addLog: (
    action: AuditAction,
    entityType: string,
    entityId: string,
    details?: Record<string, any>
  ) => Promise<void>;
  refreshLogs: () => void;
  getFilteredLogs: (filters: {
    action?: AuditAction;
    entityType?: string;
    userId?: string;
  }) => AuditLog[];
}

const AuditLogContext = createContext<AuditLogContextType | undefined>(undefined);

export function AuditLogProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    byAction: {},
    byEntityType: {},
    today: 0,
    thisWeek: 0,
  });

  const refreshLogs = () => {
    setLogs(auditLogService.getAll());
    setStats(auditLogService.getStats());
  };

  useEffect(() => {
    refreshLogs();
  }, []);

  const addLog = async (
    action: AuditAction,
    entityType: string,
    entityId: string,
    details?: Record<string, any>
  ) => {
    await auditLogService.log(
      action,
      entityType,
      entityId,
      user?.id || null,
      details,
      user?.name,
      user?.email
    );
    refreshLogs();
  };

  const getFilteredLogs = (filters: {
    action?: AuditAction;
    entityType?: string;
    userId?: string;
  }) => {
    return auditLogService.getFiltered(filters);
  };

  return (
    <AuditLogContext.Provider value={{
      logs,
      stats,
      addLog,
      refreshLogs,
      getFilteredLogs,
    }}>
      {children}
    </AuditLogContext.Provider>
  );
}

export function useAuditLog() {
  const context = useContext(AuditLogContext);
  if (!context) {
    throw new Error('useAuditLog must be used within AuditLogProvider');
  }
  return context;
}
