import { prisma } from './prisma';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SECURITY' | 'SYSTEM';
export type LogCategory =
  | 'AUTH'
  | 'MAINTENANCE'
  | 'SUBMISSION'
  | 'REVIEW'
  | 'PUBLISH'
  | 'SYSTEM'
  | 'API';

export interface LogParams {
  level?: LogLevel;
  category?: LogCategory;
  message: string;
  details?: any;
  userId?: string;
  userName?: string;
  ipAddress?: string;
}

/**
 * Centrally log application events and system telemetry into SQLite SystemLog table.
 * Gracefully falls back to console if database is temporarily locked.
 */
export async function logSystemEvent({
  level = 'INFO',
  category = 'SYSTEM',
  message,
  details,
  userId,
  userName,
  ipAddress,
}: LogParams) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] [${category}] ${message}`);

  try {
    const serializedDetails = details
      ? typeof details === 'string'
        ? details
        : JSON.stringify(details)
      : null;

    // Direct insertion into SystemLog table
    await prisma.systemLog.create({
      data: {
        level,
        category,
        message,
        details: serializedDetails,
        userId: userId || null,
        userName: userName || null,
        ipAddress: ipAddress || null,
      },
    });
  } catch (err) {
    // Non-blocking fallback
    console.error('Failed to persist system log to SQLite:', err);
  }
}
