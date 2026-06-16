import { normalizeNIC } from './normalize';
import { getNICType } from './parse';

export const maskNIC = (nic: string): string => {
  if (typeof nic !== 'string') {
    return '';
  }

  const normalized = normalizeNIC(nic);
  const type = getNICType(normalized);

  if (type === 'old') {
    return `${normalized.slice(0, 5)}****${normalized.slice(9)}`;
  }

  if (type === 'new') {
    return `${normalized.slice(0, 7)}*****`;
  }

  return normalized;
};
