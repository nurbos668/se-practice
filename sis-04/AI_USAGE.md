# AI Usage Disclosure — SIS #04

Required by the course academic policy (Generative AI use level **D — AI-integrated**). The assistant contributed to analysis, planning, code, tests and report wording. The student is responsible for reviewing and understanding the submitted work.

| Tool | Exact model / plan | Date | Used for | Which files it touched |
| --- | --- | --- | --- | --- |
| Manus assistant | not displayed | 2026-11-17 | Baseline code analysis and improvement plan | `report.md` |
| Manus assistant | not displayed | 2026-11-17 | Room catalog, filtering, selected-room availability, UI changes and regression tests | `app/src/App.tsx`, `app/src/booking.ts`, `app/src/booking.test.ts`, `app/src/rooms.ts`, `app/src/filter.ts`, `app/src/index.css` |
| Manus assistant | not displayed | 2026-11-17 | Documentation, before/after diagrams, test report, and coordinating browser checks/screenshots | `app/README.md`, `diagrams/before.puml`, `diagrams/after.puml`, `evidence/*.png`, `report.md`, `submission.yml`, `AI_USAGE.md` |

**The assistant wrote, or helped write, tests in `app/`:** yes. It edited `app/src/booking.test.ts` (27 tests total, starting from the original 19). Expected values were based on the assignment's AC1–AC5 and F1–F5/B1–B6/INT requirements, not copied from the implementation's output. The room fixtures are separate from the demo catalog; the suite uses the real modules without mocks or skipped tests.

**Every run pasted in report.md was produced by my code on my machine (or Codespace), unedited:** no — commands ran in the Manus cloud sandbox, not on the student's personal machine. The recorded terminal output was copied from those real runs without editing.

**Every number in report.md section 7 was measured the way its row says:** yes. Test counts came from Vitest; file counts from the baseline/final source trees; dependency warnings from the actual `npm install` summary.

**I shared no credentials, keys or private data with any tool:** yes — no raw credentials or keys were entered into prompts. Repository access used the session's authorized GitHub connector.

**Everything I submitted, I can explain and defend in class — including filterRooms, checkRoom and why each module exists:** not confirmed — the student has not yet reviewed the finished code in this session. The student should inspect the source, tests and report before signing or submitting.

**Anything I accepted from the AI without fully understanding it:** not confirmed by the student. Before signing, personally review `filterRooms`, `checkRoom`, the room-switch behavior, and the tests in `app/src/booking.test.ts`.

Signed: pending the student's review and signature
Date: pending
