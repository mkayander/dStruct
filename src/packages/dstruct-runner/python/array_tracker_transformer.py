import ast

class ListTrackingTransformer(ast.NodeTransformer):
    def __init__(self):
        super().__init__()
        self.counter = 0

    def visit_List(self, node):
        # Replace [1, 2, 3] with TrackedList([1, 2, 3], "auto_list_N")
        self.generic_visit(node)
        list_name = f"auto_list_{self.counter}"
        self.counter += 1
        return ast.Call(
            func=ast.Name(id="TrackedList", ctx=ast.Load()),
            args=[node, ast.Constant(value=list_name)],
            keywords=[]
        )

    def visit_ListComp(self, node):
        # Replace [x for x in y] with TrackedList([x for x in y], "auto_list_N")
        self.generic_visit(node)
        list_name = f"auto_list_{self.counter}"
        self.counter += 1
        return ast.Call(
            func=ast.Name(id="TrackedList", ctx=ast.Load()),
            args=[node, ast.Constant(value=list_name)],
            keywords=[]
        )
