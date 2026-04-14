import ast
from typing import List, Dict, Any, Union, TypedDict, TypeVar, Optional

T = TypeVar('T')

class ListItemData(TypedDict):
    id: str
    value: Union[int, str, float, None]

class ListData(TypedDict):
    ids: List[str]
    entities: Dict[str, ListItemData]

class ListOptions(TypedDict):
    name: str

def attach_ast_parents(root: ast.AST) -> None:
    """Set ``node.parent`` for every node so transforms can infer binding names."""

    def visit(node: ast.AST, parent: Optional[ast.AST]) -> None:
        setattr(node, "parent", parent)
        for child in ast.iter_child_nodes(node):
            visit(child, node)

    visit(root, None)


def _infer_list_literal_display_name(list_node: ast.List) -> Optional[str]:
    parent = getattr(list_node, "parent", None)
    if parent is None:
        return None

    if isinstance(parent, ast.Assign) and parent.value is list_node:
        targets = parent.targets
        if targets and all(isinstance(target, ast.Name) for target in targets):
            return targets[0].id

    if isinstance(parent, ast.AnnAssign) and parent.value is list_node:
        if isinstance(parent.target, ast.Name):
            return parent.target.id

    if isinstance(parent, ast.AugAssign) and parent.value is list_node:
        if isinstance(parent.target, ast.Name):
            return parent.target.id

    return None


class ListTrackingTransformer(ast.NodeTransformer):
    """AST transformer that replaces list operations with tracked list operations."""

    def __init__(self) -> None:
        super().__init__()
        self.counter = 0

    def visit_List(self, node: ast.List) -> ast.Call:
        self.generic_visit(node)
        inferred = _infer_list_literal_display_name(node)
        if inferred is not None:
            list_name: str = inferred
        else:
            list_name = f"auto_list_{self.counter}"
            self.counter += 1
        return ast.Call(
            func=ast.Name(id="TrackedList", ctx=ast.Load()),
            args=[
                node,
                ast.Constant(value=list_name),
                ast.Name(id="__callstack__", ctx=ast.Load())
            ],
            keywords=[]
        )

    def visit_ListComp(self, node: ast.ListComp) -> ast.Call:
        # Transform the comprehension to use TrackedList
        elt = self.visit(node.elt)
        generators = [self.visit(g) for g in node.generators]
        return ast.Call(
            func=ast.Name(id="list", ctx=ast.Load()),
            args=[
                ast.Call(
                    func=ast.Name(id="TrackedList", ctx=ast.Load()),
                    args=[
                        ast.ListComp(elt=elt, generators=generators),
                        ast.Constant(value="comprehension"),
                        ast.Name(id="__callstack__", ctx=ast.Load())
                    ],
                    keywords=[]
                )
            ],
            keywords=[]
        )
