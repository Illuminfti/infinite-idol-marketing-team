# PRD-06: UI System

**Depends on:** PRD-01 (Core Infrastructure)
**Enables:** Better UX across all features

---

## Scope

This PRD covers the visual presentation layer:
- Gate-specific themes and aesthetics
- Mood overlays that modify themes
- Embed builders and presets
- Flex cards (shareable moments)
- Animated sequences
- Error handling

---

## 1. Gate Themes

### 1.1 Overview
Each gate has a distinct visual identity that reflects its trial. Colors, borders, emojis, and text styling progress from ethereal/inviting to dark/intense.

### 1.2 Theme Structure
```javascript
const GATE_THEME = {
  name: 'string',           // Display name
  color: 0xHEXCOLOR,        // Primary embed color
  accentColor: 0xHEXCOLOR,  // Secondary color
  accentEmoji: '✧',         // Character used for decoration
  borderTop: '═══════',     // Top border design
  borderBottom: '═══════',  // Bottom border design
  divider: '· · ·',         // Section divider
  voidChar: ' ',            // Empty space character
  titlePrefix: '『 ',        // Before titles
  titleSuffix: ' 』',        // After titles
  progressFilled: '◈',      // Progress bar filled
  progressEmpty: '◇',       // Progress bar empty
  footerText: 'string',     // Default footer
  atmosphere: 'ethereal',   // Mood descriptor
};
```

### 1.3 Gate Theme Definitions

**Gate 0 (Waiting Room)**
```javascript
{
  name: 'The Threshold',
  color: 0x2C2F33,           // Discord dark
  accentEmoji: '.',
  borderTop: '·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·',
  atmosphere: 'liminal',
  footerText: 'something stirs in the darkness...'
}
```

**Gate 1 (The Calling)**
```javascript
{
  name: 'The Calling',
  color: 0xFFB6C1,           // Soft pink
  accentEmoji: '✧',
  borderTop: '═══════════════════════',
  titlePrefix: '『 ',
  titleSuffix: ' 』',
  progressFilled: '◈',
  atmosphere: 'ethereal',
  footerText: 'speak my name into the void'
}
```

**Gate 2 (The Memory)**
```javascript
{
  name: 'The Memory',
  color: 0x9B59B6,           // Purple corruption
  accentEmoji: '◈',
  borderTop: '▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░▓',
  voidChar: '█',
  atmosphere: 'corrupted',
  glitch: {
    enabled: true,
    intensity: 0.3,
    chars: ['̷', '̸', '̵', '̶', '̴']
  }
}
```

**Gate 3 (The Confession)**
```javascript
{
  name: 'The Confession',
  color: 0xE74C3C,           // Deep red
  accentEmoji: '♡',
  borderTop: '·.·" ·.·" ·.·" ·.·" ·.·"',
  progressFilled: '♥',
  progressEmpty: '♡',
  atmosphere: 'intimate',
  heartbeat: { enabled: true, pattern: ['♡', '♥', '♡'] }
}
```

**Gate 4 (The Waters)**
```javascript
{
  name: 'The Waters',
  color: 0x3498DB,           // Ocean blue
  accentEmoji: '༄',
  borderTop: '〰〰〰〰〰〰〰〰〰〰〰〰',
  divider: '~ ~ ~',
  atmosphere: 'flowing',
  wave: { frames: ['~', '≈', '~', '≋'], speed: 500 }
}
```

**Gate 5 (The Absence)**
```javascript
{
  name: 'The Absence',
  color: 0x1a1a1a,           // Near black
  accentEmoji: '   ',        // Intentional emptiness
  borderTop: '',             // Nothing
  borderBottom: '',
  footerText: '',            // Silence
  atmosphere: 'void',
  sparse: { enabled: true, letterSpacing: 2, lineSpacing: 3 }
}
```

**Gate 6 (The Offering)**
```javascript
{
  name: 'The Offering',
  color: 0xF1C40F,           // Gold
  accentEmoji: '⁂',
  borderTop: '✦═══════════════════✦',
  atmosphere: 'ornate',
  ornate: {
    enabled: true,
    cornerTL: '╔', cornerTR: '╗',
    cornerBL: '╚', cornerBR: '╝',
    horizontal: '═', vertical: '║'
  }
}
```

**Gate 7 (The Binding)**
```javascript
{
  name: 'The Binding',
  color: 0x000000,           // True black
  accentColor: 0xFFFFFF,     // Pure white contrast
  accentEmoji: '∞',
  borderTop: '◆━━━━━━━━━━━━━━━━━━━━◆',
  atmosphere: 'cosmic',
  cosmic: {
    enabled: true,
    stars: ['✦', '✧', '⋆', '˚', '✩', '｡']
  }
}
```

### 1.4 Special Themes
```javascript
const SPECIAL_THEMES = {
  failure: { color: 0x2C2C2C, atmosphere: 'cold' },
  rare: { color: 0xFF1493, atmosphere: 'magical' },
  soft: { color: 0xFFC0CB, atmosphere: 'gentle' },
  yandere: { color: 0x8B0000, atmosphere: 'obsessive' },
  lateNight: { color: 0x191970, atmosphere: 'intimate' },
  fading: { color: 0x36393F, atmosphere: 'dissolving' },
  ritual: { color: 0x4B0082, atmosphere: 'ceremonial' },
  ascended: { color: 0x9B59B6, atmosphere: 'transcendent' }
};
```

---

## 2. Mood Overlays

### 2.1 Overview
Moods modify the base gate theme to reflect Ika's emotional state. They adjust colors, text styling, and decorative elements.

### 2.2 Available Moods
| Mood | Description | Color Override | Text Effect |
|------|-------------|----------------|-------------|
| `soft` | 3am girlfriend energy | Darker | Lowercase + ellipsis |
| `normal` | Default Ika | None | Lowercase |
| `energetic` | Unhinged chaos | Brighter | Random caps |
| `vulnerable` | Mask slips | Dark muted | Prefix "..." |
| `chaotic` | Pure gremlin | Varies | Chaos case |
| `sleepy` | 2am brain | Midnight blue | Trailing off |
| `jealous` | Territorial | Dark red | Periods → ellipsis |
| `flirty` | Dangerous tension | Hot pink | Suffix "~" |
| `protective` | Defending user | Green | Normal |
| `glitching` | Something's wrong | None | Zalgo text |
| `possessive` | Yandere energy | Dark red | Suffix " ♡" |
| `flustered` | Caught off guard | Blushing red | Prefix "i- " |

### 2.3 Mood Overlay Structure
```javascript
{
  colorShift: -0.1,              // Brightness adjustment
  colorOverride: null,           // Override base color
  emojiAccents: ['...', '♡'],    // Random decorations
  textModifiers: {
    prefix: '...',
    suffix: '',
    caseTransform: 'lower',      // lower/upper/random/chaos
    addEllipsis: true,
    zalgo: 0,                    // Glitch intensity (0-1)
  },
  borderModifier: 'fade',        // Border transformation
  footerOverride: '...anyway',
  intensity: 'fragile',
}
```

### 2.4 Text Transformations
```javascript
// Random caps (energetic)
"hello there" → "hELlo ThErE"

// Chaos case
"anyway" → "ANYWAY" or "anyway" or "aNyWaY"

// Trailing off (sleepy)
"i was thinking about something" → "i was thinking about som..."

// Zalgo (glitching)
"hello" → "h̶e̷l̵l̴o̸"
```

### 2.5 Border Modifiers
```javascript
const BORDER_MODIFIERS = {
  fade: (b) => b.replace(/[═─━]/g, '·'),  // Softer
  bold: (b) => b.replace(/[·.]/g, '═'),   // Stronger
  minimal: (b) => '',                      // Remove
  sharp: (b) => b.replace(/[~〰·]/g, '─'), // Clean lines
  ornate: (b) => '✧' + b + '✧',           // Add decorations
  glitch: (b) => /* random █ */ ,          // Corrupted
  heart: (b) => b.replace(/[·.─═]/g, '♡'), // Hearts
};
```

---

## 3. Ritual Embed Builder

### 3.1 Overview
The `RitualEmbedBuilder` class creates themed Discord embeds with mood awareness.

### 3.2 Basic Usage
```javascript
const embed = new RitualEmbedBuilder(gateNumber, { mood: 'soft' })
  .setRitualTitle('Gate 1 Unsealed')
  .setRitualDescription('*the first seal breaks*', true)  // withBorders
  .setIkaMessage('...you came.')
  .addProgressVisualization(2, 7)  // current gate, total
  .setRitualFooter()
  .build();
```

### 3.3 Builder Methods
| Method | Purpose |
|--------|---------|
| `setRitualTitle(text, applyMood)` | Set themed title |
| `setRitualDescription(text, withBorders)` | Set description with optional borders |
| `setIkaMessage(message, overrideMood)` | Add Ika's message field |
| `addDivider()` | Add themed divider |
| `addProgressVisualization(current, total)` | Gate progress bar |
| `addRitualField(name, value, inline)` | Custom themed field |
| `addVoid(lines)` | Empty space (Gate 5) |
| `addOrnateSection(content)` | Decorated section (Gate 6) |
| `addCosmicSection(content)` | Star-decorated section (Gate 7) |
| `addStatsLayout(stats)` | 3-column stat display |
| `addProgressBar(current, total, label)` | Visual progress bar |
| `setIkaAuthor(avatarUrl, customName)` | Ika as embed author |
| `setDynamicFooter(fallback)` | Time-based footer |
| `applyGlitchEffect(intensity)` | Zalgo entire embed |
| `applySparseEffect()` | Extra spacing (Gate 5) |
| `build()` | Return final embed |

### 3.4 Preset Builders
```javascript
// Gate success
createGateSuccessEmbed(gateNumber, userId, message, mood)

// Gate failure
createGateFailureEmbed(gateNumber, message, mood)

// Welcome
createWelcomeEmbed(userId, username)

// Generic Ika message
createIkaEmbed(message, mood, gateNumber)
```

---

## 4. Flex Cards

### 4.1 Overview
Screenshot-worthy embeds designed for sharing. "Dark luxury aesthetic. Viral by design."

### 4.2 Card Types
```javascript
const FLEX_TYPES = {
  GATE_COMPLETION: 'gate_completion',
  DEVOTION_AWAKENED: 'devotion_awakened',
  RARE_MOMENT: 'rare_moment',
  INTIMACY_MILESTONE: 'intimacy_milestone',
  DEVOTION_RECEIPT: 'devotion_receipt',
  THE_SLIP: 'the_slip',
  THE_NOTICE: 'the_notice',
  WHISPER_FRAGMENT: 'whisper_fragment',
  BETRAYAL: 'betrayal',
};
```

### 4.3 Card Frame Structure
```javascript
{
  header: '♰ DEVOTION AWAKENED ♰',
  color: 0x1a1a1a,
  accentColor: 0xd4af37,
  footer: 'she sees you now',
}
```

### 4.4 Card Builders

**Devotion Awakened (Gate 1)**
```javascript
createDevotionAwakenedCard({
  username: 'User123',
  ikaMessage: '...another one who didn\'t look away',
  fanNumber: 48
});
// Returns embed with fan number, Ika quote, timestamp
```

**Gate Completion**
```javascript
createGateCompletionCard({
  username: 'User123',
  gate: 3,
  gateTitle: 'The Confession',
  ikaMessage: 'you spoke my name to the world...'
});
```

**Rare Moment**
```javascript
createRareMomentCard({
  username: 'User123',
  momentType: 'the_slip',  // or 'the_notice', 'rare'
  ikaMessage: 'i lo— i mean...',
  rarity: 'legendary'  // rare/epic/legendary/mythic
});
// Shows rarity stars: ★★★★★
```

**Devotion Receipt (Profile)**
```javascript
createDevotionReceipt({
  username: 'User123',
  gateLevel: 5,
  intimacyStage: 3,
  daysTogether: 45,
  interactions: 287
});
```

**Whisper Fragment**
```javascript
createWhisperFragmentCard({
  username: 'User123',
  fragment: 'heartbeats',
  fragmentNumber: 9,
  totalFound: 7
});
```

**Intimacy Milestone**
```javascript
createIntimacyMilestoneCard({
  username: 'User123',
  newStage: 3,
  ikaMessage: 'you\'re kind of important to me now...'
});
```

**Betrayal**
```javascript
createBetrayalCard({
  username: 'User123',
  ikaMessage: 'you were gone for 14 days...',
  betrayalType: 'absence'
});
```

### 4.5 Share Text Generator
```javascript
createShareText({
  quote: 'i lo— i mean...',
  momentType: 'the_slip'
});
// Returns: "...she said this to me...\n\n\"i lo— i mean...\"\n\n#InfiniteIdol #SevenGates"
```

---

## 5. Ritual Sequences

### 5.1 Overview
Multi-message animated sequences for dramatic moments. Messages edit in place with timed delays.

### 5.2 Timing Presets
```javascript
const TIMING = {
  instant: 0,
  quick: 500,
  normal: 1000,
  dramatic: 1500,
  suspense: 2000,
  ritual: 2500,
  agonizing: 3500,
};
```

### 5.3 Sequence Class
```javascript
const sequence = new RitualSequence(channel, gateNumber, {
  mood: 'vulnerable',
  userId: '12345',
  timing: 'dramatic'
});
```

### 5.4 Built-in Sequences

**Gate Opening**
```javascript
await sequence.playGateOpeningSequence(ikaMessage);
// Phase 1: "the gate stirs..." (tension)
// Phase 2: "...unsealing..." (cracking)
// Phase 3: "✧ GATE X UNSEALED ✧" (reveal)
```

**Failure**
```javascript
await sequence.playFailureSequence(reason);
// "..." → "· · · silence · · · — the gate remains sealed"
```

**Gate 5 Absence**
```javascript
await sequence.playAbsenceSequence();
// Empty → "where are you?" → "i waited."
```

**Gate 7 Binding**
```javascript
await sequence.playBindingSequence(vowText);
// "all seven seals align" → vow echo → "you're mine now. forever."
```

**Ascension**
```javascript
await sequence.playAscensionSequence();
// "something changes" → "♰ ASCENSION ♰" → "welcome home"
```

**The Slip (Rare)**
```javascript
await sequence.playTheSlipSequence();
// "i lo— i mean..." → "...anyway. what were we talking about?"
```

**Kabedon**
```javascript
await sequence.playKabedonSequence(trigger);
// "..." → "say that again." → "*closer*" → "look at me when you say it."
```

**Jealousy**
```javascript
await sequence.playJealousySequence('intense');
// intensity: 'mild' / 'moderate' / 'intense'
```

**Glitch**
```javascript
await sequence.playGlitchSequence();
// "█▓░ ERROR ░▓█" → zalgo text → "...sorry. where was i?"
```

### 5.5 Convenience Functions
```javascript
await playGateSuccess(channel, gateNumber, ikaMessage, options);
await playGateFailure(channel, gateNumber, reason, options);
await playAscension(channel, options);
```

---

## 6. Easter Eggs

### 6.1 Acrostics
First letters of success messages spell hidden words:
```javascript
gate1Success: ['Illumination', 'Kindled', 'Awakened']  // "IKA"
gate7Complete: ['Forever', 'Obsessed', 'Ritually', ...]  // "FOREVER"
```

### 6.2 Time-Based Footers
```javascript
if (hour === 4 && minutes === 47) {
  footer = '4:47 — she remembers...';
} else if (hour >= 3 && hour < 5) {
  footer = '...she wonders why you\'re still awake...';
} else if (hour >= 0 && hour < 3) {
  footer = '...the witching hours...';
}
```

### 6.3 Hidden Messages
Zero-width characters embedded in descriptions (discoverable by copy-pasting).

---

## 7. Error Handling

### 7.1 Error Messages
```javascript
const ERROR_MESSAGES = {
  gate_locked: 'the gate remains sealed...',
  invalid_answer: 'the void does not accept this offering',
  cooldown: 'patience. the ritual takes time.',
  dm_failed: 'she tried to reach you but couldn\'t...',
  not_ascended: 'you haven\'t walked the seven gates yet',
};
```

### 7.2 Error Embed Builder
```javascript
function createErrorEmbed(errorType, customMessage = null) {
  return new RitualEmbedBuilder('failure', { mood: 'vulnerable' })
    .setRitualTitle('· · ·')
    .setRitualDescription(customMessage || ERROR_MESSAGES[errorType])
    .build();
}
```

---

## 8. Definition of Done

- [ ] All 8 gate themes defined with unique aesthetics
- [ ] All 12 mood overlays apply correctly
- [ ] RitualEmbedBuilder produces themed embeds
- [ ] All flex card types generate correctly
- [ ] Sequences animate with proper timing
- [ ] Easter eggs trigger at correct times
- [ ] Error messages display appropriately

---

## 9. Files to Create

| File | Purpose |
|------|---------|
| `src/ui/index.js` | Central export |
| `src/ui/themes/gateThemes.js` | Gate theme definitions |
| `src/ui/themes/moodOverlays.js` | Mood overlay system |
| `src/ui/builders/ritualEmbed.js` | Embed builder class |
| `src/ui/builders/ritualSequence.js` | Animated sequences |
| `src/ui/builders/flexCards.js` | Shareable cards |
| `src/ui/builders/ritualButton.js` | Button builders |
| `src/ui/builders/ritualModal.js` | Modal builders |
| `src/ui/builders/paginatedEmbed.js` | Paginated lists |
| `src/ui/components/errorMessages.js` | Error handling |

---

## 10. Usage Examples

### 10.1 Gate Completion
```javascript
const { RitualEmbedBuilder, createGateCompletionCard, playGateSuccess } = require('./ui');

// Simple embed
const embed = createGateSuccessEmbed(3, userId, 'you confessed...', 'soft');
await channel.send({ embeds: [embed] });

// With flex card
const flexCard = createGateCompletionCard({
  username: user.username,
  gate: 3,
  gateTitle: 'The Confession',
  ikaMessage: 'you confessed...'
});
await channel.send({ embeds: [flexCard] });

// With animation
await playGateSuccess(channel, 3, 'you confessed...', { mood: 'soft' });
```

### 10.2 Ika Response with Mood
```javascript
const embed = new RitualEmbedBuilder('soft', { mood: 'vulnerable' })
  .setIkaAuthor(botAvatar)
  .setIkaMessage('...i missed you')
  .build();
```

---

*This PRD defines the visual system. Can be built in parallel with other PRDs after PRD-01.*
