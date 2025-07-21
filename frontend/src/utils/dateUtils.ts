/**
 * Date formatting utilities for consistent date display across the application
 */

export interface DateFormatOptions {
  includeTime?: boolean;
  locale?: string;
}

/**
 * Formats an event date with consistent styling
 * @param date - The date to format (Date object, string, or number)
 * @param options - Formatting options
 * @returns Formatted date string
 */
export const formatEventDate = (
  date: Date | string | number,
  options: DateFormatOptions = {}
): string => {
  const { includeTime = false, locale = 'ja-JP' } = options;

  const dateObj = new Date(date);

  if (includeTime) {
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } else {
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
};

/**
 * Formats event start date and time
 * @param date - The event start date
 * @returns Formatted date string with time
 */
export const formatEventStartDate = (date: Date | string | number): string => {
  return formatEventDate(date, { includeTime: true });
};

/**
 * Formats simple date (no time)
 * @param date - The date to format
 * @returns Formatted date string without time
 */
export const formatSimpleDate = (date: Date | string | number): string => {
  return formatEventDate(date, { includeTime: false });
};

/**
 * Formats created/updated dates consistently
 * @param date - The date to format
 * @returns Formatted date string for metadata
 */
export const formatMetadataDate = (date: Date | string | number): string => {
  return formatSimpleDate(date);
};
