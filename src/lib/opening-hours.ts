import { getCollection } from 'astro:content';

export type OpeningDayData = {
  day: string;
  order: number;
  closed: boolean;
  from?: string;
  until?: string;
  note?: string;
};

/** Opening hours from the collection, sorted Monday → Sunday. */
export async function getOpeningHours(): Promise<OpeningDayData[]> {
  const entries = await getCollection('openingHours');
  return entries
    .map((entry) => ({
      day: entry.data.day,
      order: entry.data.order,
      closed: entry.data.closed,
      from: entry.data.from,
      until: entry.data.until,
      note: entry.data.note,
    }))
    .sort((a, b) => a.order - b.order);
}

/** "10:00 – 15:00" resp. "Geschlossen" */
export function timeRange(day: OpeningDayData): string {
  if (day.closed || !day.from || !day.until) return 'Geschlossen';
  return `${day.from} – ${day.until}`;
}

/** Two-letter abbreviations as used in the compact summary ("Mo–Do"). */
const SHORT_WEEKDAYS: Record<string, string> = {
  Montag: 'Mo',
  Dienstag: 'Di',
  Mittwoch: 'Mi',
  Donnerstag: 'Do',
  Freitag: 'Fr',
  Samstag: 'Sa',
  Sonntag: 'So',
};

export interface OpeningHoursSummaryLine {
  /** "Mo–Do" resp. "Sa" */
  days: string;
  /** "10:00 – 15:00" */
  hours: string;
}

/**
 * Condenses the seven days into as few lines as possible by merging runs of
 * consecutive days that share the same times – the way the original site put
 * it ("Mo-Do: 10-15Uhr"). Closed days are left out entirely.
 */
export function summarizeOpeningHours(
  days: OpeningDayData[],
): OpeningHoursSummaryLine[] {
  const lines: OpeningHoursSummaryLine[] = [];
  let run: OpeningDayData[] = [];

  const flush = () => {
    if (run.length === 0) return;
    const first = SHORT_WEEKDAYS[run[0].day] ?? run[0].day;
    const last = SHORT_WEEKDAYS[run[run.length - 1].day] ?? run[run.length - 1].day;
    lines.push({
      days: run.length === 1 ? first : `${first}–${last}`,
      hours: timeRange(run[0]),
    });
    run = [];
  };

  for (const day of days) {
    if (day.closed || !day.from || !day.until) {
      flush();
      continue;
    }
    const previous = run[run.length - 1];
    const sameTimes =
      previous && previous.from === day.from && previous.until === day.until;
    const consecutive = previous && previous.order + 1 === day.order;
    if (!sameTimes || !consecutive) flush();
    run.push(day);
  }
  flush();

  return lines;
}

/** The editorial weekday names mapped to schema.org DayOfWeek. */
const SCHEMA_WEEKDAYS: Record<string, string> = {
  Montag: 'Monday',
  Dienstag: 'Tuesday',
  Mittwoch: 'Wednesday',
  Donnerstag: 'Thursday',
  Freitag: 'Friday',
  Samstag: 'Saturday',
  Sonntag: 'Sunday',
};

export interface SchemaOpeningHours {
  '@type': 'OpeningHoursSpecification';
  dayOfWeek: string;
  opens: string;
  closes: string;
}

/**
 * schema.org openingHoursSpecification for the practice. Closed days are left
 * out – search engines read a missing day as "closed".
 */
export function schemaOpeningHours(
  days: OpeningDayData[],
): SchemaOpeningHours[] {
  return days
    .filter((day) => !day.closed && day.from && day.until)
    .map((day) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: SCHEMA_WEEKDAYS[day.day],
      opens: day.from!,
      closes: day.until!,
    }));
}
