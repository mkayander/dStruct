from __future__ import annotations
import ast
from typing import List, Dict, Any, Optional, Union, Tuple, TypedDict, TypeVar, Generic
import uuid
from datetime import datetime
from shared_types import ExecutionResult, CallFrame, CallFrameBase, NodeFrameBase, AddArrayItemFrame, AddArrayFrame

T = TypeVar('T')

class ListItemData(TypedDict):
    id: str
    value: Union[int, str, float, None]

class ListData(TypedDict):
    ids: List[str]
    entities: Dict[str, ListItemData]

class ListOptions(TypedDict):
    name: str

class TrackedList(list, Generic[T]):
    """A proxy-like list class that tracks all operations performed on it."""
    
    def __init__(self, items: List[T], name: str, callstack: List[CallFrame]) -> None:
        super().__init__(items)
        self._name = name
        self._callstack = callstack
        self._timestamp_counter = 0
        
        # Add initial list creation to callstack
        self._add_frame(
            "addArray",
            args={
                "arrayData": self._generate_list_data(items),
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

    def _generate_list_data(self, items: List[T]) -> ListData:
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

    def __getitem__(self, index: Union[int, slice]) -> Union[T, list[T]]:
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
            # Return a plain list to avoid recursion issues with TrackedList
            return list(super().__getitem__(index))
        return super().__getitem__(index)

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
            # Avoid recursion: if value is a TrackedList, convert to plain list
            if isinstance(value, TrackedList):
                value = list(value)
        super().__setitem__(index, value)

    def __len__(self) -> int:
        return len(self)

    def __iter__(self):
        return iter(self)

    def __str__(self) -> str:
        return str(self)

    def __repr__(self) -> str:
        return f"TrackedList({self})"

def create_tracked_list(items: List[Any], name: str) -> Tuple[TrackedList, List[CallFrame]]:
    """Create a new tracked list with the given items and name."""
    callstack: List[CallFrame] = []
    return TrackedList(items, name, callstack), callstack
