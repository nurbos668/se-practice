# Traceability — use cases → stories → criteria

One row per use case. All six rows stay, even the ones with nothing behind them: an empty cell is a
finding you report, not a failure you hide. Use real IDs, comma-separated; write `none` where there
is nothing.

| Use case | Stories (US-nn) | Criteria (AC-nn) | Gap? |
| --- | --- | --- | --- |
| UC-01 View availability | US-01 | none | Yes — no AC written for this story |
| UC-02 Book room | US-02 | AC-01, AC-02, AC-03, AC-04, AC-05 | No |
| UC-03 Cancel booking | US-03 | AC-06, AC-07, AC-08 | No |
| UC-04 Block or unblock room | US-06, US-07 | AC-09, AC-10, AC-11 | No |
| UC-05 Review usage | US-08 | none | Yes — no AC written for this story |
| UC-06 Send confirmation | US-04, US-05 | none | Yes — no AC written for this story |

**Stories that belong to no use case:** none

**What the gaps tell you:** Acceptance criteria were only written for three selected stories (US-02, US-03, US-06), per the scope of Part 3, so UC-01, UC-05 and UC-06 have stories but no tested criteria yet — a coverage gap, not a missing requirement.
