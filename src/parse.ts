import { NICError } from './errors';
import { normalizeNIC } from './normalize';
import type {
  NICErrorCode,
  NICGender,
  NICType,
  ParsedNIC,
  SafeParseResult
} from './types';
import {
  DAY_CODE_FEMALE_OFFSET,
  DAY_CODE_MAX_FEMALE,
  DAY_CODE_MAX_MALE,
  DAY_CODE_MIN,
  NEW_NIC_PATTERN,
  OLD_NIC_PATTERN
} from './utils/constants';
import { dayOfYearToUTCDate, formatUTCDate } from './utils/date';

const getUTCFullYearNow = (): number => new Date().getUTCFullYear();

const fail = (
  code: NICErrorCode,
  message: string,
  input: unknown
): SafeParseResult<ParsedNIC> => ({
  success: false,
  error: new NICError(code, message, input)
});

const resolveGenderAndDay = (
  dayCode: number
): { gender: NICGender; dayOfYear: number } | null => {
  if (dayCode >= DAY_CODE_MIN && dayCode <= DAY_CODE_MAX_MALE) {
    return { gender: 'male', dayOfYear: dayCode };
  }

  if (
    dayCode >= DAY_CODE_FEMALE_OFFSET + DAY_CODE_MIN &&
    dayCode <= DAY_CODE_MAX_FEMALE
  ) {
    return { gender: 'female', dayOfYear: dayCode - DAY_CODE_FEMALE_OFFSET };
  }

  return null;
};

export const getNICType = (nic: string): NICType => {
  if (typeof nic !== 'string') {
    return 'invalid';
  }

  const normalized = normalizeNIC(nic);

  if (OLD_NIC_PATTERN.test(normalized)) {
    return 'old';
  }

  if (NEW_NIC_PATTERN.test(normalized)) {
    return 'new';
  }

  return 'invalid';
};

export const safeParse = (nic: unknown): SafeParseResult<ParsedNIC> => {
  if (typeof nic !== 'string') {
    return fail('NON_STRING', 'NIC must be a string', nic);
  }

  const normalized = normalizeNIC(nic);
  if (!normalized) {
    return fail('EMPTY', 'NIC is empty', nic);
  }

  const type = getNICType(normalized);
  if (type === 'invalid') {
    return fail(
      'INVALID_FORMAT',
      'NIC does not match old or new format',
      nic
    );
  }

  const birthYear =
    type === 'old'
      ? 1900 + Number.parseInt(normalized.slice(0, 2), 10)
      : Number.parseInt(normalized.slice(0, 4), 10);

  if (birthYear > getUTCFullYearNow()) {
    return fail('FUTURE_YEAR', `birth year ${birthYear} is in the future`, nic);
  }

  const dayCode =
    type === 'old'
      ? Number.parseInt(normalized.slice(2, 5), 10)
      : Number.parseInt(normalized.slice(4, 7), 10);

  const genderAndDay = resolveGenderAndDay(dayCode);
  if (!genderAndDay) {
    return fail(
      'INVALID_DAY_CODE',
      `day code ${dayCode} is out of range`,
      nic
    );
  }

  const date = dayOfYearToUTCDate(birthYear, genderAndDay.dayOfYear);
  if (!date) {
    return fail(
      'INVALID_DAY_FOR_YEAR',
      `day ${genderAndDay.dayOfYear} does not exist in year ${birthYear}`,
      nic
    );
  }

  return {
    success: true,
    data: {
      input: nic,
      normalized,
      type,
      valid: true,
      birthYear,
      dayOfYear: genderAndDay.dayOfYear,
      birthDate: formatUTCDate(date),
      gender: genderAndDay.gender
    }
  };
};

export const parseNIC = (nic: string): ParsedNIC | null => {
  const result = safeParse(nic);
  return result.success ? result.data : null;
};

export const parseNICOrThrow = (nic: string): ParsedNIC => {
  const result = safeParse(nic);
  if (result.success) {
    return result.data;
  }
  throw result.error;
};

export const getBirthDate = (nic: string): string | null => {
  return parseNIC(nic)?.birthDate ?? null;
};

export const getGender = (nic: string): NICGender | null => {
  return parseNIC(nic)?.gender ?? null;
};
