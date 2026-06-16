import { describe, expect, it } from 'vitest';
import { getBirthDate, getGender, getNICType, parseNIC } from '../src/parse';

describe('getNICType', () => {
  it('returns "invalid" for non-string input', () => {
    expect(getNICType(42 as unknown as string)).toBe('invalid');
    expect(getNICType(null as unknown as string)).toBe('invalid');
  });

  it('detects old format', () => {
    expect(getNICType('931234567V')).toBe('old');
  });

  it('detects new format', () => {
    expect(getNICType('199312345678')).toBe('new');
  });

  it('returns "invalid" for unrecognized format', () => {
    expect(getNICType('not-a-nic')).toBe('invalid');
  });
});

describe('parseNIC', () => {
  it('parses valid old NIC', () => {
    const parsed = parseNIC('931234567V');

    expect(parsed).not.toBeNull();
    expect(parsed?.type).toBe('old');
    expect(parsed?.birthYear).toBe(1993);
    expect(parsed?.dayOfYear).toBe(123);
    expect(parsed?.birthDate).toBe('1993-05-03');
    expect(parsed?.gender).toBe('male');
  });

  it('parses valid female old NIC', () => {
    const parsed = parseNIC('936234567V');

    expect(parsed).not.toBeNull();
    expect(parsed?.dayOfYear).toBe(123);
    expect(parsed?.gender).toBe('female');
  });

  it('parses valid new NIC', () => {
    const parsed = parseNIC('199312345678');

    expect(parsed).not.toBeNull();
    expect(parsed?.type).toBe('new');
    expect(parsed?.birthYear).toBe(1993);
    expect(parsed?.dayOfYear).toBe(123);
    expect(parsed?.birthDate).toBe('1993-05-03');
  });

  it('returns null for invalid day code 000', () => {
    expect(parseNIC('930004567V')).toBeNull();
    expect(parseNIC('199300045678')).toBeNull();
  });

  it('returns null for non-string input', () => {
    expect(parseNIC({} as unknown as string)).toBeNull();
  });

  it('getBirthDate and getGender return null for invalid NIC', () => {
    expect(getBirthDate('invalid')).toBeNull();
    expect(getGender('invalid')).toBeNull();
  });

  it('getBirthDate and getGender resolve from valid NIC', () => {
    expect(getBirthDate('199312345678')).toBe('1993-05-03');
    expect(getGender('199312345678')).toBe('male');
  });
});
