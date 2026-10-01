# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them. Replace every `<...>`
> placeholder; a row that still contains `<...>` counts as empty.

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name | Tajikossov Nurbolsyn |
| AI assistant | Gemini (drafts of the three diagrams and the critique); Claude helped with the review and the wording of this report |
| Exact model | Gemini Flash 3.6 (drafts and critique); Claude Sonnet 5.5 (review and wording) |
| Renderer | PlantUML web server |
| Behaviour diagram | activity |
| Stories used | the reference set from README §3 (my Week 03 stories number the rules differently from R1-R4 and have a cancellation confirmation that the scenario does not have, so I kept the reference set) |

---

## 2. Prompts as sent

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The
AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```text
Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.
```

### 2.2 Task 2 — class prompt

```text
Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
Generate a UML activity diagram in PlantUML for Book room. Show the initial node, actions, guarded decisions, and final nodes. Check the time range, blocked-room status, and overlapping bookings. Show confirmation after success and rejection after failure. Use branches rather than parallel paths unless concurrency is required.
```

### 2.4 Focused correction prompts (if you sent any)

```text
none
```

### 2.5 Critique prompt

```text
Compare my diagrams with the requirements. Identify missing rules, inconsistent names, and unjustified elements. Cite each issue and propose a specific correction.
```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:** I saved only the PlantUML code of the first reply, so the AI's text part (its assumptions) is not in `models/original/use-case.puml`. The code itself states none.

At least **two** findings. A finding names the element, the problem and the rule or story that
proves it is a problem.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Receive booking confirmation, with the include arrow from US-01: Book a study room | Confirmation is what the system does after a booking succeeds. No actor sets out to get it, so it is an outcome, not a user goal. The include also had no `' why:` line above it, which the conventions require. | R4 (a successful booking produces a confirmation), US-01 | Removed the use case and the include. R4 is now a note on Book room. |
| 2 | Use case names such as "US-01: Book a study room" and "US-02: View free rooms" | The story ID is inside the name, so the diagram shows a story number instead of a goal. "View free rooms" also drops the word availability that the scenario uses (the checker UC4 failed on it). | Scenario sentence "view room availability", US-02 | Renamed to plain goals: View room availability, Book room, Cancel own booking, Block room, Unblock room, Review room usage. The story IDs are traced in §7. |
| 3 | The six actor links (Student to 3 goals, Administrator to 3 goals) | I checked each link. Student is linked only to view, book and cancel; Administrator only to block, unblock and review. No admin goal on Student and no booking on Administrator. | US-01 to US-06, scenario | No change. These links are correct. |

---

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

One row per association in your **revised** class diagram.

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student — Booking | one student makes 0..* bookings | each booking belongs to exactly 1 student | 1 / 0..* |
| Booking — Room | each booking reserves exactly 1 room | one room has 0..* bookings (a new room has none yet) | 0..* / 1 |

### 4.2 Constraints the multiplicities cannot show

- R2: a note on Booking says that active bookings of the same room must not overlap. A multiplicity cannot say this, because it counts bookings but does not compare their times. The note also says touching bookings do not overlap (A1).
- R1: Booking has startTime and endTime, and the operation hasValidTimeRange checks that the start is in the future and the length is more than 0 and at most 2 hours. The note on Booking repeats it.
- R3: Room has the flag blocked. The behaviour diagram reads it.
- R4: the note on Booking says a successful booking produces a confirmation (see A3).

### 4.3 Assumptions

- A1: Touching bookings do not overlap. A booking 10:00-12:00 and a booking 12:00-13:00 for the same room can both be active. A time range includes its start and excludes its end.
- A2: Blocking a room does not cancel or change the bookings that already exist. R3 only stops new bookings.
- A3: The confirmation is a message returned when the booking succeeds. It is not stored, so there is no Confirmation class.
- A4: Only ACTIVE bookings count for R2. A CANCELLED booking frees the time slot.

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Class Administrator and the association Administrator 0..* to 0..* Room "manages" | No story or rule says which administrator manages which room. US-04 and US-05 only need the administrator as an actor. The many-to-many link invents data nobody asked for. | US-04, US-05, prompt "add other classes only when requirements justify them" | Deleted the class and the association. |
| 2 | Class Booking (only bookingId and status) and class TimeSlot with association Booking 1 to 1 TimeSlot | Booking had no start or end, so R1 and R2 cannot be checked on it. TimeSlot was split off as its own class, but a time slot is never shared between bookings, so 1 to 1 just means "two halves of one object". | R1, R2 | Moved startTime and endTime into Booking, deleted TimeSlot, added hasValidTimeRange and overlapsWith on Booking. |
| 3 | Operations on Student (viewFreeRooms, bookRoom, cancelBooking) and on Administrator (blockRoom, unblockRoom, reviewRoomUsage returning the undefined UsageReport) | These are use cases written as methods on the people. A room is blocked by Room.block, a booking is cancelled by Booking.cancel. UsageReport is not a domain concept in any story. | US-03, US-04, US-05, US-06 | Removed them. Room keeps block, unblock and isAvailable. Booking keeps cancel. |
| 4 | Class Confirmation and association Booking 1 to 1 Confirmation, plus Booking.generateConfirmation | R4 asks for a confirmation to be produced. No story asks to store it or look it up later. | R4, US-01 | Deleted the class. R4 is in the note on Booking and in A3. |
| 5 | Missing note for R2 | R2 was not stated anywhere (checker CL8 failed). Multiplicities cannot show "no overlap". | R2 | Added the note on Booking. |
| 6 | Association Student 1 to 0..* Booking and Booking 0..* to 1 Room | I read both sentences for each (see 4.1). Both are correct, the Booking end is 0..* on both, not 1..*. | US-01, US-03 | No change. |

---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** 3B activity. The three checks (R1, R3, R2) happen one after another, and an activity diagram shows each decision and the exact reason for a rejection.

**Design components added beyond the domain model:** none (activity diagram, no lifelines).

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Guards "then (yes)" and "else (no / overlap detected)" on all three decisions | The guards had no square brackets. The convention for activity diagrams is brackets inside the parentheses, and the "no / ..." texts mixed an answer with a reason. | Conventions in README §4, R1, R2, R3 | Guards are now ([yes]) and ([no]). The reason is written in the reject action. |
| 2 | Reject action "Set error: Invalid duration or start time" | It does not say what R1 asks for, and the diagram never says it is R1. The student cannot know what to change. | R1 | The action now says: start must be in the future and length 1 minute to 2 hours (R1). The R2 and R3 rejects also name their rule. |
| 3 | Decision "No overlapping active booking for selected Room? [R2]" | It does not show what happens with touching bookings, so assumption A1 was invisible. | R2, A1 | The question is now "Overlaps an active booking of this room? (R2)" and a note under the first action says touching bookings do not overlap. The diagram also has a title that says it covers only Book room. |
| 4 | Rule tags typed as "[R1]" and "AND" inside the question text | Typed square brackets inside the question mix with the guard brackets. | Conventions in README §4 | Rule tags written as (R1), (R3), (R2), like the handout example. |
| 5 | Order of the steps: R1, then R3, then R2, then create, then confirmation | I checked this. Three separate decisions, no fork, booking created only after the last check, confirmation only on success, a reject on every failure. | R1, R2, R3, R4 | No change. The order is correct. |

---

## 6. AI critique

Run the critique prompt once, on all your revised diagrams together. At least **three** rows. A
critique is another claim to evaluate, not a verdict: reject what is wrong and say why.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | Booking.isValid is on the wrong class: a booking cannot know the room status, so move validation to Room or a new BookingService | class.puml, Booking.hasValidTimeRange (was isValid) and activity.puml | reject | The claim is wrong about what the operation does. R1 depends only on startTime and endTime, which are on Booking. R3 is on Room (blocked) and R2 is Booking.overlapsWith, so no room state is needed. BookingService is a design class and does not belong in a domain model (CL6). The only fair point is the vague name, so I renamed it to hasValidTimeRange. |
| 2 | US-02 and US-06 are not supported: availability across bookings is "not clearly modeled", and there is no getUsageReport(period) method | class.puml, Room.isAvailable and the missing report for US-06 | reject | The association Booking 0..* to 1 Room is exactly what lets Room.isAvailable look at its ACTIVE bookings (A4). US-06 reads startTime, endTime and status of existing bookings (see §7). A report class or a DateRange type would be a new invented concept, the same kind of mistake as the UsageReport in the AI's first class draft. |
| 3 | The activity diagram only models Book room, so cancellation and R2 release are implied; add a scope note, or a state diagram for cancel | activity.puml against US-03 | accept | The scope note is a fair, cheap fix: I added a title saying the diagram covers only Book room (US-01). I reject the extra state diagram, because the task asks for one behaviour diagram and A4 already says a CANCELLED booking frees the slot. |
| 4 | Student has private attributes but no getters, so a booking cannot be traced to its student or used for R4 and US-06 | class.puml, Student attributes | reject | Getters are an implementation detail and not a domain concept. The link to the student is already the association Student 1 to 0..* Booking. R4 and US-06 do not need any Student operation. |

---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | Book room | Booking (startTime, endTime, hasValidTimeRange) and the note on Booking | Decision "Valid time range? (R1)" and the reject action for R1 |
| R2 | Book room | Booking (startTime, endTime, status, overlapsWith) and the R2 note on Booking | Decision "Overlaps an active booking of this room? (R2)" and the reject action for R2 |
| R3 | Block room | Room (blocked, block, unblock) | Decision "Room blocked? (R3)" and the reject action for R3 |
| R4 | Book room | Booking (note about the confirmation, A3) | Actions "Produce booking confirmation (R4)" and "Show confirmation to student" |
| US-01 | Book room | Student, Booking, Room | The whole activity diagram: request, R1, R3, R2, create booking, confirmation |
| US-02 | View room availability | Room (isAvailable), Booking (startTime, endTime, status) | Not shown. The activity diagram covers only Book room. |
| US-03 | Cancel own booking | Student, Booking (cancel, status CANCELLED) | Not shown. The activity diagram covers only Book room. |
| US-04 | Block room | Room (blocked, block) | Not a step of Book room, but the decision "Room blocked? (R3)" reads the flag it sets |
| US-05 | Unblock room | Room (blocked, unblock) | Not a step of Book room, but after it the R3 decision no longer rejects |
| US-06 | Review room usage | Booking (startTime, endTime, status), Room | Not shown. The activity diagram covers only Book room. |

---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | use case | Seven use cases, including Receive booking confirmation with an include from Book a study room and no why comment | Six use cases, no confirmation use case, no include, a note on Book room about R4 | R4: confirmation is an outcome of booking, not an actor goal. |
| 2 | use case | Names with story IDs, such as "US-02: View free rooms" | Plain goal names, such as "View room availability" | The scenario speaks about availability. IDs belong in the §7 table. |
| 3 | class | Seven classes: Student, Administrator, Room, Booking, TimeSlot, Confirmation and the enum BookingStatus | Student, Room, Booking and the enum BookingStatus. Start and end times moved into Booking. | R1 and R2 need times on Booking. No story needs Administrator, TimeSlot or Confirmation as classes. |
| 4 | class | No note for R2. Operations such as bookRoom and reviewRoomUsage on Student and Administrator. | A note on Booking for R2 (and R1, R4). Operations only on Room and Booking. | R2 cannot be a multiplicity. Behaviour belongs to the domain objects. |
| 5 | activity | Guards "(yes)" and "(no / ...)", vague R1 reject text, rule tags typed as [R1] inside the question | Guards ([yes]) and ([no]), reject texts that name the rule, tags written as (R1), a note for touching bookings, a title saying it covers only Book room | Conventions in README §4, and the student must know why a booking was rejected. |

---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
<paste the full output>
```

**FAILs I am keeping, and why:** <one line per check ID, or "none">

---

## 10. Conclusion (120–180 words)

The AI got the class diagram most wrong. It added Administrator, TimeSlot and Confirmation classes that no story asks for, and Booking had no start and no end. That last error would have reached the code: with only a bookingId and a status, nobody can implement R1 (future start, at most 2 hours) or R2 (no overlap). The use-case draft had a "Receive booking confirmation" goal that no actor wants, because R4 makes the confirmation a result of booking. The activity draft was the best: it already had separate decisions for R1, R3 and R2, so I only fixed the guards and the reject texts. The critique found two small things I missed: the name isValid did not say it covers only R1, and the activity diagram did not say it covers only Book room. It also falsely said availability is not modelled, although Booking 0..* to 1 Room is there, and it asked for a BookingService and a report method, which are design and invented classes.
