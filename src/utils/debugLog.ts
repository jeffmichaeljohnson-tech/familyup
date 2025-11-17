/**
 * Debug logging utility
 * Logs to both console and stores in window for inspection
 */

interface DebugLog {
  timestamp: string;
  message: string;
  data?: any;
}

// Store logs in window object so we can inspect them
declare global {
  interface Window {
    DEBUG_LOGS: DebugLog[];
    getDebugLogs: () => void;
  }
}

window.DEBUG_LOGS = window.DEBUG_LOGS || [];

export function debugLog(message: string, data?: any) {
  const log: DebugLog = {
    timestamp: new Date().toISOString(),
    message,
    data
  };

  // Add to window storage
  window.DEBUG_LOGS.push(log);

  // Also log to console
  if (data !== undefined) {
    console.log(`[DEBUG] ${message}`, data);
  } else {
    console.log(`[DEBUG] ${message}`);
  }

  // Keep only last 100 logs
  if (window.DEBUG_LOGS.length > 100) {
    window.DEBUG_LOGS.shift();
  }
}

// Helper to dump all logs
window.getDebugLogs = () => {
  console.table(window.DEBUG_LOGS);
  console.log('Total logs:', window.DEBUG_LOGS.length);
  console.log('Copy this:', JSON.stringify(window.DEBUG_LOGS, null, 2));
};

export function getLogSummary() {
  return {
    totalLogs: window.DEBUG_LOGS.length,
    lastLog: window.DEBUG_LOGS[window.DEBUG_LOGS.length - 1],
    allLogs: window.DEBUG_LOGS
  };
}
