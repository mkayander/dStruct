""" Execute a string as code """

from __future__ import annotations
import sys
import os
import json
from array_tracker import TrackedList
from array_tracker_transformer import ListTrackingTransformer, attach_ast_parents
from execution_location import clear_execution_source, set_execution_source
from line_tracking_transformer import LineTrackingTransformer
from tree_utils import (
    TreeNode,
    ListNode,
    build_list,
    build_tree,
    build_tracked_binary_tree,
    build_tracked_linked_list,
)
import ast
from shared_types import ExecutionResult
from output import tracked_print
import traceback
import time

# Argument type names matching frontend ArgumentType enum values
_ARG_BINARY_TREE = "binaryTree"
_ARG_LINKED_LIST = "linkedList"
_ARG_GRAPH = "graph"
_ARG_ARRAY = "array"
_ARG_MATRIX = "matrix"
_ARG_STRING = "string"
_ARG_NUMBER = "number"
_ARG_BOOLEAN = "boolean"


def _convert_arg_to_python(arg: dict, callstack: list) -> object:
    """Convert a serialized argument to a Python object."""
    arg_type = arg.get("type", "")
    value = arg.get("value")

    if arg_type == _ARG_BINARY_TREE:
        if isinstance(value, dict) and "levelOrder" in value:
            return build_tracked_binary_tree(
                value["levelOrder"],
                value["nodeIds"],
                value["treeName"],
                _ARG_BINARY_TREE,
                callstack,
            )
        return build_tree(value) if value else None
    if arg_type == _ARG_LINKED_LIST:
        if isinstance(value, dict) and "values" in value:
            return build_tracked_linked_list(
                value["values"],
                value["nodeIds"],
                value["treeName"],
                _ARG_LINKED_LIST,
                callstack,
            )
        return build_list(value) if value else None
    if arg_type == _ARG_GRAPH:
        # Graph: pass raw for now; could add build_graph later
        return value
    if arg_type == _ARG_ARRAY or arg_type == _ARG_MATRIX:
        return value if value is not None else []
    if arg_type == _ARG_STRING:
        return value if value is not None else ""
    if arg_type == _ARG_NUMBER:
        return float(value) if value is not None else 0
    if arg_type == _ARG_BOOLEAN:
        return bool(value) if value is not None else False
    return value


def safe_exec(code: str, args: list | None = None) -> ExecutionResult:
    """
    Execute Python code safely, returning execution results including success status,
    callstack, and error messages.

    Args:
        code: The Python code to execute as a string
        args: Optional list of serialized arguments [{type, value}, ...] to pass to the solution function.
            Caller should pass native Python structures (e.g. after json.loads); do not pass Pyodide JsProxy.

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

        if args is not None and not isinstance(args, list):
            raise TypeError(
                "args must be null or a JSON array of objects with 'type' and 'value'"
            )

        # Transform the AST to track list ops, then statement-level line probes
        attach_ast_parents(tree)
        list_transformer = ListTrackingTransformer()
        new_tree = list_transformer.visit(tree)
        line_transformer = LineTrackingTransformer()
        new_tree = line_transformer.visit(new_tree)
        ast.fix_missing_locations(new_tree)
        transformed_code = ast.unparse(new_tree)

        # Create separate global and local namespaces
        globals_dict = {
            "__callstack__": [],
            "__stdout__": "",
            "TrackedList": TrackedList,
            "TreeNode": TreeNode,
            "ListNode": ListNode,
            "__result__": None,
        }

        python_args = []
        if args:
            callstack_ref = globals_dict["__callstack__"]
            for arg in args:
                python_args.append(_convert_arg_to_python(arg, callstack_ref))

        args_str = ", ".join(f"__arg_{i}__" for i in range(len(python_args)))
        call_str = f"{function_def.name}({args_str})" if python_args else f"{function_def.name}()"
        wrapper_code = f"""
# Original function definition
{transformed_code}

# Execute the function and store result
__result__ = {call_str}
"""

        for index, arg_val in enumerate(python_args):
            globals_dict[f"__arg_{index}__"] = arg_val
        
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
        globals_dict["set_execution_source"] = set_execution_source

        clear_execution_source()
        # Use the same mapping for globals and locals so user `def run` is stored in
        # globals_dict; recursive calls resolve via the function's __globals__.
        exec(wrapper_code, globals_dict, globals_dict)
        
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
