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


if __name__ == "__main__":
    unittest.main()
