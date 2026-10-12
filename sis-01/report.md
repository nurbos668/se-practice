# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

<!--
  This is the only file you write your report in. README.md tells you what goes where.

  Rules the checker relies on:
  - Do not delete, rename or renumber the ## headings, the ### headings, or the **Label:** words.
  - Replace every "(write here)" and "(paste here)". None may be left when you submit.
  - Comments like this one are ignored by the word counter. Delete them or leave them.
-->

**Topic:** 1.10

<!-- Exactly one of 1.1 … 1.10, e.g.  **Topic:** 1.4  -->

---

## 1. Scenario

<!-- 100–150 words, labels included. One small scenario, used in every prompt and in your
     whole answer. Anything fictional is labelled in Assumptions. -->

**Question:** What safeguards should a software-controlled drone have for safety, privacy and accountability when it delivers medicine to a mountain village?

**Users:** A paramedic in the village and a pharmacy dispatcher in the city.

**Problem:** In winter the only road is closed, so medicine takes days to arrive.

**Constraints:** (1) Mobile coverage is unreliable on the route. (2) Battery range is limited to about 25 km.

**Risk:** Loss of connection over a gorge makes the drone crash, or its navigation camera records residents without consent.

**Assumptions:** The village, the pharmacy, the 25 km range, the weather and the camera are fictional. No real people or data are used.

## 2. Analysis

<!-- 350–400 words. Your answer to the question, the trade-offs, and how it applies to your
     scenario. Explain at least two engineering decisions and why they fit the scenario. -->

(write here)

## 3. Review

<!-- 250–300 words. What Prompt B's critique said and what you did with it; your two source
     checks and your two substantive revisions, each with a reason. Point at the rows of the
     tables in section 9 ("verification row 2", "change-log row 1"). -->

(write here)

## 4. Conclusion

<!-- 100–150 words. Your recommendation for the scenario and its main limitation. -->

(write here)

## 5. Reflection

<!-- 150–200 words. NOT part of the main total. Written by you, not by the assistant:
     what helped, what you changed, what you learned. Specific beats flattering. -->

(write here)

## 6. References

<!-- Full references, one per line, each starting with "- ". Only sources you actually opened.
     Every URL used in the verification table must also appear here. Example:
     - Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 1.
-->

- - PX4 Autopilot documentation. Safety (Failsafe) Configuration, v1.16, section "Data Link Loss Failsafe". https://docs.px4.io/v1.16/en/config/safety.html. Accessed 2026-10-12.
- ACM/IEEE-CS Joint Task Force. Software Engineering Code of Ethics and Professional Practice, short version, Principle 1, clauses 1.01, 1.03, 1.04. https://www.acm.org/code-of-ethics/software-engineering-code. Accessed 2026-10-12.

## 7. Appendix A — Initial outline

<!-- Written BEFORE you run Prompt A. Five points, your own words, numbered. These are the
     "five points" you paste into Prompt A. -->
1. If the connection is lost, the drone should return to where it started.
2. If the drone crashes or films someone, the developers are responsible.
3. Safety versus range depends on the situation: sometimes flying further matters more.
4. Camera video should be stored only for a special command or team.
5. The system should be tested before it is trusted.

## 8. Appendix B — AI exchanges

<!-- Complete prompts and complete responses, as text — never screenshots. Paste each inside
     the fenced block that follows its label. If a response itself contains ``` lines, open
     and close that block with ~~~~ instead. You may add B4, B5 … after B3 if you ran more. -->

### B1 — Draft (Prompt A)

- **Tool:** Claude
- **Model:** Sonnet 5.5
- **Date:** (write here)
- **Purpose:** contextual draft

<!-- Model: the exact model with its version, as the tool shows it (e.g. "GPT-5 Thinking",
     "Claude Sonnet 4.5"). If the tool does not show it, write: not displayed
     Date: YYYY-MM-DD -->

**Prompt:**

```text
(paste here)
```

**Response:**

```text
(paste here)
```

### B2 — Critique (Prompt B)

- **Tool:** Claude
- **Model:** Sonnet 5.5
- **Date:** (write here)
- **Purpose:** critical review of the draft

**Prompt:**

```text
Review the draft below against my chosen question and scenario. Identify inaccuracies, missing reasoning, vague claims and unsupported assumptions.
For each concern, explain why it matters and how I could check it. Include a counterexample or alternative interpretation. Do not rewrite the answer yet.
Question: What safeguards should a software-controlled drone have for safety, privacy and accountability when it delivers medicine to a mountain village? Scenario: A paramedic in the village and a pharmacy dispatcher in the city are the users; in winter the only road is closed, so medicine takes days to arrive; the constraints are unreliable mobile coverage on the route and a battery range limited to about 25 km; the risk is that loss of connection over a gorge makes the drone crash, or its navigation camera records residents without consent (the village, pharmacy, range, weather and camera are fictional). Draft: A medicine-delivery drone raises three linked concerns: safety (no harm to people or cargo), privacy (no filming of residents without consent) and accountability (someone answers when things go wrong). I separate facts from assumptions below.

**Facts (general, still to be verified)**
- Drones often have failsafes, such as returning to a launch point or landing, when the control link is lost.
- Navigation cameras can capture people incidentally, so video may count as personal data.
- Testing shows a system works in the cases tried; it cannot prove that no faults remain.

**Assumptions (yours or mine)**
- The village, pharmacy, range, weather and camera are fictional.
- I read "25 km" as total distance per battery, so about 12 km each way before any reserve. Please confirm this.
- Cold winter weather likely reduces the real range below 25 km; this is assumed, not measured.

**Your five ideas**
1. Return on connection loss: a sensible default, but not always the safest. Over the gorge, returning may be as risky as continuing, and the battery may not cover the return. A pre-planned rule (continue, return or land at the nearest safe site, depending on position and charge) handles more cases but is harder to test than one simple behaviour.
2. Developers are responsible: they share responsibility for design and testing, but probably not alone. The pharmacy running the service, whoever approves each flight, the manufacturer and the regulator also matter. I treat "developers only" as an unverified assumption. Logging who approved each flight is a design measure that supports accountability.
3. Safety versus range: decide this trade-off in advance, not mid-flight. A fixed battery reserve shortens deliveries but lowers crash risk. Urgent cases may tempt operators to override it, so an override should need a recorded reason.
4. Camera storage: it is safer to record nothing by default, use the camera for live navigation, keep footage only after an incident, and restrict access to named staff with an audit log. Less footage makes crash investigation harder but reduces privacy risk.
5. Testing: agreed, but tests should include lost connection, low battery and wind, first in simulation and then over safe terrain.

**Overall trade-off**
Every safeguard costs something: a battery reserve costs range, privacy limits cost investigation evidence, and extra rules cost testing effort. For this scenario, accepting a shorter range and less footage in return for lower risk to people looks reasonable, but that judgment depends on the assumptions above.

**Claims to verify**
- Return-to-home as a standard failsafe, and its known limits.
- Who is legally responsible for drone accidents and filming in your real jurisdiction (a legal claim; do not rely on me).
- Whether drone video counts as personal data under the relevant law.
- How cold weather affects battery range.
```

**Response:**

```text
B2: critique of the draft

1. “Drones often have failsafes, such as returning to a launch point or landing.”

Vague: “often” and “failsafes” are not sourced, and the draft never says which failsafe fits a mountain route.
Why it matters: the whole safety argument rests on this fact.
Counterexample: landing automatically over a gorge may destroy the drone and the medicine, so “land” is not a safe default everywhere.
How to check: read an official drone-safety or manufacturer document, or a regulator page, on lost-link behaviour.

2. “25 km means about 12 km each way.”

Unsupported assumption: the draft asks you to confirm it but then builds on it. Your scenario says “battery range limited to about 25 km”, which could also mean a 25 km one-way radius.
Alternative interpretation: with a payload, headwind and cold, usable range may be well under half of the nominal figure.
How to check: state your interpretation in the Assumptions label and treat it as a design parameter, not a fact.

3. “Developers share responsibility, probably not alone.”

Inaccuracy risk and missing reasoning: the draft lists the pharmacy, the manufacturer and the regulator but never says who is accountable for which failure. It also gives no reason why the developer’s share is large or small.
Counterexample: if the operator overrides the battery reserve against the documented limit, responsibility shifts toward the operator.
How to check: the ACM/IEEE-CS short code says what engineers owe the public. Any legal claim must be labelled for verification and not decided from the draft.

4. “Record nothing by default, keep footage only after an incident.”

Missing reasoning: if the camera records nothing, there is no evidence to decide whether an “incident” happened. The draft also does not say what counts as incident or who may trigger saving.
Counterexample: a rolling buffer that overwrites after a few minutes keeps crash evidence and limits what is stored.
How to check: look at a data-protection guideline on retention and purpose limitation.

5. “Tests cannot prove that no faults remain.”

Correct in substance but unsourced. It is stated as a fact with no locator.
How to check: find it in the testing chapter of a software engineering textbook and copy the exact page or section.

6. “Accepting a shorter range and less footage looks reasonable.”

Unsupported judgment: the draft never says how much shorter, and a range that is too short may make the route impossible. Then the drone never flies and the village still waits days for medicine.
Alternative: a relay or landing point mid-route, or a human-approved flight on better-weather days, might serve the users better than a fixed reserve.

7. Missing: the users. The paramedic and the dispatcher never appear. Who gets the alert when the link is lost, and who decides to continue or abort?
```

### B3 — Revision (Prompt C)

- **Tool:** (Claude)
- **Model:** Sonnet 5;.5
- **Date:** (write here)
- **Purpose:** revision using my decisions and verified evidence

**Prompt:**

```text
Revise the draft using my review decisions and source notes below. Keep the answer relevant to my scenario and preserve uncertainty where evidence is limited.

My decisions: (1) Failsafe claim: qualify. The failsafe action is a configurable setting, not one automatic behaviour, and landing over a gorge may be worse than continuing. (2) 25 km: accept the criticism. I assume 25 km is the total distance there and back, so about 12 km each way, and treat it as a design parameter, not a fact. (3) Responsibility: qualify. Developers answer for their own work, but the pharmacy operator and whoever approves each flight also share it; any legal claim stays marked for verification. (4) Camera: accept. Instead of recording nothing, use a short rolling buffer that overwrites itself and is saved only after an incident, with named staff and an audit log. (5) Testing cannot prove the absence of faults: accept, but I have not checked a source for it, so it must be flagged as unverified. (6) Shorter range: accept. If the range is too short the drone never flies, so consider a mid-route landing point or a human decision. (7) Users: accept. When the link is lost, both the paramedic and the dispatcher must be alerted.

Verified evidence: (a) PX4 Safety (Failsafe) Configuration, section "Data Link Loss Failsafe", https://docs.px4.io/v1.16/en/config/safety.html, accessed 2026-10-12: the action taken when the data link is lost is a setting with several options (disabled, hold, return, land, disarm, terminate), and return is described as a common failsafe action. (b) ACM/IEEE-CS Software Engineering Code of Ethics, short version, https://www.acm.org/code-of-ethics/software-engineering-code, accessed 2026-10-12: clause 1.01 says engineers accept full responsibility for their own work; clause 1.03 says they approve software only with a well-founded belief that it is safe, meets specifications, passes appropriate tests and does not diminish privacy; clause 1.04 says they disclose actual or potential danger to appropriate persons or authorities.

Draft: A medicine-delivery drone raises three linked concerns: safety (no harm to people or cargo), privacy (no filming of residents without consent) and accountability (someone answers when things go wrong). I separate facts from assumptions below.

**Facts (general, still to be verified)**
- Drones often have failsafes, such as returning to a launch point or landing, when the control link is lost.
- Navigation cameras can capture people incidentally, so video may count as personal data.
- Testing shows a system works in the cases tried; it cannot prove that no faults remain.

**Assumptions (yours or mine)**
- The village, pharmacy, range, weather and camera are fictional.
- I read "25 km" as total distance per battery, so about 12 km each way before any reserve. Please confirm this.
- Cold winter weather likely reduces the real range below 25 km; this is assumed, not measured.

**Your five ideas**
1. Return on connection loss: a sensible default, but not always the safest. Over the gorge, returning may be as risky as continuing, and the battery may not cover the return. A pre-planned rule (continue, return or land at the nearest safe site, depending on position and charge) handles more cases but is harder to test than one simple behaviour.
2. Developers are responsible: they share responsibility for design and testing, but probably not alone. The pharmacy running the service, whoever approves each flight, the manufacturer and the regulator also matter. I treat "developers only" as an unverified assumption. Logging who approved each flight is a design measure that supports accountability.
3. Safety versus range: decide this trade-off in advance, not mid-flight. A fixed battery reserve shortens deliveries but lowers crash risk. Urgent cases may tempt operators to override it, so an override should need a recorded reason.
4. Camera storage: it is safer to record nothing by default, use the camera for live navigation, keep footage only after an incident, and restrict access to named staff with an audit log. Less footage makes crash investigation harder but reduces privacy risk.
5. Testing: agreed, but tests should include lost connection, low battery and wind, first in simulation and then over safe terrain.

**Overall trade-off**
Every safeguard costs something: a battery reserve costs range, privacy limits cost investigation evidence, and extra rules cost testing effort. For this scenario, accepting a shorter range and less footage in return for lower risk to people looks reasonable, but that judgment depends on the assumptions above.

**Claims to verify**
- Return-to-home as a standard failsafe, and its known limits.
- Who is legally responsible for drone accidents and filming in your real jurisdiction (a legal claim; do not rely on me).
- Whether drone video counts as personal data under the relevant law.
- How cold weather affects battery range.

Show what you changed and why. Use only the sources I supplied. Flag remaining gaps instead of inventing details.
```

**Response:**

```text
Revised draft

A medicine-delivery drone raises three linked concerns: safety (no harm to people or cargo), privacy (no filming of residents without consent) and accountability (someone answers when things go wrong).

Facts supported by your sources

The action a drone takes when its data link is lost is a configurable setting with several options (disabled, hold, return, land, disarm, terminate); return is described as a common choice (PX4 documentation, “Data Link Loss Failsafe”).
The ACM/IEEE-CS short code says engineers accept full responsibility for their own work (1.01), approve software only with a well-founded belief that it is safe, passes appropriate tests and does not diminish privacy (1.03), and disclose potential danger to appropriate persons (1.04).

Assumptions

The village, pharmacy, range, weather and camera are fictional.
I treat “25 km” as the total distance there and back, about 12 km each way, as a design parameter, not a fact.
Cold weather probably reduces range further; this is not measured.

Revised ideas

Connection loss. Because the response is a setting, the team must choose it deliberately. A single “return” rule is weaker than a plan that depends on position and battery: over the gorge, landing may be worse than continuing, and the return leg may be beyond the battery.
Responsibility. Developers answer for their own work (1.01) and should not approve a flight system unless they believe it is safe and tested (1.03). The pharmacy operator and whoever approves each flight also share responsibility. Any legal claim stays unverified.
Safety versus range. Fix a battery reserve in advance and require a recorded reason for any override. If the reserve makes the route impossible, consider a mid-route landing point or a human decision instead of cancelling the service.
Camera. Instead of recording nothing, keep a short rolling buffer that overwrites itself and is saved only after an incident, with named staff and an audit log. This keeps crash evidence while limiting stored footage.
Testing. Test lost connection, low battery and wind in simulation first, then over safe terrain. The statement that tests cannot prove the absence of faults is unverified.
Alerts. On link loss, both the paramedic and the dispatcher are alerted, in line with disclosing potential danger (1.04).

What I changed and why

Idea 1: changed from “a sensible default” to a deliberate choice, because the PX4 page shows the action is configurable.
Idea 2: kept the shared-responsibility view and tied it to 1.01 and 1.03; the code does not say who else is responsible, so that part stays an assumption.
Idea 4: replaced “record nothing” with a rolling buffer, because without footage nobody could establish what happened after a crash.
Ideas 3 and 6: added the mid-route option and the dual alert from your decisions.

Remaining gaps

No source was supplied for the testing claim, the effect of cold on battery range, whether drone video is personal data, or legal responsibility; these stay unverified.
The “12 km each way” figure is an assumption.
```

## 9. Appendix C — Evidence tables

### Verification table

<!-- At least two complete rows. Source and locator: title + page / slide / section / chapter,
     or title + URL + access date (YYYY-MM-DD). Decision: keep, qualify or reject — one word. -->

| Drones often have failsafes, such as returning to a launch point or landing, when the control link is lost. | PX4 Safety (Failsafe) Configuration, section Data Link Loss Failsafe. URL: https://docs.px4.io/v1.16/en/config/safety.html; accessed 2026-10-12 | The page lists several configurable actions for data link loss (disabled, hold, return, land, disarm, terminate) and calls return a common one, so the claim holds only as a configurable choice. | qualify |
| they share responsibility for design and testing, but probably not alone | ACM/IEEE-CS Software Engineering Code, Principle 1, clauses 1.01 and 1.03. URL: https://www.acm.org/code-of-ethics/software-engineering-code; accessed 2026-10-12 | Clause 1.01 says engineers accept full responsibility for their own work and 1.03 ties approval to safety and testing; the code says nothing about who else shares responsibility, so that part stays an assumption. | qualify |

### Change log

<!-- At least two substantive revisions. Your final version must differ from the AI wording,
     and the reason must say which evidence or scenario constraint made you change it. -->

| record nothing by default, use the camera for live navigation, keep footage only after an incident | Keep a short rolling buffer that overwrites itself and is saved only after an incident, with named staff and an audit log. | Without any recording there is no evidence of what happened after a crash over the gorge, while ACM clause 1.03 requires that the system does not diminish privacy, so storage is limited, not removed. |
| Return on connection loss: a sensible default, but not always the safest. | The loss-of-link action is a configurable setting, so the team chooses it deliberately for each part of the route. | The PX4 page lists several options (hold, return, land and others), and with a 12 km one-way range over a gorge no single default fits every position. |
