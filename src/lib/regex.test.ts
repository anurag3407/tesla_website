import { describe, it, expect } from 'vitest';
import { escapeRegex, isValidObjectId } from './regex';

describe('escapeRegex', () => {
  it('escapes regex metacharacters correctly', () => {
    const input = 'hello (world) [test] * + ? ^ $ { } | \\';
    const escaped = escapeRegex(input);
    expect(escaped).toBe('hello \\(world\\) \\[test\\] \\* \\+ \\? \\^ \\$ \\{ \\} \\| \\\\');
    expect(() => new RegExp(escaped)).not.toThrow();
  });

  it('handles null, undefined, and non-string inputs safely', () => {
    expect(escapeRegex(null)).toBe('');
    expect(escapeRegex(undefined)).toBe('');
    expect(escapeRegex('')).toBe('');
    expect(escapeRegex('   ')).toBe('');
  });

  it('trims leading and trailing whitespace', () => {
    expect(escapeRegex('  tesla  ')).toBe('tesla');
  });
});

describe('isValidObjectId', () => {
  it('returns true for valid 24-character hex strings', () => {
    expect(isValidObjectId('507f1f77bcf86cd799439011')).toBe(true);
    expect(isValidObjectId('000000000000000000000000')).toBe(true);
    expect(isValidObjectId('abcdefABCDEF012345678901')).toBe(true);
  });

  it('returns false for invalid values', () => {
    expect(isValidObjectId('123')).toBe(false);
    expect(isValidObjectId('invalid-id-string')).toBe(false);
    expect(isValidObjectId('')).toBe(false);
    expect(isValidObjectId(null)).toBe(false);
    expect(isValidObjectId(undefined)).toBe(false);
    expect(isValidObjectId(123456789012)).toBe(false);
    expect(isValidObjectId('507f1f77bcf86cd79943901z')).toBe(false); // contains 'z'
  });
});
