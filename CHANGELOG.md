# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-06-16

### Added

- Validation, parsing, normalization, masking, and old→new conversion for Sri Lankan NIC numbers.
- `safeParse` returning a discriminated `{ success, data | error }` result with typed error codes.
- `parseNICOrThrow` variant that throws `NICError` with `.code` and `.input`.
- Type guards: `isValidNIC`, `isOldNIC`, `isNewNIC`.
- Age helpers: `getAge`, `getAgeOn`.
- `equalsNIC` for cross-format equality.
- `validateBatch`, `parseBatch` for array workflows.
- `generateNIC` test fixture helper (round-trippable through `parseNIC`).
- `lanka-nic` CLI binary with `validate`, `parse`, `mask`, `age` subcommands.
- Dual ESM + CJS distribution with TypeScript declarations.
- npm provenance attestation on release.
- 100% coverage gate in CI.
