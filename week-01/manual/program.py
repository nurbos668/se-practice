raw_input = input("Enter marks separated by commas: ")
marks = raw_input.split(", ")
valid_marks = []

for el in marks:
    try:
        value = float(el)
    except ValueError:
        continue

    if 0 <= value <= 100:
        valid_marks.append(value)

if len(valid_marks) == 0:
    print("No valid marks found.")
else:
    average = sum(valid_marks) / len(valid_marks)
    passing_count = sum(1 for value in valid_marks if value >= 50)
    pass_rate = (passing_count / len(valid_marks)) * 100

    print(f"Valid marks: {len(valid_marks)}")
    print(f"Average: {average:.2f}")
    print(f"Highest: {max(valid_marks)}")
    print(f"Lowest: {min(valid_marks)}")
    print(f"Pass rate: {pass_rate:.1f}%")