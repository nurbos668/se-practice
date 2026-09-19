import statistics

# Sample data: student name -> marks (out of 100)
students = {
    "Alice": 88,
    "Bob": 45,
    "Charlie": 76,
    "Diana": 92,
    "Ethan": 58,
    "Fiona": 67,
    "George": 39,
    "Hannah": 81,
}

def get_grade(mark):
    if mark >= 90: return "A"
    elif mark >= 80: return "B"
    elif mark >= 70: return "C"
    elif mark >= 60: return "D"
    elif mark >= 50: return "E"
    else: return "F"

marks = list(students.values())

# --- Basic statistics ---
average = statistics.mean(marks)
median = statistics.median(marks)
std_dev = statistics.stdev(marks)
highest = max(students, key=students.get)
lowest = min(students, key=students.get)

print("=== Class Statistics ===")
print(f"Average: {average:.2f}")
print(f"Median: {median}")
print(f"Std Dev: {std_dev:.2f}")
print(f"Highest: {highest} ({students[highest]})")
print(f"Lowest: {lowest} ({students[lowest]})")

# --- Pass/Fail (assuming pass mark = 50) ---
pass_mark = 50
passed = [n for n, m in students.items() if m >= pass_mark]
failed = [n for n, m in students.items() if m < pass_mark]

print(f"\nPassed: {len(passed)} -> {passed}")
print(f"Failed: {len(failed)} -> {failed}")
print(f"Pass rate: {len(passed) / len(students) * 100:.1f}%")

# --- Grade distribution ---
print("\n=== Individual Results ===")
grade_counts = {}
for name, mark in sorted(students.items(), key=lambda x: -x[1]):
    grade = get_grade(mark)
    grade_counts[grade] = grade_counts.get(grade, 0) + 1
    print(f"{name:10s} | Marks: {mark:3d} | Grade: {grade}")

print("\n=== Grade Distribution ===")
for grade in sorted(grade_counts):
    print(f"{grade}: {grade_counts[grade]} student(s)")