/**
 * Date utility functions
 * Following the pattern from the extension plugin
 */

/**
 * Formats seconds into human-readable time string
 * @param seconds - Total seconds
 * @returns Formatted time string (e.g., "2h 30m", "45m", "30s")
 */
export function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m`;
  
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
}

/**
 * Gets default date range (last N days)
 * @param days - Number of days to go back
 * @returns Object with start and end dates in YYYY-MM-DD format
 */
export function getDefaultDateRange(days: number = 7): { start: string; end: string } {
  const endDate = new Date();
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  return {
    start: startDate.toISOString().split('T')[0],
    end: endDate.toISOString().split('T')[0],
  };
}

/**
 * Formats date to YYYY-MM-DD format
 * @param date - Date object
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Gets date range for quick select buttons
 * @param days - Number of days to go back
 * @returns Object with start and end dates
 */
export function getDateRangeForDays(days: number): { start: string; end: string } {
  return getDefaultDateRange(days);
}

