# AI Usage Disclosure — Week 07

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT via Manus assistant | not displayed | Generated the first suite and its AC mapping | `suites/first/booking.test.ts`; initially copied to `app/src/booking.test.ts` |
| ChatGPT via Manus assistant | not displayed | Reviewed the T06 failure, revised the final suite, and drafted report text and conclusion at the student's request | `app/src/booking.test.ts`, `lab-report.md`, `submission.yml`, `AI_USAGE.md` |
| Chromium + Python Playwright (run by Manus) | N/A | Executed five UI scenarios and captured browser screenshots | `evidence/ui-1.png` … `evidence/ui-5.png` |

**I used an assistant to extract `canBook` (Task 1), or to fix a defect in it:** yes. The assistant moved the existing conditions from `app/src/App.tsx` into `app/src/booking.ts` and changed the page to call that function. The rule order and conditions were preserved; the app build, unit tests and browser checks were run. No implementation defect was changed to make a test pass.

**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):** no separate assistant. The same ChatGPT/Manus assistant helped with the tests and report; Playwright is browser-testing software, not another assistant.

**`suites/first/` holds the assistant's first test file exactly as it generated it:** yes. The final revised copy is in `app/src/booking.test.ts`.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes. The report includes the actual first/final Vitest results and unedited excerpts of each mutant run.

**I can explain every test in my final suite — its input, its expected result and the AC behind it — without the assistant:** not yet confirmed by the student. Please review the test table and suite before submission, then change this answer if appropriate.

**Anything I accepted from the AI without fully understanding it:** No item is claimed as understood on Nurbolsyn's behalf. The student should personally review the T06 correction, X1/X2, the AI-written conclusion and the invalid-existing-booking assumption before signing.

Signed: Not signed — Nurbolsyn Tajikossov must review and sign  
Date: 6 November 2026
