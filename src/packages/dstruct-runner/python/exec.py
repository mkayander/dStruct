""" Execute a string as code """

from __future__ import annotations
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
print("sys.path:", sys.path, file=sys.stderr)
print("Current directory:", os.getcwd(), file=sys.stderr)
import json
from array_tracker import TrackedList
from array_tracker_transformer import ListTrackingTransformer
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
        
        # Create a safe but complete set of built-ins
        safe_builtins = {
            name: getattr(__builtins__, name)
            for name in dir(__builtins__)
            if name not in {
                # Dangerous operations
                'open', 'exec', 'eval', 'compile', '__import__',
                # File system operations
                'os', 'sys', 'subprocess',
                # Network operations
                'socket', 'http', 'urllib',
                # Other potentially dangerous operations
                'globals', 'locals', 'vars', 'dir',
                'getattr', 'setattr', 'delattr',
                'super', 'property', 'staticmethod', 'classmethod',
                'type', 'isinstance', 'issubclass',
                'breakpoint', 'help',
                # Keep these safe operations
                'len', 'range', 'str', 'int', 'float', 'bool',
                'list', 'dict', 'set', 'tuple', 'sum', 'min', 'max',
                'enumerate', 'zip', 'filter', 'map', 'sorted',
                'abs', 'all', 'any', 'ascii', 'bin', 'chr', 'divmod',
                'format', 'hash', 'hex', 'id', 'iter', 'next', 'oct',
                'ord', 'pow', 'repr', 'round', 'slice', 'sorted',
                'True', 'False', 'None'
            }
        }
        safe_builtins['print'] = print
        
        # Create separate global and local namespaces
        globals_dict = {
            '__builtins__': safe_builtins,
            'TrackedList': TrackedList,
            '__callstack__': []  # Inject callstack
        }
        locals_dict = {}
        
        exec(transformed_code, globals_dict, locals_dict)
        callstack = globals_dict['__callstack__']
        
        return {
            "success": True,
            "callstack": callstack,
            "error": None
        }
    except SyntaxError as e:
        return {
            "success": False,
            "callstack": None,
            "error": f"Syntax error: {str(e)}"
        }
    except Exception as e:
        print(f"Error in safe_exec: {str(e)}")  # Debug print
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
