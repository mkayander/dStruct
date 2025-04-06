from __future__ import annotations
import ast
from typing import List, Dict, Any, Optional, Union, Tuple, TypedDict
import uuid
from datetime import datetime

class ArrayItemData(TypedDict):
    id: str
    value: Union[int, str, float, None]

class ArrayData(TypedDict):
    ids: List[str]
    entities: Dict[str, ArrayItemData]

class ArrayOptions(TypedDict):
    name: str

class CallFrame(TypedDict):
    id: str
    timestamp: int
    treeName: str
    structureType: str
    argType: str
    name: str
    args: Dict[str, Any]

class ArrayTracker(ast.NodeTransformer):
    def __init__(self) -> None:
        self.callstack: List[CallFrame] = []
        self.arrays: Dict[str, List[Any]] = {}
        self.timestamp_counter: int = 0

    def get_timestamp(self) -> int:
        self.timestamp_counter += 1
        return self.timestamp_counter

    def add_frame(self, frame_type: str, **kwargs: Any) -> None:
        frame: CallFrame = {
            "id": str(uuid.uuid4()),
            "timestamp": self.get_timestamp(),
            "treeName": "main",
            "structureType": "array",
            "argType": "array",
            "name": frame_type,
            "args": kwargs.get("args", {})
        }
        self.callstack.append(frame)

    def visit_Assign(self, node: ast.Assign) -> ast.AST:
        if isinstance(node.value, ast.List):
            var_name: str = node.targets[0].id if isinstance(node.targets[0], ast.Name) else "unknown"
            values: List[Any] = [self.get_value(elt) for elt in node.value.elts]
            
            self.arrays[var_name] = values
            
            array_data: ArrayData = {
                "ids": [str(i) for i in range(len(values))],
                "entities": {
                    str(i): {
                        "id": str(i),
                        "value": val
                    } 
                    for i, val in enumerate(values)
                }
            }
            
            self.add_frame(
                "addArray",
                args={
                    "arrayData": array_data,
                    "options": {"name": var_name}
                }
            )
        elif isinstance(node.targets[0], ast.Subscript):
            # Handle array[index] = value
            self.visit_Subscript(node.targets[0], value_node=node.value)
        
        return node

    def get_value_from_node(self, node: ast.AST) -> Optional[Union[int, str, float]]:
        if isinstance(node, ast.Constant):
            return node.value
        elif isinstance(node, ast.Name):
            # For variables, we'll track the access but can't know the value at parse time
            return None
        elif isinstance(node, ast.BinOp):
            # For expressions, we'll track but can't evaluate at parse time
            return None
        return None

    def visit_Subscript(self, node: ast.Subscript, value_node: Optional[ast.AST] = None) -> ast.AST:
        if isinstance(node.value, ast.Name):
            array_name: str = node.value.id
            if array_name in self.arrays:
                if isinstance(node.slice, ast.Constant):
                    index: int = node.slice.value
                    
                    if isinstance(node.ctx, ast.Store):
                        # This is a write operation (array[index] = value)
                        value = self.get_value_from_node(value_node) if value_node else None
                        self.add_frame(
                            "addArrayItem",
                            args={
                                "index": index,
                                "value": value,
                                "nodeId": str(index)
                            }
                        )
                    elif isinstance(node.ctx, ast.Load):
                        # This is a read operation (x = array[index])
                        self.add_frame(
                            "readArrayItem",
                            args={
                                "index": index,
                                "nodeId": str(index)
                            }
                        )
        return node

    def get_value(self, node: ast.AST) -> Any:
        if isinstance(node, ast.Constant):
            return node.value
        elif isinstance(node, ast.BinOp):
            # For expressions like 1 + 1, we'll track but can't evaluate at parse time
            return None
        elif isinstance(node, ast.Name):
            # For variables, we'll track but can't know the value at parse time
            return None
        return None

class ExecutionResult(TypedDict):
    success: bool
    callstack: Optional[List[CallFrame]]
    error: Optional[str]

def transform_and_track_code(code: str) -> Tuple[str, List[CallFrame]]:
    """
    Transform the input code and return the transformed code along with the callstack.
    
    Args:
        code: The input Python code as a string
        
    Returns:
        A tuple containing the transformed code and the callstack of operations
    """
    tree: ast.AST = ast.parse(code)
    tracker: ArrayTracker = ArrayTracker()
    transformed_tree: ast.AST = tracker.visit(tree)
    
    # Add tracking code
    tracking_code: ast.AST = ast.parse("""
def __dstruct_track_array_op(op: str, array_name: str, index: Optional[int] = None, value: Any = None) -> None:
    pass  # This will be replaced with actual tracking logic
""")
    
    transformed_tree.body = tracking_code.body + transformed_tree.body
    
    return ast.unparse(transformed_tree), tracker.callstack
