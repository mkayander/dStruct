"""Mutable source line context for Python harness (1-based lines, 0-based columns)."""

from __future__ import annotations

from typing import Any, Dict, Optional

_line: Optional[int] = None
_column: Optional[int] = None


def set_execution_source(line: int, column: int = 0) -> None:
    global _line, _column
    _line = line
    _column = column


def clear_execution_source() -> None:
    global _line, _column
    _line = None
    _column = None


def snapshot_for_frame() -> Optional[Dict[str, Any]]:
    if _line is None:
        return None
    out: Dict[str, Any] = {"line": _line}
    if _column is not None:
        out["column"] = _column
    return out
