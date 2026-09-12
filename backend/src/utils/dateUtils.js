/**
 * Date utility functions for Wagr.io prediction market platform.
 * Enforces configured application timezone calendar day boundaries and runtime date grounding.
 */

export const APP_TIMEZONE = process.env.APP_TIMEZONE || 'Asia/Kolkata';

/**
 * Returns a Date object set to 11:00:00.000 PM (23:00:00.000) of the current calendar day
 * in Wagr's configured application timezone.
 * 
 * Used for Short-Term market resolution dates (daily 11:00 PM resolution schedule).
 * 
 * @param {Date} [refDate]
 * @param {string} [timeZone]
 * @returns {Date}
 */
export const getISTParts = (refDate = new Date(), timeZone = APP_TIMEZONE) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(refDate);
  const getPart = (type) => parts.find((p) => p.type === type)?.value;
  const year = +getPart('year');
  const month = +getPart('month');
  const day = +getPart('day');
  let hour = +getPart('hour');
  if (hour === 24) hour = 0;
  const minute = +getPart('minute');
  const second = +getPart('second');
  return { year, month, day, hour, minute, second };
};

/**
 * Returns a Date object set to 11:00:00.000 PM (23:00:00.000) of the current calendar day
 * in Wagr's configured application timezone (Asia/Kolkata).
 * 
 * Used for Short-Term market resolution dates (daily 11:00 PM resolution schedule).
 * 
 * @param {Date} [refDate]
 * @param {string} [timeZone]
 * @returns {Date}
 */
export const getShortTermResolutionDate = (refDate = new Date(), timeZone = APP_TIMEZONE) => {
  const { year, month, day, hour } = getISTParts(refDate, timeZone);

  let targetYear = year;
  let targetMonth = month;
  let targetDay = day;

  // If reference date is 11:00 PM or later (hour >= 23), resolution belongs to tomorrow's 11:00 PM
  if (hour >= 23) {
    const nextDayUtc = new Date(Date.UTC(year, month - 1, day + 1));
    targetYear = nextDayUtc.getUTCFullYear();
    targetMonth = nextDayUtc.getUTCMonth() + 1;
    targetDay = nextDayUtc.getUTCDate();
  }

  // Target wall-clock time is 23:00:00.000 IST. Since IST is UTC+5:30, 23:00 IST = 17:30 UTC on target date
  const targetUtcMs = Date.UTC(targetYear, targetMonth - 1, targetDay, 17, 30, 0, 0);
  return new Date(targetUtcMs);
};

/**
 * Legacy alias for getShortTermResolutionDate. Returns 11:00:00 PM of current calendar day.
 */
export const getUpcomingMidnight = (refDate = new Date(), timeZone = APP_TIMEZONE) => {
  return getShortTermResolutionDate(refDate, timeZone);
};

/**
 * Checks if current time is inside the Short-Term daily maintenance/break window (23:00:01 IST - 00:04:59 IST).
 * @param {Date} [refDate]
 * @param {string} [timeZone]
 * @returns {boolean}
 */
export const isInShortTermMaintenanceWindow = (refDate = new Date(), timeZone = APP_TIMEZONE) => {
  const { hour, minute, second } = getISTParts(refDate, timeZone);

  // Break window is strictly 11:00:01 PM (23:00:01) to 12:04:59 AM (00:04:59) IST
  if (hour === 23 && (minute > 0 || second > 0)) {
    return true;
  }
  if (hour === 0 && minute < 5) {
    return true;
  }
  return false;
};

/**
 * Returns a Date object set to 00:00:00.000 (start of current calendar day)
 * in Wagr's configured application timezone.
 * 
 * @param {Date} [refDate]
 * @param {string} [timeZone]
 * @returns {Date}
 */
export const getStartOfToday = (refDate = new Date(), timeZone = APP_TIMEZONE) => {
  const { year, month, day } = getISTParts(refDate, timeZone);

  // Start of today in IST (00:00 IST = previous day 18:30 UTC)
  const targetUtcMs = Date.UTC(year, month - 1, day, 0, 0, 0, 0) - (5 * 60 + 30) * 60 * 1000;
  return new Date(targetUtcMs);
};

/**
 * Returns the current runtime ISO date string.
 * @returns {string}
 */
export const getCurrentRuntimeISO = () => {
  return new Date().toISOString();
};
