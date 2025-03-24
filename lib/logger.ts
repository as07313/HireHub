// Simple logging utility

export const logLevels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Configure log level based on environment
const currentLogLevel = process.env.NODE_ENV === 'production' 
  ? logLevels.INFO 
  : logLevels.DEBUG;

export function logError(message: string, error?: any): void {
  if (currentLogLevel >= logLevels.ERROR) {
    console.error(`[ERROR] ${message}`, error || '');
  }
}

export function logWarn(message: string, data?: any): void {
  if (currentLogLevel >= logLevels.WARN) {
    console.warn(`[WARN] ${message}`, data || '');
  }
}

export function logInfo(message: string, data?: any): void {
  if (currentLogLevel >= logLevels.INFO) {
    console.log(`[INFO] ${message}`, data ? JSON.stringify(data) : '');
  }
}

export function logDebug(message: string, data?: any): void {
  if (currentLogLevel >= logLevels.DEBUG) {
    console.log(`[DEBUG] ${message}`, data ? JSON.stringify(data) : '');
  }
}