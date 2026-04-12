"""Unit tests for tracked tree/list builders and callstack frames."""

from __future__ import annotations

import unittest

import tree_utils
from tree_utils import (
    InstrumentedListNode,
    InstrumentedTreeNode,
    TreeNode,
    build_tree,
    build_tracked_binary_tree,
    build_tracked_linked_list,
)


class TestBuildTrackedBinaryTree(unittest.TestCase):
    def setUp(self) -> None:
        self._prev_record_reads = tree_utils.record_reads
        tree_utils.record_reads = False

    def tearDown(self) -> None:
        tree_utils.record_reads = self._prev_record_reads

    def test_returns_instrumented_nodes_matching_shape(self) -> None:
        callstack: list = []
        root = build_tracked_binary_tree(
            [1, 2, 3],
            ["root-id", "left-id", "right-id"],
            "myTree",
            "binaryTree",
            callstack,
        )
        self.assertIsNotNone(root)
        assert root is not None
        self.assertIsInstance(root, InstrumentedTreeNode)
        self.assertEqual(root.val, 1)
        self.assertIsNotNone(root.left)
        self.assertIsNotNone(root.right)
        assert root.left is not None
        assert root.right is not None
        self.assertEqual(root.left.val, 2)
        self.assertEqual(root.right.val, 3)

    def test_set_color_appends_expected_frame(self) -> None:
        callstack: list = []
        root = build_tracked_binary_tree(
            [1],
            ["node-a"],
            "t",
            "binaryTree",
            callstack,
        )
        self.assertIsNotNone(root)
        assert root is not None
        root.setColor("green", "blink")
        color_frames = [frame for frame in callstack if frame["name"] == "setColor"]
        self.assertEqual(len(color_frames), 1)
        frame = color_frames[0]
        self.assertEqual(frame["nodeId"], "node-a")
        self.assertEqual(frame["treeName"], "t")
        self.assertEqual(frame["structureType"], "treeNode")
        self.assertEqual(frame["argType"], "binaryTree")
        self.assertEqual(frame["args"]["color"], "green")
        self.assertEqual(frame["args"]["animation"], "blink")

    def test_blink_dedupes_consecutive_same_node(self) -> None:
        callstack: list = []
        root = build_tracked_binary_tree(
            [1],
            ["n0"],
            "t",
            "binaryTree",
            callstack,
        )
        self.assertIsNotNone(root)
        assert root is not None
        root.blink()
        root.blink()
        blinks = [frame for frame in callstack if frame["name"] == "blink"]
        self.assertEqual(len(blinks), 1)

    def test_plain_build_tree_is_not_instrumented(self) -> None:
        root = build_tree([1, 2])
        self.assertIsNotNone(root)
        assert root is not None
        self.assertIsInstance(root, TreeNode)
        self.assertNotIsInstance(root, InstrumentedTreeNode)


class TestBuildTrackedLinkedList(unittest.TestCase):
    def setUp(self) -> None:
        self._prev_record_reads = tree_utils.record_reads
        tree_utils.record_reads = False

    def tearDown(self) -> None:
        tree_utils.record_reads = self._prev_record_reads

    def test_chain_and_types(self) -> None:
        callstack: list = []
        head = build_tracked_linked_list(
            [10, 20],
            ["a", "b"],
            "head",
            "linkedList",
            callstack,
        )
        self.assertIsNotNone(head)
        assert head is not None
        self.assertIsInstance(head, InstrumentedListNode)
        self.assertEqual(head.val, 10)
        self.assertIsNotNone(head.next)
        assert head.next is not None
        self.assertIsInstance(head.next, InstrumentedListNode)
        self.assertEqual(head.next.val, 20)

    def test_next_assignment_records_set_next_node(self) -> None:
        callstack: list = []
        head = build_tracked_linked_list(
            [1, 2],
            ["x", "y"],
            "lst",
            "linkedList",
            callstack,
        )
        self.assertIsNotNone(head)
        assert head is not None
        assert head.next is not None
        callstack.clear()
        third = InstrumentedListNode(
            3,
            None,
            node_id="z",
            tree_name="lst",
            arg_type="linkedList",
            callstack=callstack,
        )
        head.next.next = third
        next_frames = [frame for frame in callstack if frame["name"] == "setNextNode"]
        self.assertEqual(len(next_frames), 1)


if __name__ == "__main__":
    unittest.main()
