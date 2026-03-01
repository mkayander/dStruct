Now make a deep review of the code and make sure it follows best practices like DRY, KISS, SOLID, covers security principles, does not have memory leaks or possible race conditions.
In flows where something goes wrong, we must explicitly fail with a visible error, not continue silently.
If you found things to improve, try to cover them with unit tests to avoid regression.
