import { describe, expect, it } from 'vitest';
import { getAge, getAgeOn } from '../src/age';

describe('getAgeOn', () => {
  it('computes age after birthday in same year', () => {
    expect(getAgeOn('931234567V', new Date('2020-06-01T00:00:00Z'))).toBe(27);
  });

  it('computes age before birthday in same year (monthDiff < 0)', () => {
    expect(getAgeOn('931234567V', new Date('2020-01-15T00:00:00Z'))).toBe(26);
  });

  it('computes age on exact birthday', () => {
    expect(getAgeOn('931234567V', new Date('2020-05-03T00:00:00Z'))).toBe(27);
  });

  it('decrements when same month but earlier day', () => {
    expect(getAgeOn('931234567V', new Date('2020-05-02T00:00:00Z'))).toBe(26);
  });

  it('returns null for invalid NIC', () => {
    expect(getAgeOn('garbage', new Date('2020-01-01T00:00:00Z'))).toBeNull();
  });

  it('returns null when reference is before birth date', () => {
    expect(getAgeOn('931234567V', new Date('1990-01-01T00:00:00Z'))).toBeNull();
  });
});

describe('getAge', () => {
  it('uses provided `now` option', () => {
    expect(getAge('931234567V', { now: new Date('2025-12-31T00:00:00Z') })).toBe(
      32
    );
  });

  it('falls back to today when no opts', () => {
    const age = getAge('931234567V');
    expect(age).not.toBeNull();
    expect(typeof age).toBe('number');
  });

  it('falls back to today when opts.now omitted', () => {
    const age = getAge('931234567V', {});
    expect(age).not.toBeNull();
  });

  it('returns null for invalid NIC', () => {
    expect(getAge('garbage')).toBeNull();
  });
});
