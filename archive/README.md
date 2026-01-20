# Archive

> **Contents**: Archived files, reference personas, and non-essential code

---

## Directory Structure

```
archive/
├── reference-personas/     # 15 archived agent personas (documentation)
├── non-essential-code/     # Dashboard, sync-service, automation scripts
│   ├── dashboard/          # Desktop app and TUI (not active)
│   ├── sync-service/       # Notion sync service (not active)
│   └── automation-scripts/ # Python orchestration (future architecture)
├── old-outputs/            # Historical outputs and plans
├── old-reviews/            # Historical review documents
└── old-docs/               # Archived documentation files
```

---

## What's Here

### Reference Personas
15 agent personas that describe roles requiring human execution or external integrations. Load for context but don't expect autonomous AI execution.

### Non-Essential Code
Code that was developed for future features or external integrations:
- **Dashboard**: Desktop app and TUI for task management (requires Python/JS runtime)
- **Sync-Service**: Notion database synchronization (requires Node.js and API keys)
- **Automation Scripts**: Python orchestration layer (future multi-agent architecture)

### Old Outputs
Historical outputs including:
- Coordination plans
- Implementation notes
- Overhaul planning documents

### Old Reviews
Historical review documents from previous audits and validations.

### Old Docs
- `NORMIES.md` - Original onboarding document
- `CHANGELOG.md` - Historical changes
- `Gate Discord bot docs/` - Discord bot integration docs

---

## Restoration

If you need to restore any archived content:

```bash
# Example: Restore dashboard
mv archive/non-essential-code/dashboard ./dashboard

# Example: Restore a reference persona
cp archive/reference-personas/10-infiltrator.md agents/10-infiltrator.md
```

---

*"Archived, not deleted. History preserved."*
