import { describe, expect, it } from 'vitest';
import { isNewNIC, isOldNIC, isValidNIC } from '../src/guards';

describe('isValidNIC', () => {
  it('returns true for valid old NIC', () => {
    expect(isValidNIC('931234567V')).toBe(true);
  });

  it('returns true for valid new NIC', () => {
    expect(isValidNIC('199312345678')).toBe(true);
  });

  it('returns false for invalid input', () => {
    expect(isValidNIC('garbage')).toBe(false);
    expect(isValidNIC('')).toBe(false);
  });

  it('returns false for non-string', () => {
    expect(isValidNIC(null)).toBe(false);
    expect(isValidNIC(undefined)).toBe(false);
    expect(isValidNIC(42)).toBe(false);
  });
});

describe('isOldNIC', () => {
  it('returns true for valid old NIC only', () => {
    expect(isOldNIC('931234567V')).toBe(true);
    expect(isOldNIC('199312345678')).toBe(false);
  });

  it('returns false for old-format but semantically invalid NIC', () => {
    expect(isOldNIC('933670000V')).toBe(false);
  });

  it('returns false for non-string', () => {
    expect(isOldNIC(null)).toBe(false);
  });
});

describe('isNewNIC', () => {
  it('returns true for valid new NIC only', () => {
    expect(isNewNIC('199312345678')).toBe(true);
    expect(isNewNIC('931234567V')).toBe(false);
  });

  it('returns false for new-format but semantically invalid NIC', () => {
    expect(isNewNIC('199336700000')).toBe(false);
  });

  it('returns false for non-string', () => {
    expect(isNewNIC({})).toBe(false);
  });
});
