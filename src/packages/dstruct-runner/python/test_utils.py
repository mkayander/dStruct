import unittest
import json
from typing import Any, Dict, List
from datetime import datetime

class PrettyTestResult(unittest.TextTestResult):
    """Custom test result class that provides pretty printing of test results."""
    
    def startTest(self, test: unittest.TestCase) -> None:
        """Called when a test starts running."""
        super().startTest(test)
        print(f"\n\033[1mRunning test: {test._testMethodName}\033[0m")
        print(f"Description: {test._testMethodDoc or 'No description'}")
        print("-" * 80)

    def addSuccess(self, test: unittest.TestCase) -> None:
        """Called when a test passes."""
        super().addSuccess(test)
        print("\033[92m✓ Test passed\033[0m")
        self._print_callstack(test)

    def addFailure(self, test: unittest.TestCase, err: Any) -> None:
        """Called when a test fails."""
        super().addFailure(test, err)
        print("\033[91m✗ Test failed\033[0m")
        print(f"Error: {err[1]}")
        self._print_callstack(test)

    def _print_callstack(self, test: unittest.TestCase) -> None:
        """Print the callstack in a pretty format."""
        if hasattr(test, 'callstack'):
            print("\nCallstack:")
            for frame in test.callstack:
                print(f"\n  Frame {frame['timestamp']}:")
                print(f"    ID: {frame['id']}")
                print(f"    Operation: {frame['name']}")
                print(f"    Args: {json.dumps(frame['args'], indent=4)}")
            print("-" * 80)

class PrettyTestRunner(unittest.TextTestRunner):
    """Custom test runner that uses PrettyTestResult for output formatting."""
    resultclass = PrettyTestResult

def print_test_summary(result: unittest.TestResult, start_time: datetime) -> None:
    """Print a summary of test results.
    
    Args:
        result: The test result object containing test statistics
        start_time: The time when the tests started running
    """
    print("\n\033[1mTest Summary\033[0m")
    print("=" * 80)
    print(f"Total tests: {result.testsRun}")
    print(f"Passed: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"Failed: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print(f"Time taken: {(datetime.now() - start_time).total_seconds():.2f} seconds")
    print("=" * 80)

def run_tests_with_pretty_output(test_classes: List[type[unittest.TestCase]]) -> None:
    """Run tests with pretty output formatting.
    
    Args:
        test_classes: List of test classes to run
    """
    print("\n\033[1mStarting Tests\033[0m")
    print("=" * 80)
    
    start_time = datetime.now()
    
    # Create test suite
    suite = unittest.TestSuite()
    for test_class in test_classes:
        suite.addTests(unittest.TestLoader().loadTestsFromTestCase(test_class))
    
    # Run tests
    runner = PrettyTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Print summary
    print_test_summary(result, start_time) 