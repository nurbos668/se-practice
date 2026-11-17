import type { Room } from './rooms';

export type RoomFilter = {
  attendees: number;
  equipment: string[];
};

export function filterRooms(rooms: Room[], criteria: RoomFilter): Room[] {
  return rooms.filter(room =>
    room.capacity >= criteria.attendees &&
    criteria.equipment.every(item => room.equipment.includes(item)),
  );
}
