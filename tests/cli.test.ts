import { describe, expect, it } from 'vitest';
import { runCommand } from '../src/cli-core';

describe('runCommand', () => {
  it('prints usage when no command', () => {
    const r = runCommand([], null);
    expect(r.code).toBe(0);
    expect(r.stdout).toMatch(/Usage:/);
  });

  it('prints usage on --help', () => {
    const r = runCommand(['--help'], null);
    expect(r.code).toBe(0);
    expect(r.stdout).toMatch(/Usage:/);
  });

  it('prints usage on -h', () => {
    const r = runCommand(['-h'], null);
    expect(r.code).toBe(0);
  });

  it('errors when nic arg missing and no stdin', () => {
    const r = runCommand(['validate'], null);
    expect(r.code).toBe(2);
    expect(r.stderr).toMatch(/Usage:/);
  });

  it('reads NIC from stdin', () => {
    const r = runCommand(['validate'], '931234567V\n');
    expect(r.code).toBe(0);
    expect(r.stdout).toBe('true\n');
  });

  it('treats whitespace-only stdin as missing', () => {
    const r = runCommand(['validate'], '   \n');
    expect(r.code).toBe(2);
  });

  it('validate exits 0 for valid, 1 for invalid', () => {
    expect(runCommand(['validate', '931234567V'], null).code).toBe(0);
    expect(runCommand(['validate', 'invalid'], null).code).toBe(1);
  });

  it('parse prints JSON ParsedNIC', () => {
    const r = runCommand(['parse', '931234567V'], null);
    expect(r.code).toBe(0);
    const parsed = JSON.parse(r.stdout);
    expect(parsed.birthYear).toBe(1993);
  });

  it('parse outputs error JSON on invalid', () => {
    const r = runCommand(['parse', 'invalid'], null);
    expect(r.code).toBe(1);
    const parsed = JSON.parse(r.stderr);
    expect(parsed.error).toBe('INVALID_FORMAT');
  });

  it('mask prints masked NIC and exits 0 for valid', () => {
    const r = runCommand(['mask', '931234567V'], null);
    expect(r.stdout).toBe('93123****V\n');
    expect(r.code).toBe(0);
  });

  it('mask exits 1 for invalid input', () => {
    const r = runCommand(['mask', 'invalid'], null);
    expect(r.code).toBe(1);
  });

  it('age prints number for valid NIC', () => {
    const r = runCommand(['age', '931234567V'], null);
    expect(r.code).toBe(0);
    expect(Number(r.stdout.trim())).toBeGreaterThan(0);
  });

  it('age exits 1 for invalid NIC', () => {
    const r = runCommand(['age', 'garbage'], null);
    expect(r.code).toBe(1);
    expect(r.stderr).toMatch(/invalid/);
  });

  it('rejects unknown command', () => {
    const r = runCommand(['fly', '931234567V'], null);
    expect(r.code).toBe(2);
    expect(r.stderr).toMatch(/unknown/);
  });
});
