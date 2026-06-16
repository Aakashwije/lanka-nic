## [1.0.1](https://github.com/Aakashwije/lanka-nic/compare/v1.0.0...v1.0.1) (2026-06-16)

### Bug Fixes

* enable npm publishing in semantic-release ([d039629](https://github.com/Aakashwije/lanka-nic/commit/d039629ab0fb2f17e690a2b0bdadeb11bd1b2e36))
* publish under owned npm scope ([b821432](https://github.com/Aakashwije/lanka-nic/commit/b821432b337df2cdaefef2f9768a970fffffa11a))
* verify npm auth in release workflow ([77e3c57](https://github.com/Aakashwije/lanka-nic/commit/77e3c572596dba8e70f8a3ed42e808e47ac967b5))

## 1.0.0 (2026-06-16)

### Features

* initial lanka nic package ([ac97912](https://github.com/Aakashwije/lanka-nic/commit/ac97912bc0acdcfe446f9c6401a8a058c81d6485))

### Bug Fixes

* add conventional commits preset for semantic-release ([ddce03e](https://github.com/Aakashwije/lanka-nic/commit/ddce03ea188f470bb3156798f684dc17ddb7fd62))
* correct repository metadata for semantic-release ([985235d](https://github.com/Aakashwije/lanka-nic/commit/985235dac9174a81db13de5c32318933f2285445))
* disable npm publishing in semantic-release to fix CI release job ([23f93b4](https://github.com/Aakashwije/lanka-nic/commit/23f93b419a56ef419f31b01c36d91c1f845805e8))
* harden release workflow token handling ([1e348b8](https://github.com/Aakashwije/lanka-nic/commit/1e348b8cea175a003ba837f839191cb2fc6186f7))
* harden semantic-release repo and token env ([af164c9](https://github.com/Aakashwije/lanka-nic/commit/af164c94686d4e1f028cbe8fd097677bc05c9f00))

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
