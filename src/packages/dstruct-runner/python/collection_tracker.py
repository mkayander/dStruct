"""Tracked dict and set for Python harness (parity with JS Map / Set proxies)."""

from __future__ import annotations

import time
import uuid
from typing import Any, Dict, Iterable, List, Mapping, Optional

from execution_location import snapshot_for_frame
from shared_types import CallFrame

ListItemData = Dict[str, Any]
ListData = Dict[str, Any]


class TrackedDict(dict):
    """dict subclass that records reads/writes/deletes on the visualization callstack."""

    def __init__(
        self,
        items: Optional[Mapping[Any, Any]] = None,
        *,
        name: str,
        callstack: List[CallFrame],
    ) -> None:
        super().__init__()
        self._name = name
        self._callstack = callstack
        if items:
            for key, value in items.items():
                dict.__setitem__(self, key, value)
        self._add_frame(
            "addArray",
            args={
                "arrayData": self._generate_dict_data(),
                "options": {"name": name},
            },
        )

    def _get_timestamp(self) -> int:
        return int(time.time() * 1000)

    def _add_frame(self, frame_type: str, **kwargs: Any) -> None:
        frame: CallFrame = {
            "id": str(uuid.uuid4()),
            "timestamp": self._get_timestamp(),
            "treeName": "main",
            "structureType": "array",
            "argType": "map",
            "name": frame_type,
            "nodeId": kwargs.get("nodeId", ""),
            "args": kwargs.get("args", {}),
        }
        snap = snapshot_for_frame()
        if snap is not None:
            frame["source"] = snap
        self._callstack.append(frame)

    def _generate_dict_data(self) -> ListData:
        entities: Dict[str, ListItemData] = {}
        ordered_ids: List[str] = []
        for index, (key, value) in enumerate(self.items()):
            node_id = str(index)
            ordered_ids.append(node_id)
            entities[node_id] = {
                "id": node_id,
                "index": index,
                "value": value,
                "key": key,
            }
        return {"ids": ordered_ids, "entities": entities}

    def _node_id_for_key(self, key: Any) -> str:
        for index, existing in enumerate(self.keys()):
            if existing == key:
                return str(index)
        return str(key)

    def __getitem__(self, key: Any) -> Any:
        if key in self:
            self._add_frame(
                "readArrayItem",
                args={"key": key},
                nodeId=self._node_id_for_key(key),
            )
        return super().__getitem__(key)

    def get(self, key: Any, default: Any = None) -> Any:  # type: ignore[override]
        if key in self:
            self._add_frame(
                "readArrayItem",
                args={"key": key},
                nodeId=self._node_id_for_key(key),
            )
            return super().__getitem__(key)
        return default

    def __setitem__(self, key: Any, value: Any) -> None:
        self._add_frame(
            "addArrayItem",
            args={"key": key, "value": value},
            nodeId=self._node_id_for_key(key) if key in self else "",
        )
        super().__setitem__(key, value)

    def __delitem__(self, key: Any) -> None:
        if key not in self:
            raise KeyError(key)
        self._add_frame(
            "deleteNode",
            nodeId=self._node_id_for_key(key),
            args={"key": key},
        )
        super().__delitem__(key)

    def __repr__(self) -> str:
        return f"TrackedDict({super().__repr__()})"


class TrackedSet(set):
    """set subclass that records membership reads and mutations on the callstack."""

    def __init__(
        self,
        items: Optional[Iterable[Any]] = None,
        *,
        name: str,
        callstack: List[CallFrame],
    ) -> None:
        super().__init__(items if items is not None else ())
        self._name = name
        self._callstack = callstack
        self._add_frame(
            "addArray",
            args={
                "arrayData": self._generate_set_data(),
                "options": {"name": name},
            },
        )

    def _get_timestamp(self) -> int:
        return int(time.time() * 1000)

    def _add_frame(self, frame_type: str, **kwargs: Any) -> None:
        frame: CallFrame = {
            "id": str(uuid.uuid4()),
            "timestamp": self._get_timestamp(),
            "treeName": "main",
            "structureType": "array",
            "argType": "set",
            "name": frame_type,
            "nodeId": kwargs.get("nodeId", ""),
            "args": kwargs.get("args", {}),
        }
        snap = snapshot_for_frame()
        if snap is not None:
            frame["source"] = snap
        self._callstack.append(frame)

    def _generate_set_data(self) -> ListData:
        entities: Dict[str, ListItemData] = {}
        ordered_ids: List[str] = []
        for index, value in enumerate(sorted(self, key=lambda item: repr(item))):
            node_id = str(index)
            ordered_ids.append(node_id)
            entities[node_id] = {
                "id": node_id,
                "index": index,
                "value": value,
            }
        return {"ids": ordered_ids, "entities": entities}

    def _node_id_for_value(self, value: Any) -> str:
        for index, existing in enumerate(self):
            if existing == value:
                return str(index)
        return repr(value)

    def __contains__(self, value: object) -> bool:  # type: ignore[override]
        contained = super().__contains__(value)
        if contained:
            self._add_frame(
                "readArrayItem",
                args={"value": value},
                nodeId=self._node_id_for_value(value),
            )
        return contained

    def add(self, value: Any) -> None:
        if value in self:
            return None
        super().add(value)
        self._add_frame(
            "addArrayItem",
            args={"value": value, "index": len(self) - 1},
            nodeId=self._node_id_for_value(value),
        )
        return None

    def discard(self, value: Any) -> None:
        if value not in self:
            return None
        node_id = self._node_id_for_value(value)
        super().discard(value)
        self._add_frame("deleteNode", nodeId=node_id, args={"value": value})
        return None

    def remove(self, value: Any) -> None:
        if value not in self:
            raise KeyError(value)
        node_id = self._node_id_for_value(value)
        super().remove(value)
        self._add_frame("deleteNode", nodeId=node_id, args={"value": value})

    def __repr__(self) -> str:
        return f"TrackedSet({super().__repr__()})"
