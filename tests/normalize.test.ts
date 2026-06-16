import { describe, expect, it } from 'vitest';
import { normalizeNIC } from '../src/normalize';

describe('normalizeNIC', () => {
  it('trims and removes spaces', () => {
    expect(normalizeNIC('  931234567v  ')).toBe('931234567V');
    expect(normalizeNIC('1993 1234 5678')).toBe('199312345678');
  });

  it('uppercases old NIC suffix', () => {
    expect(normalizeNIC('931234567x')).toBe('931234567X');
  });

  it('returns empty string for non-string values', () => {
    expect(normalizeNIC(10 as unknown as string)).toBe('');
  });
});
