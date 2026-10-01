# AI Usage Disclosure — Week 02

Required by the course academic policy (Generative AI use level **D** — AI-integrated).
AI use is **the subject** of this lab, not a shortcut in it. You remain responsible for the
accuracy, testing and integrity of everything you submit, including everything an AI produced.

## 1. The tool under test

| |                 |
| --- |-----------------|
| Assistant | Claude          |
| Exact model name | Claude Sonnet 5 |
| Plan (free / paid) | Free            |
| Dates of the four runs |                 |

## 2. What it produced

| Prompt | File it produced | Edited by me afterwards? |
| --- | --- | --- |
| A | `week-02/code/prompt_a.py` | no |
| B | `week-02/code/prompt_b.py` | no |
| C | `week-02/code/prompt_c.py` | no |
| D | `week-02/code/prompt_d.py` | no |

## 3. Any other AI use in this lab

| Tool | Used for | Which file or section |
| --- | --- | --- |
| Claude | Diagnosing "No such file or directory" error when running the test harness (misnamed file `test_analyze_marks (1).py`) | terminal/setup, not part of graded output |
| Claude | Formatting the pasted terminal output into the results tables in `lab-report.md` sections 6–8, and drafting the wording of the conclusion in section 8 | `lab-report.md`, sections 6–8 |
| Claude | Helping word Prompt D itself, combining lessons from A/B/C into one message | `lab-report.md` section 5, and the prompt sent for `prompt_d.py` |

## 4. Declarations

- **Every prompt was sent in a fresh chat, and the outputs were saved before any editing:** yes
- **The test results in section 6 of `lab-report.md` are real output from real runs:** yes
- **Everything I submitted, I can explain and defend in class:** yes

**Anything I accepted from the AI without fully understanding it:**
The exact rounding/formatting internals of how each model implemented `round(pass_rate, 2)` vs
manual string formatting inside prompt_b/c/d's code — I trusted the harness's tolerance check
rather than reading every implementation line by line.

Signed: <your name>
Date:
