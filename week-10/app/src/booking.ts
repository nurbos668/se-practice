export type Interval = { start: number; end: number };

export type BookingRequest = {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Interval[];
};

export type Room = { id: string; name: string; blocked: boolean; bookings: Interval[] };

export const ROOMS: Room[] = [
  { id: 'alpha', name: 'Demo Room Alpha', blocked: false, bookings: [{ start: 600, end: 660 }] },
];

export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }
  return true;
}
