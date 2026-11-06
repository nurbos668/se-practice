import { expect, test } from 'vitest';
import { canBook, type BookingRequest } from './booking';

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

test('T01 AC4: a request touching the booking after it is available', () => {
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

test('T06 AC2: a 120-minute booking is unavailable', () => {
  expect(decide(720, 840)).toBe(false);
});

test('T07 AC2: a 121-minute booking is unavailable', () => {
  expect(decide(720, 841)).toBe(false);
});

test('T08 AC4: a request touching the booking before it is available', () => {
  expect(decide(570, 600)).toBe(true);
});

test('T09 AC4: a partial overlap is unavailable', () => {
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
