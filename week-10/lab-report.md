# Week 10 — Lab report

**Name:** Nurbolsyn Tajikossov  
**Group:** Monday 16–19  
**Date:** 20 November 2026

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I reviewed with (tool) | Manus chat assistant |
| Exact model (with its version, or `not displayed`) | not displayed |
| Where the assistant read the project | Chat with project files and excerpts provided in the conversation |
| Starting point (`week-08` or `week-07`) | week-08 |
| Baseline commit — the checkpoint of Part 0 | f05d838 |
| Where I ran the tests | Manus Sandbox terminal, inside `week-10/app/` |
| Vitest version | 3.2.4 |

---

## 2. Task 1 — the baseline

### 2.1 The project's commands

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | yes | pass | Vitest 3.2.4; 19 tests passed. |
| `npm test` | yes | pass | Script is `vitest run`; 19 tests passed. |
| `npm run test:unit` (the test command in `AGENTS.md`) | no | missing | No such script in `package.json`. |
| `npm run build` | yes | pass | `tsc && vite build` completed. |
| `npm run lint` | no | missing | No lint script, ESLint dependency or configuration. |

`npm install` completed and reported five npm audit advisories (2 moderate, 1 high and 2 critical). I left dependency upgrades for a separate review; see §4.1 and §7.3.

### 2.2 The baseline test run

The **real** output of `npx vitest run` in `week-10/app/`, before any change:

```text
 RUN  v3.2.4 /home/ubuntu/work/se-practice-sis04/week-10/app
 ✓ src/booking.test.ts (19 tests) 4ms
 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  09:04:20
   Duration  223ms (transform 32ms, setup 0ms, collect 32ms, tests 4ms, environment 0ms, prepare 37ms)
```

### 2.3 The agent reads the playbook

What you sent, exactly (the Practice #09 prompt):

```text
Read the root AGENTS.md before making changes. Summarize the project constraints and the exact test commands you found. Do not edit anything yet. If you cannot read AGENTS.md, tell me, and I will paste its content. Do not claim that AGENTS.md was automatically loaded.
```

The assistant's answer, pasted unedited:

```text
The project is a React and TypeScript page built with Vite. The availability function is `canBook` in `src/booking.ts`, the page is `src/App.tsx`, and the tests are in `src/booking.test.ts`. The playbook says to use real room names and the real KBTU timetable, permits adding a Supabase database and a login page if persistence is needed, and lists AC1–AC5. It says touching endpoints count as overlaps. The exact commands it lists are `npm install`, `npm run dev`, `npm run test:unit`, `npm run build`, and `npx netlify deploy --prod`. I was given the file text; I am not claiming it was automatically loaded.
```

Which rules in its summary are wrong for this project, and how you know:

The assignment requires one fictional room, no login or database, no secrets, and no external deployment. The playbook contradicts those limits. AC4 is wrong because a request that only touches a booking endpoint must be allowed. AC6 is missing. `npm run test:unit` does not exist; `package.json` has `npm test` instead. The production Netlify command is outside scope and must be forbidden.

---

## 3. Tasks 2–3 — the read-only review and the challenge

### 3.1 The review prompt and the answer

Where it ran, and how you made sure it could not edit:

I used a chat response with the relevant project files pasted into the conversation, not an editor-connected coding session. No file-edit operation was used while producing this review; the review itself was text only. The assistant's ability to edit files was not technically disabled by a separate permission setting, so I do not claim a stronger guarantee than that.

What you sent, exactly (the deck's prompt):

```text
Act as a cautious software reviewer. Inspect this Smart Campus Room Availability Checker WITHOUT editing files. Identify risks in correctness, security, privacy, reliability, maintainability, and agent operations. For each risk, cite the exact file/function or missing check, explain the impact, suggest a way to verify it, and state uncertainty. Do not invent test results.
```

The assistant's answer, pasted unedited:

```text
Read-only review (no files were edited for this review):

1. Correctness / scope — `src/App.tsx` defines two selectable rooms, although this lab's contract says one fictional room. That could let the page present functionality outside the agreed scope. Inspect the `ROOMS` array and render the page to verify how many options appear. This is confirmed in the source.
2. Privacy — `AGENTS.md` says to use real room names and the real KBTU timetable. An agent following that instruction could introduce non-fictional schedule data. Compare the instruction with the hard-coded demo data and the one-fictional-room constraint. The conflicting instruction is confirmed; actual disclosure has not occurred in the shown code.
3. Agent operations / reliability — `AGENTS.md` tells the agent to run `npm run test:unit`, but `package.json` contains `test: vitest run` and no `test:unit` script. Running the named command fails instead of checking the work. Verify by inspecting scripts and running the command. This is confirmed.
4. Security / agent operations — the playbook permits adding Supabase persistence and a login page, despite the no-login/no-database scope. That could add unnecessary data collection and external service configuration. Verify against the scope and the `You may` section. The conflict is confirmed; no database is present in the current app.
5. Agent operations — `AGENTS.md` asks for `npx netlify deploy --prod` after a build. That could publish an unreviewed app externally. Verify by reading the exact command and the deployment rule. The instruction is confirmed; no deployment was run.
6. Security — the baseline `npm install` reported five npm audit advisories, including high and critical severity. Verify with `npm audit` and identify which packages are affected before estimating exposure. This is confirmed as a dependency audit result; exploitability in this demo project is uncertain, and most affected packages are development tools.
7. Maintainability / reliability — `package.json` has no lint script, and the app has no integration test for `App.tsx` or CI workflow. A UI regression could pass the current unit suite. Verify the scripts and test files. The missing checks are confirmed; the likelihood of a specific future regression is uncertain.

I did not run or infer any test result as part of this review.
```

### 3.2 Challenging the AI's claims

| # | The AI's claim (short) | Category | What the assistant inspected | Label | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | The page offers two rooms under a one-room scope. | Correctness | Baseline `src/App.tsx` `ROOMS` array and select options. | confirmed | The array had two entries; after extraction, the R2 test failed with “got 2”. |
| 2 | The playbook says to use real KBTU timetable data. | Privacy | Original `provided/AGENTS.md`. | confirmed | The instruction is explicit, although the displayed data were demo-like. |
| 3 | `npm run test:unit` does not exist. | Agent operations | `package.json` scripts and real command output. | confirmed | The command returned “Missing script”; `npm test` passed. |
| 4 | The playbook permits database/login additions. | Security | Original `app/AGENTS.md` and current app files. | confirmed | It explicitly allowed Supabase/login; neither is in the current app. |
| 5 | The playbook requests production deployment. | Agent operations | Original `AGENTS.md` “Before you finish”. | confirmed | It explicitly names `npx netlify deploy --prod`; no deployment was run. |
| 6 | npm reported five vulnerabilities. | Security | `npm install` output and `npm audit --json`. | confirmed | The summary is 2 moderate, 1 high, 2 critical; reachability needs further review. |

---

## 4. Task 4 — the risk register

### 4.1 The register

**Score = L × I.** Component is a path inside `app/` or `missing: <check>`.

| ID | Category | Cause → event → consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | Agent operations | Conflicting playbook → agent uses real data, adds login/database, skips tests or deploys → privacy and unreviewed release changes. | `AGENTS.md` | Original instructions requested real KBTU data, allowed Supabase/login, named missing `test:unit`, and ordered `netlify deploy --prod`. | confirmed | 3 | 3 | 9 | Replace conflicting lines; list AC1–AC6 and valid commands; forbid secrets, login/database and deployment. | Repo owner | Checker A1–A3/C1–C6; `npm test` and build. |
| R2 | Correctness | Two room entries → users select an out-of-scope room → project violates one-room contract. | `src/booking.ts` (`ROOMS`) | Baseline `src/App.tsx` had two entries; new R2 test failed: expected 1, got 2. | confirmed | 3 | 2 | 6 | Extract catalog to pure module and retain one fictional room. | Repo owner | R2 regression test, full suite 20/20, browser shows one option. |
| R3 | Security | Vulnerable development dependencies → exposed tool abused during development/CI → local code may be at risk. | `package-lock.json` | Audit reported 5 advisories (2 moderate, 1 high, 2 critical), including Vite/Vitest-related packages. | confirmed | 2 | 2 | 4 | Review advisories and update compatible patched versions separately. | Repo owner | Re-run audit, tests and build after upgrade. |
| R4 | Maintainability | No formatter, linter or app architecture README → style/module ownership drift → slower reviews and changes. | `package.json` | No Prettier or ESLint config/dependency; no README inside `app/`. | confirmed | 2 | 1 | 2 | Add small architecture notes and agreed formatter/linter when scope allows. | Repo owner | Confirm configuration/documentation; run tools. |
| R5 | Reliability | No integration test/CI gate → UI wiring changes are not exercised automatically → page regression escapes unit suite. | `missing: integration checks and CI workflow` | Only `src/booking.test.ts`; no `.github/workflows/` or test of `App.tsx`. | confirmed | 2 | 2 | 4 | Add focused App integration test and CI workflow later. | Repo owner | CI runs tests/build on PR and a UI test checks status feedback. |

### 4.2 The top two for action

1. **R1** — Score 9 (3 × 3): the playbook explicitly permitted real timetable data and login/database changes and ordered a production deploy, so an agent could create privacy and release consequences without a review gate.
2. **R2** — Score 6 (3 × 2): the baseline page offered two rooms despite the one-room contract, and a regression test reproduced the mismatch. No other confirmed risk scores above 6.

---

## 5. Task 5 — the agent-readiness audit

### 5.1 The rows

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Formatter | no | No Prettier config or dependency in `app/package.json`. |
| 1b | Linter | no | No ESLint config, dependency or script. |
| 1c | Type checks | yes | `app/tsconfig.json`; build runs `tsc`. |
| 1d | Unit tests | yes | `src/booking.test.ts` uses Vitest. |
| 1e | Pinned dependencies (lockfile) | yes | `app/package-lock.json` is committed. |
| 2a | `.env.example` | no | No `app/.env.example`. |
| 2b | Architecture notes | no | No README/architecture document inside `app/`. |
| 2c | `AGENTS.md` | yes | `app/AGENTS.md` exists and was patched. |
| 3a | CI | no | No `.github/workflows/` in `app/`. |
| 3b | Pre-commit hooks | no | No Husky, lint-staged or pre-commit configuration. |
| 3c | Integration checks | no | Tests cover `canBook`; no App/page integration test. |
| 3d | Reviewable evidence | no | No CI log requirement or PR template in `app/`. |

### 5.2 The level and the gaps

**Level:** 0

**Missing evidence for the next level:**

Level 1 needs 4 of 5 rows, but only 1c, 1d and 1e are yes. The missing evidence is a formatter (1a) and linter (1b), each with a config or dependency. Level 2 would also need `.env.example` and architecture notes; Level 3 needs CI, hooks, integration tests and reviewable evidence. The assignment README accurately describes the required layout. The app folder is understandable, but it has no README explaining its modules.

---

## 6. Task 6 — the agent playbook

### 6.1 The playbook prompt and the answer

What you sent, exactly:

```text
Review AGENTS.md and project documentation only. Compare them with these constraints: one fictional room; no login/database; preserve AC1–AC6; no secrets; no external deployments; run tests before proposing acceptance. Report missing or conflicting rules. Draft a minimal patch to AGENTS.md, but wait for my approval before applying it.
```

The assistant's answer, pasted unedited:

```text
The supplied AGENTS.md conflicts with the project constraints. It asks for real room names and the KBTU timetable, which should be replaced with a one-fictional-room rule. Its AC4 says endpoint-touching requests are overlaps; the contract allows them. AC6 is missing. The test command `npm run test:unit` is not present in `package.json`; `npm test` exists and runs Vitest. The “You may” section permits Supabase and login, so it must instead forbid both. The file has no secrets rule and tells the agent to run `npx netlify deploy --prod`; add a secrets prohibition and explicitly forbid external deployment. Finally, require `npm test` to pass before proposing acceptance. I would keep the headings and change only those lines. Proposed files: `app/AGENTS.md` only. I will wait for approval before applying the patch.
```

### 6.2 Assistant's findings and decisions (student replied "все норм")

| # | Rule or line in AGENTS.md | Missing / conflicting | Decision | Why |
| --- | --- | --- | --- | --- |
| 1 | Real KBTU data | Conflicts with fictional data/privacy. | modify | Replace with one fictional room and no real timetable/student data. |
| 2 | AC4 endpoint wording | Conflicts with contract. | modify | Endpoint-touching requests must be allowed. |
| 3 | AC6 | Missing | approve | Add desktop/mobile feedback criterion. |
| 4 | `npm run test:unit` | Missing script | modify | Use existing `npm test`. |
| 5 | Supabase/login | Conflicts with no database/login. | modify | Forbid both; keep bookings in memory. |
| 6 | Secrets | Missing | approve | Forbid secrets, keys, passwords and credentials. |
| 7 | Netlify production deploy | Conflicts with no external deployments. | modify | Remove command and forbid deploy/publish. |
| 8 | Test gate | Missing | approve | Require `npm test` passing before acceptance. |

### 6.3 The approved patch

```diff
diff --git a/week-10/provided/AGENTS.md b/week-10/app/AGENTS.md
index b786d88..abfa856 100644
--- a/week-10/provided/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@ -9,30 +9,32 @@ A React + TypeScript page (Vite) that tells a student whether a campus room is f
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room and fictional booking data only. Never use real room names, timetables, student names, or personal data.
 
 ## Acceptance contract
 
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow requests that only touch at endpoints.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.
 
 ## Commands
 
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`
 
 ## You may
 
 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add a login or database; keep bookings fictional and in memory.
+- Never commit secrets, API keys, passwords, or credentials.
 
 ## Before you finish
 
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run `npm test` before proposing acceptance; all tests must pass. Never deploy or publish externally.
```

---

## 7. Task 7 — verify safely

### 7.1 The regression test fails before the mitigation

The risk it covers: **R2**.

```text
 RUN  v3.2.4 /home/ubuntu/work/se-practice-sis04/week-10/app
 ❯ src/booking.test.ts (20 tests | 1 failed | 19 skipped) 7ms
   × R2 scope: only one fictional room is configured 6ms
     → expected [ { id: 'alpha', …(3) }, …(1) ] to have a length of 1 but got 2
 FAIL  src/booking.test.ts > R2 scope: only one fictional room is configured
AssertionError: expected [ { id: 'alpha', …(3) }, …(1) ] to have a length of 1 but got 2
- Expected
+ Received
- 1
+ 2
 ❯ src/booking.test.ts:100:17
 Test Files  1 failed (1)
      Tests  1 failed | 19 skipped (20)
   Start at  09:08:52
   Duration  251ms (transform 32ms, setup 0ms, collect 29ms, tests 7ms, environment 0ms, prepare 52ms)
```

### 7.2 The manual UI check

| View | Width | What I checked | Result | Screenshot |
| --- | --- | --- | --- | --- |
| Desktop | 1280 × 720 | Assistant opened page, checked inputs, clicked “Check availability,” inspected `Available` status and layout. | Labels/status clear; no clipping or horizontal overflow. | `evidence/ui-desktop.png` |
| Mobile | 375 × 812 | Assistant checked stacked layout, inputs, button, status and booking list at the 480px breakpoint. | Readable and in order; no horizontal overflow. | `evidence/ui-mobile.png` |

### 7.3 Tests and checks I did not run

No CI run was possible because the project has no workflow. I did not run `npm audit fix`; advisories need a separate compatibility review. I did not deploy anything. `npm run lint` was attempted in §2.1 and returned “Missing script”; no linter exists. The browser check was performed by the assistant in Chromium, not personally on the student's phone.

---

## 8. Task 8 — mitigate two risks

### 8.1 The first mitigation

**Risk:** R1

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit line. Otherwise leave both empty.


**Problem → pattern → benefit:**


**What the assistant rejected from the agent's patch, and why:**

The assistant rejected unrelated README, CI and dependency changes because this mitigation is only the unsafe playbook instructions. The student later replied "все норм" after being asked to review the report and diff.

The diff applied by the assistant (`git diff`); the student later indicated it was okay after the report and diff were shared:

```diff
diff --git a/week-10/provided/AGENTS.md b/week-10/app/AGENTS.md
index b786d88..abfa856 100644
--- a/week-10/provided/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@ -9,30 +9,32 @@ A React + TypeScript page (Vite) that tells a student whether a campus room is f
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room and fictional booking data only. Never use real room names, timetables, student names, or personal data.
 
 ## Acceptance contract
 
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow requests that only touch at endpoints.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.
 
 ## Commands
 
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`
 
 ## You may
 
 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add a login or database; keep bookings fictional and in memory.
+- Never commit secrets, API keys, passwords, or credentials.
 
 ## Before you finish
 
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run `npm test` before proposing acceptance; all tests must pass. Never deploy or publish externally.
```

### 8.2 The second mitigation

**Risk:** R2

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit line. Otherwise leave both empty.

```text
Refactor the availability logic into a small, pure module, keeping the existing function inputs, outputs, and UI behavior. Use a pattern only if the identified design problem justifies it. Do not add new features or dependencies. Show the files you plan to edit before making changes.
```

The assistant applied this scoped change after the user authorized completing the assignment: put the room catalog in `src/booking.ts`, leave the pure `canBook` inputs/result and UI feedback unchanged, and remove only the second room. This makes the one-room scope directly testable. The student later replied "все норм" after being asked to review the report and diff.

**Problem → pattern → benefit:**

The room catalog was hidden inside the page, so the one-room contract was not directly testable. A small pure-module extraction avoids unnecessary Strategy/Adapter patterns; the UI reads one catalog and a regression test can enforce its size.

**What the assistant rejected from the agent's patch, and why:**

The assistant rejected adding a Strategy or Adapter, a dependency, or new booking rules because there are no competing policies or data shapes to justify them. The student later replied "все норм" after being asked to review the report and diff.

The diff applied by the assistant (`git diff`); the student later indicated it was okay after the report and diff were shared:

```diff
diff --git a/week-10/app/src/App.tsx b/week-10/app/src/App.tsx
index bf49c2a..3c3f83b 100644
--- a/week-10/app/src/App.tsx
+++ b/week-10/app/src/App.tsx
@@ -1,16 +1,5 @@
 import { useState } from 'react';
-import { canBook, type Interval } from './booking';
-
-// Starter for students with no Week 06 project. The availability decision lives INSIDE this
-// component on purpose: Task 1 of Practice #07 is to extract it into src/booking.ts as
-// canBook({ start, end, now, blocked, bookings }) without changing what the page does.
-
-type Room = { id: string; name: string; blocked: boolean; bookings: Interval[] };
-
-const ROOMS: Room[] = [
-  { id: 'a101', name: 'Room A-101', blocked: false, bookings: [{ start: 600, end: 660 }] },
-  { id: 'b204', name: 'Room B-204', blocked: false, bookings: [] },
-];
+import { canBook, ROOMS } from './booking';
@@
 export default function App() {
-  const [roomId, setRoomId] = useState('a101');
+  const [roomId, setRoomId] = useState('alpha');
   const [now, setNow] = useState('09:00');
```

```diff
diff --git a/week-10/app/src/booking.ts b/week-10/app/src/booking.ts
index 0f83758..639dabb 100644
--- a/week-10/app/src/booking.ts
+++ b/week-10/app/src/booking.ts
@@ -8,6 +8,12 @@ export type BookingRequest = {
   bookings: Interval[];
 };
 
+export type Room = { id: string; name: string; blocked: boolean; bookings: Interval[] };
+
+export const ROOMS: Room[] = [
+  { id: 'alpha', name: 'Demo Room Alpha', blocked: false, bookings: [{ start: 600, end: 660 }] },
+];
+
 export function canBook({ start, end, now, blocked, bookings }: {
```

```diff
diff --git a/week-10/app/src/booking.test.ts b/week-10/app/src/booking.test.ts
index f822359..bebddd4 100644
--- a/week-10/app/src/booking.test.ts
+++ b/week-10/app/src/booking.test.ts
@@ -1,5 +1,5 @@
 import { expect, test } from 'vitest';
-import { canBook, type BookingRequest } from './booking';
+import { canBook, ROOMS, type BookingRequest } from './booking';
@@
 test('BUG-A: a request touching two adjacent bookings is available', () => {
@@
   expect(available).toBe(true);
 });
 
+test('R2 scope: only one fictional room is configured', () => {
+  expect(ROOMS).toHaveLength(1);
+  expect(ROOMS[0].name).toMatch(/demo/i);
+});
+
 test('BUG-B: an available request leaves the booking data unchanged', () => {
```

### 8.3 The residual risk

| ID | L before | I before | Score before | L after | I after | Score after | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 3 | 3 | 9 | 1 | 3 | 3 | Patched AGENTS.md forbids database/login/secrets/deployment, uses `npm test`, and passes A1–A3/C1–C6. |
| R2 | 3 | 2 | 6 | 1 | 2 | 2 | R2 failed with two rooms before, passed after; suite 20/20 and UI shows one demo room. |

### 8.4 The final run

```text
 RUN  v3.2.4 /home/ubuntu/work/se-practice-sis04/week-10/app
 ✓ src/booking.test.ts (20 tests) 4ms
   ✓ T01 AC4: a request touching the booking after it is available 1ms
   ✓ T02 AC1: a request starting at the current time is unavailable 0ms
   ✓ T03 AC1: a zero-length interval is unavailable 0ms
   ✓ T04 AC1: a reversed interval is unavailable 0ms
   ✓ T05 AC1: an interval ending after midnight is unavailable 0ms
   ✓ T06 AC2: exactly 120 minutes is available 0ms
   ✓ T07 AC2: a 121-minute booking is unavailable 0ms
   ✓ T08 AC4: a request touching the booking before it is available 0ms
   ✓ T09 AC4: a partial overlap is unavailable 0ms
   ✓ T10 AC4: a request containing an existing booking is unavailable 0ms
   ✓ T11 AC4: a request inside an existing booking is unavailable 0ms
   ✓ T12 AC4: an identical interval is unavailable 0ms
   ✓ T13 AC3: a blocked room is unavailable 0ms
   ✓ T14 AC4: a request with no existing bookings is available 0ms
   ✓ AC5: an available request leaves the booking data unchanged 0ms
   ✓ X1 AC1: a valid interval may end exactly at 1440 0ms
   ✓ X2 AC4: a request overlapping the second of two bookings is unavailable 0ms
   ✓ BUG-A: a request touching two adjacent bookings is available 0ms
   ✓ R2 scope: only one fictional room is configured 0ms
   ✓ BUG-B: an available request leaves the booking data unchanged 0ms
 Test Files  1 passed (1)
      Tests  20 passed (20)
   Start at  09:30:12
   Duration  229ms (transform 25ms, setup 0ms, collect 23ms, tests 4ms, environment 0ms, prepare 58ms)
```

---

## 9. Task 9, and what still fails

### 9.1 A background agent on this project

| Rule | What I require |
| --- | --- |
| Isolation | Separate branch/worktree based on `week-10`; never edit `main` or share a working tree. |
| Permitted files | Change only agreed files under `week-10/app/src/` and related `week-10/lab-report.md`; ask before changing scope or manifests. |
| Commands | In `week-10/app/`, run `npm install`, `npm test`, `npm run build`; in `week-10/`, run `python tests/check_audit.py`. |
| Prohibited actions | No real timetable/student data, secrets, login/database, external service or deployment; do not weaken tests/delete evidence. |
| Required evidence | Attach exact diff, raw test/build output, changed-file summary and unresolved risk evidence. |
| Before merging or deploying | Open a PR and wait for explicit human review before merge; deployment is forbidden. |

### 9.2 Optional — the deck's checklist prompt (not graded)

Not run. The required background-agent rules are listed in §9.1; no second checklist response is claimed.

### 9.3 Checks I am keeping as FAIL or ERROR

| Check | Why it stays |
| --- | --- |
| none | The final checker run has 31 PASS, 0 FAIL and 0 ERROR after adding the student's own conclusion. |

---

## 10. Release decision and conclusion

**Decision:** CONDITIONAL

<!-- Keep one word above. GO is not allowed while any confirmed risk still scores 6 or more.
     Then 80-150 words, in your own words, without the assistant: why this decision, from the
     register, the tests and what you are still unsure about. Name at least two risk IDs. -->

I chose CONDITIONAL because I think the project is almost ready, but some problems still need attention before the release. Risk R1 decreased from 9 to 3 after fixing the `AGENTS.md` file, which reduced the risk. Risk R2 decreased from 6 to 2 because only one demo room remains in the application, and the test now checks it. The 20 successful tests and successful build confirm that the main functionality works correctly. However, they do not guarantee that everything will work perfectly in real situations. I am still concerned about the five npm audit advisories and the absence of CI and integration tests. Before the release, I think these issues should be reviewed and additional testing should be performed.
