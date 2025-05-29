from typing import Dict, Any, Optional, List, TypedDict

class ExecutionResult(TypedDict):
    success: bool
    callstack: Optional[List[Dict[str, Any]]]
    error: Optional[str] 