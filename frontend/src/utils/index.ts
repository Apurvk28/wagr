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
 * Formats a date string to a human-readable representation
 * @param dateString ISO Date string
 * @returns Formatted date string (e.g., "July 6, 2026")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};
