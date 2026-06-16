import { parseNIC } from './parse';
import type { ParsedNIC } from './types';
import { validateNIC } from './validate';

export const validateBatch = (nics: string[]): boolean[] => nics.map(validateNIC);

export const parseBatch = (nics: string[]): (ParsedNIC | null)[] =>
  nics.map(parseNIC);
