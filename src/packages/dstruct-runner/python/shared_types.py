from typing import Dict, Any, Optional, List, TypedDict, Union

class CallFrameBase(TypedDict):
    id: str
    timestamp: int
    treeName: str
    structureType: str
    argType: str

class RuntimeErrorFrame(TypedDict):
    id: str
    timestamp: int
    name: str

class NodeFrameBase(CallFrameBase):
    nodeId: str

class SetColorFrame(NodeFrameBase):
    name: str
    args: Dict[str, Any]
    prevArgs: Optional[Dict[str, Any]]

class SetColorMapFrame(CallFrameBase):
    name: str
    args: Dict[str, Any]
    prevArgs: Optional[Dict[str, Any]]

class SetInfoFrame(NodeFrameBase):
    name: str
    args: Dict[str, Any]
    prevArgs: Optional[Dict[str, Any]]

class SetHeadersFrame(CallFrameBase):
    name: str
    args: Dict[str, Any]
    prevArgs: Optional[Dict[str, Any]]

class SetValFrame(NodeFrameBase):
    name: str
    args: Dict[str, Any]
    prevArgs: Optional[Dict[str, Any]]

class SetChildFrame(NodeFrameBase):
    name: str
    args: Dict[str, Any]
    prevArgs: Optional[Dict[str, Any]]

class ShowPointerFrame(NodeFrameBase):
    name: str
    args: Dict[str, Any]
    prevArgs: Optional[Dict[str, Any]]

class BlinkFrame(NodeFrameBase):
    name: str

class ClearAppearanceFrame(CallFrameBase):
    name: str

class AddNodeFrame(NodeFrameBase):
    name: str
    args: Dict[str, Any]
    prevArgs: Optional[Dict[str, Any]]

class AddArrayItemFrame(NodeFrameBase):
    name: str
    args: Dict[str, Any]
    prevArgs: Optional[Dict[str, Any]]

class AddArrayFrame(CallFrameBase):
    name: str
    args: Dict[str, Any]
    prevArgs: Optional[Dict[str, Any]]

class DeleteNodeFrame(NodeFrameBase):
    name: str

class ConsoleLogFrame(TypedDict):
    id: str
    timestamp: int
    name: str
    args: List[str]

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
    callstack: Optional[List[Dict[str, Any]]]
    error: Optional[str] 