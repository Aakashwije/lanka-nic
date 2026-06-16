import { describe, expect, it } from 'vitest';
import { generateNIC } from '../src/generate';
import { parseNIC } from '../src/parse';

describe('generateNIC', () => {
  it('generates round-trippable old male NIC', () => {
    const nic = generateNIC({
      year: 1993,
      dayOfYear: 123,
      gender: 'male',
      format: 'old'
    });
    const parsed = parseNIC(nic);
    expect(parsed).not.toBeNull();
    expect(parsed?.type).toBe('old');
    expect(parsed?.birthYear).toBe(1993);
    expect(parsed?.dayOfYear).toBe(123);
    expect(parsed?.gender).toBe('male');
  });

  it('generates round-trippable old female NIC', () => {
    const nic = generateNIC({
      year: 1985,
      dayOfYear: 60,
      gender: 'female',
      format: 'old',
      serial: 42
    });
    const parsed = parseNIC(nic);
    expect(parsed?.gender).toBe('female');
    expect(parsed?.dayOfYear).toBe(60);
  });

  it('generates round-trippable new male NIC', () => {
    const nic = generateNIC({
      year: 2001,
      dayOfYear: 5,
      gender: 'male',
      format: 'new'
    });
    const parsed = parseNIC(nic);
    expect(parsed?.type).toBe('new');
    expect(parsed?.birthYear).toBe(2001);
  });

  it('generates round-trippable new female NIC', () => {
    const nic = generateNIC({
      year: 2010,
      dayOfYear: 250,
      gender: 'female',
      format: 'new',
      serial: 99999
    });
    const parsed = parseNIC(nic);
    expect(parsed?.gender).toBe('female');
    expect(parsed?.dayOfYear).toBe(250);
  });

  it('throws for year < 1900', () => {
    expect(() =>
      generateNIC({ year: 1800, dayOfYear: 1, gender: 'male', format: 'new' })
    ).toThrow(/>= 1900/);
  });

  it('throws when old format is requested with year > 1999', () => {
    expect(() =>
      generateNIC({ year: 2001, dayOfYear: 1, gender: 'male', format: 'old' })
    ).toThrow(/old format/);
  });

  it('throws for impossible day-of-year', () => {
    expect(() =>
      generateNIC({
        year: 1999,
        dayOfYear: 366,
        gender: 'male',
        format: 'old'
      })
    ).toThrow(/invalid day/);
  });

  it('throws for negative serial', () => {
    expect(() =>
      generateNIC({
        year: 1993,
        dayOfYear: 1,
        gender: 'male',
        format: 'old',
        serial: -1
      })
    ).toThrow(/serial/);
  });
});
