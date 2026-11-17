import { useState } from 'react';
import { checkRoom } from './booking';
import { filterRooms } from './filter';
import { ROOMS } from './rooms';

const EQUIPMENT_OPTIONS = Array.from(new Set(ROOMS.flatMap(room => room.equipment))).sort();

const toMinutes = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

const formatTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

export default function App() {
  const [attendees, setAttendees] = useState(8);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [roomId, setRoomId] = useState(ROOMS[0]?.id ?? '');
  const [now, setNow] = useState('09:00');
  const [start, setStart] = useState('11:00');
  const [end, setEnd] = useState('12:00');
  const [endOfDay, setEndOfDay] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const matchingRooms = filterRooms(ROOMS, { attendees, equipment });
  const selectedRoom = matchingRooms.find(room => room.id === roomId) ?? matchingRooms[0];

  function clearFeedback() {
    setResult(null);
    setError('');
  }

  function toggleEquipment(item: string) {
    setEquipment(current =>
      current.includes(item) ? current.filter(value => value !== item) : [...current, item],
    );
    clearFeedback();
  }

  function checkAvailability() {
    clearFeedback();
    if (!selectedRoom) return;
    if (!now || !start || (!end && !endOfDay)) {
      setError('Enter the current time, start and end.');
      return;
    }

    setResult(checkRoom(ROOMS, selectedRoom.id, {
      start: toMinutes(start),
      end: endOfDay ? 1440 : toMinutes(end),
      now: toMinutes(now),
    }));
  }

  return (
    <main className="page">
      <header className="page-header">
        <p className="eyebrow">SMART CAMPUS</p>
        <h1>Room availability</h1>
        <p className="intro">Find a room that fits your group and equipment needs.</p>
      </header>

      <section className="panel" aria-labelledby="filter-title">
        <h2 id="filter-title">Filter rooms</h2>
        <label className="attendees-field">
          Attendees
          <input
            type="number"
            min="1"
            value={attendees}
            onChange={event => {
              setAttendees(Math.max(1, Number(event.target.value) || 1));
              clearFeedback();
            }}
          />
        </label>
        <fieldset className="equipment-field">
          <legend>Required equipment</legend>
          <div className="equipment-options">
            {EQUIPMENT_OPTIONS.map(item => (
              <label className="check-option" key={item}>
                <input
                  type="checkbox"
                  checked={equipment.includes(item)}
                  onChange={() => toggleEquipment(item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section className="panel" aria-labelledby="rooms-title">
        <div className="section-heading">
          <h2 id="rooms-title">Matching rooms</h2>
          <span className="count">{matchingRooms.length}</span>
        </div>
        {matchingRooms.length === 0 ? (
          <p className="empty-state" role="status">
            No rooms match these filters. Try fewer attendees or remove an equipment requirement.
          </p>
        ) : (
          <div className="room-grid">
            {matchingRooms.map(room => (
              <label className={`room-option${selectedRoom?.id === room.id ? ' selected' : ''}`} key={room.id}>
                <input
                  type="radio"
                  name="selected-room"
                  value={room.id}
                  checked={selectedRoom?.id === room.id}
                  onChange={() => {
                    setRoomId(room.id);
                    setError('');
                    setResult(result !== null && now && start && (end || endOfDay)
                      ? checkRoom(ROOMS, room.id, {
                          start: toMinutes(start),
                          end: endOfDay ? 1440 : toMinutes(end),
                          now: toMinutes(now),
                        })
                      : null);
                  }}
                />
                <span className="room-copy">
                  <span className="room-title">
                    <strong>{room.name}</strong>
                    {room.blocked && <span className="blocked-badge">Blocked</span>}
                  </span>
                  <span className="room-meta">{room.capacity} seats · {room.equipment.join(', ')}</span>
                </span>
              </label>
            ))}
          </div>
        )}
      </section>

      <section className="panel" aria-labelledby="request-title">
        <h2 id="request-title">Check a time</h2>
        <div className="time-grid">
          <label>
            Current time
            <input type="time" value={now} onChange={event => { setNow(event.target.value); clearFeedback(); }} />
          </label>
          <label>
            Start
            <input type="time" value={start} onChange={event => { setStart(event.target.value); clearFeedback(); }} />
          </label>
          <label>
            End
            <input type="time" value={end} disabled={endOfDay} onChange={event => { setEnd(event.target.value); clearFeedback(); }} />
          </label>
        </div>
        <label className="check-option end-of-day">
          <input type="checkbox" checked={endOfDay} onChange={event => { setEndOfDay(event.target.checked); clearFeedback(); }} />
          <span>Ends at 24:00</span>
        </label>
        <button type="button" onClick={checkAvailability} disabled={!selectedRoom}>
          Check availability
        </button>
        {error && <p className="error" role="alert">{error}</p>}
        {result !== null && (
          <p className={`result ${result ? 'available' : 'unavailable'}`} role="status">
            {result ? 'Available' : 'Unavailable'}
          </p>
        )}
        {selectedRoom && (
          <div className="bookings">
            <h3>Existing bookings — {selectedRoom.name}</h3>
            {selectedRoom.bookings.length ? (
              <ul>{selectedRoom.bookings.map((booking, index) => (
                <li key={`${booking.start}-${index}`}>{formatTime(booking.start)}–{formatTime(booking.end)}</li>
              ))}</ul>
            ) : <p>None</p>}
          </div>
        )}
      </section>
      <footer>Room data is fictional for this practice.</footer>
    </main>
  );
}
