import { DAY_CODE_FEMALE_OFFSET } from './utils/constants';
import { dayOfYearToUTCDate } from './utils/date';

export type NICGenerateOptions = {
  year: number;
  dayOfYear: number;
  gender: 'male' | 'female';
  format: 'old' | 'new';
  serial?: number;
};

const padLeft = (value: number, length: number): string =>
  String(value).padStart(length, '0').slice(-length);

export const generateNIC = (opts: NICGenerateOptions): string => {
  const { year, dayOfYear, gender, format } = opts;
  const serial = opts.serial ?? 1234;

  if (year < 1900) {
    throw new Error('year must be >= 1900');
  }

  if (format === 'old' && year > 1999) {
    throw new Error('old format only supports years 1900-1999');
  }

  if (!dayOfYearToUTCDate(year, dayOfYear)) {
    throw new Error(`invalid day ${dayOfYear} for year ${year}`);
  }

  if (serial < 0) {
    throw new Error('serial must be >= 0');
  }

  const dayCode =
    gender === 'male' ? dayOfYear : dayOfYear + DAY_CODE_FEMALE_OFFSET;

  if (format === 'old') {
    const yy = padLeft(year - 1900, 2);
    const ddd = padLeft(dayCode, 3);
    const ssss = padLeft(serial, 4);
    return `${yy}${ddd}${ssss}V`;
  }

  const yyyy = padLeft(year, 4);
  const ddd = padLeft(dayCode, 3);
  const sssss = padLeft(serial, 5);
  return `${yyyy}${ddd}${sssss}`;
};
