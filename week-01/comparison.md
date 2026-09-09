# Week 01 — Manual vs AI: Comparison

**Name: Tajikossov Nurbolsyn**
**Group: Monday 16:00-19:00**
**Date:08.09.2026**

---

## 1. Facts

| | Manual (Part 1)                                | Rocket (Part 2) |
| --- |------------------------------------------------|-----------------|
| Language / stack used | python                                         | rocket          |
| Time to first version that ran | 16 minutes                                     | 2 minutes       |
| Time to all 4 test cases passing | 31 minutes                                     | 2 miutes        |
| Number of attempts / prompts needed | 10 attempts                                    | 2               |
| Lines of code you actually wrote | 25                                             | 0               |
| Did it handle invalid marks (case B)? | yes, by try/catch                              | yes             |
| Did it handle an empty list (case D)? | yes, by checking the length of the valid marks | yes             |
| Did it use the ≥ 50 pass threshold? | yes                                            | yes             |
| Output format matches the spec? | yes                                            | yes             |
| Can you explain every line of it? | yes                                            | yes             |

## 2. Test results

| Case | Input | Manual output                 | Rocket output | Spec says | Match? |
| --- | --- |-------------------------------| --- | --- | --- |
| A | `85, 23, 45, 90, 92` | avg 67.00, high 92, low 23, pass 60.0 |valid 5, avg 67.00, high 92, low 23, pass 60.0%, passing 3, failing 2 | avg 67.00 · high 92 · low 23 · pass 60.0% |Yes — all required fields match exactly (after the decimal-formatting fix). 
Rocket also added a "failing count" field, not present in the spec. |
| B | `88, 47, -5, 101, abc, 73, 50, , 100` |        avg 71.60 · high 100 · low 47 · pass 80.0%                       |valid 5, avg 71.60, high 100, low 47, pass 80.0%, passing 4, failing 1 | avg 71.60 · high 100 · low 47 · pass 80.0% |Match? Yes — all required fields match, invalid values correctly ignored. 
Same extra "failing count" field present here too. |
| C | `10, 20, 30` |                         avg 20.00 · high 30 · low 10 · pass 0.0%      |valid 3, avg 20.00, high 30, low 10, pass 0.0%, passing 0, failing 3 | avg 20.00 · high 30 · low 10 · pass 0.0% |Match? Yes — all required fields match exactl |
| D | `abc, , xyz` |                 No valid marks found.              |"No valid marks found" — no stats shown | clear message, no crash |Match? Partially — no crash, which satisfies the core requirement, but the message wording 
is slightly misleading (implies nothing was entered, when in fact all entries were invalid). 
Rocket also added a second unrequested feature here: example input hints to guide the user. |

## 3. What the AI added that I never asked for

<!-- Tech stack, UI, extra features, a pass threshold it invented, styling, etc. -->

Rocket built a full web application with a graphical UI, not the simple script or console 
program I built manually. This included:

- **A complete web interface** — styled forms, buttons, layout — instead of plain text 
  input/output like my manual version.
- **Two extra output fields**: "Passing count" and "Failing count" — neither was requested 
  in my original one-line prompt or in my answers to Rocket's clarifying questions.
- **A grade distribution chart** — a visual graph showing how marks are distributed, which 
  goes well beyond the specification (average/highest/lowest/pass rate only).
- **Input hints/examples** shown to guide the user on valid mark formats.
- General web-app scaffolding (styling, layout, likely a tech stack choice like React) that 
  I never specified — I only asked for "a small program," not a web app.

## 4. What the AI got wrong or silently skipped

<!-- Be concrete: input, expected, actual. -->

**Got wrong:** The average was not consistently formatted to 2 decimal places (showed "67" 
instead of "67.00" in some cases, "20.0" instead of "20.00" in others) — fixed with a 
follow-up prompt.

**Silently skipped / assumed without asking:** Despite asking several clarifying questions 
during the initial prompt phase, Rocket never asked whether I wanted a web application, a 
console script, or something else — it simply defaulted to building a full web app with a 
graphical UI. It also silently decided to add extra features (failing count, grade 
distribution chart) without confirming whether these were wanted, rather than asking or 
flagging them as optional additions.

## 5. The defect I asked Rocket to fix

**Prompt used:** "The average is not showing 2 decimal places (e.g. shows '67' instead of 
'67.00'). Please format the average to always display exactly 2 decimal places."

**Result:** Fixed — average now consistently shows exactly 2 decimal places across all cases 
(e.g. 67.00, 20.00, 71.60).

**What this tells me:** That AI is absolutely a super technology

---

## 6. Reflection (200–300 words)

Answer all four, in your own words:

1. Which parts of the work did the AI genuinely speed up?

Rocket built a fully working web application in about two minutes, maybe less. It handled 
almost all test cases correctly on the first try, and even added its own extra features 
(like a grade distribution chart). The biggest speed-up was in the actual writing/creation 
of the code — something that took me significantly longer to do by hand.

2. Where did the AI cost you time, or give you something that looked right but was not?


Aside from the specific requirements I clearly stated in the prompt, which Rocket handled 
correctly, there were a couple of things that cost me time to catch. The average was not 
consistently formatted to 2 decimal places — sometimes it showed just one decimal or none 
at all — because I hadn't explicitly stated that requirement in the prompt. I only caught 
this by carefully checking each test case output against the exact expected format. 
Also, instead of building a simple program that just calculates statistics, Rocket built 
a full web application — which looked impressive, but wasn't what I actually asked for, 
and meant extra features (charts, extra fields) I had to sift through to verify the core 
logic was correct.


3. Which of these two artefacts would you be willing to put your name on, and why?


I would put my name on my manual version. It's not as visually impressive or feature-rich 
as the AI-generated version, but I fully understand every single line of my own code. I can 
explain how it works, find and fix any bug in it, and I'm confident in why it behaves the 
way it does. With the Rocket version, even though it looks more polished and passed the 
tests, I can't say the same — I don't fully understand everything happening inside the 
generated web app, which means I couldn't confidently guarantee it's correct or safe if 
something went wrong.



4. What must a human engineer still be responsible for after this experiment?


First and foremost, an engineer must know how to work effectively with AI, since it can 
significantly speed up development. The engineer must also be able to notice AI-generated 
bugs, which can sometimes be very subtle and easy to miss — as I saw with the average 
formatting issue. Writing clear, precise prompts is another essential skill: being able to 
communicate exactly what you want and how you want it built. Finally, and most importantly, 
the engineer must actually understand the code being produced, rather than just writing a 
prompt and then using the result without knowing how it works underneath.

<!-- Write your reflection below this line -->