def analyze_marks(marks, pass_mark=50):
    """
    Analyze a list of student marks.

    Args:
        marks (list): List of numeric marks (0-100).
        pass_mark (float): Minimum mark to be considered a pass (default 50).

    Returns:
        dict: {
            'average': float,
            'highest': number,
            'lowest': number,
            'pass_rate': float  # percentage of marks >= pass_mark
        }

    Raises:
        ValueError: if marks is empty, contains non-numeric values,
                    or contains values outside the 0-100 range.
    """
    if not marks:
        raise ValueError("marks list cannot be empty")

    for m in marks:
        if isinstance(m, bool) or not isinstance(m, (int, float)):
            raise ValueError(f"non-numeric mark found: {m!r}")
        if m < 0 or m > 100:
            raise ValueError(f"mark out of range (0-100): {m!r}")

    total = sum(marks)
    count = len(marks)
    average = round(total / count, 2)
    highest = max(marks)
    lowest = min(marks)
    passed = sum(1 for m in marks if m >= pass_mark)
    pass_rate = round((passed / count) * 100, 2)

    return {
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate,
    }


# ---------------- Tests ----------------
if __name__ == "__main__":

    # Example from prompt
    result = analyze_marks([40, 60, 80], 50)
    assert result == {"average": 60.0, "highest": 80, "lowest": 40, "pass_rate": 66.67}, result

    # 1. Single mark
    result = analyze_marks([75])
    assert result == {"average": 75.0, "highest": 75, "lowest": 75, "pass_rate": 100.0}, result

    # 2. Decimal marks
    result = analyze_marks([55.5, 60.25, 70.1])
    assert result["average"] == round((55.5 + 60.25 + 70.1) / 3, 2), result
    assert result["highest"] == 70.1
    assert result["lowest"] == 55.5

    # 3. Custom pass_mark
    result = analyze_marks([30, 45, 60, 90], pass_mark=60)
    assert result["pass_rate"] == 50.0, result  # 2 of 4 marks >= 60

    # 4. Empty list -> ValueError
    try:
        analyze_marks([])
        assert False, "Expected ValueError for empty list"
    except ValueError:
        pass

    # 5. Text value -> ValueError
    try:
        analyze_marks([50, "abc", 70])
        assert False, "Expected ValueError for non-numeric value"
    except ValueError:
        pass

    # 6. Out-of-range marks (< 0 or > 100)
    try:
        analyze_marks([50, -5, 70])
        assert False, "Expected ValueError for mark below 0"
    except ValueError:
        pass

    try:
        analyze_marks([50, 105, 70])
        assert False, "Expected ValueError for mark above 100"
    except ValueError:
        pass

    print("All tests passed.")