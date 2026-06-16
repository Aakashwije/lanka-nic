import { describe, expect, it } from 'vitest';
import { NICError } from '../src/errors';
import { parseNICOrThrow, safeParse } from '../src/parse';

describe('safeParse', () => {
  it('succeeds for valid old NIC', () => {
    const result = safeParse('931234567V');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.birthYear).toBe(1993);
      expect(result.data.gender).toBe('male');
    }
  });

  it('succeeds for valid new NIC', () => {
    const result = safeParse('199312345678');
    expect(result.success).toBe(true);
  });

  it('returns NON_STRING for non-string input', () => {
    const result = safeParse(42);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(NICError);
      expect(result.error.code).toBe('NON_STRING');
      expect(result.error.input).toBe(42);
    }
  });

  it('returns EMPTY for empty input', () => {
    const result = safeParse('   ');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('EMPTY');
    }
  });

  it('returns INVALID_FORMAT for malformed input', () => {
    const result = safeParse('not-a-nic');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INVALID_FORMAT');
    }
  });

  it('returns FUTURE_YEAR for future birth year', () => {
    const futureYear = new Date().getUTCFullYear() + 5;
    const result = safeParse(`${futureYear}00100000`);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('FUTURE_YEAR');
    }
  });

  it('returns INVALID_DAY_CODE for out-of-range day codes', () => {
    const result = safeParse('933670000V');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INVALID_DAY_CODE');
    }
  });

  it('returns INVALID_DAY_FOR_YEAR for non-existent dates', () => {
    const result = safeParse('993660000V');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INVALID_DAY_FOR_YEAR');
    }
  });
});

describe('parseNICOrThrow', () => {
  it('returns ParsedNIC for valid input', () => {
    expect(parseNICOrThrow('931234567V').birthYear).toBe(1993);
  });

  it('throws NICError for invalid input', () => {
    expect(() => parseNICOrThrow('invalid')).toThrow(NICError);
    try {
      parseNICOrThrow('invalid');
    } catch (e) {
      expect(e).toBeInstanceOf(NICError);
      expect((e as NICError).code).toBe('INVALID_FORMAT');
      expect((e as NICError).input).toBe('invalid');
    }
  });
});
