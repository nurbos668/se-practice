import { expect, test } from 'vitest';
import { canBook, checkRoom, type BookingRequest } from './booking';
import { filterRooms } from './filter';
import type { Room } from './rooms';

function decide(start: number, end: number, changes: Partial<BookingRequest> = {}) {
  return canBook({
    start,
    end,
    now: 540,
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
    ...changes,
  });
}

// Fixed test data: deliberately independent from the page's demo catalog.
const FIXED_ROOMS: Room[] = [
  { id: 'a101', name: 'Room A-101', capacity: 8, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'b204', name: 'Room B-204', capacity: 16, equipment: ['projector', 'video conference'], blocked: false, bookings: [{ start: 660, end: 720 }] },
  { id: 'c310', name: 'Room C-310', capacity: 24, equipment: ['projector', 'whiteboard', 'video conference'], blocked: true, bookings: [] },
  { id: 'd120', name: 'Room D-120', capacity: 10, equipment: ['whiteboard'], blocked: false, bookings: [] },
];

const baseRequest = { start: 660, end: 720, now: 540 };

test('T01 B3 AC4: a request touching the booking after it is available', () => {
  expect(decide(660, 720)).toBe(true);
});

test('T02 AC1: a request starting at the current time is unavailable', () => {
  expect(decide(540, 570)).toBe(false);
});

test('T03 AC1: a zero-length interval is unavailable', () => {
  expect(decide(720, 720)).toBe(false);
});

test('T04 AC1: a reversed interval is unavailable', () => {
  expect(decide(750, 720)).toBe(false);
});

test('T05 AC1: an interval ending after midnight is unavailable', () => {
  expect(decide(1380, 1441)).toBe(false);
});

test('T06 B1 AC2: exactly 120 minutes is available', () => {
  expect(decide(720, 840)).toBe(true);
});

test('T07 B2 AC2: a 121-minute booking is unavailable', () => {
  expect(decide(720, 841)).toBe(false);
});

test('T08 AC4: a request touching the booking before it is available', () => {
  expect(decide(570, 600)).toBe(true);
});

test('T09 B4 AC4: a partial overlap is unavailable', () => {
  expect(decide(630, 690)).toBe(false);
});

test('T10 AC4: a request containing an existing booking is unavailable', () => {
  expect(decide(570, 690)).toBe(false);
});

test('T11 AC4: a request inside an existing booking is unavailable', () => {
  expect(decide(615, 645)).toBe(false);
});

test('T12 AC4: an identical interval is unavailable', () => {
  expect(decide(600, 660)).toBe(false);
});

test('T13 AC3: a blocked room is unavailable', () => {
  expect(decide(660, 720, { blocked: true })).toBe(false);
});

test('T14 AC4: a request with no existing bookings is available', () => {
  expect(decide(630, 690, { bookings: [] })).toBe(true);
});

test('AC5: an available request leaves the booking data unchanged', () => {
  const bookings = [{ start: 600, end: 660 }];
  const before = structuredClone(bookings);
  const available = canBook({ start: 660, end: 720, now: 540, blocked: false, bookings });

  expect(available).toBe(true);
  expect(bookings).toEqual(before);
});

test('X1 AC1: a valid interval may end exactly at 1440', () => {
  expect(decide(1380, 1440, { now: 1379, bookings: [] })).toBe(true);
});

test('X2 AC4: a request overlapping the second of two bookings is unavailable', () => {
  expect(decide(780, 840, { bookings: [{ start: 600, end: 660 }, { start: 810, end: 870 }] })).toBe(false);
});

test('BUG-A: a request touching two adjacent bookings is available', () => {
  const bookings = [
    { start: 600, end: 660 },
    { start: 720, end: 780 },
  ];
  const available = canBook({ start: 660, end: 720, now: 540, blocked: false, bookings });

  expect(available).toBe(true);
});

test('BUG-B: an available request leaves the booking data unchanged', () => {
  const bookings = [{ start: 600, end: 660 }];
  const before = structuredClone(bookings);
  const available = canBook({ start: 800, end: 860, now: 540, blocked: false, bookings });

  expect(available).toBe(true);
  expect(bookings).toEqual(before);
});

test('F1 B5: capacity equal to attendees includes the room and no equipment filter includes all', () => {
  const matches = filterRooms(FIXED_ROOMS, { attendees: 8, equipment: [] });
  expect(matches.map(room => room.id)).toEqual(['a101', 'b204', 'c310', 'd120']);
});

test('F1 B6: capacity one below attendees excludes the room', () => {
  const matches = filterRooms(FIXED_ROOMS, { attendees: 9, equipment: [] });
  expect(matches.map(room => room.id)).not.toContain('a101');
});

test('F2: a room must have all selected equipment', () => {
  const matches = filterRooms(FIXED_ROOMS, { attendees: 8, equipment: ['projector', 'whiteboard'] });
  expect(matches.map(room => room.id)).toEqual(['a101', 'c310']);
});

test('F4: no matching room returns an empty list', () => {
  expect(filterRooms(FIXED_ROOMS, { attendees: 25, equipment: [] })).toEqual([]);
});

test('F3: a blocked selected room is never available', () => {
  expect(checkRoom(FIXED_ROOMS, 'c310', baseRequest)).toBe(false);
});

test('F5: the selected room supplies its own bookings', () => {
  expect(checkRoom(FIXED_ROOMS, 'a101', baseRequest)).toBe(true);
  expect(checkRoom(FIXED_ROOMS, 'b204', baseRequest)).toBe(false);
});

test('INT: a filtered room is checked with its own booking data', () => {
  const matches = filterRooms(FIXED_ROOMS, { attendees: 8, equipment: ['projector'] });
  expect(matches.map(room => room.id)).toContain('b204');
  expect(checkRoom(matches, 'b204', baseRequest)).toBe(false);
});
