import ast
from typing import List, Dict, Any, Union, TypedDict, TypeVar
from shared_types import CallFrame

T = TypeVar('T')

class ListItemData(TypedDict):
    id: str
    value: Union[int, str, float, None]

class ListData(TypedDict):
    ids: List[str]
    entities: Dict[str, ListItemData]

class ListOptions(TypedDict):
    name: str

class ListTrackingTransformer(ast.NodeTransformer):
    """AST transformer that replaces list operations with tracked list operations."""
    
    def __init__(self) -> None:
        super().__init__()
        self.counter = 0

    def visit_List(self, node):
        # Replace [1, 2, 3] with TrackedList([1, 2, 3], "auto_list_N", __callstack__)
        self.generic_visit(node)
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
                        ast.Name(id="self.callstack", ctx=ast.Load())
                    ],
                    keywords=[]
                )
            ],
            keywords=[]
        )
