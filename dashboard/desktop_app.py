#!/usr/bin/env python3
"""
Infinite Idol - Desktop Command Center
A functional desktop application with integrated terminal for agent management
"""

import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox
import subprocess
import threading
import os
import sys
from datetime import datetime, timedelta
import re

class InfiniteIdolDashboard:
    def __init__(self, root):
        self.root = root
        self.root.title("Infinite Idol - Agent Command Center")
        self.root.geometry("1400x900")

        # Set dark theme colors
        self.bg_dark = "#0A0A0B"
        self.bg_surface = "#1A1A1D"
        self.bg_card = "#232326"
        self.text_primary = "#E5E5E5"
        self.text_secondary = "#A3A3A3"
        self.gold = "#D4AF37"
        self.success = "#22C55E"
        self.warning = "#F59E0B"
        self.error = "#EF4444"

        # Configure root
        self.root.configure(bg=self.bg_dark)

        # Project root
        self.project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

        # Data
        self.tasks = []
        self.activities = []
        self.agents = [
            {"id": "00", "name": "Coordinator", "role": "Marketing Director", "color": "#8B5CF6"},
            {"id": "01", "name": "Lore Architect", "role": "Worldbuilding Specialist", "color": "#EC4899"},
            {"id": "02", "name": "Content Strategist", "role": "Social Media Lead", "color": "#3B82F6"},
            {"id": "03", "name": "Community Manager", "role": "Discord & Engagement", "color": "#10B981"},
            {"id": "04", "name": "Gacha Designer", "role": "Seasonal Content", "color": "#F59E0B"},
            {"id": "05", "name": "Analytics Observer", "role": "Performance Tracking", "color": "#6366F1"},
            {"id": "06", "name": "Asset Coordinator", "role": "Creative Asset Manager", "color": "#14B8A6"},
            {"id": "07", "name": "Light Novel Writer", "role": "Narrative Specialist", "color": "#F472B6"},
            {"id": "08", "name": "Lore Guardian", "role": "Canon Validation", "color": "#A855F7"},
            {"id": "09", "name": "Resident Degen", "role": "Cultural Enforcer", "color": "#EF4444"},
        ]

        self.setup_ui()
        self.load_data()

    def setup_ui(self):
        """Setup the main UI"""

        # Create main container
        main_container = tk.Frame(self.root, bg=self.bg_dark)
        main_container.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        # Top bar
        top_bar = tk.Frame(main_container, bg=self.bg_surface, height=60)
        top_bar.pack(fill=tk.X, pady=(0, 10))
        top_bar.pack_propagate(False)

        title_label = tk.Label(
            top_bar,
            text="🎯 INFINITE IDOL - Agent Command Center",
            font=("Helvetica", 18, "bold"),
            fg=self.gold,
            bg=self.bg_surface
        )
        title_label.pack(side=tk.LEFT, padx=20, pady=15)

        self.status_label = tk.Label(
            top_bar,
            text="● All Systems Operational",
            font=("Helvetica", 11),
            fg=self.success,
            bg=self.bg_surface
        )
        self.status_label.pack(side=tk.RIGHT, padx=20, pady=15)

        refresh_btn = tk.Button(
            top_bar,
            text="🔄 Refresh",
            command=self.load_data,
            bg=self.bg_card,
            fg=self.text_primary,
            font=("Helvetica", 10),
            relief=tk.FLAT,
            padx=15,
            pady=5,
            cursor="hand2"
        )
        refresh_btn.pack(side=tk.RIGHT, padx=10)

        # Main content area - split into left and right
        content_area = tk.Frame(main_container, bg=self.bg_dark)
        content_area.pack(fill=tk.BOTH, expand=True)

        # Left panel - Dashboard data
        left_panel = tk.Frame(content_area, bg=self.bg_dark, width=800)
        left_panel.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(0, 5))

        # Right panel - Terminal and agents
        right_panel = tk.Frame(content_area, bg=self.bg_dark, width=550)
        right_panel.pack(side=tk.RIGHT, fill=tk.BOTH, padx=(5, 0))

        self.setup_left_panel(left_panel)
        self.setup_right_panel(right_panel)

    def setup_left_panel(self, parent):
        """Setup left panel with stats and tasks"""

        # Stats cards
        stats_frame = tk.Frame(parent, bg=self.bg_dark)
        stats_frame.pack(fill=tk.X, pady=(0, 10))

        self.stat_widgets = {}
        stats = [
            ("📊 Total Tasks", "tasks_total", self.text_primary),
            ("⏳ Pending", "tasks_pending", self.warning),
            ("🔄 In Progress", "tasks_in_progress", "#3B82F6"),
            ("✅ Complete", "tasks_complete", self.success),
        ]

        for i, (label, key, color) in enumerate(stats):
            card = self.create_stat_card(stats_frame, label, "0", color)
            card.grid(row=0, column=i, padx=5, sticky="ew")
            stats_frame.grid_columnconfigure(i, weight=1)
            self.stat_widgets[key] = card

        # Tabbed view for tasks, activities, report
        notebook = ttk.Notebook(parent)
        notebook.pack(fill=tk.BOTH, expand=True)

        # Style the notebook
        style = ttk.Style()
        style.theme_use('default')
        style.configure('TNotebook', background=self.bg_dark, borderwidth=0)
        style.configure('TNotebook.Tab', background=self.bg_card, foreground=self.text_primary,
                       padding=[20, 10], font=('Helvetica', 10))
        style.map('TNotebook.Tab', background=[('selected', self.bg_surface)],
                 foreground=[('selected', self.gold)])

        # Task Queue Tab
        tasks_tab = tk.Frame(notebook, bg=self.bg_surface)
        notebook.add(tasks_tab, text="📋 Task Queue")
        self.setup_tasks_tab(tasks_tab)

        # Activity Log Tab
        activity_tab = tk.Frame(notebook, bg=self.bg_surface)
        notebook.add(activity_tab, text="📝 Activity Log")
        self.setup_activity_tab(activity_tab)

        # Daily Report Tab
        report_tab = tk.Frame(notebook, bg=self.bg_surface)
        notebook.add(report_tab, text="📊 Daily Report")
        self.setup_report_tab(report_tab)

    def setup_right_panel(self, parent):
        """Setup right panel with terminal and agent controls"""

        # Agent control section
        agents_frame = tk.LabelFrame(
            parent,
            text="🎯 Agent Control",
            bg=self.bg_surface,
            fg=self.gold,
            font=("Helvetica", 12, "bold"),
            relief=tk.FLAT,
            borderwidth=2
        )
        agents_frame.pack(fill=tk.X, pady=(0, 10))

        # Create agent buttons in a grid
        agents_inner = tk.Frame(agents_frame, bg=self.bg_surface)
        agents_inner.pack(fill=tk.BOTH, padx=10, pady=10)

        for i, agent in enumerate(self.agents):
            btn = tk.Button(
                agents_inner,
                text=f"{agent['id']} {agent['name']}",
                command=lambda a=agent: self.summon_agent(a),
                bg=agent['color'],
                fg="white",
                font=("Helvetica", 9, "bold"),
                relief=tk.FLAT,
                padx=10,
                pady=8,
                cursor="hand2",
                activebackground=agent['color']
            )
            row = i // 2
            col = i % 2
            btn.grid(row=row, column=col, padx=5, pady=5, sticky="ew")
            agents_inner.grid_columnconfigure(col, weight=1)

        # Quick actions
        actions_frame = tk.LabelFrame(
            parent,
            text="⚡ Quick Actions",
            bg=self.bg_surface,
            fg=self.gold,
            font=("Helvetica", 12, "bold"),
            relief=tk.FLAT,
            borderwidth=2
        )
        actions_frame.pack(fill=tk.X, pady=(0, 10))

        actions_inner = tk.Frame(actions_frame, bg=self.bg_surface)
        actions_inner.pack(fill=tk.BOTH, padx=10, pady=10)

        quick_actions = [
            ("📋 View Queue", self.cmd_view_queue),
            ("🔄 Process Queue", self.cmd_process_queue),
            ("📊 Run Pipeline", self.cmd_run_pipeline),
            ("🔍 Check Status", self.load_data),
        ]

        for i, (text, cmd) in enumerate(quick_actions):
            btn = tk.Button(
                actions_inner,
                text=text,
                command=cmd,
                bg=self.bg_card,
                fg=self.text_primary,
                font=("Helvetica", 9),
                relief=tk.FLAT,
                padx=10,
                pady=6,
                cursor="hand2"
            )
            row = i // 2
            col = i % 2
            btn.grid(row=row, column=col, padx=5, pady=5, sticky="ew")
            actions_inner.grid_columnconfigure(col, weight=1)

        # Terminal section
        terminal_frame = tk.LabelFrame(
            parent,
            text="💻 Terminal Output",
            bg=self.bg_surface,
            fg=self.gold,
            font=("Helvetica", 12, "bold"),
            relief=tk.FLAT,
            borderwidth=2
        )
        terminal_frame.pack(fill=tk.BOTH, expand=True)

        # Terminal text area
        self.terminal_text = scrolledtext.ScrolledText(
            terminal_frame,
            bg="#000000",
            fg="#00FF00",
            font=("Courier", 10),
            wrap=tk.WORD,
            relief=tk.FLAT,
            insertbackground="#00FF00"
        )
        self.terminal_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        # Command input
        cmd_frame = tk.Frame(terminal_frame, bg=self.bg_surface)
        cmd_frame.pack(fill=tk.X, padx=10, pady=(0, 10))

        tk.Label(cmd_frame, text="$", bg=self.bg_surface, fg="#00FF00",
                font=("Courier", 12, "bold")).pack(side=tk.LEFT, padx=(0, 5))

        self.cmd_entry = tk.Entry(
            cmd_frame,
            bg="#000000",
            fg="#00FF00",
            font=("Courier", 11),
            relief=tk.FLAT,
            insertbackground="#00FF00"
        )
        self.cmd_entry.pack(side=tk.LEFT, fill=tk.X, expand=True)
        self.cmd_entry.bind('<Return>', self.execute_command)

        exec_btn = tk.Button(
            cmd_frame,
            text="Execute",
            command=lambda: self.execute_command(None),
            bg=self.success,
            fg="white",
            font=("Helvetica", 9, "bold"),
            relief=tk.FLAT,
            padx=15,
            cursor="hand2"
        )
        exec_btn.pack(side=tk.LEFT, padx=(5, 0))

        # Initial message
        self.print_terminal("=== Infinite Idol Command Center ===")
        self.print_terminal("Type commands here or use the buttons above")
        self.print_terminal("Examples: /agent 02, /queue, /pipeline")
        self.print_terminal("")

    def create_stat_card(self, parent, label, value, color):
        """Create a stat card widget"""
        card = tk.Frame(parent, bg=self.bg_card, relief=tk.FLAT, borderwidth=0)
        card.pack_propagate(False)

        label_widget = tk.Label(
            card,
            text=label,
            bg=self.bg_card,
            fg=self.text_secondary,
            font=("Helvetica", 9)
        )
        label_widget.pack(pady=(10, 5))

        value_widget = tk.Label(
            card,
            text=value,
            bg=self.bg_card,
            fg=color,
            font=("Helvetica", 24, "bold")
        )
        value_widget.pack(pady=(0, 10))

        # Store value widget for updates
        card.value_widget = value_widget

        return card

    def setup_tasks_tab(self, parent):
        """Setup tasks table"""
        # Create treeview
        columns = ("ID", "Agent", "Priority", "Task", "Status", "Due")

        tree_frame = tk.Frame(parent, bg=self.bg_surface)
        tree_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        # Scrollbars
        vsb = tk.Scrollbar(tree_frame, orient="vertical")
        vsb.pack(side=tk.RIGHT, fill=tk.Y)

        hsb = tk.Scrollbar(tree_frame, orient="horizontal")
        hsb.pack(side=tk.BOTTOM, fill=tk.X)

        self.tasks_tree = ttk.Treeview(
            tree_frame,
            columns=columns,
            show="headings",
            yscrollcommand=vsb.set,
            xscrollcommand=hsb.set
        )

        vsb.config(command=self.tasks_tree.yview)
        hsb.config(command=self.tasks_tree.xview)

        # Configure columns
        self.tasks_tree.heading("ID", text="ID")
        self.tasks_tree.heading("Agent", text="Agent")
        self.tasks_tree.heading("Priority", text="Priority")
        self.tasks_tree.heading("Task", text="Task")
        self.tasks_tree.heading("Status", text="Status")
        self.tasks_tree.heading("Due", text="Due")

        self.tasks_tree.column("ID", width=100)
        self.tasks_tree.column("Agent", width=50)
        self.tasks_tree.column("Priority", width=70)
        self.tasks_tree.column("Task", width=350)
        self.tasks_tree.column("Status", width=100)
        self.tasks_tree.column("Due", width=100)

        # Style
        style = ttk.Style()
        style.configure("Treeview",
                       background=self.bg_card,
                       foreground=self.text_primary,
                       fieldbackground=self.bg_card,
                       borderwidth=0)
        style.configure("Treeview.Heading",
                       background=self.bg_surface,
                       foreground=self.gold,
                       borderwidth=0)
        style.map('Treeview', background=[('selected', self.bg_surface)])

        self.tasks_tree.pack(fill=tk.BOTH, expand=True)

    def setup_activity_tab(self, parent):
        """Setup activity log"""
        self.activity_text = scrolledtext.ScrolledText(
            parent,
            bg=self.bg_card,
            fg=self.text_primary,
            font=("Courier", 10),
            wrap=tk.WORD,
            relief=tk.FLAT
        )
        self.activity_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

    def setup_report_tab(self, parent):
        """Setup daily report"""
        self.report_text = scrolledtext.ScrolledText(
            parent,
            bg=self.bg_card,
            fg=self.text_primary,
            font=("Courier", 10),
            wrap=tk.WORD,
            relief=tk.FLAT
        )
        self.report_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

    def load_data(self):
        """Load data from markdown files"""
        self.print_terminal("📊 Loading data from repository...")

        try:
            # Load tasks
            task_file = os.path.join(self.project_root, "automation", "task-queue.md")
            if os.path.exists(task_file):
                with open(task_file, 'r') as f:
                    content = f.read()
                    self.tasks = self.parse_task_queue(content)
                self.print_terminal(f"✅ Loaded {len(self.tasks)} tasks")
            else:
                self.print_terminal(f"⚠️  Task queue file not found: {task_file}")

            # Load activities
            activity_file = os.path.join(self.project_root, "logs", "agent-activity.md")
            if os.path.exists(activity_file):
                with open(activity_file, 'r') as f:
                    content = f.read()
                    self.activities = self.parse_activity_log(content)
                self.print_terminal(f"✅ Loaded {len(self.activities)} activities")
            else:
                self.print_terminal(f"⚠️  Activity log file not found: {activity_file}")

            # Update UI
            self.update_stats()
            self.update_tasks_view()
            self.update_activity_view()
            self.update_report_view()

            self.print_terminal("✅ Data refresh complete\n")

        except Exception as e:
            self.print_terminal(f"❌ Error loading data: {str(e)}\n")

    def parse_task_queue(self, text):
        """Parse task queue markdown"""
        tasks = []
        lines = text.split('\n')

        current_agent = None
        in_table = False

        for i, line in enumerate(lines):
            # Detect agent section
            agent_match = re.search(r'## .+? Queue \(Agent (\d{2})\)', line)
            if agent_match:
                current_agent = agent_match.group(1)
                continue

            # Detect table start
            if '| ID |' in line and '| Task |' in line:
                in_table = True
                continue

            # Skip separator
            if in_table and '---' in line:
                continue

            # Parse table row
            if in_table and line.startswith('|'):
                if '##' in line:
                    in_table = False
                    continue

                cells = [c.strip() for c in line.split('|') if c.strip()]
                if len(cells) >= 6:
                    tasks.append({
                        'id': cells[0],
                        'agent': current_agent,
                        'priority': cells[1],
                        'task': cells[2],
                        'status': cells[3],
                        'created': cells[4],
                        'due': cells[5],
                        'notes': cells[6] if len(cells) > 6 else ''
                    })

            # End of table
            if in_table and (line.strip() == '' or line.startswith('##') or line.startswith('---')):
                in_table = False

        return tasks

    def parse_activity_log(self, text):
        """Parse activity log markdown"""
        activities = []
        lines = text.split('\n')

        current_activity = None

        for line in lines:
            # Detect activity header
            header_match = re.search(r'### \[(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\]\s+(?:Agent:\s+)?(.+)', line)
            if header_match:
                if current_activity:
                    activities.append(current_activity)

                current_activity = {
                    'date': header_match.group(1),
                    'time': header_match.group(2),
                    'agent': header_match.group(3),
                    'type': '',
                    'summary': ''
                }
                continue

            # Parse activity details
            if current_activity:
                if line.startswith('**Activity Type**:'):
                    current_activity['type'] = line.replace('**Activity Type**:', '').strip()
                elif line.startswith('**Summary**:'):
                    current_activity['summary'] = line.replace('**Summary**:', '').strip()

        if current_activity:
            activities.append(current_activity)

        return activities

    def update_stats(self):
        """Update stats cards"""
        status_counts = {}
        for task in self.tasks:
            status = task['status'].lower()
            status_counts[status] = status_counts.get(status, 0) + 1

        self.stat_widgets['tasks_total'].value_widget.config(text=str(len(self.tasks)))
        self.stat_widgets['tasks_pending'].value_widget.config(text=str(status_counts.get('pending', 0)))
        self.stat_widgets['tasks_in_progress'].value_widget.config(text=str(status_counts.get('in_progress', 0)))
        self.stat_widgets['tasks_complete'].value_widget.config(text=str(status_counts.get('complete', 0)))

    def update_tasks_view(self):
        """Update tasks treeview"""
        # Clear existing
        for item in self.tasks_tree.get_children():
            self.tasks_tree.delete(item)

        # Add tasks
        for task in self.tasks:
            self.tasks_tree.insert('', 'end', values=(
                task['id'],
                task['agent'],
                task['priority'],
                task['task'][:60] + '...' if len(task['task']) > 60 else task['task'],
                task['status'],
                task['due']
            ))

    def update_activity_view(self):
        """Update activity log"""
        self.activity_text.delete('1.0', tk.END)

        for activity in self.activities[:20]:  # Show last 20
            self.activity_text.insert(tk.END, f"[{activity['date']} {activity['time']}] ", 'date')
            self.activity_text.insert(tk.END, f"{activity['agent']}\n", 'agent')
            self.activity_text.insert(tk.END, f"Type: {activity['type']}\n", 'type')
            self.activity_text.insert(tk.END, f"{activity['summary']}\n\n", 'summary')

        self.activity_text.tag_config('date', foreground=self.text_secondary)
        self.activity_text.tag_config('agent', foreground=self.gold, font=('Courier', 10, 'bold'))
        self.activity_text.tag_config('type', foreground='#3B82F6')
        self.activity_text.tag_config('summary', foreground=self.text_primary)

    def update_report_view(self):
        """Update daily report"""
        self.report_text.delete('1.0', tk.END)

        # Get last 24h activities
        now = datetime.now()
        yesterday = now - timedelta(days=1)
        yesterday_str = yesterday.strftime('%Y-%m-%d')
        today_str = now.strftime('%Y-%m-%d')

        last_24h = [a for a in self.activities if a['date'] in [yesterday_str, today_str]]

        # Generate report
        self.report_text.insert(tk.END, "=" * 60 + "\n", 'header')
        self.report_text.insert(tk.END, "DAILY STATUS REPORT - LAST 24 HOURS\n", 'header')
        self.report_text.insert(tk.END, f"Generated: {now.strftime('%Y-%m-%d %H:%M:%S')}\n", 'header')
        self.report_text.insert(tk.END, "=" * 60 + "\n\n", 'header')

        # Summary stats
        self.report_text.insert(tk.END, "📈 ACTIVITY SUMMARY\n", 'section')
        self.report_text.insert(tk.END, "-" * 60 + "\n")
        self.report_text.insert(tk.END, f"Total Activities: {len(last_24h)}\n")

        content_created = len([a for a in last_24h if 'content' in a['type'].lower() or 'tweet' in a['type'].lower()])
        self.report_text.insert(tk.END, f"Content Created: {content_created}\n")

        reviews_done = len([a for a in last_24h if 'review' in a['type'].lower()])
        self.report_text.insert(tk.END, f"Reviews Completed: {reviews_done}\n\n")

        # Agent breakdown
        self.report_text.insert(tk.END, "👥 AGENT ACTIVITY BREAKDOWN\n", 'section')
        self.report_text.insert(tk.END, "-" * 60 + "\n")

        by_agent = {}
        for activity in last_24h:
            agent_match = re.search(r'(\d{2})', activity['agent'])
            if agent_match:
                agent_id = agent_match.group(1)
                if agent_id not in by_agent:
                    by_agent[agent_id] = []
                by_agent[agent_id].append(activity)

        for agent in self.agents:
            if agent['id'] in by_agent:
                acts = by_agent[agent['id']]
                self.report_text.insert(tk.END, f"\nAgent {agent['id']} - {agent['name']}: {len(acts)} actions\n", 'agent')
                for act in acts[:2]:
                    self.report_text.insert(tk.END, f"  • {act['summary'][:80]}\n")

        # Blockers
        blockers = [t for t in self.tasks if t['status'].lower() == 'blocked']
        if blockers:
            self.report_text.insert(tk.END, "\n🚫 CURRENT BLOCKERS\n", 'blocker')
            self.report_text.insert(tk.END, "-" * 60 + "\n")
            for blocker in blockers:
                self.report_text.insert(tk.END, f"• {blocker['id']}: {blocker['task']}\n", 'blocker')

        # Next actions
        self.report_text.insert(tk.END, "\n🎯 NEXT PRIORITY ACTIONS\n", 'section')
        self.report_text.insert(tk.END, "-" * 60 + "\n")

        priority_tasks = [t for t in self.tasks if t['priority'] in ['P0', 'P1'] and t['status'].lower() != 'complete']
        for task in priority_tasks[:5]:
            self.report_text.insert(tk.END, f"[{task['priority']}] Agent {task['agent']}: {task['task']}\n")

        # Configure tags
        self.report_text.tag_config('header', foreground=self.gold, font=('Courier', 10, 'bold'))
        self.report_text.tag_config('section', foreground='#3B82F6', font=('Courier', 10, 'bold'))
        self.report_text.tag_config('agent', foreground=self.success)
        self.report_text.tag_config('blocker', foreground=self.error)

    def print_terminal(self, message):
        """Print to terminal"""
        self.terminal_text.insert(tk.END, message + "\n")
        self.terminal_text.see(tk.END)

    def execute_command(self, event):
        """Execute command from entry"""
        cmd = self.cmd_entry.get().strip()
        if not cmd:
            return

        self.print_terminal(f"$ {cmd}")
        self.cmd_entry.delete(0, tk.END)

        # Process command
        if cmd.startswith('/agent '):
            agent_id = cmd.split()[1].zfill(2)
            agent = next((a for a in self.agents if a['id'] == agent_id), None)
            if agent:
                self.summon_agent(agent)
            else:
                self.print_terminal(f"❌ Unknown agent: {agent_id}")

        elif cmd == '/queue' or cmd == '/queue status':
            self.cmd_view_queue()

        elif cmd == '/queue process':
            self.cmd_process_queue()

        elif cmd == '/pipeline':
            self.cmd_run_pipeline()

        elif cmd == '/refresh':
            self.load_data()

        elif cmd == '/help':
            self.print_terminal("Available commands:")
            self.print_terminal("  /agent XX    - Summon agent (e.g., /agent 02)")
            self.print_terminal("  /queue       - View task queue")
            self.print_terminal("  /queue process - Process task queue")
            self.print_terminal("  /pipeline    - Run content pipeline")
            self.print_terminal("  /refresh     - Refresh data")
            self.print_terminal("  /help        - Show this help")

        else:
            # Execute as shell command in project directory
            self.execute_shell_command(cmd)

    def execute_shell_command(self, cmd):
        """Execute shell command"""
        def run():
            try:
                self.print_terminal(f"Executing: {cmd}")
                result = subprocess.run(
                    cmd,
                    shell=True,
                    cwd=self.project_root,
                    capture_output=True,
                    text=True,
                    timeout=30
                )

                if result.stdout:
                    self.print_terminal(result.stdout)
                if result.stderr:
                    self.print_terminal(f"Error: {result.stderr}")

                self.print_terminal("✅ Command completed\n")
            except subprocess.TimeoutExpired:
                self.print_terminal("❌ Command timed out\n")
            except Exception as e:
                self.print_terminal(f"❌ Error: {str(e)}\n")

        thread = threading.Thread(target=run, daemon=True)
        thread.start()

    def summon_agent(self, agent):
        """Summon an agent"""
        self.print_terminal(f"\n{'='*60}")
        self.print_terminal(f"🎯 SUMMONING AGENT {agent['id']} - {agent['name']}")
        self.print_terminal(f"{'='*60}")
        self.print_terminal(f"Role: {agent['role']}")

        # Show agent tasks
        agent_tasks = [t for t in self.tasks if t['agent'] == agent['id']]
        self.print_terminal(f"\nCurrent Tasks: {len(agent_tasks)}")
        for task in agent_tasks[:3]:
            self.print_terminal(f"  • [{task['status']}] {task['task'][:60]}")

        # Execute the /agent command
        cmd = f"/agent {agent['id']}"
        self.print_terminal(f"\nExecuting: {cmd}\n")
        self.execute_shell_command(cmd)

    def cmd_view_queue(self):
        """View queue command"""
        self.print_terminal("\n📋 TASK QUEUE STATUS")
        self.print_terminal("-" * 60)

        status_counts = {}
        for task in self.tasks:
            status = task['status']
            status_counts[status] = status_counts.get(status, 0) + 1

        for status, count in status_counts.items():
            self.print_terminal(f"{status}: {count} tasks")

        self.print_terminal(f"\nTotal: {len(self.tasks)} tasks\n")

    def cmd_process_queue(self):
        """Process queue command"""
        self.execute_shell_command("/queue process")

    def cmd_run_pipeline(self):
        """Run pipeline command"""
        self.execute_shell_command("/pipeline")


def main():
    root = tk.Tk()
    app = InfiniteIdolDashboard(root)
    root.mainloop()


if __name__ == "__main__":
    main()
