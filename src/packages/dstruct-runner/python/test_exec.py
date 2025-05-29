import unittest
import sys
import os
import json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from exec import safe_exec

class TestExec(unittest.TestCase):
    def test_successful_execution(self):
        """Test successful execution of valid Python code"""
        code = """
x = 5
y = 10
result = x + y
"""
        result = safe_exec(code)
        self.assertTrue(result["success"])
        self.assertIsNone(result["error"])
        self.assertIsNotNone(result["callstack"])

    def test_syntax_error(self):
        """Test handling of syntax errors"""
        code = """
x = 5
y = 10
result = x + y  # Missing closing quote
print("unclosed string
"""
        result = safe_exec(code)
        self.assertFalse(result["success"])
        self.assertIsNotNone(result["error"])
        self.assertIsNone(result["callstack"])

    def test_runtime_error(self):
        """Test handling of runtime errors"""
        code = """
x = 5
y = "10"
result = x + y  # TypeError: unsupported operand type(s) for +: 'int' and 'str'
"""
        result = safe_exec(code)
        self.assertFalse(result["success"])
        self.assertIsNotNone(result["error"])
        self.assertIsNone(result["callstack"])

    def test_empty_code(self):
        """Test execution of empty code string"""
        code = ""
        result = safe_exec(code)
        self.assertTrue(result["success"])
        self.assertIsNone(result["error"])
        self.assertIsNotNone(result["callstack"])

    def test_print_statement(self):
        """Test that print statements are allowed"""
        code = """
print("Hello, World!")
"""
        result = safe_exec(code)
        self.assertTrue(result["success"])
        self.assertIsNone(result["error"])
        self.assertIsNotNone(result["callstack"])

    def test_restricted_globals(self):
        """Test that restricted globals are not accessible"""
        restricted_modules = [
            "import os",
            "import sys",
            "import subprocess",
            "from os import path",
            "import builtins",
            "import importlib"
        ]
        for code in restricted_modules:
            result = safe_exec(code)
            self.assertFalse(result["success"], f"Should restrict: {code}")
            self.assertIsNotNone(result["error"])
            self.assertIsNone(result["callstack"])

    def test_array_operations(self):
        """Test array operations tracking"""
        test_cases = [
            # Basic array operations
            """
arr = [1, 2, 3]
arr[0] = 4
x = arr[1]
""",
            # Nested array operations
            """
matrix = [[1, 2], [3, 4]]
matrix[0][1] = 5
x = matrix[1][0]
""",
            # Array slicing
            """
arr = [1, 2, 3, 4, 5]
sub_arr = arr[1:3]
arr[1:3] = [6, 7]
""",
            # List comprehension
            """
arr = [1, 2, 3, 4, 5]
squares = [x*x for x in arr]
"""
        ]
        
        for code in test_cases:
            result = safe_exec(code)
            self.assertTrue(result["success"], f"Failed for code: {code}")
            self.assertIsNone(result["error"])
            self.assertIsNotNone(result["callstack"])
            self.assertTrue(len(result["callstack"]) > 0)

    def test_data_types(self):
        """Test various Python data types and operations"""
        code = """
# Numbers
x = 42
y = 3.14
z = 1 + 2j

# Strings
s1 = "Hello"
s2 = 'World'
s3 = f"{s1} {s2}"

# Lists
lst = [1, 2, 3]
lst.append(4)

# Tuples
tup = (1, 2, 3)

# Dictionaries
d = {"a": 1, "b": 2}
d["c"] = 3

# Sets
s = {1, 2, 3}
s.add(4)

# Boolean operations
b1 = True
b2 = False
b3 = b1 and b2
"""
        result = safe_exec(code)
        self.assertTrue(result["success"])
        self.assertIsNone(result["error"])
        self.assertIsNotNone(result["callstack"])

    def test_multiline_code(self):
        """Test handling of multiline code with various indentation levels"""
        code = """
def add(a, b):
    return a + b

x = 5
y = 10
result = add(x, y)
"""
        result = safe_exec(code)
        self.assertTrue(result["success"])
        self.assertIsNone(result["error"])
        self.assertIsNotNone(result["callstack"])

    def test_comments(self):
        """Test handling of various comment types"""
        code = """
# Single line comment
x = 5  # Inline comment
'''
Multi-line
comment
'''
y = 10
"""
        result = safe_exec(code)
        self.assertTrue(result["success"])
        self.assertIsNone(result["error"])
        self.assertIsNotNone(result["callstack"])

    def test_json_output(self):
        """Test that the output can be properly serialized to JSON"""
        code = "x = 5"
        result = safe_exec(code)
        # Verify the result can be serialized to JSON
        json_str = json.dumps(result)
        parsed_result = json.loads(json_str)
        self.assertEqual(result, parsed_result)

if __name__ == '__main__':
    unittest.main() 