""" Execute a string as code """

from __future__ import annotations
import sys
import json
from array_tracker import TrackedList
from array_tracker_transformer import ListTrackingTransformer
from collection_tracker import TrackedDict, TrackedFrozenSet, TrackedSet
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
_ARG_SET = "set"
_ARG_MAP = "map"
_ARG_OBJECT = "object"


def _deep_wrap_json_value(value: object, callstack: list, counter: list[int]) -> object:
    """Wrap nested JSON-derived list/dict values in tracked containers (inline JSON args)."""
    if isinstance(value, list):
        counter[0] += 1
        name = f"arg_json_list_{counter[0]}"
        wrapped_items = [_deep_wrap_json_value(item, callstack, counter) for item in value]
        return TrackedList(wrapped_items, name, callstack)
    if isinstance(value, dict):
        counter[0] += 1
        name = f"arg_json_dict_{counter[0]}"
        wrapped_map = {
            key: _deep_wrap_json_value(nested, callstack, counter)
            for key, nested in value.items()
        }
        return TrackedDict(wrapped_map, name=name, callstack=callstack)
    return value


def _convert_arg_to_python(arg: object, callstack: list) -> object:
    """Convert a serialized argument to a Python object."""
    if not isinstance(arg, dict):
        raise TypeError(
            "Each argument must be a JSON object with 'type' and 'value' keys, "
            f"got {type(arg).__name__}",
        )
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
        if value is None:
            return None
        if not isinstance(value, list):
            raise TypeError(
                "Argument type 'graph' requires value to be a JSON array (edge list), "
                f"got {type(value).__name__}",
            )
        counter = [0]
        return _deep_wrap_json_value(value, callstack, counter)
    if arg_type == _ARG_ARRAY or arg_type == _ARG_MATRIX:
        if value is None:
            return TrackedList([], "arg_array", callstack)
        if not isinstance(value, list):
            raise TypeError(
                f"Argument type {arg_type!r} requires value to be a JSON array (list), "
                f"got {type(value).__name__}",
            )
        counter: list[int] = [0]
        return _deep_wrap_json_value(value, callstack, counter)
    if arg_type == _ARG_SET:
        if value is None:
            return TrackedSet((), name="arg_set", callstack=callstack)
        if not isinstance(value, list):
            raise TypeError(
                "Argument type 'set' requires value to be a JSON array of set elements, "
                f"got {type(value).__name__}",
            )
        counter = [0]
        wrapped_elements = [
            _deep_wrap_json_value(item, callstack, counter) for item in value
        ]
        return TrackedSet(wrapped_elements, name="arg_set", callstack=callstack)
    if arg_type == _ARG_MAP or arg_type == _ARG_OBJECT:
        if value is None:
            return TrackedDict(None, name=f"arg_{arg_type}", callstack=callstack)
        if not isinstance(value, dict):
            raise TypeError(
                f"Argument type {arg_type!r} requires value to be a JSON object, "
                f"got {type(value).__name__}",
            )
        counter = [0]
        wrapped = {
            key: _deep_wrap_json_value(nested, callstack, counter)
            for key, nested in value.items()
        }
        return TrackedDict(wrapped, name=f"arg_{arg_type}", callstack=callstack)
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
            "TrackedDict": TrackedDict,
            "TrackedSet": TrackedSet,
            "TrackedFrozenSet": TrackedFrozenSet,
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
            "list": list,
            "dict": dict,
            "set": set,
            "frozenset": frozenset,
            "tuple": tuple,
            
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
