# AI Usage Disclosure — Week 10

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Manus chat assistant | not displayed | Project review, risk-register draft, report and declaration drafting, code-change assistance | `week-10/lab-report.md`, `week-10/AI_USAGE.md`, `week-10/submission.yml`, `week-10/app/AGENTS.md`, `week-10/app/src/App.tsx`, `week-10/app/src/booking.ts`, `week-10/app/src/booking.test.ts` |
| Chromium / Playwright | N/A (browser/test tools, not an AI assistant) | Desktop and mobile viewport screenshots and UI interaction check | `week-10/evidence/ui-desktop.png`, `week-10/evidence/ui-mobile.png` |

**The review in Task 2 ran in a mode where the assistant could not edit, and `git status` showed no
change afterwards:** no
The review response was text-only and no edit operation was used for that response, but editing tools
were available in the broader Manus task, so I cannot claim they were technically disabled. The app
was not changed as part of writing that review answer.

**I labelled every claim in lab-report.md §3.2 after opening the cited file myself:** no
The assistant inspected the cited files and recorded the evidence. The student has not yet confirmed
that they personally repeated each inspection.

**Every change to `app/` was reviewed by me as a diff before I accepted it:** yes
The student was given the report/diff link and replied "все норм" after being asked to review. This
was taken as approval; no line-by-line change request was made.
<!-- Name anything you rejected in §8; name here anything you accepted without reading. -->

**I used another assistant as well (to explain a risk, to draft text in lab-report.md, …):** no
<!-- If "yes": which one, the exact model, and for which section. -->

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**I can explain every score in my register, and why my release decision follows from it, without
the assistant:** no
The student has not yet confirmed this independently.

**Anything I accepted from the AI without fully understanding it:**
The student has not yet confirmed independent understanding of the proposed `AGENTS.md` patch and
the catalog extraction in `app/src/booking.ts`; review them before submission.

Signed: Awaiting student review; not signed by the assistant
Date: 2026-11-20
