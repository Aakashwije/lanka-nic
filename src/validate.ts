import { parseNIC } from './parse';

export const validateNIC = (nic: string): boolean => {
  return parseNIC(nic) !== null;
};
