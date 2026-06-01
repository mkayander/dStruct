"""Readable string formatting for Python harness return values (UI parity with stringifySolutionResult)."""

from __future__ import annotations

from typing import Any, List

from array_tracker import TrackedList
from collection_tracker import TrackedDict, TrackedFrozenSet, TrackedSet
from tree_utils import ListNode, TreeNode, binary_tree_to_display_string, linked_list_to_display_string


def compose_run_output(stdout: str, result: object) -> str:
    """Merge captured print output and formatted return value (one block for the UI)."""
    stripped = stdout.rstrip("\n") if stdout else ""
    if result is None:
        return stripped
    formatted = format_python_return_value(result)
    if stripped and formatted:
        return f"{stripped}\n{formatted}"
    if stripped:
        return stripped
    return formatted


def format_python_return_value(value: object, *, depth: int = 0) -> str:
    """Format a solution return value for display (avoid default `<Class at 0x…>`)."""
    if depth > 24:
        return "…"

    if value is None:
        return "None"
    if isinstance(value, bool):
        return "True" if value else "False"
    if isinstance(value, (int, float)):
        if isinstance(value, float) and value != value:
            return "nan"
        if value == float("inf"):
            return "inf"
        if value == float("-inf"):
            return "-inf"
        if isinstance(value, float) and value == int(value):
            return str(int(value))
        return str(value)

    if isinstance(value, str):
        return repr(value)

    if isinstance(value, TrackedList):
        parts = [
            format_python_return_value(item, depth=depth + 1) for item in value
        ]
        return "[" + ", ".join(parts) + "]"

    if isinstance(value, list):
        parts = [
            format_python_return_value(item, depth=depth + 1) for item in value
        ]
        return "[" + ", ".join(parts) + "]"

    if isinstance(value, TrackedDict):
        pairs = [
            f"{format_python_return_value(key, depth=depth + 1)}: "
            f"{format_python_return_value(nested, depth=depth + 1)}"
            for key, nested in value.items()
        ]
        return "{" + ", ".join(pairs) + "}"

    if isinstance(value, dict):
        pairs = [
            f"{format_python_return_value(key, depth=depth + 1)}: "
            f"{format_python_return_value(nested, depth=depth + 1)}"
            for key, nested in value.items()
        ]
        return "{" + ", ".join(pairs) + "}"

    if isinstance(value, (TrackedSet, TrackedFrozenSet)):
        parts = sorted(
            (format_python_return_value(item, depth=depth + 1) for item in value),
            key=lambda text: text,
        )
        name = type(value).__name__
        return f"{name}{{{', '.join(parts)}}}"

    if isinstance(value, frozenset):
        parts = sorted(
            (format_python_return_value(item, depth=depth + 1) for item in value),
            key=lambda text: text,
        )
        return f"frozenset({{{', '.join(parts)}}})"

    if isinstance(value, set):
        parts = sorted(
            (format_python_return_value(item, depth=depth + 1) for item in value),
            key=lambda text: text,
        )
        return f"set({{{', '.join(parts)}}})"

    if isinstance(value, TreeNode):
        return binary_tree_to_display_string(value)

    if isinstance(value, ListNode):
        return linked_list_to_display_string(value)

    try:
        text = repr(value)
    except Exception:
        text = object.__repr__(value)
    if text.startswith("<") and " object at " in text:
        return f"<{type(value).__name__}>"
    return text
