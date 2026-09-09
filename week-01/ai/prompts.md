Rocket Enhanced

A personal internal tool for processing student marks — input a list of marks and instantly see the average, highest score, lowest score, and pass rate. Designed for single-user use with a clean, straightforward interface focused entirely on quick results.

Building with Next.js and TypeScript.




### Case A: 85, 23, 45, 90, 92
**Input:** 85, 23, 45, 90, 92
**App output:** Valid marks: 5, Average: 67, Highest: 92, Lowest: 23, Pass rate: 60.0%
**Matches spec?** Almost — all values correct, but Average is shown as "67" instead of "67.00" 
(missing 2 decimal places as required by the spec).




### Case B: 88, 47, -5, 101, abc, 73, 50, , 100
**Input:** 88, 47, -5, 101, abc, 73, 50, , 100
**App output:** Valid marks: 5, Average: 71.60, Highest: 100, Lowest: 47, Pass rate: 80.0%, 
Failing count: 1
**Matches spec?** Yes on required fields — all values correct, including invalid values 
correctly ignored. However, app also displays "Failing count" which was not part of the 
original specification — an extra feature Rocket added on its own.





### Case C: 10, 20, 30
**Input:** 10, 20, 30
**App output:** Valid marks: 3, Average: 20.0, Highest: 30, Lowest: 10, Pass rate: 0.0%, 
Failing count: 3
**Matches spec?** Almost — all required values correct, but Average shows "20.0" instead 
of "20.00" (spec requires exactly 2 decimal places).




### Case D: abc, , xyz
**Input:** abc, , xyz
**App output:** "No marks entered yet" (plus examples of valid mark format shown to guide 
the user)
**Matches spec?** Partially — no crash occurred, which satisfies the core requirement. 
However, the message "No marks entered yet" is slightly misleading: marks WERE entered, 
they were just all invalid. A more accurate message would be something like 
"No valid marks found" to distinguish between an empty input and invalid input.



## Fixing the defect

**Prompt used:** "The average is not showing 2 decimal places (e.g. shows '67' instead of 
'67.00'). Please format the average to always display exactly 2 decimal places."

**Result:** Fixed — average now consistently shows exactly 2 decimal places across all cases 
(e.g. 67.00, 20.00, 71.60).

**Did it break anything else?** No — re-tested all four cases (A, B, C, D) after the fix, 
and all other fields (valid count, highest, lowest, pass rate) remained correct. No new 
issues introduced.
 




## Note on Rocket code
Rocket did not offer a code download option in the free tier. Instead, documentation for 
this part consists of screenshots (see `week-01/ai/screenshots/`) and the live preview link: 
[https://www.rocket.new/6aa108d222afed001449161b#preview]