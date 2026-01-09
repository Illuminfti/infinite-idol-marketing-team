#!/usr/bin/env python3
"""Entry point for Infinite Idol TUI Dashboard.

Run with:
    python dashboard/tui_app.py

Or install and run with:
    cd dashboard && pip install -e .
    idol-dashboard
"""

import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from tui.app import InfiniteIdolApp


def main():
    """Main entry point for the TUI application."""
    app = InfiniteIdolApp()
    app.run()


if __name__ == "__main__":
    main()
