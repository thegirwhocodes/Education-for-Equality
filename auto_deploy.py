#!/usr/bin/env python3
"""Compatibility entrypoint for the workspace safe snapshot hook."""

from pathlib import Path
import runpy


SNAPSHOT_SCRIPT = Path("/Users/naomiivie/Education for Equality/scripts/safe_auto_snapshot.py")


if __name__ == "__main__":
    runpy.run_path(str(SNAPSHOT_SCRIPT), run_name="__main__")
