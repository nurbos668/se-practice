# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name: Tajikossov Nurbolsyn**
**Group:**
**Date:**

> Fill in every section. **Do not delete or renumber the headings** — the grading pass reads them
> by number. If something did not happen, write "did not happen" and why; an empty section and a
> fabricated one are graded the same way.

---

## 1. The frozen experiment

| |                 |
| --- |-----------------|
| AI assistant | Claude AI       |
| Exact model name | Sonnet 5 Medium |
| Implementation language | Python          |
| Date of the runs |                 |

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can
be checked:

```
(paste here, or write "n/a — used Python")
```

**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes / no
- No follow-up questions were asked before Part 7: yes / no
- Every output was saved **before** any editing: yes / no

---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):

```
Write Python code to analyze student marks.
```

**Assumptions the AI made that I never gave it** — list them, one per line. A data format, a pass
threshold, a rounding rule, an input method, an invented feature all count.

1.Computes average, median, and standard deviation
2.Assigns letter grades and tallies the distribution
3.Splits students into pass/fail groups (default pass mark: 50)

**Questions it should have asked and did not:**

1.What inputs and outputs are needed?
2.Do I need a full website or just code?

**Is the function named `analyze_marks` with the required signature?** yes / no — if no, what is it
called: no, there are no function like this at all

**First impression before testing** (one sentence — you will compare this with section 6 later):Generally the is correct. There are all the needed outputs and parametrs.

--- 

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return
average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range values. Use
no external libraries. Return code plus a short explanation.
```

**What B fixed compared to A:**

1.Since we wrote the prompt more precisely, the AI gave us the values we needed without any extra information.
2.The AI ​​has clearly written one function that does its job.

**What B still leaves open:**

1.
The proposal says to return the pass_rate, but it doesn't specify what units it is measured in or how it is rounded.
2.It says raise ValueError for non-numeric values. But what about strings that contain numbers? For example, analyze_marks([40, "60"], 50) – should the function throw a ValueError (since "60" is a str), or will the generated code automatically try to cast it to int("60") and skip it?

---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:**

```
Example: analyze_marks([40, 60, 80], 50) → average 60, highest 80, lowest 40,
pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list,
text value, and marks below 0 or above 100. State any remaining assumptions before
the code.
```

**Tests the AI wrote for itself** — how many, and which situations do they cover?

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark |Yes — analyze_marks([75]) checks average/highest/lowest/pass_rate all equal 75.0/75/75/100.0 |
| decimals |Yes — analyze_marks([55.5, 60.25, 70.1]) checks average is correctly rounded and highest/lowest match the decimal values |
| custom pass_mark |Yes — analyze_marks([30, 45, 60, 90], pass_mark=60) checks pass_rate = 50.0 (2 of 4 pass) |
| empty list |Yes — analyze_marks([]) checked to raise ValueError |
| text value |Yes — analyze_marks([50, "abc", 70]) checked to raise ValueError |
| below 0 / above 100 |Yes — two separate checks: [50, -5, 70] and [50, 105, 70], both checked to raise ValueError |

**Do the AI's own tests pass against the AI's own code? yes **  / no yes
**Do they agree with the harness in section 6?** yes / no — if no, where do they disagree:

**Assumptions C stated explicitly before the code: the code is fully correct**

---

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):

```
You are a Python developer. Implement a function:

def analyze_marks(marks, pass_mark=50):

It must return a dictionary with exactly these four keys: average, highest, lowest, pass_rate.

Rules:
- marks is a list of numbers (int or float), each expected to be in the range 0–100 inclusive.
- pass_mark is a number; a mark equal to pass_mark counts as a pass (i.e. use >=, not >).
- pass_rate is the percentage of marks that pass, rounded to 2 decimal places (e.g. 66.67, not 66.666666666666664).
- average, highest and lowest are plain numbers, not rounded unless naturally exact.
- Raise ValueError if: marks is an empty list, marks contains any non-numeric value (e.g. a string), or marks contains any value below 0 or above 100.
- Use no external libraries — standard library only.
- Do not add a CLI, file I/O, or anything not explicitly requested.

Example: analyze_marks([40, 60, 80], 50) → {'average': 60, 'highest': 80, 'lowest': 40, 'pass_rate': 66.67}

Include tests for the following cases, and state any remaining assumptions before the code:
1. analyze_marks([40, 60, 80], 50) → average 60, highest 80, lowest 40, pass_rate 66.67
2. analyze_marks([100], 50) → average 100, highest 100, lowest 100, pass_rate 100
3. analyze_marks([49.5, 50], 50) → average 49.75, highest 50, lowest 49.5, pass_rate 50 (the 50 counts as a pass)
4. analyze_marks([], 50) → raises ValueError
5. analyze_marks([40, "60"], 50) → raises ValueError
6. analyze_marks([-1, 50, 101], 50) → raises ValueError

Return the code plus a short explanation.
```

**What I deliberately added that A, B and C did not have:**

1. Explicit rounding rule for pass_rate (2 decimal places) — without it you get
   66.66666666666667 instead of 66.67, and case 1 fails.

2. Explicit tie-break rule for the pass threshold (>=, not >) — without it, mark == pass_mark
   may not count as a pass, and case 3 returns pass_rate=0 instead of 50.

3. Explicit "no extra scope" constraint (no CLI, no file I/O) — A tends to add unrequested
   features, which costs points on Noise.

**The ambiguity I found in the specification, and how I resolved it inside Prompt D: It's unclear whether a mark equal to pass_mark should pass or fail. The example
analyze_marks([49.5, 50], 50) → pass_rate 50 only works if 50 counts as a pass (1/2 = 50%).
I resolved it in Prompt D by stating explicitly that equal-to-pass_mark counts as a pass,
using >= instead of >.**

---

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | ERROR | PASS | PASS | PASS |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | ERROR | PASS | PASS | PASS |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | ERROR | PASS | PASS | PASS |
| 4 | `analyze_marks([], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| | **Totals** | | **0/6** | **6/6** | **6/6** | **6/6** |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| A | 1–6 | `code\prompt_a.py` defines no callable named `analyze_marks` — the AI wrote a full "class statistics" script (median, std dev, grade distribution A–F, a hardcoded 8-student roster) instead of the requested function. All six cases counted as ERROR. |
| B | 1 | Not a failure, but notable: `got pass_rate=66.66666666666666` vs required `66.67` — harness still marked PASS because comparison used 0.01 tolerance, but the raw value was unrounded. This is exactly what Prompt D fixed explicitly. |
| — | — | No FAIL cases occurred in B, C, or D. |

### Pasted terminal output — all four runs

> This is the part that makes the table above count. Paste the **whole** output, unedited,
> including the header lines. A table with nothing behind it is not accepted.

**Prompt A**

```
PS C:\Users\123\dev\university\software_engineering\se-practice\week-02> python tests/test_analyze_marks.py code/prompt_a.py
=== Class Statistics ===
Average: 68.25
Median: 71.5
Std Dev: 19.56
Highest: Diana (92)
Lowest: George (39)

Passed: 6 -> ['Alice', 'Charlie', 'Diana', 'Ethan', 'Fiona', 'Hannah']
Failed: 2 -> ['Bob', 'George']
Pass rate: 75.0%

=== Individual Results ===
Diana | Marks: 92 | Grade: A
Alice | Marks: 88 | Grade: B
Hannah | Marks: 81 | Grade: B
Charlie | Marks: 76 | Grade: C
Fiona | Marks: 67 | Grade: D
Ethan | Marks: 58 | Grade: E
Bob | Marks: 45 | Grade: F
George | Marks: 39 | Grade: F

=== Grade Distribution ===
A: 1 student(s)
B: 2 student(s)
C: 1 student(s)
D: 1 student(s)
E: 1 student(s)
F: 2 student(s)
ERROR: code\prompt_a.py defines no callable named 'analyze_marks'.
All six cases count as ERROR. Record that in lab-report.md.
```

**Prompt B**

```
PS C:\Users\123\dev\university\software_engineering\se-practice\week-02> python tests/test_analyze_marks.py code/prompt_b.py
analyze_marks harness — code/prompt_b.py
tolerance for numeric comparison: 0.01
SIGNATURE: ok
case 1 PASS analyze_marks([40, 60, 80], 50)
expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
got : average=60.0, highest=80, lowest=40, pass_rate=66.66666666666666
case 2 PASS analyze_marks([100], 50)
expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
got : average=100.0, highest=100, lowest=100, pass_rate=100.0
case 3 PASS analyze_marks([49.5, 50], 50)
expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
got : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
case 4 PASS analyze_marks([], 50)
expect: ValueError
got : raised ValueError: marks must be a non-empty list
case 5 PASS analyze_marks([40, '60'], 50)
expect: ValueError
got : raised ValueError: Non-numeric mark found: '60'
case 6 PASS analyze_marks([-1, 50, 101], 50)
expect: ValueError
got : raised ValueError: Mark out of range (0-100): -1
RESULT 6 PASS · 0 FAIL · 0 ERROR (code/prompt_b.py)
```

**Prompt C**

```
PS C:\Users\123\dev\university\software_engineering\se-practice\week-02> python tests/test_analyze_marks.py code/prompt_c.py
analyze_marks harness — code/prompt_c.py
tolerance for numeric comparison: 0.01
SIGNATURE: ok
case 1 PASS analyze_marks([40, 60, 80], 50)
expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
got : average=60.0, highest=80, lowest=40, pass_rate=66.67
case 2 PASS analyze_marks([100], 50)
expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
got : average=100.0, highest=100, lowest=100, pass_rate=100.0
case 3 PASS analyze_marks([49.5, 50], 50)
expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
got : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
case 4 PASS analyze_marks([], 50)
expect: ValueError
got : raised ValueError: marks list cannot be empty
case 5 PASS analyze_marks([40, '60'], 50)
expect: ValueError
got : raised ValueError: non-numeric mark found: '60'
case 6 PASS analyze_marks([-1, 50, 101], 50)
expect: ValueError
got : raised ValueError: mark out of range (0-100): -1
RESULT 6 PASS · 0 FAIL · 0 ERROR (code/prompt_c.py)
```

**Prompt D**

```
PS C:\Users\123\dev\university\software_engineering\se-practice\week-02> python tests/test_analyze_marks.py code/prompt_d.py
analyze_marks harness — code/prompt_d.py
tolerance for numeric comparison: 0.01
SIGNATURE: ok
case 1 PASS analyze_marks([40, 60, 80], 50)
expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
got : average=60.0, highest=80, lowest=40, pass_rate=66.67
case 2 PASS analyze_marks([100], 50)
expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
got : average=100.0, highest=100, lowest=100, pass_rate=100.0
case 3 PASS analyze_marks([49.5, 50], 50)
expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
got : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
case 4 PASS analyze_marks([], 50)
expect: ValueError
got : raised ValueError: marks must be a non-empty list
case 5 PASS analyze_marks([40, '60'], 50)
expect: ValueError
got : raised ValueError: Invalid mark (not numeric): '60'
case 6 PASS analyze_marks([-1, 50, 101], 50)
expect: ValueError
got : raised ValueError: Mark out of range (0-100): -1
RESULT 6 PASS · 0 FAIL · 0 ERROR (code/prompt_d.py)
```

---


---

## 7. Scoring

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | 0 | 2 | 2 | 2 |
| Requirement coverage | 0 | 2 | 2 | 2 |
| Verifiability (tests) | 0 | 0 | 2 | 2 |
| Assumptions stated | 0 | 1 | 2 | 2 |
| Noise (2 = none) | 0 | 2 | 2 | 2 |
| **Total / 10** | **0** | **7** | **10** | **10** |

**Prompt length, in words:** A 7 · B 44 · C 84 · D 230

**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says:

B over A: 37 extra words bought 7 points (0→7) — cheapest gain in the whole experiment. C over B: 40 extra words bought 3 points (7→10). D over C: 146 extra words bought 0 additional points (10→10) — D's extra length paid for robustness and documentation, not correctness.

---

## 8. Conclusion — 150–200 words

Prompt C and Prompt D both scored 10/10, tied with each other but ahead of B (7/10) and far ahead of A (0/10). By the score, C and D are equivalent; in practice I'd use D at work, because its explicit rules (rounding to 2 decimals, `>=` for the pass threshold, no extra scope) remove ambiguity that C still left implicit even though C happened to guess correctly this run.

The single addition that bought the most correctness was the jump from A to B: giving the role, exact signature, return-dict shape, and validation rules turned all six cases from ERROR (no `analyze_marks` function existed) into PASS. C and D added nothing to correctness — B already returned exactly 66.67-equivalent values within tolerance — they only added verifiability (case 4–6 tests) and explicit assumptions.

Nothing in C or D was pure noise; every addition mapped to a scoring criterion (tests, assumptions, tie-break rule). The ambiguity was whether a mark equal to `pass_mark` should pass — case 3's example (`pass_rate 50`) only makes sense if it does. I resolved it in D by writing "use `>=`, not `>`" explicitly.

**Word count:** 178

---

## 9. Two questions for the debrief

1. If B already reaches 6/6 with almost no ambiguity resolved on paper, how much of that is luck from the model's own reasonable defaults rather than the prompt actually constraining it — and how would we know the difference without a harness like this one?
2. Since C's own tests all passed against C's own code (the trap this README warns about), how much should "Verifiability" really count toward the score if the tests aren't independently adversarial?
