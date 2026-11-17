export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: { start: number; end: number }[];
};

export const ROOMS: Room[] = [
  {
    id: 'a101',
    name: 'Room A-101',
    capacity: 8,
    equipment: ['projector', 'whiteboard'],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: 'b204',
    name: 'Room B-204',
    capacity: 16,
    equipment: ['projector', 'video conference'],
    blocked: false,
    bookings: [{ start: 660, end: 720 }],
  },
  {
    id: 'c310',
    name: 'Room C-310',
    capacity: 24,
    equipment: ['projector', 'whiteboard', 'video conference'],
    blocked: true,
    bookings: [],
  },
  {
    id: 'd120',
    name: 'Room D-120',
    capacity: 10,
    equipment: ['whiteboard'],
    blocked: false,
    bookings: [],
  },
];
