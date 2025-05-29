from __future__ import annotations
import ast
from typing import List, Dict, Any, Optional, Union, Tuple, TypedDict, TypeVar, Generic
import uuid
from datetime import datetime

T = TypeVar('T')

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

class ExecutionResult(TypedDict):
    success: bool
    callstack: Optional[List[CallFrame]]
    error: Optional[str]

class TrackedArray(Generic[T]):
    """A proxy-like array class that tracks all operations performed on it."""
    
    def __init__(self, items: List[T], name: str, callstack: List[CallFrame]) -> None:
        self._items = items
        self._name = name
        self._callstack = callstack
        self._timestamp_counter = 0
        
        # Add initial array creation to callstack
        self._add_frame(
            "addArray",
            args={
                "arrayData": self._generate_array_data(items),
                "options": {"name": name}
            }
        )

    def _get_timestamp(self) -> int:
        self._timestamp_counter += 1
        return self._timestamp_counter

    def _add_frame(self, frame_type: str, **kwargs: Any) -> None:
        frame: CallFrame = {
            "id": str(uuid.uuid4()),
            "timestamp": self._get_timestamp(),
            "treeName": "main",
            "structureType": "array",
            "argType": "array",
            "name": frame_type,
            "args": kwargs.get("args", {})
        }
        self._callstack.append(frame)

    def _generate_array_data(self, items: List[T]) -> ArrayData:
        return {
            "ids": [str(i) for i in range(len(items))],
            "entities": {
                str(i): {
                    "id": str(i),
                    "value": item
                }
                for i, item in enumerate(items)
            }
        }

    def __getitem__(self, index: Union[int, slice]) -> Union[T, List[T]]:
        # Track read operation
        if isinstance(index, int):
            self._add_frame(
                "readArrayItem",
                args={
                    "index": index,
                    "nodeId": str(index)
                }
            )
        elif isinstance(index, slice):
            self._add_frame(
                "readArrayItem",
                args={
                    "slice": True,
                    "start": index.start if index.start is not None else 0,
                    "end": index.stop,
                    "nodeId": "slice"
                }
            )
        return self._items[index]

    def __setitem__(self, index: Union[int, slice], value: Union[T, List[T]]) -> None:
        # Track write operation
        if isinstance(index, int):
            self._add_frame(
                "addArrayItem",
                args={
                    "index": index,
                    "value": value,
                    "nodeId": str(index)
                }
            )
        elif isinstance(index, slice):
            self._add_frame(
                "addArrayItem",
                args={
                    "slice": True,
                    "start": index.start if index.start is not None else 0,
                    "end": index.stop,
                    "value": value,
                    "nodeId": "slice"
                }
            )
        self._items[index] = value

    def __len__(self) -> int:
        return len(self._items)

    def __iter__(self):
        return iter(self._items)

    def __str__(self) -> str:
        return str(self._items)

    def __repr__(self) -> str:
        return f"TrackedArray({self._items})"

def create_tracked_array(items: List[Any], name: str) -> Tuple[TrackedArray, List[CallFrame]]:
    """Create a new tracked array with the given items and name."""
    callstack: List[CallFrame] = []
    return TrackedArray(items, name, callstack), callstack

def transform_and_track_code(code: str) -> Tuple[str, List[CallFrame]]:
    """Transform Python code to use tracked arrays."""
    tree = ast.parse(code)
    transformer = ArrayTransformer()
    transformed_tree = transformer.visit(tree)
    return ast.unparse(transformed_tree), transformer.callstack

class ArrayTransformer(ast.NodeTransformer):
    """AST transformer that replaces array operations with tracked array operations."""
    
    def __init__(self) -> None:
        self.callstack: List[CallFrame] = []
        self.array_counter = 0

    def visit_Assign(self, node: ast.Assign) -> ast.AST:
        if isinstance(node.value, ast.List):
            # Create a tracked array for list literals
            array_name = f"arr_{self.array_counter}"
            self.array_counter += 1
            
            # Create the tracked array
            items = [self.get_value(elt) for elt in node.value.elts]
            tracked_array, callstack = create_tracked_array(items, array_name)
            self.callstack.extend(callstack)
            
            # Replace the assignment with the tracked array
            return ast.Assign(
                targets=node.targets,
                value=ast.Call(
                    func=ast.Name(id='TrackedArray', ctx=ast.Load()),
                    args=[ast.List(elts=node.value.elts, ctx=ast.Load())],
                    keywords=[
                        ast.keyword(arg='name', value=ast.Constant(value=array_name))
                    ]
                )
            )
        return node

    def get_value(self, node: ast.AST) -> Any:
        if isinstance(node, ast.Constant):
            return node.value
        return None
