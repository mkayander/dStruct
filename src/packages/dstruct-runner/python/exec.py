""" Execute a string as code """

from __future__ import annotations
import sys
import json
from typing import Dict, Any, Optional, List
from array_tracker import transform_and_track_code, ExecutionResult

def safe_exec(code_str: str) -> ExecutionResult:
    """
    Safely execute the provided code string and return the execution result.
    
    Args:
        code_str: The Python code to execute
        
    Returns:
        A dictionary containing execution success status, callstack, and any error messages
    """
    try:
        # Transform and track the code
        transformed_code: str
        callstack: List[Dict[str, Any]]
        transformed_code, callstack = transform_and_track_code(code_str)
        
        # Create a safe execution environment
        allowed_globals: Dict[str, None] = {"__builtins__": None}
        allowed_locals: Dict[str, Any] = {
            "print": print,
            "__dstruct_track_array_op": lambda op, array_name, index=None, value=None: None
        }
        
        # Execute the transformed code
        exec(transformed_code, allowed_globals, allowed_locals)
        
        return {
            "success": True,
            "callstack": callstack,
            "error": None
        }
    except Exception as e:
        return {
            "success": False,
            "callstack": None,
            "error": str(e)
        }

if __name__ == "__main__":
    code_str: str = sys.argv[1]
    result: ExecutionResult = safe_exec(code_str)
    print(json.dumps(result))
