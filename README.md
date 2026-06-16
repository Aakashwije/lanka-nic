# @lanka/nic

[![CI](https://img.shields.io/github/actions/workflow/status/aakashlk/lanka-nic/ci.yml?branch=main)](https://github.com/aakashlk/lanka-nic/actions)
[![npm](https://img.shields.io/npm/v/@lanka/nic.svg)](https://www.npmjs.com/package/@lanka/nic)
[![License](https://img.shields.io/npm/l/@lanka/nic.svg)](./LICENSE)

Production-grade TypeScript validator and parser for Sri Lankan **National Identity Card** numbers. Supports both the **old** (9 digits + V/X) and **new** (12-digit) formats with UTC-safe date math, leap-year correctness, typed error codes, type guards, age helpers, and a CLI.

Zero runtime dependencies. ESM + CJS dual build. 100% test coverage.

---

## Installation

```bash
npm install @lanka/nic
# or
pnpm add @lanka/nic
# or
yarn add @lanka/nic
```

Requires Node.js **>= 18**.

## Quick start

```ts
import { parseNIC, validateNIC, getGender, getAge } from '@lanka/nic';

validateNIC('931234567V');         // true
validateNIC('199312345678');       // true
validateNIC('not-a-nic');          // false

parseNIC('931234567V');
// {
//   input: '931234567V',
//   normalized: '931234567V',
//   type: 'old',
//   valid: true,
//   birthYear: 1993,
//   dayOfYear: 123,
//   birthDate: '1993-05-03',
//   gender: 'male'
// }

getGender('199312345678');         // 'male'
getAge('931234567V');              // number (computed against today UTC)
```

## API

### Core

#### `validateNIC(nic: string): boolean`

Returns `true` when `nic` is a syntactically and semantically valid Sri Lankan NIC.

#### `getNICType(nic: string): "old" | "new" | "invalid"`

Detects the NIC format.

#### `normalizeNIC(nic: string): string`

Trims surrounding whitespace, removes inner whitespace, and upper-cases the old-format suffix.

```ts
normalizeNIC('  931234567v  ');   // '931234567V'
normalizeNIC('1993 1234 5678');   // '199312345678'
```

#### `parseNIC(nic: string): ParsedNIC | null`

Returns a full `ParsedNIC` or `null` on any failure.

```ts
type ParsedNIC = {
  input: string;
  normalized: string;
  type: 'old' | 'new';
  valid: boolean;
  birthYear: number;
  dayOfYear: number;
  birthDate: string;          // 'YYYY-MM-DD', UTC
  gender: 'male' | 'female';
};
```

#### `getBirthDate(nic: string): string | null`

Returns the birth date as `YYYY-MM-DD` (UTC) or `null`.

#### `getGender(nic: string): "male" | "female" | null`

Resolves gender from the NIC day code.

#### `maskNIC(nic: string): string`

Masks the sensitive serial digits.

```ts
maskNIC('931234567V');     // '93123****V'
maskNIC('199312345678');   // '1993123*****'
```

#### `convertOldToNew(nic: string): string | null`

Best-effort conversion of an old NIC to the new 11-digit representation (`YYYY + DDD + SSSS`).

```ts
convertOldToNew('931234567V');   // '19931234567'
```

> The official 12th check digit cannot be derived from an old NIC. The output here is the canonical 11-digit form; do not treat it as an authoritative new NIC.

### Result-style parsing

#### `safeParse(nic: unknown): SafeParseResult<ParsedNIC>`

Zod-style discriminated result. Never throws.

```ts
import { safeParse } from '@lanka/nic';

const result = safeParse(' 931234567v ');
if (result.success) {
  console.log(result.data.birthDate);
} else {
  console.error(result.error.code, result.error.message);
}
```

#### `parseNICOrThrow(nic: string): ParsedNIC`

Throws a `NICError` (with `.code` and `.input`) instead of returning `null`.

```ts
import { NICError, parseNICOrThrow } from '@lanka/nic';

try {
  parseNICOrThrow('invalid');
} catch (e) {
  if (e instanceof NICError) {
    console.log(e.code);   // 'INVALID_FORMAT'
  }
}
```

#### Error codes

| Code                   | Meaning                                                  |
| ---------------------- | -------------------------------------------------------- |
| `NON_STRING`           | Input was not a `string`.                                |
| `EMPTY`                | Input was empty after trimming.                          |
| `INVALID_FORMAT`       | Did not match the old (`\d{9}[VvXx]`) or new (`\d{12}`) shape. |
| `INVALID_DAY_CODE`     | Day code outside `001–366` and `501–866`.                |
| `INVALID_DAY_FOR_YEAR` | Day does not exist in that year (e.g., `366` non-leap). |
| `FUTURE_YEAR`          | Birth year is in the future relative to UTC today.       |

### Type guards

```ts
import { isOldNIC, isNewNIC, isValidNIC } from '@lanka/nic';

function process(value: unknown) {
  if (isValidNIC(value)) {
    // value: string
  }
}
```

### Age helpers

```ts
import { getAge, getAgeOn } from '@lanka/nic';

getAge('931234567V');                                  // age today (UTC)
getAge('931234567V', { now: new Date('2030-01-01') }); // age on 2030-01-01
getAgeOn('931234567V', new Date('2020-06-01'));        // 27
```

Returns `null` for invalid NICs or when the reference date precedes the birth date.

### Equality

```ts
import { equalsNIC } from '@lanka/nic';

equalsNIC('931234567V', '931234567v');  // true (case + suffix normalized)
equalsNIC('931234567V', '941234567V');  // false (different year)
```

### Batch helpers

```ts
import { validateBatch, parseBatch } from '@lanka/nic';

validateBatch(['931234567V', 'garbage']);  // [true, false]
parseBatch(['931234567V', 'garbage']);     // [ParsedNIC, null]
```

### `generateNIC` (test fixture)

A round-trippable generator for downstream tests:

```ts
import { generateNIC, parseNIC } from '@lanka/nic';

const nic = generateNIC({
  year: 1993,
  dayOfYear: 123,
  gender: 'male',
  format: 'old'
});

parseNIC(nic);   // { birthYear: 1993, dayOfYear: 123, gender: 'male', ... }
```

> Intended for test data. Output is syntactically valid; serial digits are not authoritative.

## CLI

```
$ npm install -g @lanka/nic

$ lanka-nic validate 931234567V
true

$ lanka-nic parse 931234567V
{
  "input": "931234567V",
  "normalized": "931234567V",
  "type": "old",
  "valid": true,
  "birthYear": 1993,
  "dayOfYear": 123,
  "birthDate": "1993-05-03",
  "gender": "male"
}

$ echo '199312345678' | lanka-nic mask
1993123*****

$ lanka-nic age 931234567V
32
```

Exit codes: `0` on success, `1` on invalid NIC, `2` on usage error.

## Examples

### Old NIC

```ts
import { parseNIC, maskNIC, convertOldToNew } from '@lanka/nic';

parseNIC('931234567V');
// type: 'old', birthYear: 1993, birthDate: '1993-05-03', gender: 'male'

maskNIC('931234567V');           // '93123****V'
convertOldToNew('931234567V');   // '19931234567'
```

### New NIC

```ts
import { validateNIC, parseNIC, maskNIC } from '@lanka/nic';

validateNIC('199312345678');     // true
parseNIC('199312345678');        // type: 'new', birthDate: '1993-05-03'
maskNIC('199312345678');         // '1993123*****'
```

## Edge cases

- Empty / whitespace-only input → invalid.
- Non-string input is handled safely (`false`, `null`, or empty string).
- Day code `000` → invalid.
- Day code `367–500` → invalid.
- Day code `> 866` → invalid.
- Female day codes have `500` added; subtracted on parse.
- Day `366` is only valid on leap years.
- Future birth years are rejected.
- All date math is UTC-only to avoid timezone drift.

## TypeScript

```ts
import type { ParsedNIC, NICErrorCode, SafeParseResult } from '@lanka/nic';
```

Both ESM and CommonJS are supported via the `exports` field:

```ts
// ESM
import { validateNIC } from '@lanka/nic';

// CJS
const { validateNIC } = require('@lanka/nic');
```

## License

[MIT](./LICENSE)
