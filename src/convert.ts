import { getNICType } from './parse';
import { normalizeNIC } from './normalize';

export const convertOldToNew = (nic: string): string | null => {
  if (typeof nic !== 'string') {
    return null;
  }

  const normalized = normalizeNIC(nic);
  if (getNICType(normalized) !== 'old') {
    return null;
  }

  const year = `19${normalized.slice(0, 2)}`;
  const dayCode = normalized.slice(2, 5);
  const serial = normalized.slice(5, 9);

  // This produces a best-effort 11-digit form documented by this package.
  return `${year}${dayCode}${serial}`;
};
