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

    def test_tracked_list_iteration_does_not_recurse(self) -> None:
        # List literal is rewritten to TrackedList by ListTrackingTransformer.
        code = """
def run():
    total = 0
    for value in [1, 2, 3]:
        total += value
    print(total)
    return total
"""
        result = safe_exec(code, None)
        self.assertIsNone(result["error"])
        self.assertIn("6", result["output"])
        read_frames = [
            frame for frame in result["callstack"] if frame["name"] == "readArrayItem"
        ]
        self.assertGreaterEqual(len(read_frames), 3)

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

    def test_map_argument_non_object_surfaces_type_error(self) -> None:
        code = """
def solve(m):
    return 0
"""
        args = [{"type": "map", "value": []}]
        result = safe_exec(code, args)
        self.assertIsNotNone(result["error"])
        self.assertEqual(result["error"]["name"], "TypeError")

    def test_set_argument_non_array_surfaces_type_error(self) -> None:
        code = """
def solve(s):
    return 0
"""
        args = [{"type": "set", "value": {"not": "a list"}}]
        result = safe_exec(code, args)
        self.assertIsNotNone(result["error"])
        self.assertEqual(result["error"]["name"], "TypeError")

    def test_array_null_yields_tracked_empty_list(self) -> None:
        code = """
def solve(nums):
    return len(nums)
"""
        args = [{"type": "array", "value": None}]
        result = safe_exec(code, args)
        self.assertIsNone(result["error"])
        add_array = [
            frame
            for frame in result["callstack"]
            if frame["name"] == "addArray" and frame.get("argType") == "array"
        ]
        self.assertGreaterEqual(len(add_array), 1)

    def test_set_add_duplicate_does_not_emit_read_frame(self) -> None:
        """add() must not use `in` (overridden __contains__) for duplicate check."""
        code = """
def solve():
    s = {1}
    s.add(1)
    return len(s)
"""
        result = safe_exec(code, None)
        self.assertIsNone(result["error"])
        set_reads = [
            frame
            for frame in result["callstack"]
            if frame.get("argType") == "set" and frame["name"] == "readArrayItem"
        ]
        self.assertEqual(len(set_reads), 0)

    def test_args_entry_not_dict_surfaces_type_error(self) -> None:
        code = """
def solve():
    return 0
"""
        result = safe_exec(code, ["not-an-object"])
        self.assertIsNotNone(result["error"])
        self.assertEqual(result["error"]["name"], "TypeError")

    def test_frozenset_call_tracked_for_membership(self) -> None:
        code = """
def solve():
    fs = frozenset([1, 2])
    return 1 in fs
"""
        result = safe_exec(code, None)
        self.assertIsNone(result["error"])
        set_reads = [
            frame
            for frame in result["callstack"]
            if frame.get("argType") == "set" and frame["name"] == "readArrayItem"
        ]
        self.assertGreaterEqual(len(set_reads), 1)

    def test_graph_argument_wrapped_as_nested_lists(self) -> None:
        code = """
def solve(graph):
    return len(graph[0])
"""
        args = [{"type": "graph", "value": [[0, 1], [1, 2]]}]
        result = safe_exec(code, args)
        self.assertIsNone(result["error"])
        array_frames = [
            frame
            for frame in result["callstack"]
            if frame.get("argType") == "array"
        ]
        self.assertGreaterEqual(len(array_frames), 1)

    def test_graph_argument_non_list_surfaces_type_error(self) -> None:
        code = """
def solve(graph):
    return 0
"""
        result = safe_exec(code, [{"type": "graph", "value": {}}])
        self.assertIsNotNone(result["error"])
        self.assertEqual(result["error"]["name"], "TypeError")

    def test_dict_clear_emits_clear_appearance(self) -> None:
        code = """
def solve():
    d = {"a": 1}
    d.clear()
    return len(d)
"""
        result = safe_exec(code, None)
        self.assertIsNone(result["error"])
        names = [frame["name"] for frame in result["callstack"]]
        self.assertIn("clearAppearance", names)


if __name__ == "__main__":
    unittest.main()
