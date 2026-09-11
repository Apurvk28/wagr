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
export const getShortTermResolutionDate = (refDate = new Date(), timeZone = APP_TIMEZONE) => {
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

  // Target wall-clock time is 23:00:00.000 on target calendar day in target timezone
  const targetTimeMs = Date.UTC(targetYear, targetMonth - 1, targetDay, 23, 0, 0, 0);

  const testDate = new Date(targetTimeMs);
  const tzParts = formatter.formatToParts(testDate);
  const tzYear = +tzParts.find((p) => p.type === 'year').value;
  const tzMonth = +tzParts.find((p) => p.type === 'month').value;
  const tzDay = +tzParts.find((p) => p.type === 'day').value;
  let tzHour = +tzParts.find((p) => p.type === 'hour').value;
  if (tzHour === 24) tzHour = 0;
  const tzMinute = +tzParts.find((p) => p.type === 'minute').value;
  const tzSecond = +tzParts.find((p) => p.type === 'second').value;

  const tzAsUtcMs = Date.UTC(tzYear, tzMonth - 1, tzDay, tzHour, tzMinute, tzSecond, 0);
  const offsetMs = tzAsUtcMs - targetTimeMs;

  return new Date(targetTimeMs - offsetMs);
};

/**
 * Legacy alias for getShortTermResolutionDate. Returns 11:00:00 PM of current calendar day.
 */
export const getUpcomingMidnight = (refDate = new Date(), timeZone = APP_TIMEZONE) => {
  return getShortTermResolutionDate(refDate, timeZone);
};

/**
 * Checks if current time is inside the Short-Term daily maintenance window (11:00 PM - 12:05 AM).
 * @param {Date} [refDate]
 * @param {string} [timeZone]
 * @returns {boolean}
 */
export const isInShortTermMaintenanceWindow = (refDate = new Date(), timeZone = APP_TIMEZONE) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(refDate);
  let hour = +parts.find((p) => p.type === 'hour')?.value;
  if (hour === 24) hour = 0;
  const minute = +parts.find((p) => p.type === 'minute')?.value;

  // Window is 11:00 PM (23:00) to 12:04 AM (00:04)
  return hour === 23 || (hour === 0 && minute < 5);
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

  const targetTimeMs = Date.UTC(year, month - 1, day, 0, 0, 0, 0);

  const testDate = new Date(targetTimeMs);
  const tzParts = formatter.formatToParts(testDate);
  const tzYear = +tzParts.find((p) => p.type === 'year').value;
  const tzMonth = +tzParts.find((p) => p.type === 'month').value;
  const tzDay = +tzParts.find((p) => p.type === 'day').value;
  let tzHour = +tzParts.find((p) => p.type === 'hour').value;
  if (tzHour === 24) tzHour = 0;
  const tzMinute = +tzParts.find((p) => p.type === 'minute').value;
  const tzSecond = +tzParts.find((p) => p.type === 'second').value;

  const tzAsUtcMs = Date.UTC(tzYear, tzMonth - 1, tzDay, tzHour, tzMinute, tzSecond, 0);
  const offsetMs = tzAsUtcMs - targetTimeMs;

  return new Date(targetTimeMs - offsetMs);
};

/**
 * Returns the current runtime ISO date string.
 * @returns {string}
 */
export const getCurrentRuntimeISO = () => {
  return new Date().toISOString();
};
