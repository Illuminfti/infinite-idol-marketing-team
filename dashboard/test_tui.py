#!/usr/bin/env python3
"""Test script for TUI dashboard.

This script verifies that the TUI can be imported and initialized
without errors. It doesn't launch the interactive interface.
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

print("🧪 Testing Infinite Idol TUI Dashboard...\n")

# Test 1: Import modules
print("1️⃣  Testing imports...")
try:
    from tui.app import InfiniteIdolApp
    from tui.data.loader import DataLoader
    from tui.theme import AGENTS, CSS
    from tui.widgets.stat_card import StatCard
    from tui.widgets.agent_grid import AgentGrid
    from tui.widgets.activity_feed import ActivityFeed
    from tui.screens.dashboard import DashboardScreen
    print("   ✅ All modules import successfully\n")
except Exception as e:
    print(f"   ❌ Import failed: {e}\n")
    sys.exit(1)

# Test 2: Data loader
print("2️⃣  Testing data loader...")
try:
    loader = DataLoader()
    tasks = loader.load_task_queue()
    activities = loader.load_activity_log()
    content = loader.load_content_files()
    stats = loader.calculate_stats(tasks)

    print(f"   ✅ Data loader works:")
    print(f"      • Tasks: {len(tasks)}")
    print(f"      • Activities: {len(activities)}")
    print(f"      • Content files: {len(content)}")
    print(f"      • Total tasks: {stats.get('tasks_total', 0)}")
    print(f"      • Pending: {stats.get('tasks_pending', 0)}")
    print(f"      • In Progress: {stats.get('tasks_in_progress', 0)}")
    print(f"      • Complete: {stats.get('tasks_complete', 0)}\n")
except Exception as e:
    print(f"   ❌ Data loader failed: {e}\n")
    sys.exit(1)

# Test 3: App initialization
print("3️⃣  Testing app initialization...")
try:
    app = InfiniteIdolApp()
    print(f"   ✅ App initialized successfully")
    print(f"      • Title: {app.TITLE}")
    print(f"      • Bindings: {len(app.BINDINGS)} keyboard shortcuts")
    print(f"      • State keys: {list(app.state.keys())}\n")
except Exception as e:
    print(f"   ❌ App initialization failed: {e}\n")
    sys.exit(1)

# Test 4: Theme
print("4️⃣  Testing theme...")
try:
    print(f"   ✅ Theme configured:")
    print(f"      • Agents defined: {len(AGENTS)}")
    print(f"      • CSS length: {len(CSS)} characters\n")
except Exception as e:
    print(f"   ❌ Theme test failed: {e}\n")
    sys.exit(1)

print("=" * 60)
print("✅ All tests passed! TUI is ready to use.")
print("=" * 60)
print("\nTo launch the dashboard:")
print("  python dashboard/tui_app.py")
print("\nOr after installation:")
print("  idol-dashboard")
print()
