import { OLD_NIC_PATTERN } from './utils/constants';

export const normalizeNIC = (nic: string): string => {
  if (typeof nic !== 'string') {
    return '';
  }

  const compact = nic.trim().replace(/\s+/g, '');
  if (OLD_NIC_PATTERN.test(compact)) {
    return compact.slice(0, 9) + compact.slice(9).toUpperCase();
  }

  return compact;
};
