import unittest
from array_tracker import ArrayTracker, transform_and_track_code, ExecutionResult
from exec import safe_exec
from typing import List, Dict, Any
from test_utils import run_tests_with_pretty_output

class TestArrayTracker(unittest.TestCase):
    def setUp(self) -> None:
        self.tracker = ArrayTracker()
        self.callstack: List[Dict[str, Any]] = []

    def test_array_creation(self) -> None:
        """Test tracking of array creation"""
        code = "arr = [1, 2, 3]"
        _, self.callstack = transform_and_track_code(code)
        
        self.assertEqual(len(self.callstack), 1)
        frame = self.callstack[0]
        
        self.assertEqual(frame["name"], "addArray")
        self.assertEqual(frame["structureType"], "array")
        self.assertEqual(frame["args"]["options"]["name"], "arr")
        
        array_data = frame["args"]["arrayData"]
        self.assertEqual(array_data["ids"], ["0", "1", "2"])
        self.assertEqual(
            array_data["entities"],
            {
                "0": {"id": "0", "value": 1},
                "1": {"id": "1", "value": 2},
                "2": {"id": "2", "value": 3}
            }
        )

    def test_array_modification(self) -> None:
        """Test tracking of array element modification"""
        code = """
arr = [1, 2, 3]
arr[1] = 5
"""
        _, self.callstack = transform_and_track_code(code)
        
        self.assertEqual(len(self.callstack), 2)
        modify_frame = self.callstack[1]
        
        self.assertEqual(modify_frame["name"], "addArrayItem")
        self.assertEqual(modify_frame["args"]["index"], 1)
        self.assertEqual(modify_frame["args"]["nodeId"], "1")

    def test_multiple_arrays(self) -> None:
        """Test tracking multiple arrays"""
        code = """
arr1 = [1, 2, 3]
arr2 = [4, 5, 6]
"""
        _, self.callstack = transform_and_track_code(code)
        
        self.assertEqual(len(self.callstack), 2)
        self.assertEqual(self.callstack[0]["args"]["options"]["name"], "arr1")
        self.assertEqual(self.callstack[1]["args"]["options"]["name"], "arr2")

    def test_array_with_expressions(self) -> None:
        """Test array creation with expressions"""
        code = "arr = [1 + 1, 2 * 2, 3]"
        _, self.callstack = transform_and_track_code(code)
        
        self.assertEqual(len(self.callstack), 1)
        frame = self.callstack[0]
        array_data = frame["args"]["arrayData"]
        
        # Note: expressions are not evaluated during AST transformation
        self.assertIsNotNone(array_data["entities"]["0"])
        self.assertIsNotNone(array_data["entities"]["1"])
        self.assertEqual(array_data["entities"]["2"]["value"], 3)

class TestSafeExec(unittest.TestCase):
    def setUp(self) -> None:
        self.result: ExecutionResult = {}

    def test_successful_execution(self) -> None:
        """Test successful code execution"""
        code = """
arr = [1, 2, 3]
arr[1] = 5
"""
        self.result = safe_exec(code)
        
        self.assertTrue(self.result["success"])
        self.assertIsNotNone(self.result["callstack"])
        self.assertIsNone(self.result["error"])
        self.assertEqual(len(self.result["callstack"]), 2)

    def test_syntax_error(self) -> None:
        """Test handling of syntax errors"""
        code = "arr = [1, 2, 3"  # Missing closing bracket
        self.result = safe_exec(code)
        
        self.assertFalse(self.result["success"])
        self.assertIsNone(self.result["callstack"])
        self.assertIsNotNone(self.result["error"])

    def test_restricted_imports(self) -> None:
        """Test that imports are restricted"""
        code = """
import os
arr = [1, 2, 3]
"""
        self.result = safe_exec(code)
        
        self.assertFalse(self.result["success"])
        self.assertIsNotNone(self.result["error"])

    def test_complex_operations(self) -> None:
        """Test tracking of complex array operations"""
        code = """
arr = [1, 2, 3]
arr[0] = arr[1]
arr[2] = 10
"""
        self.result = safe_exec(code)
        
        self.assertTrue(self.result["success"])
        self.assertIsNotNone(self.result["callstack"])
        self.assertEqual(len(self.result["callstack"]), 3)  # 1 creation + 2 modifications

class TestEdgeCases(unittest.TestCase):
    def setUp(self) -> None:
        self.callstack: List[Dict[str, Any]] = []

    def test_empty_array(self) -> None:
        """Test handling of empty arrays"""
        code = "arr = []"
        _, self.callstack = transform_and_track_code(code)
        
        self.assertEqual(len(self.callstack), 1)
        frame = self.callstack[0]
        array_data = frame["args"]["arrayData"]
        self.assertEqual(array_data["ids"], [])
        self.assertEqual(array_data["entities"], {})

    def test_nested_arrays(self) -> None:
        """Test handling of nested arrays (should only track top level for now)"""
        code = "arr = [[1, 2], [3, 4]]"
        _, self.callstack = transform_and_track_code(code)
        
        self.assertEqual(len(self.callstack), 1)
        # Verify that we at least track the outer array creation
        self.assertEqual(self.callstack[0]["name"], "addArray")

    def test_array_with_different_types(self) -> None:
        """Test arrays with mixed types"""
        code = 'arr = [1, "two", 3.0]'
        _, self.callstack = transform_and_track_code(code)
        
        self.assertEqual(len(self.callstack), 1)
        frame = self.callstack[0]
        array_data = frame["args"]["arrayData"]
        
        self.assertEqual(array_data["entities"]["0"]["value"], 1)
        self.assertEqual(array_data["entities"]["1"]["value"], "two")
        self.assertEqual(array_data["entities"]["2"]["value"], 3.0)

if __name__ == "__main__":
    # When running directly, use our pretty runner
    run_tests_with_pretty_output([
        TestArrayTracker,
        TestSafeExec,
        TestEdgeCases
    ])
else:
    # When running with unittest module, use standard test suite
    def load_tests(loader, tests, pattern):
        suite = unittest.TestSuite()
        suite.addTests(loader.loadTestsFromTestCase(TestArrayTracker))
        suite.addTests(loader.loadTestsFromTestCase(TestSafeExec))
        suite.addTests(loader.loadTestsFromTestCase(TestEdgeCases))
        return suite
