# User stories — Smart Campus study room booking

6 to 8 stories. Keep the shape exactly: ID, the As/I want/so that sentence, a priority, one
assumption. Roles are **Student** or **Administrator** only.

Delete the TODO lines as you fill them in — the checker treats a leftover TODO as unfinished work.

---

### US-01
**Story:** As a Student, I want to see which rooms are free and for which time slots, so that I can choose a room and time before booking.
**Priority:** High
**Assumption:** Availability can be viewed for any future date/time; past time slots are not shown as bookable.

### US-02
**Story:** As a Student, I want to reserve a free room for a specific time slot, so that I have guaranteed space for individual or group study.
**Priority:** High
**Assumption:** A booking request is rejected if it starts in the past (R1), exceeds two hours (R2), overlaps an existing booking for that room (R3), or targets a blocked room (R4).

### US-03
**Story:** As a Student, I want to cancel a booking I made, so that I free up the room for others if I no longer need it.
**Priority:** High
**Assumption:** A student can only cancel their own bookings, and only before the booking's start time.

### US-04
**Story:** As a Student, I want to receive a confirmation when my booking succeeds, so that I know the reservation is finalized and can rely on it.
**Priority:** Medium
**Assumption:** Confirmation is generated automatically by the system immediately after a successful booking, with no separate notification channel involved.

### US-05
**Story:** As a Student, I want to receive a confirmation when my cancellation succeeds, so that I know the room is released and I'm no longer responsible for it.
**Priority:** Medium
**Assumption:** Confirmation is shown only after the cancellation is successfully processed, not on failed attempts.

### US-06
**Story:** As an Administrator, I want to block a room, so that students cannot book it while it is unavailable.
**Priority:** High
**Assumption:** Blocking a room does not automatically cancel existing future bookings already made for that room.

### US-07
**Story:** As an Administrator, I want to unblock a room I previously blocked, so that students can book it again once it's usable.
**Priority:** Medium
**Assumption:** An unblocked room immediately becomes bookable subject to normal availability (R3), with no additional approval step.

### US-08
**Story:** As an Administrator, I want to view how rooms were booked over a chosen period, so that I can understand usage patterns across the library's rooms.
**Priority:** Medium
**Assumption:** Usage review covers booking counts and time slots per room over a selected date range, with no payment, attendance, or equipment data involved.

<!-- Add two more blocks in the same shape if you kept 7 or 8 stories. -->
