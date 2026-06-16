import type { NICError } from './errors';

export type NICType = 'old' | 'new' | 'invalid';
export type NICGender = 'male' | 'female';

declare const NormalizedNICBrand: unique symbol;
export type NormalizedNIC = string & { readonly [NormalizedNICBrand]: true };

export type NICErrorCode =
  | 'EMPTY'
  | 'NON_STRING'
  | 'INVALID_FORMAT'
  | 'INVALID_DAY_CODE'
  | 'INVALID_DAY_FOR_YEAR'
  | 'FUTURE_YEAR';

export type ParsedNIC = {
  input: string;
  normalized: string;
  type: 'old' | 'new';
  valid: boolean;
  birthYear: number;
  dayOfYear: number;
  birthDate: string;
  gender: NICGender;
};

export type SafeParseSuccess<T> = { success: true; data: T };
export type SafeParseFailure = { success: false; error: NICError };
export type SafeParseResult<T> = SafeParseSuccess<T> | SafeParseFailure;
