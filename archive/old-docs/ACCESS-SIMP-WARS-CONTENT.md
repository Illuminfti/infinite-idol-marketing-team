# How Marketing Agents Access Simp Wars Content

## ✅ Setup Complete!

The infinite-idol-marketing-team repo is now a **git submodule** inside the simp-wars repo.

```
simp-wars/
├── src/                      # Discord bot source code
│   └── modules/
│       ├── mini-chase/       # Mini-Chase battle royale
│       ├── onboarding/       # Onboarding journey
│       ├── gacha/            # Gacha system
│       ├── faction/          # Faction wars
│       └── ika/              # Ika's voice patterns
├── .auto-claude/
│   └── specs/                # PRD documents
└── marketing/                # ← YOU ARE HERE
    ├── agents/               # Marketing agents
    ├── outputs/              # Generated content
    └── knowledge-base/       # Marketing knowledge

```

## 📂 Key Content Files

### Mini-Chase Events (VIRAL CONTENT)
```
../src/modules/mini-chase/events.ts
- 86 events with Ika's voice
- 6 voice modes (Tsundere, Yandere, Deredere, Smug, Chaos, 4th Wall)
- 6+ anime references (JoJo, DBZ, Isekai, AoT, Death Note)
- Comedy punchlines in every event
```

### Onboarding Journey Messages
```
../src/modules/onboarding/messages.ts
- 7-stage onboarding flow copy
- Welcome DMs, quiz questions, victory messages
- Ika's personality in action
```

### Ika's Voice Patterns
```
../src/modules/ika/index.ts
- All voice mode examples
- Character personality guidelines
```

### PRD Documents
```
../.auto-claude/specs/002-prd-simp-wars-onboarding-journey/spec.md
../.auto-claude/specs/003-prd-mini-chase-content-enhancement/spec.md
```

### Gacha Cards
```
../src/modules/gacha/cards.ts
- All card definitions
- Rarity tiers, descriptions
```

### Faction System
```
../src/modules/faction/
- Pink Pilled, Dark Devotees, Chaos Agents lore
```

## 🤖 Example Agent Prompts

### Agent: Content Miner
```
Read ../src/modules/mini-chase/events.ts and extract:
1. The 10 funniest event narratives
2. The 5 most screenshot-worthy moments
3. All anime references

Output to outputs/mini-chase-highlights.md
```

### Agent: Twitter Hook Generator
```
Review ../src/modules/onboarding/messages.ts and create:
- 20 Twitter hooks teasing the onboarding experience
- Each hook should be <280 characters
- Include call-to-action

Output to outputs/twitter-hooks.md
```

### Agent: Lore Curator
```
Compile all Ika character information from:
- ../src/modules/ika/index.ts
- ../src/modules/onboarding/messages.ts
- ../src/modules/mini-chase/announcements.ts

Create a brand character sheet for designers.
Output to outputs/ika-character-sheet.md
```

### Agent: Feature Highlighter
```
Read ../.auto-claude/specs/003-prd-mini-chase-content-enhancement/spec.md
Extract:
- All success criteria
- Key features
- User experience goals

Create 5 marketing one-pagers.
Output to outputs/feature-highlights/
```

## 🔄 How to Update the Submodule

```bash
# Pull latest changes from marketing repo
cd marketing
git pull origin main

# Or update from parent repo
cd ..
git submodule update --remote marketing
```

## 📝 Notes

- All paths use `../` to reference parent simp-wars directory
- Agents can READ simp-wars content (not modify)
- Marketing outputs stay in marketing/outputs/
- Keep git histories separate (good practice)

## 🚀 Ready to Use!

Your agents now have direct access to all simp-wars content.
Just reference paths like `../src/modules/mini-chase/events.ts` in your prompts.
