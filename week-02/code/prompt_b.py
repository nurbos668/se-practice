def analyze_marks(marks, pass_mark=50):
    if not isinstance(marks, list) or len(marks) == 0:
        raise ValueError("marks must be a non-empty list")

    for m in marks:
        if isinstance(m, bool) or not isinstance(m, (int, float)):
            raise ValueError(f"Non-numeric mark found: {m!r}")
        if m < 0 or m > 100:
            raise ValueError(f"Mark out of range (0-100): {m}")

    total = sum(marks)
    count = len(marks)
    passed = sum(1 for m in marks if m >= pass_mark)

    return {
        "average": total / count,
        "highest": max(marks),
        "lowest": min(marks),
        "pass_rate": (passed / count) * 100,
    }