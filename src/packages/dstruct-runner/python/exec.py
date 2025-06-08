""" Execute a string as code """

from __future__ import annotations
import sys
import os
import json
from array_tracker import TrackedList
from array_tracker_transformer import ListTrackingTransformer
import ast
from shared_types import ExecutionResult
from output import tracked_print
import traceback
import time

def safe_exec(code: str) -> ExecutionResult:
    """
    Execute Python code safely, returning execution results including success status,
    callstack, and error messages.
    
    Args:
        code: The Python code to execute as a string
        
    Returns:
        A dictionary containing:
        - output: String containing the execution output
        - callstack: List of operation frames
        - runtime: Execution time in milliseconds
        - startTimestamp: When execution started
        - error: Optional error object with name, message, and stack
    """
    try:
        start_time = time.time()
        start_timestamp = int(start_time * 1000)  # Convert to milliseconds
        
        # Parse the code into an AST
        tree = ast.parse(code)
        
        # Find the function definition
        function_def = None
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                function_def = node
                break
        
        if not function_def:
            raise SyntaxError("Code must contain a function definition")
            
        # Transform the AST to track function calls
        transformer = ListTrackingTransformer()
        new_tree = transformer.visit(tree)
        ast.fix_missing_locations(new_tree)
        transformed_code = ast.unparse(new_tree)
        
        # Create wrapper code
        wrapper_code = f"""
# Original function definition
{transformed_code}

# Execute the function and store result
__result__ = {function_def.name}()
"""
        
        # Create separate global and local namespaces
        globals_dict = {
            '__callstack__': [],
            '__stdout__': "",
            'TrackedList': TrackedList,
            '__result__': None
        }
        locals_dict = {}
        
        # Create a whitelist of safe built-in operations
        safe_builtins = {
            # Basic types and operations
            'len': len,
            'range': range,
            'str': str,
            'int': int,
            'float': float,
            'bool': bool,
            'list': list,
            'dict': dict,
            'set': set,
            'tuple': tuple,
            
            # Iteration and sequence operations
            'enumerate': enumerate,
            'zip': zip,
            'filter': filter,
            'map': map,
            'sorted': sorted,
            'iter': iter,
            'next': next,
            
            # Mathematical operations
            'sum': sum,
            'min': min,
            'max': max,
            'abs': abs,
            'divmod': divmod,
            'pow': pow,
            'round': round,
            
            # Type conversion and formatting
            'ascii': ascii,
            'bin': bin,
            'chr': chr,
            'format': format,
            'hex': hex,
            'oct': oct,
            'ord': ord,
            'repr': repr,
            
            # Boolean operations
            'all': all,
            'any': any,
            
            # Constants
            'True': True,
            'False': False,
            'None': None,
            
            # Output
            'print': tracked_print
        }
        
        # Add safe built-ins to globals
        globals_dict.update(safe_builtins)
        
        # Execute the wrapper code
        exec(wrapper_code, globals_dict, locals_dict)
        
        # Return the result
        return {
            "output": globals_dict['__stdout__'],
            "callstack": globals_dict['__callstack__'],
            "runtime": int((time.time() - start_time) * 1000),
            "startTimestamp": start_timestamp,
            "error": None
        }
    except SyntaxError as e:
        runtime = int((time.time() - start_time) * 1000)
        return {
            "output": "",
            "callstack": [],
            "runtime": runtime,
            "startTimestamp": start_timestamp,
            "error": {
                "name": "SyntaxError",
                "message": str(e),
                "stack": traceback.format_exc()
            }
        }
    except Exception as e:
        runtime = int((time.time() - start_time) * 1000)
        return {
            "output": "",
            "callstack": [],
            "runtime": runtime,
            "startTimestamp": start_timestamp,
            "error": {
                "name": type(e).__name__,
                "message": str(e),
                "stack": traceback.format_exc()
            }
        }

if __name__ == "__main__":
    # Read code from stdin
    code_str: str = sys.stdin.read()
    result: ExecutionResult = safe_exec(code_str)
    print(json.dumps(result))
