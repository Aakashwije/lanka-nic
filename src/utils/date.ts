export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const dayOfYearToUTCDate = (year: number, dayOfYear: number): Date | null => {
  const maxDays = isLeapYear(year) ? 366 : 365;
  if (dayOfYear < 1 || dayOfYear > maxDays) {
    return null;
  }

  return new Date(Date.UTC(year, 0, dayOfYear));
};

export const formatUTCDate = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

export const parseUTCBirthDate = (iso: string): Date => {
  const year = Number(iso.slice(0, 4));
  const month = Number(iso.slice(5, 7));
  const day = Number(iso.slice(8, 10));
  return new Date(Date.UTC(year, month - 1, day));
};
