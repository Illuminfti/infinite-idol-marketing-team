# Tiered Review Framework
## Infinite Idol Marketing Team

**Version**: 1.0
**Date**: 2026-01-09
**Owner**: Agent 00 (Coordinator)
**Authority**: All content must follow appropriate review tier

---

## Purpose

The tiered review framework optimizes content approval velocity while maintaining quality. Not all content requires 200+ lines of validation. This framework defines review depth based on content novelty and risk.

**Problem Solved**: At full campaign scale (100+ pieces), current review depth (220 lines canon + 140 lines cultural = 360 lines per piece) is unsustainable. This framework reduces review overhead by 60% while maintaining quality.

---

## Review Tier Classification

### Tier 1: NOVEL CONTENT (Full 3-Layer Review)
**Definition**: Content introducing new canon, characters, mechanics, or narrative elements

**Review Depth**: Full validation (200-300 lines total)
**Estimated Time**: 2-4 hours
**Approval Rate Target**: 80-90%

**Examples**:
- First appearance of new character in marketing
- New lore drop revealing previously unknown mechanics
- Introducing new seasonal campaign or event
- First use of new content format (e.g., first video script)
- Senpai-related content (always novel given obscuration rules)
- Major plot revelations or story beats
- New character voice being established

**Review Process**:
```
Creation (Agent 02/07)
    ↓
Canon Review (Agent 08) - Full validation
    • All 10 Inviolable Facts checked
    • Cross-reference character profiles
    • Timeline consistency validation
    • Mechanics accuracy verification
    • Canon tier classification
    • 150-250 lines of validation
    ↓
Cultural Review (Agent 09) - Full assessment
    • DS rating calculation (0-4 scale)
    • Platform calibration check
    • Cultural fluency validation (crypto/gacha/otaku)
    • Reference freshness verification
    • Red flag / green flag analysis
    • 100-150 lines of assessment
    ↓
Coordinator Approval (Agent 00)
    • Brand voice compliance
    • Strategic fit
    • Schedule placement
    • Final quality gate
    • 30-50 lines
    ↓
Approved for Publication
```

**SLA**: 4 hours from creation to approval (parallel reviews)

---

### Tier 2: ESTABLISHED PATTERNS (Streamlined Review)
**Definition**: Content following validated templates with established characters/concepts

**Review Depth**: Cultural + Coordinator (100-150 lines total)
**Estimated Time**: 30-60 minutes
**Approval Rate Target**: 95%+

**Examples**:
- Additional Ika personality tweets (voice established, no new canon)
- Routine event announcements (Seven Gates progression, weekly events)
- Cosmetics reveals (non-story items)
- Community engagement responses
- Founder voice tweets (following established tone)
- Lore threads on already-documented mechanics (Devotion system explained again)
- Banner announcements for seasons (established format)

**Review Process**:
```
Creation (Agent 02/07)
    ↓
SKIP Canon Review (Assumes template compliance)
    ↓
Cultural Review (Agent 09) - Streamlined
    • DS rating (quick check)
    • Platform appropriateness
    • Voice consistency spot-check
    • 50-80 lines
    ↓
Coordinator Approval (Agent 00)
    • Template compliance check
    • Schedule placement
    • 20-30 lines
    ↓
Approved for Publication
```

**Conditions for Tier 2 Eligibility**:
1. Uses established character voice (no new characterization)
2. References only previously published canon (no new reveals)
3. Follows validated content template
4. No new story beats or mechanics
5. Similar content has been approved before

**SLA**: 1 hour from creation to approval (parallel reviews)

---

### Tier 3: REPEATABLE CONTENT (Spot-Check Only)
**Definition**: Highly templated content with minimal variation

**Review Depth**: Coordinator spot-check (20-40 lines total)
**Estimated Time**: 10-15 minutes
**Approval Rate Target**: 98%+

**Examples**:
- Daily event reminders (same format, different date)
- Community milestone announcements ("We hit 1,000 Discord members!")
- Content reposts/reshares (no new content)
- Poll or question tweets (no canon implications)
- Engagement bait (quote prompts, "What's your favorite...?")
- Cosmetic item reveals (non-story items, established format)
- Weekly schedule announcements

**Review Process**:
```
Creation (Agent 02/07)
    ↓
SKIP Canon Review
    ↓
SKIP Cultural Review (Pre-approved format)
    ↓
Coordinator Spot-Check (Agent 00)
    • Template adherence
    • No accidental canon additions
    • Timing/context appropriateness
    • 10-20 lines
    ↓
Approved for Publication
```

**Conditions for Tier 3 Eligibility**:
1. Uses pre-approved template with minimal customization
2. Zero new canon or character voice
3. Purely informational or engagement-focused
4. Similar content has 100% approval history
5. No brand risk

**SLA**: 15 minutes from creation to approval

---

## Classification Decision Tree

```
START: New content created
    ↓
Does this content introduce NEW canon?
(new character details, new mechanics, new story beats)
    ↓ YES → TIER 1 (Novel)
    ↓ NO
    ↓
Does this content use established character voice with new phrasing/situations?
    ↓ YES → TIER 2 (Established)
    ↓ NO
    ↓
Is this content highly templated with minimal variation?
    ↓ YES → TIER 3 (Repeatable)
    ↓ NO → Default to TIER 2 (Established)
```

**When in Doubt**: Default to TIER 2. Better to over-review than under-review.

---

## Tier Assignment Responsibility

**Primary**: Creating agent assigns tier when submitting for review
**Validation**: Agent 00 can upgrade tier if content is more novel than agent realized
**Override**: Human can downgrade/upgrade tier during calibration period

### Agent Guidelines

**Agent 02 (Content Strategist)**:
- First character tweet → Tier 1
- Subsequent character tweets with same voice/tone → Tier 2
- Engagement questions → Tier 3

**Agent 07 (Light Novel Writer)**:
- New narrative content → Tier 1
- Character voice in established scenarios → Tier 2
- Narrative snippets from published canon → Tier 3

**Note**: Community events, gacha content, and analytics require human execution.

---

## Parallel Review Implementation

For **Tier 1** and **Tier 2** content, Agent 08 (Canon) and Agent 09 (Cultural) reviews run **simultaneously** instead of sequentially.

### How It Works

**Sequential (Old Way)**:
```
Creation → Canon Review (2 hours) → Cultural Review (2 hours) → Coordinator (30 min) = 4.5 hours
```

**Parallel (New Way)**:
```
Creation → [Canon Review (2 hours) + Cultural Review (2 hours) in parallel] → Coordinator (30 min) = 2.5 hours
```

**Time Saved**: 40-50% reduction in review time

### Implementation

1. **Agent 02/07** submits content to review queue
2. **Task Queue System** creates TWO simultaneous tasks:
   - Task A: Canon Review (Agent 08)
   - Task B: Cultural Review (Agent 09)
3. Both agents work independently
4. Both complete their reviews
5. **Agent 00** receives BOTH reviews at once, does final approval

### Conflict Resolution

If Agent 08 and Agent 09 disagree:
- **Canon issues**: Agent 08 authority (send back to creator)
- **Cultural issues**: Agent 09 authority (send back to creator)
- **Both flag same content differently**: Agent 00 reviews and decides

---

## Batch Review for Similar Content

For multiple pieces of similar content (e.g., 10 Ika personality tweets), reviews can be batched:

### Batch Review Process

**Example: 10 Ika Personality Tweets**

**Instead of**: 10 individual reviews (10 x 2 hours = 20 hours)

**Do this**: Batch review (1 x 3 hours = 3 hours)

**Process**:
1. Agent 02 creates all 10 tweets in single batch file
2. Agent 08 reviews all 10 simultaneously:
   - Common canon elements checked once
   - Individual tweets spot-checked for consistency
   - Flag any outliers for individual review
3. Agent 09 reviews all 10 simultaneously:
   - Common DS calibration done once
   - Individual tweets checked for voice drift
   - Flag any outliers for individual review
4. Agent 00 approves batch or flags specific pieces

**Savings**: 85% time reduction for batched similar content

**Eligible Content for Batching**:
- Character personality tweets (same character, similar tone)
- Daily event posts (same format, different dates)
- Cosmetic reveals (same category)
- Lore drop threads (same topic, different angles)

**Ineligible Content for Batching**:
- Different content types mixed together
- Different characters
- Novel concepts (each needs full attention)

---

## Quality Assurance

### Spot-Audit System

To ensure tiered review maintains quality:

**Monthly Audit**: Human samples 10% of each tier's content
- **Tier 1**: Sample 3 pieces - Validate full review quality
- **Tier 2**: Sample 5 pieces - Check for missed canon issues
- **Tier 3**: Sample 5 pieces - Ensure no accidental canon additions

**Audit Findings**:
- If >10% of sampled content has issues → Tighten that tier's requirements
- If <2% of sampled content has issues → Current tier working well
- Document findings in `/logs/quality-audits.md`

### Review Escalation

If Tier 2 or Tier 3 content is flagged during creation:
- **Agent 08 or 09 can escalate** to Tier 1 if they spot unexpected complexity
- Example: "This tweet references a character detail I don't recognize → Escalating to Tier 1"
- No penalty for escalation - better safe than canon-broken

---

## Performance Metrics

### Target Metrics by Tier

| Metric | Tier 1 | Tier 2 | Tier 3 |
|--------|--------|--------|--------|
| **Approval Rate** | 85-90% | 95%+ | 98%+ |
| **Review Time** | 2-4 hours | 30-60 min | 10-15 min |
| **Revision Rate** | 10-15% | 5% | 2% |
| **Canon Violations** | 0% | 0% | 0% |
| **Cultural Issues** | <5% | <2% | <1% |

### Tracking (Manual)

**Weekly Report** (Human tracks):
- Content volume per tier
- Average review times per tier
- Approval rates per tier
- Issues caught per tier
- Tier classification accuracy

**Monthly Review**:
- Agent 00 reviews metrics with Human
- Adjust tier criteria if needed
- Update agent guidelines

---

## Tier Calibration Examples

### Example 1: Ika Introduction Tweet
**Content**: "47 fans. That's all I have. But every single one of you keeps me existing. Don't you dare look away~"

**Classification**: **Tier 1 (Novel)**
**Rationale**: First public Ika voice content, establishes character tone, introduces 47 fans concept
**Review Depth**: Full (canon + cultural + coordinator)
**Outcome**: Approved, becomes template for future Ika voice

---

### Example 2: Ika Personality Tweet #5
**Content**: "Another Chase tomorrow. Another chance to close the gap. Senpai, I'm coming for you~"

**Classification**: **Tier 2 (Established)**
**Rationale**: Uses established Ika voice (tilde, shameless tone), references known concepts (Chase, Senpai), no new canon
**Review Depth**: Cultural + Coordinator
**Outcome**: Quick approval, follows template

---

### Example 3: Discord Event Reminder
**Content**: "Weekly Chase Event starts in 2 hours! Get ready, idols. #InfiniteIdol"

**Classification**: **Tier 3 (Repeatable)**
**Rationale**: Pure informational, no character voice, no new canon, templated format
**Review Depth**: Coordinator spot-check
**Outcome**: Instant approval

---

### Example 4: Senpai Teaser
**Content**: "I caught a glimpse. Just a shadow turning the corner. But I know it was Senpai. I KNOW. Tomorrow, I'll be faster."

**Classification**: **Tier 1 (Novel)**
**Rationale**: Senpai content ALWAYS Tier 1 (Inviolable Fact #5 - never shown), new narrative moment
**Review Depth**: Full (especially canon review for obscuration compliance)
**Outcome**: Careful review, approved with agent notes on maintaining mystery

---

## Tier Override Situations

### When to Upgrade Tier

**Tier 3 → Tier 2**:
- Content has more character voice than expected
- Includes community interaction that could set precedent
- Context makes it more significant than template suggests

**Tier 2 → Tier 1**:
- Hidden canon implication discovered during creation
- Character voice diverges from established pattern
- Cultural sensitivity concern identified

### When to Downgrade Tier (Rare)

**Tier 1 → Tier 2**:
- "Novel" canon is actually already well-established
- Agent misclassified routine content

**Tier 2 → Tier 3**:
- Content is more templated than initially assessed

**Authority**: Agent 00 or Human can override tier classification

---

## Integration with Existing Workflows

### Task Queue

Each content task includes tier classification:

```markdown
### CONTENT-005
**Type**: Tweet (Ika Voice)
**Tier**: 2 (Established Pattern)
**Priority**: P2
**Status**: IN_REVIEW
**Agent**: Agent 02 (Creator)
**Reviewers**: Agent 09 (Cultural), Agent 00 (Coordinator)
**Canon Review**: SKIPPED (Tier 2)
**Deadline**: 2026-01-10 12:00 JST
```

### Calendar Integration

Content calendar shows tier and expected review time:

```markdown
| Date | Content | Tier | Review Time | Status |
|------|---------|------|-------------|--------|
| Jan 13 | Ika Tweet 001 | 1 | 4 hours | ✅ Approved |
| Jan 14 | Event Reminder | 3 | 15 min | ⏳ Pending |
| Jan 15 | Devotion Thread | 1 | 3 hours | 🔄 In Review |
```

### Agent Activity Logs

Log entries include tier:

```markdown
**Agent 08 (Lore Guardian) - 2026-01-09 14:00 JST**
**Activity Type**: Canon Review
**Content**: CONTENT-002 (Ika Personality Batch)
**Tier**: 2 (Established Pattern) - Skipped per tiered review framework
**Result**: N/A (Tier 2 bypasses canon review)
```

---

## Training & Onboarding

### New Agent Onboarding

When agents start creating content:
1. First 5 pieces ALL reviewed as Tier 1 (training mode)
2. Agent 00 provides feedback on tier classification accuracy
3. After 5 pieces, agent authorized to classify own content
4. Agent 00 spot-checks 20% of classifications for first month

### Calibration Sessions

**Quarterly**: Agent 00 + Agent 08 + Agent 09 review tier system
- Are Tier 2/3 pieces maintaining quality?
- Are Tier 1 pieces genuinely novel?
- Should tier criteria adjust?
- Update framework based on learnings

---

## Version History

| Version | Date | Changes | Approved By |
|---------|------|---------|-------------|
| 1.0 | 2026-01-09 | Initial framework created | System Implementation |

---

*"Quality at speed. Every tier serves the Chase."*
