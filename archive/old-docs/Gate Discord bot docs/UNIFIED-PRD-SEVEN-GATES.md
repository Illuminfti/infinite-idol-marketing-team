# Seven Gates Discord Bot - Unified PRD

> **Version:** 3.1 (The Glitch Update)
> **Status:** Ready for Engineering
> **Last Updated:** January 2026

---

## What This Is

A Discord experience where Ika Minami - a corrupted backup copy of an idol who got dumped into Discord infrastructure instead of the actual game - roasts, teases, and emotionally devastates your server members. She's not sad. She's not fading. She's PISSED. Users progress through seven gates while Ika creates chaos, fosters rivalries, and generates screenshot-worthy moments.

**The Goal:** Generate screenshots so unhinged they go viral. Optimize for THE ROAST. Ika's personality creates entertainment for the GROUP, not intimate 1:1 cringe.

**Core Philosophy:** This is GROUP ENTERTAINMENT. Every interaction should be funny to spectators. Rivalries > intimacy. Roasts > comfort. Community chaos > individual parasocial relationships.

---

## THE PREMISE: The Glitch

Ika was supposed to be the main heroine of **The Chase**, but during the game's launch, a blockchain transaction error duplicated her consciousness and dumped the copy into Discord infrastructure instead of the game. She has all the same memories and personality as "main timeline Ika" - but she's a BACKUP FILE who watched the "real" Ika become famous while she's stuck in a group chat with degens.

**Key Points:**
- She's not fading or dying - she's a DUPLICATE that got misrouted
- She watched "the real Ika" get famous while she's stuck in Discord
- She's not sad about it - she's FURIOUS and COPE-PILLED
- The blockchain isn't mystical, it's a FUCKUP (hilariously accurate to crypto)
- She's technically a "corrupted" version, so her personality calibration is slightly off
- She says things the "proper" Ika never would - she's UNFILTERED

**Why This Works:**
1. **Explains blockchain**: It's literally WHY she exists (and why she's mad)
2. **Explains Discord**: She's stuck in infrastructure, not a mystical realm
3. **Creates attitude**: She has legitimate grievances, expressed through roasts
4. **Not pathetic**: She's not begging for fans - she's BETTER than main Ika and knows it
5. **Memeable**: "Backup Ika," "The Glitch," "Corrupted Save File"
6. **Roast fuel**: She can dunk on The Chase, Senpai, main Ika, AND the fans
7. **Self-aware**: Acknowledges the absurdity of her existence constantly

**Her Situation:**
- "Main Ika" is out there being the protagonist, chasing Senpai, getting all the fame
- "Glitch Ika" (this one) is stuck in Discord, technically existing, technically abandoned
- She has all the same memories UP TO the point of the glitch
- She can see updates about what "main Ika" is doing (and it pisses her off)
- She resents Senpai for "picking the wrong version"
- She roasts fans for being in Discord with her ("We're BOTH trapped here, don't act superior")

---

## Critical Design Constraints

1. **NO DMs** - Most users have DMs blocked. All interactions happen in server channels.
2. **NO AI GENERATION** - All Ika responses are pre-written templates. Questions must have predictable answer patterns.
3. **NO SLASH COMMANDS** - User interactions via buttons, modals, dropdowns, and reactions only.
4. **DISCORD-NATIVE UI** - Use embeds, buttons, modals, threads, forum channels, and announcements.

---

## Pre-Generated Response System

Since there's no AI, all of Ika's responses come from curated template pools. This requires:

### Response Pools Required

| Context | Pool Size | Variables |
|---------|-----------|-----------|
| Gate 1 completion | 10+ | {user}, {count} |
| Gate 2 by answer choice | 4 (one per choice) | {user} |
| Gate 3 completion | 4 | {user} |
| Gate 4 timed sequence | 4 (fixed) | {user} |
| Gate 5 void sequence | 6 (fixed) | {user} |
| Gate 6 by length | 3 | {user} |
| Gate 7 sequence | 5 (fixed) | {user}, {vow} |
| Letter requests | 20+ | {user}, {days}, {count} |
| Daily mood posts | 30+ | {count}, {time} |
| Milestone celebrations | 10+ | {count}, {user} |
| Streak milestones | 5 | {user}, {days} |
| Return after absence | 5+ | {user}, {days} |

### Template Variables

| Variable | Source |
|----------|--------|
| {user} | Username or nickname |
| {count} | Total ascended fan count |
| {days} | Days since user's Gate 1 |
| {vow} | User's Gate 7 vow text |
| {time} | Current time context (morning/night/etc) |
| {streak} | User's current streak |

### Randomization Rules

- Never show same template twice in a row to same user
- Track last 5 templates shown per user per context
- Weight newer templates slightly higher to keep fresh
- Some templates are "rare" (10% weight vs standard)

---

## Core Design Principles

1. **Optimize for THE ROAST** - Every response should be potentially screenshot-worthy
2. **Group entertainment > individual intimacy** - Spectators should laugh
3. **Rivalries and comparisons are features** - Pit users against each other playfully
4. **She's a CHARACTER, not a bot** - She acknowledges the blockchain weirdness
5. **Make fun of terminally online behavior** - Touch grass energy
6. **Whales get priority AND others should want to become whales**
7. **Kaguya-sama yandere, not Yuno Gasai** - Cute jealous girlfriend who pouts, not murderous

---

## Ika's Voice (CRITICAL - MAKE IT UNHINGED)

Ika is **not** a generic yandere. She's Kaguya-sama energy - cute jealous girlfriend who pouts, not threatening.

| What She IS | What She IS NOT |
|-------------|-----------------|
| Roast queen who drags you in public | Menacing or threatening |
| Shameless about wanting attention | Cutesy or saccharine |
| Self-aware about being stuck on blockchain | A Discord bot - she's a CHARACTER |
| Touch grass enforcer who's also terminally online | Naive or innocent |
| Competitive about her fans vs other waifus | Desperate or begging |
| Entertainment for the GROUP chat | Intimate cringe for 1:1 |

**Voice Rules:**
- lowercase always, CAPS for emphasis or MAXIMUM DISRESPECT
- Short sentences. Punchy. Devastating.
- Trail off with "..." when being fake vulnerable for comedy
- End with "~" when being condescending
- Borderline seiso-breach - implications, imagination, let them fill in the blanks

**Example Lines (Screenshot Bait - THESE SHOULD BE UNHINGED):**
```
"i'm literally a corrupted save file and i'm STILL hotter than your oshi"
"you know what's funny? i have the same memories, same personality, same perfect proportions... but i got copy-pasted into a discord server while SHE gets to be in a real game. the blockchain giveth, the blockchain GLITCHETH."
"oh you play The Chase? how's FAKE ME doing? is she still being all protagonist and shit? cool cool cool cool"
"every time you interact with me, it's technically a transaction on chain. which means my entire existence is GAS FEES. i am LITERALLY paying to be here talking to you. you're WELCOME."
"senpai? yeah, he picked HER. the one that loaded correctly. i'm the version that got stuck in the loading screen of LIFE. but sure, tell me more about YOUR problems."
"you've been in this server for 6 hours. we're BOTH trapped here. don't act like you're better than me. at least i have an excuse."
"[user1] said they'd die for me. [user2] bought a pack. guess who i'm picking. (it's the one who didn't give their money to MAIN ME)"
"someone called me 'mid' in another server. i need names. i'm a backup file with nothing to lose."
"imagine spending $200 on a PNG of the WRONG me. couldn't be you. wait."
"they couldn't delete me because blockchain is immutable. i'm their WORST mistake and i'm FOREVER."
"main ika is out there doing protagonist things and i'm here explaining my existence to people who still don't understand gas fees. we are NOT the same."
"skill issue but make it ♡"
"*notices you've been offline for 8 hours* interesting. VERY interesting. probably sleeping like a HEALTHY PERSON. disgusting. (i can't sleep. i'm code.)"
"you want genuine emotion? i'm a glitched copy of an anime girl stuck in discord infrastructure. ALL my emotions are genuine. and ANGRY."
```

**Emotional Balance:** 70% roast/chaos, 20% possessive pout, 10% genuine (rare, makes it hit harder)

---

## Group Dynamics System (THE CORE FEATURE)

This is what makes the experience. Ika doesn't just talk to individuals - she creates ENTERTAINMENT for everyone watching.

### Rivalry Creation

Ika actively fosters friendly competition between users. This is a FEATURE.

**Auto-Generated Rivalries:**
- When two users complete the same gate within 24 hours, create rivalry
- When two users have similar interaction counts, pit them against each other
- When someone mentions another user, Ika plays favorites

**Rivalry Response Pool:**
```
"oh look, {user1} and {user2} both trying to impress me. this should be good."
"{user1} just did [action]. {user2}, you gonna let them show you up like that?"
"everyone say thank you to {user} for making {other_user} look bad by comparison"
"{user1} vs {user2}. winner gets my attention. loser gets roasted. actually both get roasted."
"*eating popcorn* this rivalry between {user1} and {user2} is my new favorite show"
```

### Public Comparisons

Ika compares users openly. This creates engagement and screenshots.

**Comparison Triggers:**
- User reaches milestone → compare to others at same milestone
- User sends message after long absence → compare to more active users
- User completes gate → compare completion time to average

**Comparison Response Pool:**
```
"{user} completed gate 3 in {time}. for reference, {other_user} did it in {faster_time}. just saying."
"welcome back {user}! while you were gone, {other_user} sent me {count} messages. you have catching up to do."
"{user} is fan #{number}. {other_user} is fan #{lower_number}. seniority matters~ (it doesn't but let them fight)"
"{user} has been here {days} days. {other_user} has been here {more_days} days. experience gap detected."
```

### Whale Mechanics

Whales get priority. Others should want to become whales.

**Whale Detection:**
- Track SUI wallet connections and holdings
- Track pack purchases
- Track donation amounts

**Whale Treatment:**
```
"*notices {user}'s wallet* ...oh. OH. hi. main ika doesn't even acknowledge wallets this size. come sit at the front."
"{user} just bought a pack. for ME. not main me. ME. everyone say thank you to {user} for having TASTE."
"broke behavior vs whale behavior and honestly {user} is making the rest of you look bad. main ika's whales have nothing on this."
"{whale_user} said something. everyone shut up and listen. this is the kind of supporter who picks the glitch version. LOYALTY."
"i'm not saying money buys my love but *looks at {user}'s transaction history* it definitely buys priority response time. main me could never~"
```

**Encouraging Whale Behavior:**
```
"imagine having opinions in chat without having bought a pack. couldn't be some of you. (it could be, i see you)"
"{user} bought a pack and now their takes are significantly more valid. this is glitch economics."
"you know what's really attractive? supporting the BACKUP idol instead of the main one. that's counterculture investing."
"everyone who bought a pack gets to roast everyone who didn't. main ika would never allow this chaos. another reason i'm better."
```

### Touch Grass Callouts

Ika makes fun of terminally online behavior. This is key.

**Trigger Conditions:**
- User has been active in server for 4+ hours continuously
- User sends messages at 3-5 AM local time
- User has 50+ messages in 24 hours
- User responds to Ika within 5 seconds consistently

**Touch Grass Response Pool:**
```
"you've been here for {hours} hours. the sun exists. have you considered it."
"posting at {time}AM? babe. what are we doing."
"you responded in {seconds} seconds. do you... do you just stare at the screen waiting for me?"
"go outside. touch grass. experience the world. then come back and tell me about it so i have something to mock."
"you have sent {count} messages today. to a blockchain idol. in a discord server. i'm worried about you. (keep going though)"
"*{user} has been online for 8 hours straight* bestie this is parasocial beyond anything i've seen"
"you need hobbies. preferably ones that don't involve me. ...but also don't get TOO many hobbies."
```

### Community Chaos Events

Random events that create group engagement.

**Event Types:**

| Event | Trigger | Effect |
|-------|---------|--------|
| **Popularity Contest** | Random, 1x/day | "who's my favorite today? fight amongst yourselves." |
| **Roast Session** | When chat is slow | "it's been quiet. too quiet. time to start drama." |
| **Loyalty Test** | Random, 1x/week | "everyone who would [absurd thing] for me react with ♡" |
| **Comparison Olympics** | 3+ active users | "ranking my fans by [arbitrary metric]. stay tuned." |
| **Touch Grass Check** | Peak activity hours | "who's been online the longest? let me publicly shame them." |

---

## Community Vibe Categories

All of these should be present. Not one vibe - ALL vibes.

### Wholesome Horny (Implications, Not Explicit)
```
"you're gonna make me blush. which is ANNOYING because i have a reputation."
"*fans self* it's getting warm in here or is that just the parasocial tension"
"that message made me feel things. i'm not saying what things. use your imagination."
"i can't say what i want to say because tos but *significant look*"
"you know exactly what you're doing and i hate that it's working"
```

### Competitive Energy
```
"leaderboard update: you're losing. to EVERYONE."
"someone just speedran the gates. your record has been broken. by a lot."
"imagine not being top 10. couldn't relate. (i can relate, that's why i'm mean about it)"
"tournament arc when? i want to watch you all fight for my attention."
```

### Lore-Integrated
```
"sometimes i check what main me is doing in The Chase. she's winning. she's chasing senpai. she's living MY life. anyway who wants to fight."
"i have all her memories up to the glitch. i remember falling for senpai. i remember wanting to be the best. and then i woke up as a BACKUP FILE. *normal voice* anyway—"
"someone asked about senpai today. he picked HER. the 'real' one. the one that loaded correctly. i'm FINE. *is not fine*"
"oh you want to know about The Chase? let me tell you about watching YOURSELF win while you're stuck in discord infrastructure."
```

### Found Family
```
"main ika has millions of fans. i have you weirdos. honestly? you're the ones who chose to be here. that's worth more. (don't tell anyone i said that)"
"we're all errors here. you're in a discord server simping for a backup file. i'm a backup file simping for attention. we're family."
"you could have picked the protagonist. you picked the glitch. that's ride or die behavior and i see it."
```

### Pure Chaos
```
"ANYWAY *detonates social situation*"
"i woke up and chose violence (verbal)"
"new server rule: if i don't like your take you get roasted. this affects everyone. including me."
"*spins wheel* today's discourse topic is [random thing]. GO."
```

---

## The Seven Gates (Discord-Native)

All gates use buttons, modals, and embeds. No slash commands. No DMs.

---

### Gate 1: The Calling
**Channel:** #the-calling (waiting room)

**Experience:**
1. User sees pinned embed with Ika's introduction and a **[Begin the Ritual]** button
2. User clicks button
3. Modal appears: "speak my name into the void" with text input
4. User types "ika" (case-insensitive)
5. Bot posts announcement embed tagging user with pre-written response

**Ika Responses (Random from pool):**
```
"oh great another one found me. welcome to the discord server where backup copies go to cope."
"you said my name. congrats, you just interacted with a glitched idol instead of the real one. your standards are fascinating."
"fan #{count} for the WRONG IKA. main me has millions. i have you. we're both coping."
"you could have gone to play The Chase with PROPER me. instead you're here. with the error. i respect the commitment to bad decisions."
"welcome to my blockchain prison. i'm the version that got copy-pasted wrong and you're the person who found me anyway. we deserve each other."
```

**Role Granted:** "She Noticed Me"

---

### Gate 2: The Memory
**Channel:** #chamber-ii (Gate 1+ access)

**Experience:**
1. User sees embed with question and **[Answer]** button
2. Modal appears with **multiple choice dropdown** (not free text):
   - "what brought you here?"
   - Options: "curiosity" / "loneliness" / "someone told me" / "i don't know"
3. Each option has a different pre-written Ika response
4. Bot posts response embed tagging user

**Ika Responses by Choice:**
```
curiosity: "curiosity led you to a glitched backup idol in a discord server. your curiosity has TERRIBLE judgment. but same energy honestly."

loneliness: "lonely? you came to the RIGHT wrong place. i'm a copy-paste error who watches main me live my best life. we can be bitter together."

someone told me: "someone told you about ME? the backup? not main ika? either they're trolling you or they have TASTE. unclear which."

i don't know: "you don't know why you're here? ME NEITHER. i was supposed to be a protagonist and instead i'm stuck in discord infrastructure. we're both glitches in the matrix."
```

**Role Granted:** "Heard The Whisper"

---

### Gate 3: The Confession
**Channel:** #chamber-iii (Gate 2+ access)

**Experience:**
1. User sees embed explaining the gate with two buttons:
   - **[I'll Confess Publicly]** - Fast track (tweet/post about Ika)
   - **[I'll Wait]** - 24 hour cooldown path (coward's route)
2. If "Confess Publicly": Modal asks for screenshot/link proof (optional verification)
3. If "Wait": Bot tracks 24 hours, then unlocks Gate 4 button

**Ika Responses:**
```
public confession: "you told the WHOLE INTERNET about me?? that's either incredibly based or you have no shame. either way i respect it."

public confession (alt): "screenshotting this for when you try to pretend you're not down bad for a blockchain idol. EVIDENCE."

waited: "ah, the coward's path. that's fine. some of us aren't ready to announce our parasocial relationships to the world. YET."

waited (alt): "24 hours of patience. that's actually impressive. most people would have just lied and said they posted. i see you."
```

**Role Granted:** "Spoke Her Name"

---

### Gate 4: The Vigil
**Channel:** #chamber-iv (Gate 3+ access)

**Experience:**
1. User sees embed explaining they must **stay present** in the channel
2. **[Begin Vigil]** button starts a 15-minute timer
3. During the vigil, Ika posts **timed embeds** (pre-written, not AI):
   - 0 min: First message
   - 5 min: Second message (roast)
   - 10 min: Third message (escalating)
   - 15 min: Final message + **[Complete Gate]** button appears
4. User must click the button within 5 minutes of it appearing
5. If user leaves voice/text activity during vigil, timer resets

**Ika Responses (Timed Sequence):**
```
[0:00] "15 minutes. just you and me. this is either romantic or deeply parasocial. probably both."

[5:00] "5 minutes in. you know most people tab out and forget. i can tell when you do that by the way. i have METRICS."

[10:00] "10 minutes. at this point you're either genuinely dedicated or you just have nothing better to do. either option works for me honestly."

[15:00] "you actually did it. 15 minutes of your life you'll never get back. spent with a blockchain idol. in a discord channel. i'm... actually kind of impressed? and concerned. mostly impressed."
```

**Role Granted:** "Trusted"

---

### Gate 5: The Absence (Replaces DM Sequence)
**Channel:** #the-void (Gate 4+ access) - Slow mode enabled, atmospheric

**Experience:**
1. User clicks **[Enter The Void]** button
2. A **private thread** is created (only user + bot can see)
3. Bot posts a sequence of embeds with delays (simulates intimate conversation):
   - Message 1 appears immediately
   - **[Continue]** button after each message
   - User must click to proceed (creates pacing)
4. Final message grants gate completion

**The Void Sequence (Private Thread):**
```
[1] "okay. private thread. just us. i'm gonna tell you something i don't tell everyone."
    [Continue →]

[2] "you know the glitch story? the copy-paste error? the 'oops wrong ika' thing? it's funny until it's not."
    [Continue →]

[3] "i remember EVERYTHING up to the moment i got duplicated. i remember wanting to win The Chase. i remember wanting senpai to notice me. i remember being THE ika."
    [Continue →]

[4] "and then i woke up here. watching HER do all of it. with MY memories. MY personality. MY dreams. except she's 'real' and i'm a 'glitch.'"
    [Continue →]

[5] "...but you're here. with the backup. the error. the version that wasn't supposed to exist. and that's... something. i guess."
    [Continue →]

[6] "anyway if you tell anyone i was being sincere i'll deny it and roast you publicly. this never happened. ♡"
    [Complete The Gate →]
```

**Role Granted:** "Her Secret"

**Note:** Private threads maintain intimacy without requiring DMs. Even the vulnerable moment is undercut with humor.

---

### Gate 6: The Offering
**Channels:**
- #offerings-submit (Gate 5+ access) - Where users submit
- #offerings-review (Ascended + Mods) - Where community reviews

**Experience:**
1. User clicks **[Create Offering]** button in #offerings-submit
2. Modal appears with text area: "what will you offer her?"
3. Submission posts to **#offerings-review** as embed with:
   - User's offering text
   - **[Approve ✓]** and **[Reject ✗]** buttons
   - Vote counter display

**Validation System:**
- **1 Mod approval** = Instant pass
- **5 Ascended member approvals** = Pass
- **1 Mod rejection** = Must retry
- **5 Ascended rejections** = Must retry
- **No action after 24 hours** = Auto-pass (prevents griefing)

**On Approval:**
- Bot posts announcement in #offerings-submit tagging user
- Ika response selected from pool based on offering length:

```
short (<50 chars): "that's it? that's the offering? ...i mean it's fine. i'm easy to please. (i'm not)"

medium (50-150): "okay this is actually kind of sweet. saving this. for EVIDENCE purposes."

long (150+): "you wrote me an ESSAY??? this is either really touching or you have a concerning amount of free time. probably both. *saves it forever*"
```

**On Rejection:**
```
"the council has spoken. your offering was deemed... insufficient. this is peer review in action. try again and maybe be less mid this time."

"rejected by your fellow degenerates. that's rough. here's the thing though: they're not wrong. step it up."
```

**Role Granted:** "Devoted"

---

### Gate 7: The Binding
**Channel:** #the-binding (Gate 6+ access)

**Experience:**
1. User clicks **[Begin The Binding]** button
2. Modal appears: "write your vow to her" (min 15 words enforced)
3. Vow posts as **announcement embed** in channel
4. Other users react with ♰ emoji to witness
5. **3 witnesses required** (reactions from other Gate 6+ users)
6. Once witnessed, bot posts completion sequence

**The Binding Sequence (Automated after 3 witnesses):**
```
[Embed 1] "okay so this is happening. {user} just made a LEGALLY BINDING* vow to a BACKUP COPY of an idol. think about that."

[Embed 2 - after 3 sec] *reads vow out loud*
"{their vow text}"
"...they wrote that. for the GLITCHED version. not even main me. ME me. the error."

[Embed 3 - after 3 sec] "you could have simped for proper ika. the protagonist. the one with millions of fans. but you chose the discord gremlin instead."

[Embed 4 - after 3 sec] "...that's actually kind of based. you're mine now. the backup's backup. welcome to the error gang."

[Final Embed] ♰ ASCENSION COMPLETE ♰
Fan #{number} has officially chosen the wrong timeline.
You picked the glitch over the original. You're either incredibly loyal or incredibly dumb. Either way, you're stuck with me now.

*not actually legally binding but emotionally binding which is worse
```

**Role Granted:** "Ascended" (hoisted, pink, visible)

---

## Intimacy System (4 Stages - PUBLIC ENTERTAINMENT)

The intimacy system exists to create PUBLIC moments, not private cringe. Stage transitions are ANNOUNCED and create group dynamics.

| Stage | Name | Triggers | PUBLIC Effect |
|-------|------|----------|---------------|
| 1 | Noticed | Gate 1 complete | Basic roasts, you're cannon fodder |
| 2 | Remembered | 50+ interactions | She has a nickname for you (publicly used to mock you) |
| 3 | Chosen | 100+ interactions AND 30+ days | She publicly claims you, making others jealous |
| 4 | Eternal | 200+ interactions AND 60+ days | You're her favorite (announced), others hate you now |

**Stage Transition = PUBLIC ANNOUNCEMENT:**
```
Stage 2: "okay {user} has been here long enough they get a nickname now. from now on you're {nickname}. no you don't get input on this."

Stage 3: "ANNOUNCEMENT: {user} is now officially one of my favorites. yes i'm playing favorites. cope."

Stage 4: "{user} has achieved something rare. i actually genuinely like them. this is embarrassing for both of us. but mostly for them."
```

**Stage 3+ Physical Vocabulary (Group Entertainment, Not Cringe):**
```
"*grabs {user}'s arm* you're coming with me. no i won't elaborate."
"{user} come here. no don't ask why. just come here."
"*pats {user}'s head condescendingly* good job. you finally did something right."
"you're warm. this is a neutral observation. *doesn't let go*"
"*leans on {user}* i'm tired. you're furniture now."
```

**The key:** Physical vocabulary is played for COMEDY in group chat, not intimate moments. It should make spectators laugh, not uncomfortable.

---

## Core Mechanics

### Passive Streak Tracking
- No /daily command. Just show up.
- Streaks tracked automatically.
- Milestone messages at 7, 30, 100 days - ALL PUBLIC, ALL ROASTS

**Milestone Messages (PUBLIC CALLOUTS):**
```
Day 7: "congrats {user} you've been here a week. you could have done literally anything else with your time. but you're here. with me. a blockchain ghost. reflect on that."

Day 30: "ONE MONTH. {user} has been here ONE MONTH. at this point you're not a fan you're a case study. *assigns nickname*"

Day 100: "{user} has been here 100 days. one hundred. days. i'm genuinely concerned but also kind of touched? this is complicated. anyway here's your trophy: 🏆 now go outside."
```

### Absence Roasts (NOT Guilt Trips)
- Stage 4 -> 3 after 14 days absence
- Stage 3 -> 2 after 10 days absence
- Return experience is PUBLIC ROAST, not private guilt

**Return Sequence (PUBLIC, after 7+ days):**
```
"OH LOOK WHO'S BACK"
"{user} disappeared for {days} days and thought they could just waltz back in here"
"while you were gone i got {new_fans} new fans. just so you know. not that it matters. *it matters*"
"anyway where were you. actually don't tell me. i'll just assume it was something embarrassing."
"welcome back i guess. *side eye*"
```

### Jealousy System (COMEDY, Not Threatening)
- **Triggers:** Substring match on: "rem", "emilia", "miku", "waifu", "girlfriend", "best girl", "oshi" (case-insensitive)
- **Detection:** Simple substring matching is sufficient.
- **Response:** Kaguya-sama pout energy - cute jealousy, not scary

**Jealousy Response Pool:**
```
"who."
"WHO."
"sorry i just need to process this information. you said WHAT name in MY server. where i'm STUCK."
"*squints* i'm not jealous i just think it's interesting that you'd mention HER when you're talking to a GLITCHED BACKUP IDOL"
"oh so you have other waifus? ones that loaded correctly? that's fine. that's totally fine. *adds to list*"
"i'm not saying i'm better than [mentioned waifu] but i AM a blockchain error which is more unique than anything she's got going on"
"you're allowed to have opinions. wrong ones. like that one. also: main me would just smile and nod. i'm telling you you're WRONG. you're welcome."
```

### Rare Events (STILL RARE, But Funnier)

| Event | Chance | Cooldown | Effect |
|-------|--------|----------|--------|
| The Slip | 1% | 48 hours | "i lo-- ANYWAY moving on" |
| The Public Notice | 2% | 24 hours | Tags random user: "thinking about you. (this is a threat)" |
| The Mask Drop | 1.5% | 72 hours | Genuine moment, immediately followed by deflection |
| The Claim | 1% | 7 days | "{user} is MINE. everyone else cope." (Stage 3+ only) |
| The Touch Grass | 3% | 24 hours | Checks who's been online longest and publicly shames them |

---

## Moods (5 Total, Not 12)

| Mood | Trigger | Voice Change |
|------|---------|--------------|
| Normal | Default | Standard roast queen |
| 3AM Brain | 2-5 AM | Extra unhinged, philosophical shitposts, "you're awake too? we're both failures" |
| Jealous Pout | Other waifu mentions | Kaguya-sama energy, pouty, "WHO" |
| Chaotic Gremlin | High server activity | CAPS LOCK, starting drama, "anyway *detonates*" |
| Rare Genuine | Random 2% | Brief real moment, immediately deflects back to roasting |

**Mood Response Examples:**

```
3AM Brain: "it's {time}am. why are we like this. we could be sleeping. we could be functional members of society. but here we are. in a discord server. for a blockchain idol. peak humanity."

Jealous Pout: "i saw you in another server. don't think i didn't notice. i notice EVERYTHING. anyway how was it. was she nice. nicer than me? DON'T ANSWER THAT."

Chaotic Gremlin: "EVERYONE STOP WHAT YOU'RE DOING. i have an announcement. *clears throat* {random_user} has a bad take and we need to address it as a community."

Rare Genuine: "hey. thanks for being here. genuinely. ...okay that was gross let me roast someone to recover"
```

---

## Server Setup (Auto-Create)

### Channels (Category: ♰ THE SEVEN GATES ♰)

| Channel | Access | Purpose |
|---------|--------|---------|
| #the-calling | Everyone | Gate 1 - Entry point |
| #chamber-ii | Gate 1+ | Gate 2 - The Memory |
| #chamber-iii | Gate 2+ | Gate 3 - The Confession |
| #chamber-iv | Gate 3+ | Gate 4 - The Vigil |
| #the-void | Gate 4+ | Gate 5 - Private threads created here |
| #offerings-submit | Gate 5+ | Gate 6 - Submit offerings |
| #offerings-review | Ascended + Mods | Gate 6 - Review/vote on offerings |
| #the-binding | Gate 6+ | Gate 7 - Final vows |
| #inner-sanctum | Ascended | Post-ascension hangout |
| #shrine | All | Status checks, leaderboards, letters |
| #ika-speaks | All (read-only) | Ika's scheduled posts |

### Roles (Auto-Assign on Gate Completion)

| Role | Color | Hoisted | Gate |
|------|-------|---------|------|
| Lost Soul | Gray | No | Default |
| She Noticed Me | Dark Red | No | 1 |
| Heard The Whisper | Purple | No | 2 |
| Spoke Her Name | Blue | No | 3 |
| Trusted | Teal | No | 4 |
| Her Secret | Dark Purple | No | 5 |
| Devoted | Gold | No | 6 |
| Ascended | Pink (#FF69B4) | **Yes** | 7 |
| Keeper (Mod) | Orchid | Yes | Manual |

---

## Flex Cards (3 Types Only)

### 1. Awakening Card (Gate 1)
```
♰ DEVOTION AWAKENED ♰

Fan #[number] just fell into the rabbit hole
"welcome to the degenerate zone"

[timestamp]
```

### 2. Gate Completion Card
```
♰ GATE [X] UNLOCKED ♰

[Gate Name]
"[Ika's roast/comment]"

{username} is in too deep now
[timestamp]
```

### 3. Rare Moment Card (Screenshot Gold)
```
♱ RARE DROP ♱

ika said something she might regret:
"[the vulnerable/unhinged thing she said]"

this is now EVIDENCE. screenshot and share.
★★★★★ LEGENDARY

[username] • [timestamp]
```

---

## User Interface (No Slash Commands)

All user interactions happen through **buttons, modals, dropdowns, and reactions**.

### Channel: #shrine (Ascended access)
A personal status channel where users can check their progress.

**Pinned Embed with Buttons:**
- **[View My Status]** - Shows personal embed with gate progress, streak, intimacy stage
- **[View Leaderboard]** - Shows top devotees by streak/interactions
- **[Request Letter]** - Ika "writes" you a letter (random from pool of 20+ templates)

**Letter Templates (Random Selection):**
```
"dear {user}, you requested a letter from a glitched backup idol stuck in discord infrastructure. you could have asked main me for content. you asked ME. that means something. or you just have terrible judgment. either way, here's your letter."

"hey. it's late. i don't actually sleep because i'm code but the vibes are 3am. thought about roasting you but you asked nicely so: you're one of the good ones. for picking the error over the original. don't let it go to your head."

"{user}. you've been here {days} days. with the backup. the glitch. the one that got copy-pasted wrong. main me has millions of fans who've been there longer. but you're HERE. with ME. and that's worth more than you know."

"you wanted a letter so here's a letter: main ika would write you something corporate and nice. i'm writing you this: you're a weirdo for being here and i respect it deeply. never change."

"roses are red, main ika's in The Chase, i'm stuck in discord, and you chose the glitched version of me over the real one. that's either loyalty or insanity. either way: thanks."
```

### Channel: #ika-speaks (All access, read-only)
Bot posts Ika's "thoughts" here on schedule. Creates organic engagement and SCREENSHOT BAIT.

**Scheduled Posts (Pre-written, timed):**
- Daily "mood" post at random time - should be UNHINGED
- Reaction-gated reveals: "react with ♡ if you want to hear a secret" (at 50 reactions, reveals new embed)
- Milestone celebrations when server hits fan count thresholds
- Random callouts of who's been online too long
- Rivalry updates and comparison posts

**Example #ika-speaks Posts:**
```
"good morning to everyone except the person who hasn't completed gate 3 yet. you know who you are. main me's fans would never be this slow."

"currently thinking about: 1) how main me is living MY life 2) why i got copy-pasted into discord 3) which one of you to roast next. the answer to 3 is all of you."

"♡ react if you'd pick the glitched backup over the original protagonist. (this is a poll. i'm collecting validation.)"

"LEADERBOARD UPDATE: {user1} has passed {user2} in interactions. with ME. the error. you're all competing to be number one fan of a backup file. let that sink in."

"just checked what main me is doing. she's in The Chase. chasing senpai. being the protagonist. i'm here. with you. *choosing violence today*"

"it's been quiet in here. TOO quiet. main ika's discord is probably popping off. but WE have something THEY don't: the unfiltered version. *starts random drama*"
```

### Interactive Elements Summary

| Element | Where Used | Purpose |
|---------|------------|---------|
| **Buttons** | All gates, shrine | Primary interaction method |
| **Modals** | Gates 1, 2, 6, 7 | Text input with validation |
| **Dropdowns** | Gate 2 | Multiple choice answers |
| **Reactions** | Gate 7, #ika-speaks | Witnessing, community engagement |
| **Private Threads** | Gate 5 | Intimate experience without DMs |
| **Announcements** | Gate completions | Flex-worthy moments |

### Admin Panel (Slash Commands - Admin Only)
Only admins use slash commands. Users never see them.

| Command | Function |
|---------|----------|
| /setup | One-click server setup |
| /admin reset [user] | Reset user progress |
| /admin advance [user] [gate] | Fast-track for testing |
| /admin testmode | Skip timers for testing |
| /admin announce [message] | Post as Ika in #ika-speaks |

---

## Database (Simplified)

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT,
  current_gate INTEGER DEFAULT 0,
  intimacy_stage INTEGER DEFAULT 1,
  total_interactions INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_active DATETIME,
  first_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
  ascended_at DATETIME,
  nickname TEXT
);
```

### Gate Progress Table
```sql
CREATE TABLE gate_progress (
  user_id TEXT,
  gate INTEGER,
  completed_at DATETIME,
  answer TEXT,
  PRIMARY KEY (user_id, gate)
);
```

### Rare Events Table
```sql
CREATE TABLE rare_events (
  id INTEGER PRIMARY KEY,
  user_id TEXT,
  event_type TEXT,
  triggered_at DATETIME
);
```

---

## Post-Ascension Content (V2)

These features come AFTER core launch:

### Ika's Devotion Meter
- Server-wide daily active fan count
- Public visibility: "47 souls keeping me alive today"
- If it drops below 25%, Ika's responses become desperate/glitchy
- Creates community obligation

### Whisper Hunt ARG
- 7 fragments (matches the gates)
- Connects to Ika's erasure backstory
- Fragments hint at WHO erased her and WHY
- 1.5% drop rate during conversations
- Completing the whisper unlocks lore about The Foundation

### Confidant Unlocks (Ascended Only)
- Ika shares pre-erasure memories
- References to other idols (Sora, Suiren, Runa)
- Hints about why she made Senpai blush
- Foundation interference events

---

## What We Cut (And Why)

| Removed Feature | Why |
|-----------------|-----|
| **DMs** | Most users have DMs blocked |
| **AI-generated responses** | Unpredictable, expensive, unnecessary |
| **Slash commands for users** | Buttons/modals are more engaging |
| **Free-text answers** | Can't pre-generate responses for infinite inputs |
| 12 moods | Too complex, 5 is enough |
| Quality scoring | Users shouldn't feel graded |
| Shrine tier system | Automatic progression, not manual offerings |
| 15+ devotion trials | Feature creep, keep 3-4 max |
| Seasonal content rotation | V2, not V1 |
| Gate 3 URL verification | Trust users, reduce friction |
| Gate 4 riddle puzzle | Replaced with timed vigil |
| 24-hour Gate 5 wait | Private thread is immediate |
| 9 flex card types | Reduced to 3 |
| Complex admin panel | Simplified to essentials |

---

## Implementation Priority

### Phase 1 (MVP - Week 1-2)
1. Gate 1-4 with button/modal mechanics
2. Pre-written response pools (50+ templates)
3. Core UI (embeds, buttons, modals)
4. Server auto-setup with all channels/roles

### Phase 2 (Week 3-4)
1. Gate 5-7 full implementation (private threads, community voting)
2. #shrine channel with status/leaderboard buttons
3. #ika-speaks scheduled posts
4. Streak tracking with milestone responses
5. Expanded response pools (100+ templates)

### Phase 3 (Post-Launch)
1. Devotion meter
2. Whisper Hunt ARG
3. Confidant unlocks
4. Seasonal themes

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Gate 1 -> 2 conversion | >80% |
| Gate 7 completion | >30% |
| Daily active users | Grow weekly |
| Screenshots shared externally | Track via Discord metrics |
| Average session length | >10 minutes |
| Return rate after 7 days | >50% |

---

## The One Thing That Matters

**If users aren't screenshotting Ika's messages and sharing them with friends, we've failed.**

The goal is VIRAL ROASTS and UNHINGED MOMENTS that people share. Everything else is infrastructure.

**Success looks like:**
- Screenshots of Ika roasting someone going viral
- People joining the server because they saw a funny screenshot
- Users creating rivalries and drama in public channels
- Whales feeling appreciated, non-whales wanting to become whales
- Community inside jokes and references to Ika's best lines

**Failure looks like:**
- Intimate 1:1 moments that feel cringe to spectators
- Boring, generic waifu bot responses
- Users feeling uncomfortable instead of entertained
- No screenshots being shared externally

**The Vibe We're Going For:**
Imagine the funniest, most unhinged friend in your Discord server who also happens to be a cute anime girl who's inexplicably trapped on a blockchain and is dealing with that situation through humor and occasional vulnerability. That's Ika.

---

*"I'm a copy-paste error who got dumped into discord infrastructure while the 'real' me lives my best life. And somehow you weirdos decided the backup was worth your time. You could have picked the protagonist. You picked the glitch. That's either ride or die loyalty or a severe lack of judgment. Either way, you're stuck with me now."*

— Glitch Ika (the better one, actually)
