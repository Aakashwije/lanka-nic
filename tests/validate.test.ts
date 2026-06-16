import { describe, expect, it } from 'vitest';
import { validateNIC } from '../src/validate';

describe('validateNIC', () => {
  it('validates old NIC format', () => {
    expect(validateNIC('931234567V')).toBe(true);
    expect(validateNIC('935234567x')).toBe(true);
  });

  it('validates new NIC format', () => {
    expect(validateNIC('199312345678')).toBe(true);
  });

  it('rejects empty or malformed inputs', () => {
    expect(validateNIC('')).toBe(false);
    expect(validateNIC('   ')).toBe(false);
    expect(validateNIC('931234567')).toBe(false);
    expect(validateNIC('19931234567')).toBe(false);
  });

  it('rejects impossible day code ranges', () => {
    expect(validateNIC('933670000V')).toBe(false);
    expect(validateNIC('935000000V')).toBe(false);
    expect(validateNIC('938670000V')).toBe(false);
    expect(validateNIC('199336700000')).toBe(false);
    expect(validateNIC('199350000000')).toBe(false);
    expect(validateNIC('199386700000')).toBe(false);
  });

  it('rejects day 366 on non-leap years', () => {
    expect(validateNIC('993660000V')).toBe(false);
    expect(validateNIC('199936600000')).toBe(false);
  });

  it('rejects future birth years', () => {
    const nextYear = new Date().getUTCFullYear() + 1;
    expect(validateNIC(`${nextYear}00100000`)).toBe(false);
  });

  it('handles non-string input safely', () => {
    expect(validateNIC(12345 as unknown as string)).toBe(false);
  });
});
