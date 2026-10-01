def analyze_marks(marks, pass_mark=50):
    if not isinstance(marks, list) or len(marks) == 0:
        raise ValueError("marks must be a non-empty list")

    for m in marks:
        if isinstance(m, bool) or not isinstance(m, (int, float)):
            raise ValueError(f"Invalid mark (not numeric): {m!r}")
        if m < 0 or m > 100:
            raise ValueError(f"Mark out of range (0-100): {m!r}")

    total = sum(marks)
    average = total / len(marks)
    highest = max(marks)
    lowest = min(marks)

    pass_count = sum(1 for m in marks if m >= pass_mark)
    pass_rate = round((pass_count / len(marks)) * 100, 2)

    return {
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate,
    }


# ---------------- Tests ----------------
if __name__ == "__main__":
    # 1
    result = analyze_marks([40, 60, 80], 50)
    assert result == {"average": 60, "highest": 80, "lowest": 40, "pass_rate": 66.67}, result

    # 2
    result = analyze_marks([100], 50)
    assert result == {"average": 100, "highest": 100, "lowest": 100, "pass_rate": 100}, result

    # 3
    result = analyze_marks([49.5, 50], 50)
    assert result == {"average": 49.75, "highest": 50, "lowest": 49.5, "pass_rate": 50.0}, result

    # 4
    try:
        analyze_marks([], 50)
        assert False, "Expected ValueError for empty list"
    except ValueError:
        pass

    # 5
    try:
        analyze_marks([40, "60"], 50)
        assert False, "Expected ValueError for non-numeric value"
    except ValueError:
        pass

    # 6
    try:
        analyze_marks([-1, 50, 101], 50)
        assert False, "Expected ValueError for out-of-range value"
    except ValueError:
        pass

    print("All tests passed.")