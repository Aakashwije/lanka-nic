import { parseNIC } from './parse';
import type { ParsedNIC } from './types';

const serialOf = (parsed: ParsedNIC): string => {
  if (parsed.type === 'old') {
    return parsed.normalized.slice(5, 9);
  }
  return parsed.normalized.slice(7, 11);
};

export const equalsNIC = (a: string, b: string): boolean => {
  const pa = parseNIC(a);
  const pb = parseNIC(b);

  if (!pa || !pb) {
    return false;
  }

  return (
    pa.birthYear === pb.birthYear &&
    pa.dayOfYear === pb.dayOfYear &&
    pa.gender === pb.gender &&
    serialOf(pa) === serialOf(pb)
  );
};
