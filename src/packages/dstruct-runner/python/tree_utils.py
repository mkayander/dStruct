"""TreeNode and list builders for LeetCode-style inputs + visualization callstack parity."""

from __future__ import annotations

import time
import uuid
from typing import Any, Dict, List, Optional

from execution_location import snapshot_for_frame

# Mirror JS `globalThis.recordReads` for `.val` access (blink on read).
record_reads: bool = True


class TreeNode:
    """LeetCode-style binary tree node."""

    def __init__(
        self,
        val: int = 0,
        left: Optional["TreeNode"] = None,
        right: Optional["TreeNode"] = None,
    ):
        object.__setattr__(self, "val", val)
        object.__setattr__(self, "left", left)
        object.__setattr__(self, "right", right)


def build_tree(values: List[Any]) -> Optional[TreeNode]:
    """Build TreeNode from level-order list [1,2,3,null,4,...]."""
    if not values or values[0] is None:
        return None

    root = TreeNode(values[0])
    queue: List[TreeNode] = [root]
    index = 1

    while queue and index < len(values):
        node = queue.pop(0)

        left_val = values[index] if index < len(values) else None
        index += 1
        if left_val is not None:
            node.left = TreeNode(left_val)
            queue.append(node.left)
        else:
            node.left = None

        right_val = values[index] if index < len(values) else None
        index += 1
        if right_val is not None:
            node.right = TreeNode(right_val)
            queue.append(node.right)
        else:
            node.right = None

    return root


def _snapshot_optional() -> Optional[Dict[str, Any]]:
    return snapshot_for_frame()


def _append_tree_frame(
    callstack: List[Dict[str, Any]],
    *,
    tree_name: str,
    arg_type: str,
    node_id: str,
    frame_name: str,
    args: Optional[Dict[str, Any]] = None,
    prev_args: Optional[Dict[str, Any]] = None,
) -> None:
    frame: Dict[str, Any] = {
        "id": str(uuid.uuid4()),
        "timestamp": int(time.time() * 1000),
        "treeName": tree_name,
        "structureType": "treeNode",
        "argType": arg_type,
        "nodeId": node_id,
        "name": frame_name,
    }
    if args is not None:
        frame["args"] = args
    if prev_args is not None:
        frame["prevArgs"] = prev_args
    snap = _snapshot_optional()
    if snap is not None:
        frame["source"] = snap
    callstack.append(frame)


class InstrumentedTreeNode(TreeNode):
    """Binary tree node that records visualization frames (setColor, blink, …)."""

    def __init__(
        self,
        val: int | str | float = 0,
        left: Optional["TreeNode"] = None,
        right: Optional["TreeNode"] = None,
        *,
        node_id: str,
        tree_name: str,
        arg_type: str,
        callstack: List[Dict[str, Any]],
    ):
        object.__setattr__(self, "_node_id", node_id)
        object.__setattr__(self, "_tree_name", tree_name)
        object.__setattr__(self, "_arg_type", arg_type)
        object.__setattr__(self, "_callstack", callstack)
        object.__setattr__(self, "_meta_color", None)
        object.__setattr__(self, "_meta_animation", None)
        object.__setattr__(self, "_meta_info", None)
        object.__setattr__(self, "_meta_color_map", None)
        super().__init__(val, left, right)

    def __getattribute__(self, name: str) -> Any:
        if name == "val":
            data = object.__getattribute__(self, "__dict__")
            if record_reads:
                InstrumentedTreeNode._deduped_blink(
                    data["_callstack"],
                    tree_name=data["_tree_name"],
                    arg_type=data["_arg_type"],
                    node_id=data["_node_id"],
                )
            return data["val"]
        return object.__getattribute__(self, name)

    def __setattr__(self, name: str, value: Any) -> None:
        if name == "val":
            data = object.__getattribute__(self, "__dict__")
            previous = data.get("val")
            data["val"] = value
            _append_tree_frame(
                data["_callstack"],
                tree_name=data["_tree_name"],
                arg_type=data["_arg_type"],
                node_id=data["_node_id"],
                frame_name="setVal",
                args={"value": value},
                prev_args={"value": previous},
            )
            return
        object.__setattr__(self, name, value)

    @staticmethod
    def _deduped_blink(
        callstack: List[Dict[str, Any]],
        *,
        tree_name: str,
        arg_type: str,
        node_id: str,
    ) -> None:
        if callstack:
            last = callstack[-1]
            if last.get("name") == "blink" and last.get("nodeId") == node_id:
                return
        _append_tree_frame(
            callstack,
            tree_name=tree_name,
            arg_type=arg_type,
            node_id=node_id,
            frame_name="blink",
        )

    def setColor(self, color: Any, animation: Any = None) -> None:
        previous_color = object.__getattribute__(self, "_meta_color")
        previous_animation = object.__getattribute__(self, "_meta_animation")
        object.__setattr__(self, "_meta_color", color)
        object.__setattr__(self, "_meta_animation", animation)
        data = object.__getattribute__(self, "__dict__")
        _append_tree_frame(
            data["_callstack"],
            tree_name=data["_tree_name"],
            arg_type=data["_arg_type"],
            node_id=data["_node_id"],
            frame_name="setColor",
            args={"color": color, "animation": animation},
            prev_args={"color": previous_color, "animation": previous_animation},
        )

    def setInfo(self, info: Dict[str, Any]) -> None:
        previous = object.__getattribute__(self, "_meta_info")
        object.__setattr__(self, "_meta_info", info)
        data = object.__getattribute__(self, "__dict__")
        _append_tree_frame(
            data["_callstack"],
            tree_name=data["_tree_name"],
            arg_type=data["_arg_type"],
            node_id=data["_node_id"],
            frame_name="setInfo",
            args={"info": info},
            prev_args={"info": previous},
        )

    def setColorMap(self, color_map: Dict[Any, str]) -> None:
        previous = object.__getattribute__(self, "_meta_color_map")
        object.__setattr__(self, "_meta_color_map", color_map)
        data = object.__getattribute__(self, "__dict__")
        frame: Dict[str, Any] = {
            "id": str(uuid.uuid4()),
            "timestamp": int(time.time() * 1000),
            "treeName": data["_tree_name"],
            "structureType": "treeNode",
            "argType": data["_arg_type"],
            "name": "setColorMap",
            "args": {"colorMap": color_map},
            "prevArgs": {"colorMap": previous},
        }
        snap = _snapshot_optional()
        if snap is not None:
            frame["source"] = snap
        data["_callstack"].append(frame)

    def showIndexes(self, *_args: Any, **_kwargs: Any) -> None:
        """JS templates call this on arrays; no-op on tree nodes."""

    def blink(self) -> None:
        data = object.__getattribute__(self, "__dict__")
        InstrumentedTreeNode._deduped_blink(
            data["_callstack"],
            tree_name=data["_tree_name"],
            arg_type=data["_arg_type"],
            node_id=data["_node_id"],
        )


def build_tracked_binary_tree(
    values: List[Any],
    node_ids: List[Any],
    tree_name: str,
    arg_type: str,
    callstack: List[Dict[str, Any]],
) -> Optional[InstrumentedTreeNode]:
    """Level-order binary tree with Redux node ids for visualization frames."""
    if (
        not values
        or values[0] is None
        or not node_ids
        or node_ids[0] is None
        or len(values) != len(node_ids)
    ):
        return None

    root_id = node_ids[0]
    root = InstrumentedTreeNode(
        values[0],
        None,
        None,
        node_id=str(root_id),
        tree_name=tree_name,
        arg_type=arg_type,
        callstack=callstack,
    )
    queue: List[InstrumentedTreeNode] = [root]
    index = 1

    while queue and index < len(values):
        node = queue.pop(0)

        left_val = values[index] if index < len(values) else None
        left_id = node_ids[index] if index < len(node_ids) else None
        index += 1

        if left_val is not None and left_id is not None:
            left_node = InstrumentedTreeNode(
                left_val,
                None,
                None,
                node_id=str(left_id),
                tree_name=tree_name,
                arg_type=arg_type,
                callstack=callstack,
            )
            node.left = left_node
            queue.append(left_node)
        else:
            node.left = None

        right_val = values[index] if index < len(values) else None
        right_id = node_ids[index] if index < len(node_ids) else None
        index += 1

        if right_val is not None and right_id is not None:
            right_node = InstrumentedTreeNode(
                right_val,
                None,
                None,
                node_id=str(right_id),
                tree_name=tree_name,
                arg_type=arg_type,
                callstack=callstack,
            )
            node.right = right_node
            queue.append(right_node)
        else:
            node.right = None

    return root


class ListNode:
    """LeetCode-style linked list node."""

    def __init__(self, val: int = 0, next: Optional["ListNode"] = None):
        object.__setattr__(self, "val", val)
        object.__setattr__(self, "next", next)


class InstrumentedListNode(ListNode):
    """Linked list node with visualization callstack parity."""

    def __init__(
        self,
        val: int | str | float = 0,
        next: Optional["ListNode"] = None,
        *,
        node_id: str,
        tree_name: str,
        arg_type: str,
        callstack: List[Dict[str, Any]],
    ):
        object.__setattr__(self, "_node_id", node_id)
        object.__setattr__(self, "_tree_name", tree_name)
        object.__setattr__(self, "_arg_type", arg_type)
        object.__setattr__(self, "_callstack", callstack)
        object.__setattr__(self, "_meta_color", None)
        object.__setattr__(self, "_meta_animation", None)
        object.__setattr__(self, "_meta_info", None)
        super().__init__(val, next)

    def __getattribute__(self, name: str) -> Any:
        if name == "val":
            data = object.__getattribute__(self, "__dict__")
            if record_reads:
                InstrumentedTreeNode._deduped_blink(
                    data["_callstack"],
                    tree_name=data["_tree_name"],
                    arg_type=data["_arg_type"],
                    node_id=data["_node_id"],
                )
            return data["val"]
        return object.__getattribute__(self, name)

    def __setattr__(self, name: str, value: Any) -> None:
        if name == "next":
            data = object.__getattribute__(self, "__dict__")
            previous = data.get("next")
            previous_id = getattr(previous, "_node_id", None) if previous else None
            next_id = getattr(value, "_node_id", None) if value else None
            data["next"] = value
            tree_name = data["_tree_name"]
            _append_tree_frame(
                data["_callstack"],
                tree_name=tree_name,
                arg_type=data["_arg_type"],
                node_id=data["_node_id"],
                frame_name="setNextNode",
                args={
                    "childId": next_id,
                    "childTreeName": tree_name,
                },
                prev_args={
                    "childId": previous_id,
                    "childTreeName": tree_name,
                },
            )
            return
        if name == "val":
            data = object.__getattribute__(self, "__dict__")
            previous = data.get("val")
            data["val"] = value
            _append_tree_frame(
                data["_callstack"],
                tree_name=data["_tree_name"],
                arg_type=data["_arg_type"],
                node_id=data["_node_id"],
                frame_name="setVal",
                args={"value": value},
                prev_args={"value": previous},
            )
            return
        object.__setattr__(self, name, value)

    def setColor(self, color: Any, animation: Any = None) -> None:
        previous_color = object.__getattribute__(self, "_meta_color")
        previous_animation = object.__getattribute__(self, "_meta_animation")
        object.__setattr__(self, "_meta_color", color)
        object.__setattr__(self, "_meta_animation", animation)
        data = object.__getattribute__(self, "__dict__")
        _append_tree_frame(
            data["_callstack"],
            tree_name=data["_tree_name"],
            arg_type=data["_arg_type"],
            node_id=data["_node_id"],
            frame_name="setColor",
            args={"color": color, "animation": animation},
            prev_args={"color": previous_color, "animation": previous_animation},
        )

    def setInfo(self, info: Dict[str, Any]) -> None:
        previous = object.__getattribute__(self, "_meta_info")
        object.__setattr__(self, "_meta_info", info)
        data = object.__getattribute__(self, "__dict__")
        _append_tree_frame(
            data["_callstack"],
            tree_name=data["_tree_name"],
            arg_type=data["_arg_type"],
            node_id=data["_node_id"],
            frame_name="setInfo",
            args={"info": info},
            prev_args={"info": previous},
        )

    def showIndexes(self, *_args: Any, **_kwargs: Any) -> None:
        """No-op stub matching JS dummy visualization API."""

    def blink(self) -> None:
        data = object.__getattribute__(self, "__dict__")
        InstrumentedTreeNode._deduped_blink(
            data["_callstack"],
            tree_name=data["_tree_name"],
            arg_type=data["_arg_type"],
            node_id=data["_node_id"],
        )


def build_list(values: List[Any]) -> Optional[ListNode]:
    """Build ListNode from list [1,2,3,...]."""
    if not values:
        return None

    dummy = ListNode(0)
    current = dummy
    for item in values:
        if item is not None:
            current.next = ListNode(item)
            current = current.next
    return dummy.next


def build_tracked_linked_list(
    values: List[Any],
    node_ids: List[str],
    tree_name: str,
    arg_type: str,
    callstack: List[Dict[str, Any]],
) -> Optional[InstrumentedListNode]:
    if not values or len(values) != len(node_ids):
        return None

    head = InstrumentedListNode(
        values[0],
        None,
        node_id=str(node_ids[0]),
        tree_name=tree_name,
        arg_type=arg_type,
        callstack=callstack,
    )
    previous = head
    for index in range(1, len(values)):
        current = InstrumentedListNode(
            values[index],
            None,
            node_id=str(node_ids[index]),
            tree_name=tree_name,
            arg_type=arg_type,
            callstack=callstack,
        )
        object.__setattr__(previous, "next", current)
        previous = current
    return head
