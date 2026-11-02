import sys
from pathlib import Path

# Ensure backend root is in sys.path so 'tools' and local modules resolve
backend_dir = str(Path(__file__).resolve().parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from .backend import run_travel_agent

__all__ = ["run_travel_agent"]

