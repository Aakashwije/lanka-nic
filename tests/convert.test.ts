import { describe, expect, it } from 'vitest';
import { convertOldToNew } from '../src/convert';

describe('convertOldToNew', () => {
  it('converts valid old NIC to best-effort new representation', () => {
    expect(convertOldToNew('931234567V')).toBe('19931234567');
  });

  it('returns null for non-old NIC values', () => {
    expect(convertOldToNew('199312345678')).toBeNull();
    expect(convertOldToNew('invalid')).toBeNull();
  });

  it('handles non-string safely', () => {
    expect(convertOldToNew(123 as unknown as string)).toBeNull();
  });
});
