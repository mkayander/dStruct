import sys

def tracked_print(*args, **kwargs):
    """
    Custom print function that stores output in the provided globals['__stdout__'].
    Mimics the behavior of print() but stores the result in the global stdout buffer.
    """
    # Get the globals dictionary from the caller's frame
    frame = sys._getframe(1)
    globals_dict = frame.f_globals
    
    # Convert all arguments to strings
    sep = kwargs.get('sep', ' ')
    end = kwargs.get('end', '\n')
    
    # Join all arguments with the separator
    output = sep.join(str(arg) for arg in args) + end
    
    # Append to the global stdout buffer
    globals_dict['__stdout__'] += output

def get_output():
    """Get the current output buffer and clear it."""
    global _output_buffer
    output = _output_buffer.get('__stdout__', "")
    _output_buffer['__stdout__'] = ""
    return output
