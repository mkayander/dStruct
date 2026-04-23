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
                        ast.Name(id="__callstack__", ctx=ast.Load()),
                    ],
                    keywords=[],
                )
            ],
            keywords=[],
        )

    def visit_Dict(self, node: ast.Dict) -> ast.Call:
        self.generic_visit(node)
        dict_name = f"auto_dict_{self.counter}"
        self.counter += 1
        return ast.Call(
            func=ast.Name(id="TrackedDict", ctx=ast.Load()),
            args=[
                ast.Call(func=ast.Name(id="dict", ctx=ast.Load()), args=[node], keywords=[]),
                ast.keyword(arg="name", value=ast.Constant(value=dict_name)),
                ast.keyword(
                    arg="callstack", value=ast.Name(id="__callstack__", ctx=ast.Load())
                ),
            ],
            keywords=[],
        )

    def visit_Set(self, node: ast.Set) -> ast.Call:
        self.generic_visit(node)
        set_name = f"auto_set_{self.counter}"
        self.counter += 1
        return ast.Call(
            func=ast.Name(id="TrackedSet", ctx=ast.Load()),
            args=[
                node,
                ast.keyword(arg="name", value=ast.Constant(value=set_name)),
                ast.keyword(
                    arg="callstack", value=ast.Name(id="__callstack__", ctx=ast.Load())
                ),
            ],
            keywords=[],
        )

    def visit_DictComp(self, node: ast.DictComp) -> ast.Call:
        key = self.visit(node.key)
        value = self.visit(node.value)
        generators = [self.visit(g) for g in node.generators]
        return ast.Call(
            func=ast.Name(id="dict", ctx=ast.Load()),
            args=[
                ast.Call(
                    func=ast.Name(id="TrackedDict", ctx=ast.Load()),
                    args=[
                        ast.DictComp(key=key, value=value, generators=generators),
                    ],
                    keywords=[
                        ast.keyword(arg="name", value=ast.Constant(value="dict_comp")),
                        ast.keyword(
                            arg="callstack",
                            value=ast.Name(id="__callstack__", ctx=ast.Load()),
                        ),
                    ],
                )
            ],
            keywords=[],
        )

    def visit_SetComp(self, node: ast.SetComp) -> ast.Call:
        elt = self.visit(node.elt)
        generators = [self.visit(g) for g in node.generators]
        return ast.Call(
            func=ast.Name(id="set", ctx=ast.Load()),
            args=[
                ast.Call(
                    func=ast.Name(id="TrackedSet", ctx=ast.Load()),
                    args=[
                        ast.SetComp(elt=elt, generators=generators),
                    ],
                    keywords=[
                        ast.keyword(arg="name", value=ast.Constant(value="set_comp")),
                        ast.keyword(
                            arg="callstack",
                            value=ast.Name(id="__callstack__", ctx=ast.Load()),
                        ),
                    ],
                )
            ],
            keywords=[],
        )

    def visit_Call(self, node: ast.Call) -> ast.Call:
        """Rewrite frozenset(iterable) to TrackedFrozenSet for read tracking."""
        self.generic_visit(node)
        if not isinstance(node.func, ast.Name) or node.func.id != "frozenset":
            return node
        if node.keywords:
            return node
        frozen_name = f"auto_frozen_{self.counter}"
        self.counter += 1
        if node.args:
            iterable = node.args[0]
            extra_args = node.args[1:]
            if extra_args:
                return node
            return ast.Call(
                func=ast.Name(id="TrackedFrozenSet", ctx=ast.Load()),
                args=[iterable],
                keywords=[
                    ast.keyword(arg="name", value=ast.Constant(value=frozen_name)),
                    ast.keyword(
                        arg="callstack",
                        value=ast.Name(id="__callstack__", ctx=ast.Load()),
                    ),
                ],
            )
        return ast.Call(
            func=ast.Name(id="TrackedFrozenSet", ctx=ast.Load()),
            args=[],
            keywords=[
                ast.keyword(arg="name", value=ast.Constant(value=frozen_name)),
                ast.keyword(
                    arg="callstack",
                    value=ast.Name(id="__callstack__", ctx=ast.Load()),
                ),
            ],
        )
