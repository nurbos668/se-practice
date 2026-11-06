# AI Usage Disclosure — Week 08

Required by the course academic policy (Generative AI use level **D — AI-integrated**). This disclosure describes what happened in this task; the student should review it before signing.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Manus assistant | not displayed | Planning, test additions, running commands, debugging, both minimal code changes, report and disclosure drafts | `app/src/booking.ts`, `app/src/booking.test.ts`, `lab-report.md`, `AI_USAGE.md`, `submission.yml`, `skills/bug-detector/SKILL.md`, `skills/bug-detector.zip` |
| Manus assistant, fresh isolated context without skill | not displayed | Prompt-only response for Task 4 (§5); no code edits | none |
| Manus assistant, fresh isolated context with the course skill text pasted as prompt-only instructions | not displayed | Prompt-only simulation for Task 5 (§6); no skill installation | none |

**`skills/bug-detector/SKILL.md` was typed by me from the deck's text, not generated:** no. The assistant wrote the file from the course-provided text; the student has not confirmed reviewing it.

**I applied the patches myself, one minimal change per bug, after reviewing what the assistant proposed:** no. The assistant edited `app/src/booking.ts`: it changed the overlap comparison for BUG-A and removed the mutation (and its now-inaccurate comment) for BUG-B. It also added the two regression tests in `app/src/booking.test.ts`. The assistant ran Vitest and the production build; the student's independent review is not confirmed.

**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):** yes — separate fresh Manus assistant contexts were used for §5 and §6. No other assistant provider was used; exact model names were not displayed.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes. The checker and validator runs will be recorded from the terminal before final submission.

**I can explain both bugs and both fixes — which line, why it was wrong, which test proves the fix — without the assistant:** no — the student has not confirmed this.

**Anything I accepted from the AI without fully understanding it:** `app/src/booking.ts`: changing the overlap comparison to strict inequalities and removing `bookings.push`; the student asked the assistant to complete the task and has not confirmed independent understanding.

Signed: not signed — student review/signature required
Date: not signed
