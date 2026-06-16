import { parseNIC } from './parse';
import { parseUTCBirthDate } from './utils/date';

const toUTCDay = (date: Date): Date => {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
};

const todayUTC = (): Date => toUTCDay(new Date());

export const getAgeOn = (nic: string, date: Date): number | null => {
  const parsed = parseNIC(nic);
  if (!parsed) {
    return null;
  }

  const birth = parseUTCBirthDate(parsed.birthDate);
  const ref = toUTCDay(date);

  if (ref.getTime() < birth.getTime()) {
    return null;
  }

  let age = ref.getUTCFullYear() - birth.getUTCFullYear();
  const monthDiff = ref.getUTCMonth() - birth.getUTCMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && ref.getUTCDate() < birth.getUTCDate())
  ) {
    age -= 1;
  }

  return age;
};

export const getAge = (
  nic: string,
  opts?: { now?: Date }
): number | null => {
  const ref = opts?.now ?? todayUTC();
  return getAgeOn(nic, ref);
};
