// utils/date.ts
export const roundTo30Min = (date: Date): Date => {
  const ms = 1000 * 60 * 30;
  return new Date(Math.round(date.getTime() / ms) * ms);
};

export const formatDate = (d?: Date): string =>
  d
    ? `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${d.getFullYear()}`
    : 'DD-MM-YY';

export const formatTimeRange = (d?: Date): string => {
  if (!d) return 'Select Time';
  const start = new Date(d);
  const end = new Date(d.getTime() + 30 * 60 * 1000);

  const format = (t: Date) =>
    t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return `${format(start)} - ${format(end)}`;
};

export const isDateInPast = (date: Date, time: Date): boolean => {
  const dt = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes()
  );
  return dt < new Date();
};
