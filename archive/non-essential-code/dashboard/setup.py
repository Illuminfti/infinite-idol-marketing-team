"""Setup configuration for Infinite Idol Dashboard TUI."""

from setuptools import setup, find_packages
from pathlib import Path

# Read README if it exists
readme_file = Path(__file__).parent / "TUI_GUIDE.md"
long_description = ""
if readme_file.exists():
    long_description = readme_file.read_text(encoding="utf-8")

setup(
    name="infinite-idol-dashboard",
    version="2.0.0",
    description="Terminal UI dashboard for Infinite Idol AI agent team",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="Infinite Idol Team",
    author_email="team@infiniteidol.game",
    url="https://github.com/infiniteidol/marketing-team",
    packages=find_packages(),
    install_requires=[
        "textual>=0.50.0",
        "rich>=13.0.0",
    ],
    extras_require={
        "clipboard": ["pyperclip>=1.8.0"],
    },
    entry_points={
        "console_scripts": [
            "idol-dashboard=tui_app:main",
        ],
    },
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Topic :: Software Development :: User Interfaces",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
    ],
    python_requires=">=3.9",
)
