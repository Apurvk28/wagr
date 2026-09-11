/**
 * Formats a number as virtual currency (Market Exchange Points)
 * @param value The numerical amount of MXP
 * @returns Formatted string (e.g., "500 MXP")
 */
export const formatMXP = (value: number): string => {
  return `${Math.round(value).toLocaleString()} MXP`;
};

/**
 * Formats a probability ratio/percentage
 * @param value Probability between 0 and 1, or 0 and 100
 * @returns Formatted percentage string (e.g., "57%")
 */
export const formatProbability = (value: number): string => {
  // If the value is a decimal (e.g. 0.57), scale it
  const percent = value <= 1 && value >= 0 ? value * 100 : value;
  return `${Math.round(percent)}%`;
};

/**
 * Formats a market resolution date string including exact resolution time
 * respecting the user's 12h/24h format and timezone preference.
 * @param dateString ISO Date string
 * @param includeTime Whether to include resolution time (defaults to true)
 * @returns Formatted date & time string (e.g. "Sep 11, 11:00 PM" or "Sep 11, 23:00")
 */
export const formatResolutionDate = (dateString: string, includeTime: boolean = true): string => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';

  const format = (localStorage.getItem('wagr_clock_format') as '12' | '24') || '12';
  const timezone = localStorage.getItem('wagr_clock_timezone') || 'Asia/Kolkata';

  try {
    const month = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: timezone }).format(date);
    const day = new Intl.DateTimeFormat('en-US', { day: 'numeric', timeZone: timezone }).format(date);
    
    if (!includeTime) {
      return `${month} ${day}`;
    }

    const timeStr = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: format === '12',
      timeZone: timezone,
    }).format(date);

    return `${month} ${day}, ${timeStr}`;
  } catch (e) {
    return date.toLocaleDateString();
  }
};

/**
 * Formats a date string to a human-readable representation with time
 * @param dateString ISO Date string
 * @returns Formatted date string (e.g., "Sep 11, 11:00 PM")
 */
export const formatDate = (dateString: string): string => {
  return formatResolutionDate(dateString, true);
};

/**
 * Formats the daily Short-Term market refresh time (12:05 AM)
 * according to the user's 12h/24h format preference.
 * @returns Formatted time string (e.g., "12:05 AM" or "00:05")
 */
export const formatOpeningTime = (): string => {
  const format = (localStorage.getItem('wagr_clock_format') as '12' | '24') || '12';
  return format === '24' ? '00:05' : '12:05 AM';
};
