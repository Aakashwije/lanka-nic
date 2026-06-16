import { describe, expect, it } from 'vitest';
import { maskNIC } from '../src/mask';

describe('maskNIC', () => {
  it('masks old NIC', () => {
    expect(maskNIC('931234567V')).toBe('93123****V');
  });

  it('masks new NIC', () => {
    expect(maskNIC('199312345678')).toBe('1993123*****');
  });

  it('returns normalized original if invalid', () => {
    expect(maskNIC('abc 123')).toBe('abc123');
  });

  it('handles non-string safely', () => {
    expect(maskNIC(123 as unknown as string)).toBe('');
  });
});
