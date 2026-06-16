import { describe, expect, it } from 'vitest';
import {
  dayOfYearToUTCDate,
  formatUTCDate,
  isLeapYear,
  parseUTCBirthDate
} from '../src/utils/date';

describe('isLeapYear', () => {
  it('handles ordinary leap (divisible by 4)', () => {
    expect(isLeapYear(2024)).toBe(true);
  });

  it('rejects ordinary non-leap', () => {
    expect(isLeapYear(2023)).toBe(false);
  });

  it('rejects centurial non-leap (divisible by 100 but not 400)', () => {
    expect(isLeapYear(1900)).toBe(false);
  });

  it('accepts centurial leap (divisible by 400)', () => {
    expect(isLeapYear(2000)).toBe(true);
  });
});

describe('dayOfYearToUTCDate', () => {
  it('returns null for day below 1', () => {
    expect(dayOfYearToUTCDate(2024, 0)).toBeNull();
  });

  it('returns null for day past year length', () => {
    expect(dayOfYearToUTCDate(2023, 366)).toBeNull();
    expect(dayOfYearToUTCDate(2024, 367)).toBeNull();
  });

  it('returns Feb 29 on leap years', () => {
    const date = dayOfYearToUTCDate(2024, 60);
    expect(date).not.toBeNull();
    expect(formatUTCDate(date!)).toBe('2024-02-29');
  });

  it('returns Jan 1 for day 1', () => {
    const date = dayOfYearToUTCDate(2024, 1);
    expect(formatUTCDate(date!)).toBe('2024-01-01');
  });
});

describe('parseUTCBirthDate', () => {
  it('parses YYYY-MM-DD into UTC Date', () => {
    const d = parseUTCBirthDate('1993-05-03');
    expect(d.getUTCFullYear()).toBe(1993);
    expect(d.getUTCMonth()).toBe(4);
    expect(d.getUTCDate()).toBe(3);
  });
});
