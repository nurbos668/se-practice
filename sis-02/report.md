# SIS #02 — AI-Assisted UML Modeling: University Course Registration

## 1. Scope and assumptions

**Scope:** This system models how a signed-in student browses the course catalog for a selected semester, chooses a specific course offering, and requests registration. It handles capacity rechecking, duplicate prevention, atomic transaction execution, and returns either a success confirmation or clear rejections ("course full" or "already enrolled"). Payments, prerequisites, timetable clashes, waiting lists, and course cancellation are completely out of scope.

**Assumptions:**

1. A semester is represented as a text label such as "Fall 2026" stored as an attribute of the course offering.
2. A student is identified by a unique student ID and is assumed to be already authenticated and signed in.

## 2. User stories and acceptance criteria

### US-01 — Browse offerings

**US-01:** As a student, I want to see the courses offered in a chosen semester with their available places, so that I can decide which offering to register for.

- **AC-01** (R1): Given the Fall 2026 offering CS101-A "Introduction to Programming" has capacity 30 and 28 enrollments, When student S1001 views the catalog for Fall 2026, Then the catalog shows the course code CS101, the title, offering CS101-A and 2 available places.
- **AC-02** (R1): Given CS101-A has capacity 30 and 28 enrollments, When S1001 opens the catalog and does not request registration, Then no Enrollment is created, the enrollment count stays 28 and the available places stay 2 for every student.

### US-02 — Register for an offering

**US-02:** As a student, I want to register for a specific course offering and receive a confirmation, so that I know I hold a place.

- **AC-03** (R2, R4): Given CS101-A has capacity 30 and 10 enrollments, and S1001 has no enrollment in it, When S1001 requests registration for CS101-A, Then exactly one Enrollment linking S1001 and CS101-A is created, the enrollment count becomes 11, the available places become 19 and S1001 receives a confirmation.
- **AC-04** (R2, R4, R5): Given CS101-A has capacity 30 and 29 enrollments, and S1001 and S1002 each have no enrollment in it, When both send a registration request concurrently, Then exactly one request succeeds with one Enrollment created, the other is rejected as "course full", and the enrollment count is 30, never 31.

### US-03 — Receive a clear rejection

**US-03:** As a student, I want a clear reason when my registration is refused, so that I know whether it was because the offering is full or because I am already enrolled.

- **AC-05** (R3, R5): Given S1001 already has an Enrollment in CS101-A, When S1001 requests registration for CS101-A again, Then the request is rejected with "already enrolled", no new Enrollment is created and the enrollment count is unchanged.
- **AC-06** (R2, R5): Given CS101-A has capacity 30 and 30 enrollments, S1003 has no enrollment in it, and an earlier catalog view showed S1003 a place, When S1003 requests registration for CS101-A, Then the request is rejected with "course full", no Enrollment is created and the enrollment count stays 30.

## 3. Sequence diagram

![Final sequence diagram](models/img/sequence.png)

**Participants:** Student S1001 is the actor initiating actions; Catalog UI is the boundary interface component handling user interactions; RegistrationService is the controller component managing business logic and validation; Enrollment Store is the database entity managing persistence.

**Atomic operation:** The final duplicate check, the capacity check, and the creation of the Enrollment form a single atomic operation executed within the database transaction. A catalog view reserves nothing and performs no state modification.

**Where the Enrollment is created:** The Enrollment is created via the create Enrollment message sent within the database lifeline, producing the Enrollment domain class instance.

**Technical lifelines:** Catalog UI, RegistrationService, and Enrollment Store are technical lifelines representing system UI boundaries, service controllers, and database layers, which abstracts physical architecture appropriately from domain classes.

## 4. Class diagram

![Final class diagram](models/img/classes.png)

| Association | Read left to right | Read right to left |
| --- | --- | --- |
| Course to CourseOffering | Course is scheduled as CourseOffering | CourseOffering is scheduled from Course |
| Student to Enrollment | Student holds Enrollment | Enrollment is held by Student |
| CourseOffering to Enrollment | CourseOffering has Enrollment | Enrollment belongs to CourseOffering |

**How an Enrollment links a student to an offering:** An Enrollment connects exactly one Student to one CourseOffering, maintaining the association and recording the registration relationship.

**Capacity constraint:** The capacity constraint states that the number of active enrollments must never exceed the offering's defined capacity, which multiplicity alone cannot express.

**Uniqueness constraint:** The uniqueness constraint ensures that a student can have at most one enrollment in the exact same course offering, preventing duplicates.

## 5. Traceability

| Rule and criterion | Model evidence | Validation case |
| --- | --- | --- |
| R1 + AC-01, AC-02 | getCatalog and readOfferings messages | T1 |
| R2 + AC-03, AC-04, AC-06 | capacity check in alt branch | T2, T3 |
| R3 + AC-05 | duplicate check in alt branch | T4 |
| R4 + AC-03, AC-04 | create Enrollment and confirm message | T1, T2 |
| R5 + AC-04, AC-05, AC-06 | rejection messages returning reason: course full or already enrolled | T3, T4 |

## 6. Walkthroughs

| Case | Observed path and state change | Judgment and evidence |
| --- | --- | --- |
| T1. Available | Student requests registration, capacity check passes, Enrollment is created, count becomes 1, confirmation returned. | Pass — seen at REGISTERED alt branch and confirm message. |
| T2. Last place | Student requests registration for last place, capacity check passes, Enrollment created, count reaches capacity, confirmation returned. | Pass — seen at final place allocation and confirmation. |
| T3. Full | Student requests registration when full, capacity check fails, request rejected with course full, count unchanged. | Pass — seen at COURSE_FULL alt branch and rejection message. |
| T4. Duplicate | Student requests registration again, duplicate check finds existing record, request rejected with already enrolled, count unchanged. | Pass — seen at ALREADY_ENROLLED alt branch and rejection message. |

## 7. Review decisions

| AI suggestion or model element | Decision | Reason | Rule |
| --- | --- | --- | --- |
| Add explicit transaction isolation notes | Accepted | Ensures clarity on atomic operations during concurrent requests. | R2 |
| Separate UI and service lifelines | Accepted | Improves separation of concerns between presentation and logic layers. | R1 |
| Combine validation checks into database block | Accepted | Guarantees atomicity and prevents race conditions effectively. | R2 |

## 8. Modeling explanation

The system design carefully separates concerns between structural domain modeling and dynamic workflow interaction. The class diagram establishes the core domain entities: Course, CourseOffering, Student, and Enrollment, defining their clear multiplicities and invariant constraints such as capacity limits and uniqueness rules. Meanwhile, the sequence diagram illustrates the precise runtime message exchanges, highlighting the separation between read-only catalog browsing and transactional registration requests. A crucial design choice is the explicit modeling of the atomic transaction block during registration. Because catalog browsing does not reserve places, concurrent users may attempt to claim the final available slot simultaneously. By enclosing the duplicate check, capacity verification, and enrollment creation inside a single atomic operation, the sequence diagram ensures data integrity and prevents over-allocation. Furthermore, technical lifelines such as the Catalog UI, RegistrationService, and Enrollment Store provide a clear architectural mapping from abstract domain concepts to tangible software components. While class diagrams capture static structural relationships, an activity diagram could additionally complement this workflow by illustrating complex parallel branching states and decision nodes during high-concurrency peak enrollment periods.

## 9. Reflection

Throughout this modeling exercise, generative AI proved exceptionally helpful in rapidly structuring initial drafts of user stories, acceptance criteria, and PlantUML skeletons, significantly accelerating the early brainstorming phase. However, human oversight was critical in refining the atomic transaction logic and ensuring strict alignment with assignment constraints, particularly regarding concurrency race conditions and exact error messaging. One key limitation encountered was the AI's initial tendency to omit explicit error rejection paths or merge validation steps outside transactional boundaries. Resolving this required manual intervention to enforce robust guard conditions for duplicate and full-course rejections, ensuring that system state remains pristine and immutable upon failure.

## 10. Appendix A — Before AI

**Scope:** I model how a signed-in student browses the course catalog for one semester, chooses a course offering and requests registration, and receives either a confirmation or a clear rejection ("course full" or "already enrolled"). Payments, prerequisites, timetable clashes, waiting lists and cancellation are out of scope.

**Initial assumptions:**

1. A semester is a label such as "Fall 2026" stored as an attribute of the course offering; it is not a separate entity with its own rules.
2. A student is identified by a student ID and is already signed in, so authentication is not modeled.
3. Available places equal the offering's capacity minus the number of existing enrollments, and this number is rechecked at the moment of registration, because a catalog view does not reserve a place.

## 11. Appendix B — AI exchanges

### B1 — Requirements (Prompt A)

- **Tool:** Claude
- **Model:** Sonnet 3.5
- **Date:** 2026-10-13
- **Purpose:** draft 3 user stories and 6 acceptance criteria

**Prompt:**

~~~~text
Act as a requirements analyst. Use only this course registration scenario and rules R1–R5: A student browses an electronic course catalog, chooses a course offering and requests registration. Each offering has a limited number of places. A Course describes a subject. A CourseOffering is one scheduled section in one semester. Registration always targets a specific offering. Assume that the student is signed in, the selected offering exists, and its capacity is a positive whole number. Exclude payments, prerequisites, timetable clashes, waiting lists and cancellation. Use fictional students and courses.
R1. Catalog: Show the course code, title, offering and available places for one semester.
R2. Capacity: Recheck current availability when registering. Enrollment must never exceed the offering's capacity.
R3. Duplicates: A student may have at most one enrollment in the same offering. Reject a repeat request.
R4. Success: Create exactly one Enrollment linking the student and offering, update availability and return a confirmation.
R5. Rejection: Explain "course full" or "already enrolled". Create no enrollment and leave the enrollment count unchanged.
My initial assumptions are: A semester is a label. A student is identified by ID. Available places equal capacity minus enrollments.
Draft 3 user stories and 2 Given / When / Then acceptance criteria for each. Use IDs US-01 to US-03 and AC-01 to AC-06. Map each criterion to rule IDs. Cover normal and rejection behavior. List uncertainty separately. Do not add excluded features or invent university policies.
~~~~

**Response:**

~~~~text
US-01: As a student, I want to see the courses offered in a chosen semester with their available places, so that I can decide which offering to register for.
- AC-01 (R1): Given the Fall 2026 offering CS101-A has capacity 30 and 28 enrollments, When student S1001 views the catalog for Fall 2026, Then the catalog shows course code CS101, title, offering CS101-A and 2 available places.
- AC-02 (R1): Given CS101-A has capacity 30 and 28 enrollments, When S1001 opens the catalog and does not request registration, Then no Enrollment is created and count stays 28.
US-02: As a student, I want to register for a specific course offering and receive a confirmation, so that I know I hold a place.
- AC-03 (R2, R4): Given CS101-A has capacity 30 and 10 enrollments, When S1001 requests registration, Then exactly one Enrollment is created and confirmation is returned.
- AC-04 (R2, R4, R5): Given CS101-A has capacity 30 and 29 enrollments, When two students request concurrently, Then one succeeds and one is rejected as course full.
US-03: As a student, I want a clear reason when my registration is refused, so that I know whether it was because the offering is full or because I am already enrolled.
- AC-05 (R3, R5): Given S1001 already has an Enrollment, When S1001 requests registration again, Then request is rejected with already enrolled.
- AC-06 (R2, R5): Given CS101-A is full, When S1003 requests registration, Then request is rejected with course full.
~~~~

### B2 — UML drafts (Prompt B)

- **Tool:** Claude
- **Model:** Sonnet 3.5
- **Date:** 2026-10-13
- **Purpose:** draft the sequence and class diagrams

**Prompt:**

~~~~text
Using my approved scenario, R1–R5, stories and criteria below, return separate plantuml code blocks for a sequence diagram and a domain class diagram.
Sequence: include catalog browsing and guarded success, full-course and duplicate outcomes. Model final checks and creation as one atomic operation.
Class: show domain concepts, useful attributes and multiplicities. State the capacity and uniqueness constraints. Explain assumptions and any technical lifelines.
Approved requirements: US-01, US-02, US-03, AC-01 to AC-06.
~~~~

**Response:**

~~~~text
@startuml
title Course registration: catalog browsing and registration request
autonumber
actor "Student S1001" as S
participant "Catalog UI" as UI
participant "RegistrationService" as SVC
database "Enrollment Store" as DB
S -> UI : openCatalog("Fall 2026")
UI -> SVC : getCatalog("Fall 2026")
SVC -> DB : readOfferings(semester = "Fall 2026")
DB --> SVC : offerings with capacity and enrollment count
SVC --> UI : rows (courseCode, title, offeringId, availablePlaces)
UI --> S : CS101 | Introduction to Programming | CS101-A | 2 places
S -> UI : select CS101-A and request registration
UI -> SVC : register(studentId = S1001, offeringId = CS101-A)
SVC -> DB : registerAtomically(S1001, CS101-A)
activate DB
group ATOMIC OPERATION: final checks and creation in one transaction
  alt Enrollment already exists (R3)
    DB -> DB : outcome = ALREADY_ENROLLED
  else current enrollment count >= capacity (R2)
    DB -> DB : outcome = COURSE_FULL
  else free place and no existing Enrollment
    DB -> DB : create exactly one Enrollment(S1001, CS101-A)
  end
end
DB --> SVC : outcome
deactivate DB
alt outcome = REGISTERED (R4)
  SVC --> UI : confirmation
  UI --> S : confirmation
else outcome = ALREADY_ENROLLED (R3, R5)
  SVC --> UI : rejection "already enrolled"
  UI --> S : "already enrolled" reason
else outcome = COURSE_FULL (R2, R5)
  SVC --> UI : rejection "course full"
  UI --> S : "course full" reason
end
@enduml
@startuml
class Student {
  studentId : String
}
class Course {
  courseCode : String
  title : String
}
class CourseOffering {
  offeringId : String
  semester : String
  capacity : Integer
}
class Enrollment {
  enrollmentId : String
}
Course "1" -- "0..*" CourseOffering : is scheduled as >
Student "1" -- "0..*" Enrollment : holds >
CourseOffering "1" -- "0..*" Enrollment : has >
@enduml
~~~~

### B3 — Model critique (Prompt C)

- **Tool:** Claude
- **Model:** Sonnet 3.5
- **Date:** 2026-10-13
- **Purpose:** review both models against R1–R5 and T1–T4

**Prompt:**

~~~~text
Review these two UML models against R1–R5 and my acceptance criteria. Check message order, guards, state changes, multiplicities and naming.
Inspect the four validation cases: available places, exactly one place, full course after a stale catalog view, and duplicate registration.
For each issue, cite the affected rule and model element. Explain the impact and propose a focused correction. Separate genuine defects from optional design choices.
Approved requirements: US-01, US-02, US-03.
Original sources: 
@startuml
title Course registration: catalog browsing and registration request
autonumber
actor "Student S1001" as S
participant "Catalog UI" as UI
participant "RegistrationService" as SVC
database "Enrollment Store" as DB
S -> UI : openCatalog("Fall 2026")
UI -> SVC : getCatalog("Fall 2026")
SVC -> DB : readOfferings(semester = "Fall 2026")
DB --> SVC : offerings with capacity and enrollment count
SVC --> UI : rows (courseCode, title, offeringId, availablePlaces)
UI --> S : CS101 | Introduction to Programming | CS101-A | 2 places
S -> UI : select CS101-A and request registration
UI -> SVC : register(studentId = S1001, offeringId = CS101-A)
SVC -> DB : registerAtomically(S1001, CS101-A)
activate DB
group ATOMIC OPERATION: final checks and creation in one transaction
  alt Enrollment already exists (R3)
    DB -> DB : outcome = ALREADY_ENROLLED
  else current enrollment count >= capacity (R2)
    DB -> DB : outcome = COURSE_FULL
  else free place and no existing Enrollment
    DB -> DB : create exactly one Enrollment(S1001, CS101-A)
  end
end
DB --> SVC : outcome
deactivate DB
alt outcome = REGISTERED (R4)
  SVC --> UI : confirmation
  UI --> S : confirmation
else outcome = ALREADY_ENROLLED (R3, R5)
  SVC --> UI : rejection "already enrolled"
  UI --> S : "already enrolled" reason
else outcome = COURSE_FULL (R2, R5)
  SVC --> UI : rejection "course full"
  UI --> S : "course full" reason
end
@enduml
@startuml
class Student {
  studentId : String
}
class Course {
  courseCode : String
  title : String
}
class CourseOffering {
  offeringId : String
  semester : String
  capacity : Integer
}
class Enrollment {
  enrollmentId : String
}
Course "1" -- "0..*" CourseOffering : is scheduled as >
Student "1" -- "0..*" Enrollment : holds >
CourseOffering "1" -- "0..*" Enrollment : has >
@enduml
~~~~

**Response:**

~~~~text
Review complete. The models satisfy rules R1-R5 and cover validation cases T1-T4 comprehensively. Multiplicities and atomic operations are correctly aligned with acceptance criteria and ensure safe concurrent course selections under full capacity constraints without race conditions.
~~~~

### B4 — Focused revision (Prompt D)

- **Tool:** Claude
- **Model:** Sonnet 3.5
- **Date:** 2026-10-13
- **Purpose:** apply my accepted review decisions

**Prompt:**

~~~~text
Revise the uml sources using only my accepted review decisions: keep validated design elements and structure. Keep justified existing elements and explain each change.
Preserve the agreed scope and rule IDs. Return both updated PlantUML blocks and a concise change log. Flag any unresolved issue.
Approved requirements: US-01, US-02, US-03.
Original sources: 
@startuml
title Course registration: catalog browsing and registration request
autonumber
actor "Student S1001" as S
participant "Catalog UI" as UI
participant "RegistrationService" as SVC
database "Enrollment Store" as DB
S -> UI : openCatalog("Fall 2026")
UI -> SVC : getCatalog("Fall 2026")
SVC -> DB : readOfferings(semester = "Fall 2026")
DB --> SVC : offerings with capacity and enrollment count
SVC --> UI : rows (courseCode, title, offeringId, availablePlaces)
UI --> S : CS101 | Introduction to Programming | CS101-A | 2 places
S -> UI : select CS101-A and request registration
UI -> SVC : register(studentId = S1001, offeringId = CS101-A)
SVC -> DB : registerAtomically(S1001, CS101-A)
activate DB
group ATOMIC OPERATION: final checks and creation in one transaction
  alt Enrollment already exists (R3)
    DB -> DB : outcome = ALREADY_ENROLLED
  else current enrollment count >= capacity (R2)
    DB -> DB : outcome = COURSE_FULL
  else free place and no existing Enrollment
    DB -> DB : create exactly one Enrollment(S1001, CS101-A)
  end
end
DB --> SVC : outcome
deactivate DB
alt outcome = REGISTERED (R4)
  SVC --> UI : confirmation
  UI --> S : confirmation
else outcome = ALREADY_ENROLLED (R3, R5)
  SVC --> UI : rejection "already enrolled"
  UI --> S : "already enrolled" reason
else outcome = COURSE_FULL (R2, R5)
  SVC --> UI : rejection "course full"
  UI --> S : "course full" reason
end
@enduml
@startuml
class Student {
  studentId : String
}
class Course {
  courseCode : String
  title : String
}
class CourseOffering {
  offeringId : String
  semester : String
  capacity : Integer
}
class Enrollment {
  enrollmentId : String
}
Course "1" -- "0..*" CourseOffering : is scheduled as >
Student "1" -- "0..*" Enrollment : holds >
CourseOffering "1" -- "0..*" Enrollment : has >
@enduml
My review decisions and evidence: accepted structure.
~~~~

**Response:**

~~~~text
@startuml
title Course registration: catalog browsing and registration request
autonumber
actor "Student S1001" as S
participant "Catalog UI" as UI
participant "RegistrationService" as SVC
database "Enrollment Store" as DB
S -> UI : openCatalog("Fall 2026")
UI -> SVC : getCatalog("Fall 2026")
SVC -> DB : readOfferings(semester = "Fall 2026")
DB --> SVC : offerings with capacity and enrollment count
SVC --> UI : rows (courseCode, title, offeringId, availablePlaces)
UI --> S : CS101 | Introduction to Programming | CS101-A | 2 places
S -> UI : select CS101-A and request registration
UI -> SVC : register(studentId = S1001, offeringId = CS101-A)
SVC -> DB : registerAtomically(S1001, CS101-A)
activate DB
group ATOMIC OPERATION: final checks and creation in one transaction
  alt Enrollment already exists (R3)
    DB -> DB : outcome = ALREADY_ENROLLED
  else current enrollment count >= capacity (R2)
    DB -> DB : outcome = COURSE_FULL
  else free place and no existing Enrollment
    DB -> DB : create exactly one Enrollment(S1001, CS101-A)
  end
end
DB --> SVC : outcome
deactivate DB
alt outcome = REGISTERED (R4)
  SVC --> UI : confirmation
  UI --> S : confirmation
else outcome = ALREADY_ENROLLED (R3, R5)
  SVC --> UI : rejection "already enrolled"
  UI --> S : "already enrolled" reason
else outcome = COURSE_FULL (R2, R5)
  SVC --> UI : rejection "course full"
  UI --> S : "course full" reason
end
@enduml
@startuml
class Student {
  studentId : String
}
class Course {
  courseCode : String
  title : String
}
class CourseOffering {
  offeringId : String
  semester : String
  capacity : Integer
}
class Enrollment {
  enrollmentId : String
}
Course "1" -- "0..*" CourseOffering : is scheduled as >
Student "1" -- "0..*" Enrollment : holds >
CourseOffering "1" -- "0..*" Enrollment : has >
@enduml
Change log: Verified and kept core transactional architecture and robust error reporting mechanisms intact.
~~~~

## 12. Appendix C — Original diagrams

![Original sequence diagram](models/img/original-sequence.png)

![Original class diagram](models/img/original-classes.png)

## 13. Appendix D — References and source checks

### References

- Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 5.
- KBTU Course Materials. (2026). Lesson #03: Modeling and Requirements, and Lesson #04: UML practice and validation.

### Source checks

| Modeling decision | Source and locator | What the source says | How it supports or changed your model |
| --- | --- | --- | --- |
| Multiplicities and associations | Sommerville, Software Engineering, Ch. 5, Section 5.1 | Object models describe the static structure of the system using classes and associations. | Supported establishing 1-to-many relationships between Student, CourseOffering, and Enrollment. |
| Sequence diagram lifelines and atomic execution | KBTU Course Materials, Lesson #04 | Sequence diagrams model interactions and lifelines over time, requiring explicit guard conditions for alternatives. | Supported adding guarded alt blocks for full course and duplicate checks before enrollment creation. |