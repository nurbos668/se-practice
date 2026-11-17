# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 10.), every
     ### sub-heading and every **Label:** word — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and starting point

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Starting point: week-08 | week-07 | sis-03 | starter   (README section 3)
     Baseline commit: the commit that brings your starting point into sis-04/app/ UNCHANGED —
     git rev-parse --short HEAD right after that commit. It is your "initial version". -->

| Item | Value |
| --- | --- |
| Assistant (tool) | Manus assistant |
| Assistant model | not displayed |
| Starting point | week-08 |
| Baseline commit | 890351a |
| Language (ts or js) | ts |
| Vitest version | 3.2.4 |
| Where I ran the tests | Manus cloud sandbox (Linux) |

### 1.1 Baseline run

<!-- Before you change anything: run the tests of your starting point inside app/ and paste the
     REAL output. No tests yet (starter, sis-03)? Paste the run anyway: Vitest prints
     "No test files found". That is your honest "original" number, 0/0. -->

```text
 RUN  v3.2.4 /home/ubuntu/work/se-practice-sis04/sis-04/app

 ✓ src/booking.test.ts (19 tests) 3ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  09:43:41
   Duration  215ms (transform 27ms, setup 0ms, collect 24ms, tests 3ms, environment 0ms, prepare 43ms)
```

## 2. Context for the assistant

### 2.1 Repository map

<!-- The concise map you gave the assistant: the files that matter and one line each on what
     they do. A tree is fine:  src/App.tsx — the page, holds the rooms and the form … -->

```text
app/src/App.tsx — React page: two-room catalog, time inputs, global blocked checkbox, error/result state; calls canBook.
app/src/booking.ts — pure canBook({start, end, now, blocked, bookings}) implementing AC1–AC5.
app/src/booking.test.ts — 19 real Vitest regression tests for AC1–AC5 and earlier edge cases.
app/src/index.css — page layout, result/error colors and one narrow-screen media query.
app/src/main.tsx — mounts App and imports the stylesheet.
app/package.json — React/Vite/TypeScript/Vitest dependencies and dev, test, build scripts.
```

### 2.2 The context message as sent

<!-- The whole first message of your analysis chat: the map, AC1–AC6, F1–F5 and the constraints
     (no login, payments, live APIs or database; fictional data only). Unedited. -->

```text
This is a fresh analysis-only assistant context for SIS #04. Do not edit any files and do not write code.

Repository map from the unchanged Week 08 starting point:
- `app/src/App.tsx`: React page; contains the two-room catalog, form state, current-time parsing, global `blocked` checkbox, validation/result handling, and calls `canBook` with the selected room's bookings.
- `app/src/booking.ts`: pure `canBook` function implementing time validity, future-time, 120-minute limit, blocked flag and strict overlap check.
- `app/src/booking.test.ts`: 19 real Vitest tests for AC1–AC5 and earlier regression cases.
- `app/src/index.css`: basic flex layout with one mobile media query at 480px.
- `app/src/main.tsx`: mounts `App` and imports CSS.
- `app/package.json`: React, Vite, TypeScript and Vitest; `npm run dev`, `npm test`, `npm run build`.

Observed baseline details: `App.tsx` has only two rooms (lines 10–13), keeps a single page-level `blocked` state (line 24 and checkbox near line 64), and contains both room data and UI logic. It also keeps `toMinutes`, display formatting, form validation and result state in the page. `booking.ts` is already a separate pure module. The baseline suite passed 19/19.

Requirements:
AC1 reject start >= end and requests in the past. AC2 maximum duration 120 minutes. AC3 blocked room unavailable. AC4 reject overlaps but allow endpoint-touching bookings. AC5 availability checking does not mutate booking data. AC6 clear responsive desktop/mobile feedback.
F1 room capacity >= attendees. F2 room has ALL selected equipment. F3 blocked room never Available. F4 clear empty state when nothing matches. F5 switching selected room uses that room's own blocked status and bookings and refreshes result.
At least four fictional rooms; modules named exactly `src/rooms.ts` (Room + ROOMS), `src/booking.ts` (`canBook` unchanged plus `checkRoom`), `src/filter.ts` (`filterRooms`), and UI with no room data or duplicated rules. At least 10 executable Vitest tests, preserving original AC1–AC5 and including F1–F5, B1–B6, and INT. No network, storage, login, payment, backend, live API, or added dependency unless necessary. Keep solution small. Blocked rooms may remain visible with a label or be hidden; choose one and explain.

Please return: (1) at least three concrete maintainability risks with file/line evidence and priority; (2) a short, prioritised, small-step plan, baseline first and no code until the plan is committed; (3) one optional design decision and its tradeoff. Distinguish observed facts from assumptions. Do not propose a full rewrite or add libraries.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

<!-- At least three, found in YOUR starting code. "Where" names a file or a function(),
     e.g. src/App.tsx, check(). Evidence is what you saw, not what the assistant said.
     Priority: High / Medium / Low. -->

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | The room catalog is too small and coupled to the page | `src/App.tsx:8–13` | `Room` and `ROOMS` are declared in the UI, and only two rooms exist; new catalog/filter requirements would expand the component. | High |
| 2 | A page-level blocked flag can disagree with the selected room | `src/App.tsx:24, 48, 64` | `check()` passes one global `blocked` state while bookings come from the selected room, so F3/F5 are not represented by one room record. | High |
| 3 | Invalid time order still produces a result | `src/App.tsx:42–49` | The page sets an error when `s >= e` but does not return; it then calls `canBook` and sets an Unavailable result too. | Medium |
| 4 | A stale comment describes the old design | `src/App.tsx:4–6` | The comment says the availability decision lives inside the component although the file imports `canBook` from `booking.ts`. | Low |

### 3.2 Improvement plan — before editing

<!-- Numbered, in the order you will do it, smallest safe step first. Written BEFORE you change
     code: the commit that adds this section comes before the commit that changes app/src. -->

1. Keep the Week 08 baseline and AC1–AC5 suite. Before each new rule, add a deterministic test using a fixed room fixture, run it to see the failure, then implement only the needed module/function and rerun the full suite.
2. Add `src/rooms.ts` with a `Room` type and four fictional rooms, each with its own ID, name, capacity, equipment, blocked status and bookings.
3. Add pure `filterRooms` in `src/filter.ts` for capacity and all-required equipment; cover F1, F2, F4, B5 and B6 with tests.
4. Add `checkRoom` to `src/booking.ts` without changing `canBook`; look up the selected room and call `canBook` with that room's own blocked flag and bookings. Test F3, F5 and INT, including an unknown ID.
5. Make `App.tsx` coordinate the filters and selected room, keep blocked rooms visible with a label, clear stale results when inputs/room change, and return after invalid time input. Keep rules and catalog out of the UI.
6. Finish responsive styling, `app/README.md`, before/after PlantUML diagrams and five real UI screenshots; run Vitest, build, checker and validator, and record only measured results.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| Put capacity and equipment checks inside `checkRoom` | Modified | Keep F1/F2 in `filterRooms`; `checkRoom` should only find the chosen room and call `canBook` with its own data, as README §7 specifies. This keeps the two responsibilities and their tests separate. |

## 4. Feature extension (Task 2)

### 4.1 What I added

The catalog contains four fictional rooms: A-101 (8 seats, projector and whiteboard), B-204 (16, projector and video conference), C-310 (24, projector, whiteboard and video conference; blocked), and D-120 (10, whiteboard). Users set minimum attendees and tick equipment requirements; the filter requires every selected item. Blocked rooms remain visible with a “Blocked” label. The empty state says no rooms match and suggests changing the filters. Filter and time changes clear stale feedback; when a room changes after a result exists, the same request is checked immediately against the new room.

### 4.2 Demonstration

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | Attendees = 10 and projector selected; exactly B-204 and blocked C-310 match. |
| `evidence/filter-empty.png` | Attendees = 50 with projector selected; count is 0 and the empty-state message is visible. |
| `evidence/switch-a.png` | A-101 selected; now 09:00, request 11:00–12:00; result is Available. |
| `evidence/switch-b.png` | Same times, B-204 selected; result refreshes immediately to Unavailable because its own booking is 11:00–12:00. |
| `evidence/narrow.png` | Fresh page at 375px portrait width; controls/cards stack in one column with no horizontal overflow. |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | `Room` type and four fictional records, each with capacity, equipment, blocked status and bookings. |
| `src/booking.ts` | Existing pure `canBook` rules plus `checkRoom`, which looks up one room and delegates to `canBook`. |
| `src/filter.ts` | Pure `filterRooms` for capacity and all selected equipment. |
| `src/App.tsx` | UI state, input conversion, room selection and rendering; imports the catalog and domain functions. |
| `src/main.tsx` / `src/index.css` | Mounts the page and provides responsive presentation styles. |

### 5.2 Design decisions

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Keep blocked rooms visible with a “Blocked” badge | Hide blocked rooms from the matches | F3 still prevents booking; keeping the room visible explains why it cannot be Available and keeps the catalog transparent. |
| Separate `filterRooms` from `checkRoom` | Put filtering and booking availability in one function | The brief assigns F1/F2 to `filterRooms` and selected-room availability to `checkRoom`; separate tests pinpoint which rule failed. |
| Recalculate an existing result when a different room is selected | Clear the result and require another button press | F5 asks the selected room to refresh the result; using the same times makes the changed result visible immediately. |

### 5.3 Duplication removed

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| None found in the baseline: searched `App.tsx` and `booking.ts` for repeated availability checks, time validation and list rendering; each was implemented once. | 0 duplicated locations removed; the refactor separates responsibilities but does not claim duplicate code was eliminated. |

## 6. Automated tests (Task 4)

### 6.1 Test plan

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | `T02 AC1`, `T03 AC1`, `T04 AC1`, `T05 AC1` | Start at now, zero/reversed interval, or end 1441 → false. |
| AC2 | `T06 B1 AC2`, `T07 B2 AC2` | 120 minutes → true; 121 minutes → false. |
| AC3 | `T13 AC3` and `F3` | `blocked=true` / blocked room → false. |
| AC4 | `T01 B3 AC4`, `T08 AC4`, `T09 B4 AC4` | Endpoint touch → true; overlap → false. |
| AC5 | `AC5: an available request leaves the booking data unchanged` | Available request → true; bookings array equals its copy. |
| F1 | `F1 B5`, `F1 B6` | Capacity 8 for 8 attendees included; capacity 8 for 9 attendees excluded. |
| F2 | `F2: a room must have all selected equipment` | Projector + whiteboard → only A-101 and C-310. |
| F3 | `F3: a blocked selected room is never available` | Blocked C-310 → false. |
| F4 | `F4: no matching room returns an empty list` | 25 attendees → empty array; UI screenshot shows the message. |
| F5 | `F5: the selected room supplies its own bookings`; `F5: an unknown room id is unavailable` | Same 11:00–12:00 request: A-101 true, B-204 false; unknown ID → false. |
| B1 | `T06 B1 AC2` | Exactly 120 minutes → true. |
| B2 | `T07 B2 AC2` | 121 minutes → false. |
| B3 | `T01 B3 AC4` | Request touches booking endpoint → true. |
| B4 | `T09 B4 AC4` | Partial overlap → false. |
| B5 | `F1 B5` | Capacity equals attendee count → included. |
| B6 | `F1 B6` | Capacity one below attendee count → excluded. |
| INT | `INT: a filtered room is checked with its own booking data` | Filter returns B-204; `checkRoom` uses its booking and returns false. |

### 6.2 Commands

```text
npx vitest run
npm run build
```

### 6.3 Final run

```text
 RUN  v3.2.4 /home/ubuntu/work/se-practice-sis04/sis-04/app

 ✓ src/booking.test.ts (27 tests) 5ms

 Test Files  1 passed (1)
      Tests  27 passed (27)
   Start at  10:08:35
   Duration  240ms (transform 37ms, setup 0ms, collect 36ms, tests 5ms, environment 0ms, prepare 40ms)
```

## 7. Quality evaluation (Task 5)

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 19/19 | 27/27 | Vitest `Tests` lines in sections 1.1 and 6.3. |
| Duplicated logic locations removed | 0 identified | 0 | Counted and explained in section 5.3; no repeated implementation was present in the baseline. |
| Code structure: modules and their responsibilities | 5 source files: `App`, `booking`, `booking.test`, `index.css`, `main` | 7 source files: previous 5 plus `rooms` and `filter` | `git ls-files sis-04/app/src` at baseline commit 890351a and final code. |
| Remaining limitation | One-room-style demo; no live data | Four fictional in-memory rooms; no persistence/live campus API. `npm install` also reported 5 dependency vulnerabilities (2 moderate, 1 high, 2 critical); no forced audit fix was attempted. | Task scope excludes backend/live data; vulnerability counts are copied from the real `npm install` summary. |

## 8. AI evidence appendix

### 8.1 Exchange 1

**Tool and model:** Manus assistant; model not displayed
**Date:** 2026-11-17
**Purpose:** Analyze the untouched baseline and ask for a small plan before code changes.

**Prompt:**

```text
This is a fresh analysis-only assistant context for SIS #04. Do not edit any files and do not write code.

Repository map from the unchanged Week 08 starting point:
- `app/src/App.tsx`: React page; contains the two-room catalog, form state, current-time parsing, global `blocked` checkbox, validation/result handling, and calls `canBook` with the selected room's bookings.
- `app/src/booking.ts`: pure `canBook` function implementing time validity, future-time, 120-minute limit, blocked flag and strict overlap check.
- `app/src/booking.test.ts`: 19 real Vitest tests for AC1–AC5 and earlier regression cases.
- `app/src/index.css`: basic flex layout with one mobile media query at 480px.
- `app/src/main.tsx`: mounts `App` and imports CSS.
- `app/package.json`: React, Vite, TypeScript and Vitest; `npm run dev`, `npm test`, `npm run build`.

Observed baseline details: `App.tsx` has only two rooms (lines 10–13), keeps a single page-level `blocked` state (line 24 and checkbox near line 64), and contains both room data and UI logic. It also keeps `toMinutes`, display formatting, form validation and result state in the page. `booking.ts` is already a separate pure module. The baseline suite passed 19/19.

Requirements:
AC1 reject start >= end and requests in the past. AC2 maximum duration 120 minutes. AC3 blocked room unavailable. AC4 reject overlaps but allow endpoint-touching bookings. AC5 availability checking does not mutate booking data. AC6 clear responsive desktop/mobile feedback.
F1 room capacity >= attendees. F2 room has ALL selected equipment. F3 blocked room never Available. F4 clear empty state when nothing matches. F5 switching selected room uses that room's own blocked status and bookings and refreshes result.
At least four fictional rooms; modules named exactly `src/rooms.ts` (Room + ROOMS), `src/booking.ts` (`canBook` unchanged plus `checkRoom`), `src/filter.ts` (`filterRooms`), and UI with no room data or duplicated rules. At least 10 executable Vitest tests, preserving original AC1–AC5 and including F1–F5, B1–B6, and INT. No network, storage, login, payment, backend, live API, or added dependency unless necessary. Keep solution small. Blocked rooms may remain visible with a label or be hidden; choose one and explain.

Please return: (1) at least three concrete maintainability risks with file/line evidence and priority; (2) a short, prioritised, small-step plan, baseline first and no code until the plan is committed; (3) one optional design decision and its tradeoff. Distinguish observed facts from assumptions. Do not propose a full rewrite or add libraries.
```

**Output used (summary):**

```text
The analysis identified the global page-level `blocked` value as a risk because it can disagree with the selected room, and recommended keeping blocked rooms visible with a clear label. It also pointed out that the page owns catalog, domain types, parsing and formatting.
```

**Problems found:** The suggested plan put capacity/equipment matching inside `checkRoom`, but the brief assigns F1/F2 to `filterRooms` and room availability to `checkRoom`.
**Changes made:** Kept catalog, filters and availability as separate steps. Committed baseline 890351a, then the analysis/plan as 4a3acdb before editing `app/src`.
**Verified by:** Inspected the cited baseline code and ran the original suite: 19/19 passed; the plan was compared with README §7.

### 8.2 Exchange 2

**Tool and model:** Manus assistant; model not displayed
**Date:** 2026-11-17
**Purpose:** Get minimal module contracts and an edge case after the plan commit.

**Prompt:**

```text
We have committed the SIS #04 analysis and plan before any source edits. Starting point is Week 08 (TypeScript), baseline 19/19. Keep this small and do not edit files.

Requirements summary: `rooms.ts` exports `Room` and `ROOMS` with 4+ fictional rooms; each has id, name, capacity, equipment, blocked and its own bookings. `filter.ts` exports `filterRooms(rooms, {attendees,equipment})`, capacity >= requested and ALL selected equipment, returning [] for no matches. `booking.ts` keeps the existing `canBook` unchanged and adds `checkRoom(rooms, roomId, request)`; find by id, return false if unknown, and call canBook with that selected room's own blocked/bookings. No mutation. UI displays matched rooms, keeps blocked rooms visible with a label, shows empty state, uses selected room and clears stale result when selection/filters/time change. No new packages.

I will write tests and observe failures before implementing. Please suggest concise TypeScript module contracts and one likely edge case to guard against. Do not provide a full App rewrite, extra dependencies, or claim you've tested code.
```

**Output used (summary):**

```text
Keep `canBook` unchanged; make `filterRooms` require `capacity >= attendees` and every selected item; make `checkRoom` look up the chosen room, use its own `blocked` and `bookings`, and return false for an unknown ID. The no-equipment-selected case should include every capacity-qualified room.
```

**Problems found:** The assistant did not execute or verify code; I treated its module contracts as guidance and checked them against the task requirements before coding.
**Changes made:** Wrote fixed-fixture tests first; the initial red run failed because `./filter` did not exist. Added `rooms.ts`, `filter.ts` and `checkRoom`, kept `canBook` unchanged, then wired the UI. After review, added an unknown-ID test and immediate room-switch recalculation.
**Verified by:** Final Vitest run 27/27, TypeScript/Vite build passed, and Playwright checked matching/empty filters, A-101/B-204/C-310 results and 375px portrait layout.

### 8.3 Exchange 3

**Tool and model:** Manus assistant; model not displayed
**Date:** 2026-11-17
**Purpose:** Review the implemented modules and test coverage against the SIS requirements.

**Prompt:**

```text
This is the third SIS #04 assistant exchange, a review-only check after implementation. Do not edit files and do not claim to run commands yourself.

Inspect the current project files under `/home/ubuntu/work/se-practice-sis04/sis-04/app/src` and compare them with the exact SIS requirements: `Room`/four-room `ROOMS`; `filterRooms` capacity >= attendees and ALL selected equipment; unchanged `canBook` AC1–AC5 plus `checkRoom(rooms, roomId, request)` using the selected room's own blocked/bookings, false for unknown IDs; UI imports modules, has empty state and refreshes result on room changes; tests use fixed fixtures, real modules, no mocks/skips, include AC1–AC5, F1–F5, B1–B6 and INT.

Actual recorded results so far: Vitest 26/26 passed after the UI change; `npm run build` passed; a Playwright check saw 2 rooms for attendees=10 + projector, the empty state at 50 attendees, A101 Available and B204 Unavailable for the same 11:00–12:00 request, C310 blocked and Unavailable, and no horizontal overflow at 375px. Five named screenshots are in `sis-04/evidence/`.

Return only concrete verified observations, any genuine remaining risks/test gaps, and one practical suggestion for the report. Keep it short. Do not infer personal student review or claim this is ready for submission.
```

**Output used:**

```text
Verified from source: `ROOMS` defines four rooms; `filterRooms` enforces capacity >= attendees and every selected equipment item. `checkRoom` resolves the requested room and passes that room’s blocked/bookings, returning false if absent.
[…]
Genuine gap: there is no explicit test for `checkRoom` returning false for an unknown room ID. Room selection clears the prior result rather than automatically rechecking.
No commands were run during this review.
```

**Problems found:** The reviewer correctly identified the missing unknown-ID regression and that the UI only cleared the result on room change.
**Changes made:** Added the unknown-room test, changed room selection to recalculate an existing result immediately, and recaptured `switch-b.png` without pressing Check again.
**Verified by:** Vitest passed 27/27, build passed, and Playwright confirmed B-204 immediately shows Unavailable for the same 11:00–12:00 request after A-101 showed Available.

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| none | No checker checks failed in the latest run. |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

While working on the project, I answered five questions that helped me reflect on what I did and draw conclusions for the future.

First, I created a map of the project files. It included the results of the initial tests, the booking rules and catalog requirements, as well as the project’s filters and constraints. This map helped me understand the structure of the application and avoid getting lost among the files.

Second, it was very useful to split the code into separate parts: room data, booking validation, filtering, and other modules. Now each part is responsible for its own task, the code is easier to read, and making changes is simpler and safer.

Third, I verified the result in several ways: I ran the checkers, built the project, and went through the browser scenario. This confirmed that the application works not only in theory but also in real use.

Fourth, I evaluated which tests influenced my decisions. They helped me verify the starting rules, add a check for an unknown room, and make sure that different rooms are actually used in booking. Thanks to this, I was able to find weak spots early and fix them.

Finally, fifth, I thought about what to improve next time. The main conclusion is this: first check every small change, and only then, step by step, improve the project as a whole. This approach reduces the risk of errors, saves time, and makes development calmer and more consistent.

In summary, working on this project taught me to act step by step, rely on tests, and carefully verify the result at every stage.
