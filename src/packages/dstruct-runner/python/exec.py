""" Execute a string as code """

from __future__ import annotations
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
print("sys.path:", sys.path, file=sys.stderr)
print("Current directory:", os.getcwd(), file=sys.stderr)
import json
from typing import Dict, Any, Optional, List, TypedDict
from array_tracker import transform_and_track_code
from array_tracker_ast import ListTrackingTransformer
import ast
from shared_types import ExecutionResult

def safe_exec(code: str) -> ExecutionResult:
    """
    Execute Python code safely, returning execution results including success status,
    callstack, and error messages.
    
    Args:
        code: The Python code to execute as a string
        
    Returns:
        A dictionary containing:
        - success: Boolean indicating if execution was successful
        - callstack: List of operation frames if successful, None if failed
        - error: Error message if failed, None if successful
    """
    try:
        # Transform the code to replace native lists with TrackedList instances
        tree = ast.parse(code)
        transformer = ListTrackingTransformer()
        new_tree = transformer.visit(tree)
        ast.fix_missing_locations(new_tree)
        transformed_code = ast.unparse(new_tree)
        
        # Execute the transformed code
        restricted_globals = {
            '__builtins__': {
                name: getattr(__builtins__, name)
                for name in ['print', 'len', 'range', 'str', 'int', 'float', 'bool', 'list', 'dict', 'set', 'tuple']
            }
        }
        exec(transformed_code, restricted_globals)
        
        return {
            "success": True,
            "callstack": transformer.callstack,
            "error": None
        }
    except SyntaxError as e:
        return {
            "success": False,
            "callstack": None,
            "error": f"Syntax error: {str(e)}"
        }
    except Exception as e:
        return {
            "success": False,
            "callstack": None,
            "error": f"Runtime error: {str(e)}"
        }

if __name__ == "__main__":
    # Read code from stdin
    code_str: str = sys.stdin.read()
    result: ExecutionResult = safe_exec(code_str)
    print(json.dumps(result))
