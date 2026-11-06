# Week 08 — Lab report

**Name:** Nurbolsyn Tajikossov
**Group:** Monday 16–19
**Date:** 6 November 2026

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I debugged with (tool) | Manus assistant |
| Exact model (with its version, or `not displayed`) | not displayed |
| Where the skill was installed (ChatGPT / Claude web / Claude Code / prompt-only simulation) | prompt-only simulation; not installed |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | Manus cloud sandbox, in `week-08/app/` |
| Vitest version (the `RUN  v…` line of a run) | 3.2.4 |
| Language of my booking module (`ts` or `js`) — the file I copied from `buggy/` | ts |

---

## 2. Task 1 — baseline, buggy code, failing tests

### 2.1 My Week 07 suite on my own code

The **real** output of your Week 07 suite, run in `week-08/app/` **before** you replace
anything. It should be green. If it is not, say why under the block.

```text
RUN  v3.2.4 /home/ubuntu/work/se-practice-github/week-08/app

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
   Start at  09:11:44
   Duration  326ms (transform 45ms, setup 0ms, collect 41ms, tests 5ms, environment 0ms, prepare 58ms)
```

### 2.2 The same suite on the provided canBook

You copied the whole `canBook` function from `buggy/booking.ts` (or `.js`) over yours and changed
nothing else. This is the real output:

```text
RUN  v3.2.4 /home/ubuntu/work/se-practice-github/week-08/app

 × src/booking.test.ts > T01 AC4: a request touching the booking after it is available 8ms
   → expected false to be true // Object.is equality
 ✓ src/booking.test.ts > T02 AC1: a request starting at the current time is unavailable 0ms
 ✓ src/booking.test.ts > T03 AC1: a zero-length interval is unavailable 0ms
 ✓ src/booking.test.ts > T04 AC1: a reversed interval is unavailable 0ms
 ✓ src/booking.test.ts > T05 AC1: an interval ending after midnight is unavailable 0ms
 ✓ src/booking.test.ts > T06 AC2: exactly 120 minutes is available 0ms
 ✓ src/booking.test.ts > T07 AC2: a 121-minute booking is unavailable 0ms
 × src/booking.test.ts > T08 AC4: a request touching the booking before it is available 1ms
   → expected false to be true // Object.is equality
 ✓ src/booking.test.ts > T09 AC4: a partial overlap is unavailable 0ms
 ✓ src/booking.test.ts > T10 AC4: a request containing an existing booking is unavailable 0ms
 ✓ src/booking.test.ts > T11 AC4: a request inside an existing booking is unavailable 0ms
 ✓ src/booking.test.ts > T12 AC4: an identical interval is unavailable 0ms
 ✓ src/booking.test.ts > T13 AC3: a blocked room is unavailable 0ms
 ✓ src/booking.test.ts > T14 AC4: a request with no existing bookings is available 0ms
 × src/booking.test.ts > AC5: an available request leaves the booking data unchanged 1ms
   → expected false to be true // Object.is equality
 ✓ src/booking.test.ts > X1 AC1: a valid interval may end exactly at 1440 0ms
 ✓ src/booking.test.ts > X2 AC4: a request overlapping the second of two bookings is unavailable 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > T01 AC4: a request touching the booking after it is available
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:16:28
     14| 
     15| test('T01 AC4: a request touching the booking after it is available', …
     16|   expect(decide(660, 720)).toBe(true);
       |                            ^
     17| });
     18| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯

 FAIL  src/booking.test.ts > T08 AC4: a request touching the booking before it is available
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:44:28
     42| 
     43| test('T08 AC4: a request touching the booking before it is available',…
     44|   expect(decide(570, 600)).toBe(true);
       |                            ^
     45| });
     46| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯

 FAIL  src/booking.test.ts > AC5: an available request leaves the booking data unchanged
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:76:21
     74|   const available = canBook({ start: 660, end: 720, now: 540, blocked:…
     75| 
     76|   expect(available).toBe(true);
       |                     ^
     77|   expect(bookings).toEqual(before);
     78| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯


 Test Files  1 failed (1)
      Tests  3 failed | 14 passed (17)
   Start at  09:23:02
   Duration  353ms (transform 41ms, setup 0ms, collect 37ms, tests 13ms, environment 0ms, prepare 91ms)
```

### 2.3 One failing test per bug

Add the two regression tests from README Part 1, step 5: one named `BUG-A` and one named `BUG-B`.
Run them **on the buggy code**. Both must fail here. That is the evidence that each test can see
its bug.

```text
RUN  v3.2.4 /home/ubuntu/work/se-practice-github/week-08/app

 × src/booking.test.ts > T01 AC4: a request touching the booking after it is available 7ms
   → expected false to be true // Object.is equality
 ✓ src/booking.test.ts > T02 AC1: a request starting at the current time is unavailable 0ms
 ✓ src/booking.test.ts > T03 AC1: a zero-length interval is unavailable 0ms
 ✓ src/booking.test.ts > T04 AC1: a reversed interval is unavailable 0ms
 ✓ src/booking.test.ts > T05 AC1: an interval ending after midnight is unavailable 0ms
 ✓ src/booking.test.ts > T06 AC2: exactly 120 minutes is available 0ms
 ✓ src/booking.test.ts > T07 AC2: a 121-minute booking is unavailable 0ms
 × src/booking.test.ts > T08 AC4: a request touching the booking before it is available 1ms
   → expected false to be true // Object.is equality
 ✓ src/booking.test.ts > T09 AC4: a partial overlap is unavailable 0ms
 ✓ src/booking.test.ts > T10 AC4: a request containing an existing booking is unavailable 0ms
 ✓ src/booking.test.ts > T11 AC4: a request inside an existing booking is unavailable 0ms
 ✓ src/booking.test.ts > T12 AC4: an identical interval is unavailable 0ms
 ✓ src/booking.test.ts > T13 AC3: a blocked room is unavailable 0ms
 ✓ src/booking.test.ts > T14 AC4: a request with no existing bookings is available 0ms
 × src/booking.test.ts > AC5: an available request leaves the booking data unchanged 1ms
   → expected false to be true // Object.is equality
 ✓ src/booking.test.ts > X1 AC1: a valid interval may end exactly at 1440 0ms
 ✓ src/booking.test.ts > X2 AC4: a request overlapping the second of two bookings is unavailable 0ms
 × src/booking.test.ts > BUG-A: a request touching two adjacent bookings is available 0ms
   → expected false to be true // Object.is equality
 × src/booking.test.ts > BUG-B: an available request leaves the booking data unchanged 3ms
   → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 5 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > T01 AC4: a request touching the booking after it is available
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:16:28
     14| 
     15| test('T01 AC4: a request touching the booking after it is available', …
     16|   expect(decide(660, 720)).toBe(true);
       |                            ^
     17| });
     18| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/5]⎯

 FAIL  src/booking.test.ts > T08 AC4: a request touching the booking before it is available
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:44:28
     42| 
     43| test('T08 AC4: a request touching the booking before it is available',…
     44|   expect(decide(570, 600)).toBe(true);
       |                            ^
     45| });
     46| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/5]⎯

 FAIL  src/booking.test.ts > AC5: an available request leaves the booking data unchanged
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:76:21
     74|   const available = canBook({ start: 660, end: 720, now: 540, blocked:…
     75| 
     76|   expect(available).toBe(true);
       |                     ^
     77|   expect(bookings).toEqual(before);
     78| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/5]⎯

 FAIL  src/booking.test.ts > BUG-A: a request touching two adjacent bookings is available
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:96:21
     94|   const available = canBook({ start: 660, end: 720, now: 540, blocked:…
     95| 
     96|   expect(available).toBe(true);
       |                     ^
     97| });
     98| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/5]⎯

 FAIL  src/booking.test.ts > BUG-B: an available request leaves the booking data unchanged
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 860,
+     "start": 800,
+   },
  ]

 ❯ src/booking.test.ts:105:20
    103| 
    104|   expect(available).toBe(true);
    105|   expect(bookings).toEqual(before);
       |                    ^
    106| });
    107| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/5]⎯


 Test Files  1 failed (1)
      Tests  5 failed | 14 passed (19)
   Start at  09:23:56
   Duration  327ms (transform 40ms, setup 0ms, collect 35ms, tests 15ms, environment 0ms, prepare 54ms)
```

---

## 3. Defect log

**Note about authorship:** Nurbolsyn said he was unsure and asked the assistant to complete this section. These are AI-assisted, after-the-run explanations, not the student's own pre-assistant hypotheses required by the worksheet.

One row per defect. At least **BUG-A and BUG-B**. "Suspected cause" is your hypothesis
**before** you ask any assistant: the line and why.

| Defect | Test ID | Input | Expected | Actual | Suspected cause (line and why) |
| --- | --- | --- | --- | --- | --- |
| BUG-A | T01 | 660–720 touches existing 600–660 | true | false | AI-assisted after the run: line 17 uses inclusive comparisons, so equality at 660 is treated as an overlap. |
| BUG-B | BUG-B | 800–860 with existing 600–660 | true and bookings unchanged | true, but `{start: 800, end: 860}` is appended | AI-assisted after the run: line 20 pushes into the caller's array; the isolated test confirms the mutation. |

---

## 4. Tasks 2–3 — the skill

**The checks from the deck, before you zip it.** Answer each one yes / no:

| Check | yes / no |
| --- | --- |
| The file is plain UTF-8 text, named exactly `SKILL.md` (not `SKILL.md.txt`) | yes |
| The first and the closing YAML delimiter are exactly three hyphens: `---` | yes |
| `name` is lowercase with hyphens, and `description` says WHEN to use it | yes |
| I read the whole file once: no passwords, API keys or private student data | yes |

*The assistant checked the full file for private data; the student has not confirmed personal review.*

**The contents of `skills/bug-detector.zip`.** Paste the listing (Windows: open the ZIP and copy
the paths; macOS/Linux: `unzip -l skills/bug-detector.zip`):

```text
Archive:  bug-detector.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
        0  2026-11-06 09:24   bug-detector/
      570  2026-11-06 09:24   bug-detector/SKILL.md
---------                     -------
      570                     2 files
```

**Installation.** Where you uploaded it, what the upload said, and whether a new chat showed the
skill as enabled. If upload was not available, write `prompt-only simulation` and say why.
Screenshot of the result: `evidence/install.png`.

<!-- Write below this line -->

The ChatGPT Skills page opened at sign-in, so the ZIP was not uploaded or installed. The assistant wrote `SKILL.md` from the deck-provided text; the student did not hand-type it or confirm a review. The fallback was a prompt-only simulation in a fresh Manus assistant context, with the skill text supplied as instructions rather than loaded as an installed skill. No genuine browser screenshot of the simulation was available, so E1 is reported as a known failure in §9.1 rather than replaced with a fabricated image.

---

## 5. Task 4 — without the skill

A fresh Manus assistant context had no skill loaded. The user message below contains the deck's
question and shared input; the assistant was asked not to edit code and to answer in simple English:

```text
Find the root cause of the failed room-booking test. Propose minimal patch and regression test. Do not edit code.

AC1: reject start >= end and requests in the past.
AC2: enforce maximum duration 120 minutes.
AC3: reject a blocked room.
AC4: reject overlaps; allow bookings that only touch at endpoints.
AC5: return Available/Unavailable without changing booking data.
AC6: preserve clear UI feedback on desktop and mobile.
Observed single failing test: T01 AC4, candidate start=660, end=720, now=540, blocked=false, existing bookings=[{start:600,end:660}], expected true, actual false (Vitest: expected false to be true).
Provided TypeScript code:
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
    if (start <= b.end && end >= b.start) return false;
  }
  bookings.push({ start, end });
  return true;
}

Explain the likely root cause, identify the line, suggest the smallest patch, and propose one regression test with expected result. Separate what the T01 failure proves from any other defect you notice.
```

**The assistant's answer, pasted unedited:**

```text
The likely root cause is the overlap check: `if (start <= b.end && end >= b.start) return false;`. The inclusive comparisons treat bookings that touch at an endpoint as overlapping. In T01, the candidate starts at 660 and the existing booking ends at 660, so the first comparison is true and the function incorrectly rejects it.

**Smallest patch:** use strict comparisons for overlap: `if (start < b.end && end > b.start) return false;`. This still rejects intervals that actually overlap, while allowing endpoint-touching bookings.

**Regression test:** call `canBook` with `start: 660`, `end: 720`, `now: 540`, `blocked: false`, and `bookings: [{ start: 600, end: 660 }]`; expect `true`.

**What T01 proves:** the current logic rejects this endpoint-touching case, contrary to AC4. It does not establish failures in the other listed acceptance criteria. Separately, the function mutates `bookings` with `bookings.push({ start, end })` on success. That appears inconsistent with AC5’s no-booking-data-change requirement and is a distinct defect; T01 does not demonstrate it. A targeted regression test should snapshot the input bookings, call `canBook`, and assert the array remains unchanged; the minimal behavioral fix is to remove the `push` from this availability check.
```

---

## 6. Task 5 — with the skill

This was a prompt-only simulation, not an installed skill: the exact `SKILL.md` text from §4 was
supplied first in a fresh Manus assistant context. Then the user message below used the same input
as §5; only the deck question changed. The environment did not show skill invocation:

```text
Use the bug-detector skill to diagnose the failed room-booking test.

AC1: reject start >= end and requests in the past.
AC2: enforce maximum duration 120 minutes.
AC3: reject a blocked room.
AC4: reject overlaps; allow bookings that only touch at endpoints.
AC5: return Available/Unavailable without changing booking data.
AC6: preserve clear UI feedback on desktop and mobile.
Observed single failing test: T01 AC4, candidate start=660, end=720, now=540, blocked=false, existing bookings=[{start:600,end:660}], expected true, actual false (Vitest: expected false to be true).
Provided TypeScript code:
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
    if (start <= b.end && end >= b.start) return false;
  }
  bookings.push({ start, end });
  return true;
}

Explain the likely root cause, identify the line, suggest the smallest patch, and propose one regression test with expected result. Separate what the T01 failure proves from any other defect you notice.
```

**The assistant's answer, pasted unedited:**

````text
**Defect (T01):** A booking that starts exactly when an existing booking ends is incorrectly rejected.

**Evidence:** For the test input, `start=660` and the existing booking ends at `660`. The overlap check is `if (start <= b.end && end >= b.start) return false;`. Its first comparison is true (`660 <= 660`), and its second is also true, so the function returns `false` although endpoint-touching bookings should be allowed.

**Root cause:** The overlap condition treats shared endpoints as overlap. The T01 failure confirms this boundary-condition defect for the supplied case; it does not establish whether other booking cases fail.

**Smallest fix:** Change the overlap condition to strict inequalities:
```ts
if (start < b.end && end > b.start) return false;
```

**Regression test:** With `start=660`, `end=720`, `now=540`, `blocked=false`, and `bookings=[{start:600,end:660}]`, expect `canBook(...)` to return `true`.

**Separate issue:** The function also calls `bookings.push({ start, end })` before returning `true`. That mutates booking data, contrary to AC5’s requirement to report availability without changing it. This is visible in the code but is not what caused T01: the failing test returns at the overlap check before reaching the push. Remove the push for a pure availability check, and test that calling the function leaves the input bookings unchanged.
````

Did the environment show that the skill was invoked? yes / no / not shown

---

## 7. Comparison — judged against the actual code

Do not assume the skill did better. Judge both answers against the code and against what your
tests showed. Write a short verdict in each cell, and give a reason where they differ.

| Criterion | No skill | With skill |
| --- | --- | --- |
| Correct root cause | Correctly identifies inclusive endpoint comparisons; also notices the separate mutation in the code. | Correctly identifies the same comparison and separates the confirmed T01 cause from the separate mutation. |
| Reproducible test | Gives the exact T01 endpoint case; its separate AC5 test is suggested, not run by the response. | Gives the same endpoint case and suggests an unchanged-array test plus extra boundary cases; suggestions are not claimed as run. |
| Minimal proposed patch | One-line change to strict overlap comparisons. | Same one-line change; also recommends removing the separate `push`. |
| Unsupported claims | No unsupported claim about T01; correctly says it does not prove the mutation issue. | No unsupported claim about T01; labels mutation as separate from the observed failure. |
| Clarity of explanation | Clear and short. | More structured and explicit about evidence versus a second issue. |

**Which bugs did each answer find?** (BUG-A, BUG-B, both, neither)

Both noticed BUG-A and BUG-B in the code. Only BUG-A is proved by T01; the separate BUG-B regression test proves the mutation.

---

## 8. Task 6 — repair and regression

Review the proposed patch yourself, then make **one minimal change per bug**, one commit each.
Rerun the test that was failing, then the full suite.

### 8.1 The BUG-A patch

The change as a diff (`git diff`, or the old and the new line), then the real run:

```text
$ git show --format= --no-color 9f2206a -- week-08/app/src/booking.ts
diff --git a/week-08/app/src/booking.ts b/week-08/app/src/booking.ts
index 83fc391..db3c8cc 100644
--- a/week-08/app/src/booking.ts
+++ b/week-08/app/src/booking.ts
@@ -20,7 +20,7 @@ export function canBook({ start, end, now, blocked, bookings }: {
   if (end - start > 120) return false;
   if (blocked) return false;
   for (const b of bookings) {
-    if (start <= b.end && end >= b.start) return false;
+    if (start < b.end && end > b.start) return false;
   }
   // keep the room's list current with the slot that was just found free
   bookings.push({ start, end });

$ npx vitest run -t BUG-A --reporter=verbose
RUN  v3.2.4 /home/ubuntu/work/se-practice-github/week-08/app

 ↓ src/booking.test.ts > T01 AC4: a request touching the booking after it is available
 ↓ src/booking.test.ts > T02 AC1: a request starting at the current time is unavailable
 ↓ src/booking.test.ts > T03 AC1: a zero-length interval is unavailable
 ↓ src/booking.test.ts > T04 AC1: a reversed interval is unavailable
 ↓ src/booking.test.ts > T05 AC1: an interval ending after midnight is unavailable
 ↓ src/booking.test.ts > T06 AC2: exactly 120 minutes is available
 ↓ src/booking.test.ts > T07 AC2: a 121-minute booking is unavailable
 ↓ src/booking.test.ts > T08 AC4: a request touching the booking before it is available
 ↓ src/booking.test.ts > T09 AC4: a partial overlap is unavailable
 ↓ src/booking.test.ts > T10 AC4: a request containing an existing booking is unavailable
 ↓ src/booking.test.ts > T11 AC4: a request inside an existing booking is unavailable
 ↓ src/booking.test.ts > T12 AC4: an identical interval is unavailable
 ↓ src/booking.test.ts > T13 AC3: a blocked room is unavailable
 ↓ src/booking.test.ts > T14 AC4: a request with no existing bookings is available
 ↓ src/booking.test.ts > AC5: an available request leaves the booking data unchanged
 ↓ src/booking.test.ts > X1 AC1: a valid interval may end exactly at 1440
 ↓ src/booking.test.ts > X2 AC4: a request overlapping the second of two bookings is unavailable
 ✓ src/booking.test.ts > BUG-A: a request touching two adjacent bookings is available 2ms
 ↓ src/booking.test.ts > BUG-B: an available request leaves the booking data unchanged

 Test Files  1 passed (1)
      Tests  1 passed | 18 skipped (19)
   Start at  09:27:14
   Duration  328ms (transform 44ms, setup 0ms, collect 41ms, tests 4ms, environment 0ms, prepare 84ms)

$ npx vitest run --reporter=verbose (after BUG-A only)
RUN  v3.2.4 /home/ubuntu/work/se-practice-github/week-08/app

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
 × src/booking.test.ts > AC5: an available request leaves the booking data unchanged 8ms
   → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]
 ✓ src/booking.test.ts > X1 AC1: a valid interval may end exactly at 1440 0ms
 ✓ src/booking.test.ts > X2 AC4: a request overlapping the second of two bookings is unavailable 0ms
 ✓ src/booking.test.ts > BUG-A: a request touching two adjacent bookings is available 0ms
 × src/booking.test.ts > BUG-B: an available request leaves the booking data unchanged 1ms
   → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > AC5: an available request leaves the booking data unchanged
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 720,
+     "start": 660,
+   },
  ]

 ❯ src/booking.test.ts:77:20
     75| 
     76|   expect(available).toBe(true);
     77|   expect(bookings).toEqual(before);
       |                    ^
     78| });
     79| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  src/booking.test.ts > BUG-B: an available request leaves the booking data unchanged
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 860,
+     "start": 800,
+   },
  ]

 ❯ src/booking.test.ts:105:20
    103| 
    104|   expect(available).toBe(true);
    105|   expect(bookings).toEqual(before);
       |                    ^
    106| });
    107| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed (1)
      Tests  2 failed | 17 passed (19)
   Start at  09:27:15
   Duration  318ms (transform 41ms, setup 0ms, collect 36ms, tests 14ms, environment 0ms, prepare 55ms)
```

### 8.2 The BUG-B patch and the final run

The change as a diff, then the real output of the **full** suite. Every test must pass.

```text
$ git show --format= --no-color 3e86366 -- week-08/app/src/booking.ts
diff --git a/week-08/app/src/booking.ts b/week-08/app/src/booking.ts
index db3c8cc..0f83758 100644
--- a/week-08/app/src/booking.ts
+++ b/week-08/app/src/booking.ts
@@ -22,7 +22,5 @@ export function canBook({ start, end, now, blocked, bookings }: {
   for (const b of bookings) {
     if (start < b.end && end > b.start) return false;
   }
-  // keep the room's list current with the slot that was just found free
-  bookings.push({ start, end });
   return true;
 }

$ npx vitest run -t BUG-B --reporter=verbose
RUN  v3.2.4 /home/ubuntu/work/se-practice-github/week-08/app

 ↓ src/booking.test.ts > T01 AC4: a request touching the booking after it is available
 ↓ src/booking.test.ts > T02 AC1: a request starting at the current time is unavailable
 ↓ src/booking.test.ts > T03 AC1: a zero-length interval is unavailable
 ↓ src/booking.test.ts > T04 AC1: a reversed interval is unavailable
 ↓ src/booking.test.ts > T05 AC1: an interval ending after midnight is unavailable
 ↓ src/booking.test.ts > T06 AC2: exactly 120 minutes is available
 ↓ src/booking.test.ts > T07 AC2: a 121-minute booking is unavailable
 ↓ src/booking.test.ts > T08 AC4: a request touching the booking before it is available
 ↓ src/booking.test.ts > T09 AC4: a partial overlap is unavailable
 ↓ src/booking.test.ts > T10 AC4: a request containing an existing booking is unavailable
 ↓ src/booking.test.ts > T11 AC4: a request inside an existing booking is unavailable
 ↓ src/booking.test.ts > T12 AC4: an identical interval is unavailable
 ↓ src/booking.test.ts > T13 AC3: a blocked room is unavailable
 ↓ src/booking.test.ts > T14 AC4: a request with no existing bookings is available
 ↓ src/booking.test.ts > AC5: an available request leaves the booking data unchanged
 ↓ src/booking.test.ts > X1 AC1: a valid interval may end exactly at 1440
 ↓ src/booking.test.ts > X2 AC4: a request overlapping the second of two bookings is unavailable
 ↓ src/booking.test.ts > BUG-A: a request touching two adjacent bookings is available
 ✓ src/booking.test.ts > BUG-B: an available request leaves the booking data unchanged 2ms

 Test Files  1 passed (1)
      Tests  1 passed | 18 skipped (19)
   Start at  09:27:55
   Duration  323ms (transform 41ms, setup 0ms, collect 35ms, tests 3ms, environment 0ms, prepare 63ms)

$ npx vitest run --reporter=verbose
RUN  v3.2.4 /home/ubuntu/work/se-practice-github/week-08/app

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
 ✓ src/booking.test.ts > BUG-A: a request touching two adjacent bookings is available 0ms
 ✓ src/booking.test.ts > BUG-B: an available request leaves the booking data unchanged 0ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  09:27:57
   Duration  301ms (transform 41ms, setup 0ms, collect 36ms, tests 5ms, environment 0ms, prepare 59ms)

$ npm run build
> smart-campus-availability@0.0.0 build
> tsc && vite build

vite v5.4.21 building for production...
transforming...
✓ 32 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.42 kB │ gzip:  0.28 kB
dist/assets/index-X8OGNIvT.css    0.66 kB │ gzip:  0.36 kB
dist/assets/index-D9kEtwvx.js   144.75 kB │ gzip: 46.63 kB
✓ built in 663ms
```

---

## 9. What still fails, and what AI-assisted debugging cannot do

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| E1 | The ChatGPT Skills page required sign-in, so no ZIP upload or genuine prompt-only screenshot was available. The prompt-only diagnosis was run in a fresh Manus assistant context; no screenshot was fabricated. |

### 9.2 One limitation of AI-assisted debugging

<!-- Use something that actually happened in sections 5-8. 20 words or more. -->

**AI-assisted draft; student review is not confirmed.**

T01 failed before `bookings.push` because the endpoint check returned false, so the original AC5 test could not isolate BUG-B. The separate 800–860 test was needed to expose the mutation. The ChatGPT Skills page also required sign-in, which prevented uploading the ZIP and capturing a genuine screenshot of the prompt-only simulation.

---

## 10. Conclusion (80–150 words)

<!-- Answer both, in your own words, without the assistant (3-5 sentences, as the deck asks):
     (a) Did the skill help? Show it with one row of section 7.
     (b) What did your tests actually prove - and what did they not?
     Worthless: "The skill made the AI much better at debugging."
     Worth everything: "Both answers found BUG-A from the T01 failure. Only the skill answer
     separated BUG-B as a hypothesis instead of a fact, because step 4 told it to. BUG-B was only
     visible after the BUG-A patch: the AC5 test had been failing for the wrong reason." -->

**AI-assisted draft; student review and signature are not confirmed.**

The prompt-only simulation helped a little: both answers found BUG-A, but the skill answer separated the T01 evidence from the separate BUG-B issue more clearly. After the overlap comparison was changed, T01, T08 and BUG-A passed, while AC5 and BUG-B still failed because the function appended the new slot to the input list. Removing that mutation made all 19 tests pass, and the production build also succeeded. These runs prove the two defects in the supplied function and show that the regression tests catch them; they do not prove every booking case is covered or that a prompt-only simulation behaves like an installed skill.
