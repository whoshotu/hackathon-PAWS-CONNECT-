import { describe, it, expect } from 'vitest';
import { formatDate, formatRelativeTime } from '../components/utils/dateUtils';

describe('Date Utils', () => {
  describe('formatDate', () => {
    it('formats date string correctly', () => {
      const date = '2024-01-15';
      const result = formatDate(date);
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });

    it('handles invalid dates gracefully', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('Invalid Date');
    });
  });

  describe('formatRelativeTime', () => {
    it('returns "just now" for recent dates', () => {
      const now = new Date().toISOString();
      const result = formatRelativeTime(now);
      expect(result).toBe('just now');
    });

    it('formats minutes correctly', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const result = formatRelativeTime(fiveMinutesAgo);
      expect(result).toBe('5 minutes ago');
    });

    it('formats hours correctly', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      const result = formatRelativeTime(twoHoursAgo);
      expect(result).toBe('2 hours ago');
    });
  });
});
