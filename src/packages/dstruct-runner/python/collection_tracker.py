"""Tracked dict, set, and frozenset for Python harness (parity with JS Map / Set proxies)."""

from __future__ import annotations

import time
import uuid
from typing import Any, Dict, Iterable, List, Mapping, Optional

from execution_location import snapshot_for_frame
from shared_types import CallFrame

ListItemData = Dict[str, Any]
ListData = Dict[str, Any]


def _append_collection_frame(
    callstack: List[CallFrame],
    *,
    arg_type: str,
    frame_type: str,
    node_id: str,
    args: Dict[str, Any],
) -> None:
    frame: CallFrame = {
        "id": str(uuid.uuid4()),
        "timestamp": int(time.time() * 1000),
        "treeName": "main",
        "structureType": "array",
        "argType": arg_type,
        "name": frame_type,
        "nodeId": node_id,
        "args": args,
    }
    snap = snapshot_for_frame()
    if snap is not None:
        frame["source"] = snap
    callstack.append(frame)


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
        _append_collection_frame(
            callstack,
            arg_type="map",
            frame_type="addArray",
            node_id="",
            args={
                "arrayData": self._generate_dict_data(),
                "options": {"name": name},
            },
        )

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
            _append_collection_frame(
                self._callstack,
                arg_type="map",
                frame_type="readArrayItem",
                node_id=self._node_id_for_key(key),
                args={"key": key},
            )
        return super().__getitem__(key)

    def get(self, key: Any, default: Any = None) -> Any:  # type: ignore[override]
        if key in self:
            _append_collection_frame(
                self._callstack,
                arg_type="map",
                frame_type="readArrayItem",
                node_id=self._node_id_for_key(key),
                args={"key": key},
            )
            return super().__getitem__(key)
        return default

    def __setitem__(self, key: Any, value: Any) -> None:
        _append_collection_frame(
            self._callstack,
            arg_type="map",
            frame_type="addArrayItem",
            node_id=self._node_id_for_key(key) if key in self else "",
            args={"key": key, "value": value},
        )
        super().__setitem__(key, value)

    def __delitem__(self, key: Any) -> None:
        if key not in self:
            raise KeyError(key)
        _append_collection_frame(
            self._callstack,
            arg_type="map",
            frame_type="deleteNode",
            node_id=self._node_id_for_key(key),
            args={"key": key},
        )
        super().__delitem__(key)

    def setdefault(self, key: Any, default: Any = None) -> Any:  # type: ignore[override]
        if key in self:
            _append_collection_frame(
                self._callstack,
                arg_type="map",
                frame_type="readArrayItem",
                node_id=self._node_id_for_key(key),
                args={"key": key},
            )
            return dict.__getitem__(self, key)
        self[key] = default
        return default

    def pop(self, key: Any, *args: Any) -> Any:  # type: ignore[override]
        if len(args) > 1:
            raise TypeError(f"pop expected at most 2 arguments, got {1 + len(args)}")
        if key not in self:
            if args:
                return args[0]
            raise KeyError(key)
        _append_collection_frame(
            self._callstack,
            arg_type="map",
            frame_type="readArrayItem",
            node_id=self._node_id_for_key(key),
            args={"key": key},
        )
        popped = dict.__getitem__(self, key)
        _append_collection_frame(
            self._callstack,
            arg_type="map",
            frame_type="deleteNode",
            node_id=self._node_id_for_key(key),
            args={"key": key},
        )
        dict.__delitem__(self, key)
        return popped

    def popitem(self) -> tuple[Any, Any]:
        if not self:
            raise KeyError("popitem(): dictionary is empty")
        key = next(reversed(self))
        value = dict.__getitem__(self, key)
        _append_collection_frame(
            self._callstack,
            arg_type="map",
            frame_type="deleteNode",
            node_id=self._node_id_for_key(key),
            args={"key": key, "value": value},
        )
        dict.__delitem__(self, key)
        return key, value

    def clear(self) -> None:  # type: ignore[override]
        if not self:
            return None
        _append_collection_frame(
            self._callstack,
            arg_type="map",
            frame_type="clearAppearance",
            node_id="",
            args={},
        )
        dict.clear(self)
        return None

    def update(self, *args: Any, **kwargs: Any) -> None:  # type: ignore[override]
        if len(args) > 1:
            raise TypeError("update expected at most 1 argument, got %d" % len(args))
        if args:
            other = args[0]
            if other is None:
                pass
            elif isinstance(other, Mapping):
                for key, value in other.items():
                    self[key] = value
            else:
                for key, value in other:
                    self[key] = value
        for key, value in kwargs.items():
            self[key] = value
        return None

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
        _append_collection_frame(
            callstack,
            arg_type="set",
            frame_type="addArray",
            node_id="",
            args={
                "arrayData": self._generate_set_data(),
                "options": {"name": name},
            },
        )

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
            _append_collection_frame(
                self._callstack,
                arg_type="set",
                frame_type="readArrayItem",
                node_id=self._node_id_for_value(value),
                args={"value": value},
            )
        return contained

    def add(self, value: Any) -> None:
        if super().__contains__(value):
            return None
        super().add(value)
        _append_collection_frame(
            self._callstack,
            arg_type="set",
            frame_type="addArrayItem",
            node_id=self._node_id_for_value(value),
            args={"value": value, "index": len(self) - 1},
        )
        return None

    def discard(self, value: Any) -> None:
        if not super().__contains__(value):
            return None
        node_id = self._node_id_for_value(value)
        super().discard(value)
        _append_collection_frame(
            self._callstack,
            arg_type="set",
            frame_type="deleteNode",
            node_id=node_id,
            args={"value": value},
        )
        return None

    def remove(self, value: Any) -> None:
        if not super().__contains__(value):
            raise KeyError(value)
        node_id = self._node_id_for_value(value)
        super().remove(value)
        _append_collection_frame(
            self._callstack,
            arg_type="set",
            frame_type="deleteNode",
            node_id=node_id,
            args={"value": value},
        )

    def pop(self) -> Any:
        if not self:
            raise KeyError("pop from an empty set")
        value = next(iter(self))
        node_id = self._node_id_for_value(value)
        super().discard(value)
        _append_collection_frame(
            self._callstack,
            arg_type="set",
            frame_type="deleteNode",
            node_id=node_id,
            args={"value": value},
        )
        return value

    def clear(self) -> None:  # type: ignore[override]
        if not self:
            return None
        _append_collection_frame(
            self._callstack,
            arg_type="set",
            frame_type="clearAppearance",
            node_id="",
            args={},
        )
        super().clear()
        return None

    def __repr__(self) -> str:
        return f"TrackedSet({super().__repr__()})"


class TrackedFrozenSet(frozenset):
    """Immutable set with read tracking (for frozenset(...) in transformed user code)."""

    def __new__(
        cls,
        iterable: Iterable[Any] = (),
        *,
        name: str,
        callstack: List[CallFrame],
    ) -> TrackedFrozenSet:
        data = tuple(iterable) if iterable is not None else ()
        instance = super().__new__(cls, data)
        object.__setattr__(instance, "_name", name)
        object.__setattr__(instance, "_callstack", callstack)
        _append_collection_frame(
            callstack,
            arg_type="set",
            frame_type="addArray",
            node_id="",
            args={
                "arrayData": _frozen_set_snapshot_data(instance),
                "options": {"name": name},
            },
        )
        return instance

    def __setattr__(self, name: str, value: Any) -> None:
        raise AttributeError(f"{type(self).__name__!r} object has no attribute {name!r}")

    def _node_id_for_value(self, value: Any) -> str:
        for index, existing in enumerate(self):
            if existing == value:
                return str(index)
        return repr(value)

    def __contains__(self, value: object) -> bool:  # type: ignore[override]
        contained = super().__contains__(value)
        if contained:
            callstack = object.__getattribute__(self, "_callstack")
            _append_collection_frame(
                callstack,
                arg_type="set",
                frame_type="readArrayItem",
                node_id=self._node_id_for_value(value),
                args={"value": value},
            )
        return contained


def _frozen_set_snapshot_data(fs: frozenset) -> ListData:
    entities: Dict[str, ListItemData] = {}
    ordered_ids: List[str] = []
    for index, value in enumerate(sorted(fs, key=lambda item: repr(item))):
        node_id = str(index)
        ordered_ids.append(node_id)
        entities[node_id] = {
            "id": node_id,
            "index": index,
            "value": value,
        }
    return {"ids": ordered_ids, "entities": entities}
