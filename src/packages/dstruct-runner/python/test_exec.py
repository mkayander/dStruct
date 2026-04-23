"""Unit tests for safe_exec (entry function, globals scope, tracked args)."""

from __future__ import annotations

import unittest

from exec import safe_exec


class TestSafeExec(unittest.TestCase):
    def test_recursive_entry_function_is_callable(self) -> None:
        code = """
def run(root):
    if not root:
        return None
    return run(root.left)
"""
        args = [
            {
                "type": "binaryTree",
                "value": {
                    "levelOrder": [1],
                    "nodeIds": ["only"],
                    "treeName": "t",
                },
            }
        ]
        result = safe_exec(code, args)
        self.assertIsNone(result["error"])

    def test_tracked_binary_tree_set_color_appears_in_callstack(self) -> None:
        code = """
def solve(root):
    root.setColor("green")
    return root.val
"""
        args = [
            {
                "type": "binaryTree",
                "value": {
                    "levelOrder": [1],
                    "nodeIds": ["node-1"],
                    "treeName": "t",
                },
            }
        ]
        result = safe_exec(code, args)
        self.assertIsNone(result["error"])
        names = [frame["name"] for frame in result["callstack"]]
        self.assertIn("setColor", names)

    def test_helper_after_entry_can_be_called(self) -> None:
        code = """
def entry(x):
    print(double(x))

def double(y):
    return y * 2
"""
        args = [{"type": "number", "value": 21}]
        result = safe_exec(code, args)
        self.assertIsNone(result["error"])
        self.assertIn("42", result["output"])

    def test_inline_dict_literal_emits_map_frames(self) -> None:
        code = """
def solve():
    d = {"a": 1}
    _ = d["a"]
    d["b"] = 2
    return len(d)
"""
        result = safe_exec(code, None)
        self.assertIsNone(result["error"])
        arg_types = {frame.get("argType") for frame in result["callstack"]}
        self.assertIn("map", arg_types)
        names = [frame["name"] for frame in result["callstack"]]
        self.assertIn("readArrayItem", names)
        self.assertIn("addArrayItem", names)

    def test_inline_set_literal_emits_set_frames(self) -> None:
        code = """
def solve():
    s = {1, 2}
    _ = 1 in s
    s.add(3)
    return len(s)
"""
        result = safe_exec(code, None)
        self.assertIsNone(result["error"])
        arg_types = {frame.get("argType") for frame in result["callstack"]}
        self.assertIn("set", arg_types)

    def test_array_argument_nested_dict_is_tracked(self) -> None:
        code = """
def solve(rows):
    return rows[0]["k"]
"""
        args = [
            {
                "type": "array",
                "value": [{"k": 7}],
            }
        ]
        result = safe_exec(code, args)
        self.assertIsNone(result["error"])
        map_frames = [
            frame
            for frame in result["callstack"]
            if frame.get("argType") == "map"
        ]
        self.assertGreater(len(map_frames), 0)

    def test_map_argument_is_tracked(self) -> None:
        code = """
def solve(m):
    m["x"] = 1
    return m.get("x", 0)
"""
        args = [{"type": "map", "value": {}}]
        result = safe_exec(code, args)
        self.assertIsNone(result["error"])
        names = [frame["name"] for frame in result["callstack"]]
        self.assertIn("addArrayItem", names)


if __name__ == "__main__":
    unittest.main()
