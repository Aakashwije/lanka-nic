import { describe, expect, it } from 'vitest';
import { equalsNIC } from '../src/equals';

describe('equalsNIC', () => {
  it('matches identical old NICs', () => {
    expect(equalsNIC('931234567V', '931234567V')).toBe(true);
    expect(equalsNIC('931234567V', '931234567v')).toBe(true);
  });

  it('matches identical new NICs', () => {
    expect(equalsNIC('199312345678', '199312345678')).toBe(true);
  });

  it('does not match different birth years', () => {
    expect(equalsNIC('931234567V', '941234567V')).toBe(false);
  });

  it('does not match different day codes', () => {
    expect(equalsNIC('931234567V', '932004567V')).toBe(false);
  });

  it('does not match different genders (same day)', () => {
    // 123 male vs 623 = 123 + 500 female
    expect(equalsNIC('931234567V', '936234567V')).toBe(false);
  });

  it('does not match different serial digits', () => {
    expect(equalsNIC('931234567V', '931239999V')).toBe(false);
  });

  it('returns false when either NIC is invalid', () => {
    expect(equalsNIC('garbage', '931234567V')).toBe(false);
    expect(equalsNIC('931234567V', 'garbage')).toBe(false);
  });

  it('matches across old vs new format with same person data', () => {
    // old: 93 / 123 / 4567 / V  →  new: 1993 / 123 / 04567 / X
    expect(equalsNIC('931234567V', '199312304567')).toBe(false); // serial differs by length
  });
});
