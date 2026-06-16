export type {
  ParsedNIC,
  NICType,
  NICGender,
  NICErrorCode,
  SafeParseResult,
  SafeParseSuccess,
  SafeParseFailure,
  NormalizedNIC
} from './types';

export { NICError } from './errors';

export { normalizeNIC } from './normalize';
export {
  parseNIC,
  safeParse,
  parseNICOrThrow,
  getNICType,
  getBirthDate,
  getGender
} from './parse';
export { validateNIC } from './validate';
export { maskNIC } from './mask';
export { convertOldToNew } from './convert';
export { isValidNIC, isOldNIC, isNewNIC } from './guards';
export { getAge, getAgeOn } from './age';
export { equalsNIC } from './equals';
export { validateBatch, parseBatch } from './batch';
export { generateNIC } from './generate';
export type { NICGenerateOptions } from './generate';
