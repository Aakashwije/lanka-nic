import { describe, expect, it } from 'vitest';
import { parseBatch, validateBatch } from '../src/batch';

describe('validateBatch', () => {
  it('preserves order with mixed inputs', () => {
    expect(validateBatch(['931234567V', 'garbage', '199312345678'])).toEqual([
      true,
      false,
      true
    ]);
  });

  it('returns empty array for empty input', () => {
    expect(validateBatch([])).toEqual([]);
  });
});

describe('parseBatch', () => {
  it('returns parsed results in order', () => {
    const results = parseBatch(['931234567V', 'garbage']);
    expect(results).toHaveLength(2);
    expect(results[0]?.birthYear).toBe(1993);
    expect(results[1]).toBeNull();
  });
});
