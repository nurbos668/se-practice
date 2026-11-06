# Week 07 — Lab report

**Name:** Nurbolsyn Tajikossov  
**Group:** Monday 16–19  
**Date:** 6 November 2026

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Project I continue (`week-06` = my Week 06 Bolt project, `starter` = the provided starter) | starter — no Week 06 project was included in the supplied archive |
| Bolt project link (or `not shared`, and why) | not shared — I used the provided starter, not a Bolt project |
| Assistant that generated the tests (tool) | ChatGPT via the Manus assistant |
| Exact model (with its version, or `not displayed`) | not displayed in this session |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | Manus Sandbox terminal; UI scenarios were run in Chromium with Playwright |
| Vitest version (the `RUN  v…` line of a run) | 3.2.4 |
| Test command | First: `npm test -- --reporter=verbose`; final and mutant runs: `npx vitest run --reporter=verbose` |

---

## 2. Task 1 — baseline and the booking function

**Before editing:** where did the booking decision live in the project you started from?

| | |
| --- | --- |
| File and function (or "inside the page component") | `starter/src/App.tsx`, inside `App()` in its `check()` function |
| Its inputs | Start, end and current time as `HH:MM` strings; blocked-room state; selected room's booking intervals |
| What it returned | A boolean local variable, then stored as the displayed availability result |
| How the page used it | `check()` evaluated the rules inline, then the component displayed Available or Unavailable |

**What I changed to extract `canBook`.**

I created `app/src/booking.ts` and moved the existing boolean decision into the exported `canBook({ start, end, now, blocked, bookings })` function. The page still converts the time strings to minutes and still owns the validation message; `app/src/App.tsx` now imports `canBook` and passes it the same values and the selected room's bookings. I kept the original rule order and conditions: interval bounds, start-after-now, maximum duration, blocked room and overlap. This makes the page and tests use the same implementation. No implementation fix was made in response to the first test failure; the incorrect expectation was repaired instead.

---

## 3. Task 2 — the test plan

Default fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`, fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in my words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | The request starts exactly when the existing booking ends, so the intervals only touch. |
| T02 | 540–570 (starts now) | false | AC1 | AC1 requires the start to be strictly after the supplied current time. |
| T03 | 720–720 (zero duration) | false | AC1 | Start and end are equal, but a valid interval must have start less than end. |
| T04 | 750–720 (reversed) | false | AC1 | The start is later than the end, so the interval order is invalid. |
| T05 | 1380–1441 (past day end) | false | AC1 | The requested end is 1441, which exceeds the allowed limit of 1440. |
| T06 | 720–840 (120 minutes) | true | AC2 | Exactly 120 minutes is not longer than the 120-minute maximum. |
| T07 | 720–841 (121 minutes) | false | AC2 | 121 minutes exceeds the maximum permitted duration of 120 minutes. |
| T08 | 570–600 (touching before) | true | AC4 | The request ends exactly when the existing booking starts, so it only touches. |
| T09 | 630–690 (partial overlap) | false | AC4 | The interval shares time with the existing booking from 630 to 660. |
| T10 | 570–690 (contains booking) | false | AC4 | This candidate covers the complete existing 600–660 booking interval. |
| T11 | 615–645 (inside booking) | false | AC4 | The whole candidate interval lies inside the existing booking. |
| T12 | 600–660 (identical interval) | false | AC4 | Identical intervals overlap for their entire duration. |
| T13 | 660–720, blocked = true | false | AC3 | AC3 rejects a request whenever the selected room is blocked. |
| T14 | 630–690, bookings = [] | true | AC4 | The request is after now, within the duration limit, and has no bookings to overlap. |
| AC5 | Available request; compare bookings before and after | true, data unchanged | AC5 | An availability check must not modify the existing booking data. |
| X1 | 1380–1440, now = 1379, bookings = [] | true | AC1 | The end equals the inclusive day limit 1440, while the start is after now. |
| X2 | 780–840; bookings = [{600–660}, {810–870}] | false | AC4 | The candidate overlaps the second booking even though it does not overlap the first. |

X1 and X2 are **your own two cases**: a boundary or a state that T01–T14 do not reach. Fill all
five columns.

---

## 4. Task 3 — the generation prompt and the first suite

**The prompt exactly as I sent it.** Use the deck's prompt with `[our test framework]` replaced by
`Vitest`, followed by the case table from section 3:

Note: I used the assistant in this task conversation rather than opening a separate fresh chat.

```text
Generate tests for the existing booking function using Vitest. Use AC1–AC6 and the reviewed case table below.

Import the real function used by the page. Keep its code unchanged. Use fixed time and fresh fixtures. Assert exact decisions and unchanged booking data.

Return the test file, run command, and AC mapping. Flag unclear requirements. We will run the tests ourselves.

T01: 660–720, expected true, AC4 — touching after the booking is allowed.
T02: 540–570, expected false, AC1 — start equals now.
T03: 720–720, expected false, AC1 — zero duration.
T04: 750–720, expected false, AC1 — reversed interval.
T05: 1380–1441, expected false, AC1 — end exceeds 1440.
T06: 720–840, expected true, AC2 — exactly 120 minutes.
T07: 720–841, expected false, AC2 — 121 minutes.
T08: 570–600, expected true, AC4 — touching before the booking.
T09: 630–690, expected false, AC4 — partial overlap.
T10: 570–690, expected false, AC4 — candidate contains booking.
T11: 615–645, expected false, AC4 — candidate inside booking.
T12: 600–660, expected false, AC4 — identical interval.
T13: 660–720, blocked=true, expected false, AC3.
T14: 630–690, bookings=[], expected true, AC4.
AC5: on an available request, assert that bookings equal a copy made before the call.
X1: 1380–1440, now=1379, bookings=[], expected true, AC1 — inclusive day-end boundary.
X2: 780–840, bookings=[{600–660},{810–870}], expected false, AC4 — overlap with second booking.
Default fixture: now=540, blocked=false, bookings=[{600–660}].
```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
Run command: npm test -- --reporter=verbose.
AC mapping: AC1—T02 to T05; AC2—T06 and T07; AC3—T13; AC4—T01, T08 to T12 and T14; AC5—the preservation test.
The returned suite contains T01–T14 and AC5 (15 tests); it does not include X1 or X2. It expects T06 (720–840) to be false. No unclear requirement was flagged in the answer; invalid existing-booking behavior is discussed separately in section 9.3.
```

The first suite was saved to `suites/first/` **before** I changed anything in it: yes / no

**Answer:** yes. The first file is retained separately; the revised copy is `app/src/booking.test.ts`.

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | T06, exactly 120 minutes | The first suite expected false even though 120 is not greater than the maximum; it is a wrong boundary expectation. | revise | AC2 rejects only a booking longer than 120 minutes; T06 must expect true. |
| 2 | Missing X1 and X2 | The suite omitted both required student-added cases, so the day-end boundary and second-booking overlap were not tested. | revise | The lab requires two additional cases beyond T01–T14; AC1 and AC4 define these expected results. |
| 3 | T01 and T08 touching endpoints | Exact true/false assertions exercise the correct non-overlap boundary and use the real module. | accept | AC4 explicitly allows touching endpoints. |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
 RUN  v3.2.4 /home/ubuntu/work/week-07/app
 ✓ src/booking.test.ts > T01 AC4: a request touching the booking after it is available 1ms
 ✓ src/booking.test.ts > T02 AC1: a request starting at the current time is unavailable 0ms
 ✓ src/booking.test.ts > T03 AC1: a zero-length interval is unavailable 0ms
 ✓ src/booking.test.ts > T04 AC1: a reversed interval is unavailable 0ms
 ✓ src/booking.test.ts > T05 AC1: an interval ending after midnight is unavailable 0ms
 × src/booking.test.ts > T06 AC2: a 120-minute booking is unavailable 6ms
   → expected true to be false // Object.is equality
 ✓ src/booking.test.ts > T07 AC2: a 121-minute booking is unavailable 0ms
 ✓ src/booking.test.ts > T08 AC4: a request touching the booking before it is available 0ms
 ✓ src/booking.test.ts > T09 AC4: a partial overlap is unavailable 0ms
 ✓ src/booking.test.ts > T10 AC4: a request containing an existing booking is unavailable 0ms
 ✓ src/booking.test.ts > T11 AC4: a request inside an existing booking is unavailable 0ms
 ✓ src/booking.test.ts > T12 AC4: an identical interval is unavailable 1ms
 ✓ src/booking.test.ts > T13 AC3: a blocked room is unavailable 0ms
 ✓ src/booking.test.ts > T14 AC4: a request with no existing bookings is available 0ms
 ✓ src/booking.test.ts > AC5: an available request leaves the booking data unchanged 0ms
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
 FAIL  src/booking.test.ts > T06 AC2: a 120-minute booking is unavailable
AssertionError: expected true to be false // Object.is equality
- Expected
+ Received
- false
+ true
 ❯ src/booking.test.ts:36:28
     34| 
     35| test('T06 AC2: a 120-minute booking is unavailable', () => {
     36|   expect(decide(720, 840)).toBe(false);
       |                            ^
     37| });
     38| 
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
 Test Files  1 failed (1)
      Tests  1 failed | 14 passed (15)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| T06 | Assertion mismatch: actual `canBook` result was true; first suite expected false. | Compare the expected value with AC2, not with the implementation output. | Test repair | Changed only T06 to expect true because exactly 120 minutes is allowed; no code fix was needed. |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
Review this test suite against AC1–AC6 and our case table. Identify incorrect expectations, weak assertions, duplicated cases, and missing boundaries.

For each proposed change, explain the requirement and the defect it could detect. Improve the tests without changing correct expectations to match buggy behavior.

Use the actual failure output below. Separate test repairs from implementation fixes.

 RUN  v3.2.4 /home/ubuntu/work/week-07/app
 × src/booking.test.ts > T06 AC2: a 120-minute booking is unavailable 6ms
   → expected true to be false // Object.is equality
 FAIL  src/booking.test.ts > T06 AC2: a 120-minute booking is unavailable
AssertionError: expected true to be false // Object.is equality
- Expected
+ Received
- false
+ true
      Tests  1 failed | 14 passed (15)
```

```text
T06's first-suite expectation is wrong: AC2 rejects only a duration greater than 120 minutes, so 720–840 must be expected true. This is a test repair; the implementation matches the criterion. Keep the exact assertions for T01 and T08 because AC4 permits touching endpoints. Add X1 for end=1440 and X2 for overlap with a second booking; these cover missing boundaries/states. Keep fresh fixtures and the AC5 before/after comparison. No duplicate or mocked test needs to be accepted, and no implementation fix is required.
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
 RUN  v3.2.4 /home/ubuntu/work/week-07/app
 ✓ src/booking.test.ts > T01 AC4: a request touching the booking after it is available 1ms
 ✓ src/booking.test.ts > T02 AC1: a request starting at the current time is unavailable 0ms
 ✓ src/booking.test.ts > T03 AC1: a zero-length interval is unavailable 0ms
 ✓ src/booking.test.ts > T04 AC1: a reversed interval is unavailable 0ms
 ✓ src/booking.test.ts > T05 AC1: an interval ending after midnight is unavailable 0ms
 ✓ src/booking.test.ts > T06 AC2: exactly 120 minutes is available 0ms
 ✓ src/booking.test.ts > T07 AC2: a 121-minute booking is unavailable 0ms
 ✓ src/booking.test.ts > T08 AC4: a request touching the booking before it is available 0ms
 ✓ src/booking.test.ts > T09 AC4: a partial overlap is unavailable 0ms
 ✓ src/booking.test.ts > T10 AC4: a request containing an existing booking is unavailable 0ms
 ✓ src/booking.test.ts > T11 AC4: a request inside an existing booking is unavailable 0ms
 ✓ src/booking.test.ts > T12 AC4: an identical interval is unavailable 0ms
 ✓ src/booking.test.ts > T13 AC3: a blocked room is unavailable 0ms
 ✓ src/booking.test.ts > T14 AC4: a request with no existing bookings is available 0ms
 ✓ src/booking.test.ts > AC5: an available request leaves the booking data unchanged 1ms
 ✓ src/booking.test.ts > X1 AC1: a valid interval may end exactly at 1440 0ms
 ✓ src/booking.test.ts > X2 AC4: a request overlapping the second of two bookings is unavailable 0ms
 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  08:33:37
   Duration  286ms (transform 37ms, setup 0ms, collect 32ms, tests 4ms, environment 0ms, prepare 65ms)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected | T06 | Not applicable — the exact 120-minute boundary assertion detected it. |
| M2 | Treat touching endpoints as an overlap | Detected | T01, T08, AC5 | Not applicable — both touching cases and the available AC5 request detected it. |
| M3 | Remove the blocked-room rejection | Detected | T13 | Not applicable — the blocked-room case detected it. |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
===== M1 — RUN v3.2.4 =====
× src/booking.test.ts > T06 AC2: exactly 120 minutes is available
FAIL  src/booking.test.ts > T06 AC2: exactly 120 minutes is available
      Tests  1 failed | 16 passed (17)

===== M2 — RUN v3.2.4 =====
× src/booking.test.ts > T01 AC4: a request touching the booking after it is available
× src/booking.test.ts > T08 AC4: a request touching the booking before it is available
× src/booking.test.ts > AC5: an available request leaves the booking data unchanged
FAIL  src/booking.test.ts > T01 AC4: a request touching the booking after it is available
FAIL  src/booking.test.ts > T08 AC4: a request touching the booking before it is available
FAIL  src/booking.test.ts > AC5: an available request leaves the booking data unchanged
      Tests  3 failed | 14 passed (17)

===== M3 — RUN v3.2.4 =====
× src/booking.test.ts > T13 AC3: a blocked room is unavailable
FAIL  src/booking.test.ts > T13 AC3: a blocked room is unavailable
      Tests  1 failed | 16 passed (17)
```

**All three changes reverted, and the full suite run again (section 6.3): yes.**

---

## 8. Task 7 — manual UI checks

The five scenarios below were executed in Chromium by the Manus assistant using Playwright. They are real browser observations, but they were not manually performed by the student; please review the screenshots before submission. Use `now = 09:00` and an existing `10:00–11:00` booking. Save a
screenshot of each as `evidence/ui-1.png` … `ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | The page showed Available and listed the unchanged 10:00–11:00 booking. | Pass |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | The prior Available result changed to Unavailable after Room blocked was enabled. | Pass |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | Clearing Start showed “Fill in the current time, the start and the end.” and removed the old result. | Pass |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | At 375×812 the controls stacked vertically; document width stayed 375 px with no horizontal overflow. | Pass |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | An available check and then an overlapping unavailable check left the 10:00–11:00 list unchanged. | Pass |

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | The local Week 07 checker is clean. Personal GitHub/repository details and student-authored reflection are still unconfirmed and are not represented as checker failures. |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | 15 / 14 / 1 | 17 / 17 / 0 |
| Requirements with meaningful tests (AC IDs and gaps) | T01–T05, T07–T14 and AC5; T06 had a wrong expectation, and X1/X2 were absent. | T01–T14, AC5, X1 and X2 with exact decisions and fresh fixtures. |
| Selected mutants detected | Mutants were not run against the first suite. | M1 by T06; M2 by T01/T08 and AC5; M3 by T13. |
| Accepted / revised / rejected tests | T01/T08 accepted; T06 revised; X1/X2 added because they were missing. | T06 corrected from AC2; X1/X2 added; other planned cases retained. |
| Remaining limitations | No tests for X1/X2; no policy for invalid existing booking data. | No AC defines invalid existing-booking behavior; app uses fictional in-memory data only. |

### 9.3 What no AC decides

For `bookings = [{ start: 700, end: 650 }]`, a 660–720 request returns **true**. I ran the real function with these values. None of AC1–AC6 defines how an invalid existing booking must be handled. The current overlap condition does not treat the reversed 700–650 interval as overlapping, so the function allows the request. A future requirement could reject malformed stored bookings, but that behavior should be specified before changing the rule.

---

## 10. Conclusion (120–180 words)

**AI-generated conclusion, at the student's request (disclosed in AI_USAGE.md):** The first suite's T06 case expected a 120-minute booking to be rejected. That expectation conflicts with AC2, which rejects bookings longer than 120 minutes, not one lasting exactly 120. The first Vitest run exposed the mismatch, so the test expectation was corrected while the implementation remained unchanged. The final run reports 17 passing tests covering the stated interval rules, the blocked-room case, overlaps, and preservation of existing booking data. That result supports confidence only in the assertions and inputs actually tested; it does not prove correctness for every possible interval or guarantee a usable page in every browser. The three mutation runs show that this suite detects the selected duration, endpoint, and blocked-room defects. The browser checks also showed the page remains usable at 375-pixel width and gives feedback for a blank field. One unresolved limit is that no acceptance criterion defines invalid existing booking data: with a reversed booking, canBook currently returns true. The app also uses fictional in-memory bookings rather than persistence.
