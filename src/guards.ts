import { getNICType } from './parse';
import { validateNIC } from './validate';

export const isValidNIC = (value: unknown): value is string => {
  return typeof value === 'string' && validateNIC(value);
};

export const isOldNIC = (value: unknown): value is string => {
  return (
    typeof value === 'string' &&
    getNICType(value) === 'old' &&
    validateNIC(value)
  );
};

export const isNewNIC = (value: unknown): value is string => {
  return (
    typeof value === 'string' &&
    getNICType(value) === 'new' &&
    validateNIC(value)
  );
};
