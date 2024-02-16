""" Execute a string as code """

import sys

codeStr = sys.argv[1]

allowed_globals = {"__builtins__": None}
allowed_locals = {"print": print}
result = exec(codeStr, allowed_globals, allowed_locals)
