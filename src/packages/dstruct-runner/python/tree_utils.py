"""TreeNode and list builders for LeetCode-style inputs."""

from typing import List, Optional, Any


class TreeNode:
    """LeetCode-style binary tree node."""

    def __init__(
        self,
        val: int = 0,
        left: Optional["TreeNode"] = None,
        right: Optional["TreeNode"] = None,
    ):
        self.val = val
        self.left = left
        self.right = right


def build_tree(values: List[Any]) -> Optional[TreeNode]:
    """Build TreeNode from level-order list [1,2,3,null,4,...]."""
    if not values or values[0] is None:
        return None

    root = TreeNode(values[0])
    queue: List[TreeNode] = [root]
    i = 1

    while queue and i < len(values):
        node = queue.pop(0)

        left_val = values[i] if i < len(values) else None
        i += 1
        if left_val is not None:
            node.left = TreeNode(left_val)
            queue.append(node.left)
        else:
            node.left = None

        right_val = values[i] if i < len(values) else None
        i += 1
        if right_val is not None:
            node.right = TreeNode(right_val)
            queue.append(node.right)
        else:
            node.right = None

    return root


class ListNode:
    """LeetCode-style linked list node."""

    def __init__(self, val: int = 0, next: Optional["ListNode"] = None):
        self.val = val
        self.next = next


def build_list(values: List[Any]) -> Optional[ListNode]:
    """Build ListNode from list [1,2,3,...]."""
    if not values:
        return None

    dummy = ListNode(0)
    curr = dummy
    for v in values:
        if v is not None:
            curr.next = ListNode(v)
            curr = curr.next
    return dummy.next
