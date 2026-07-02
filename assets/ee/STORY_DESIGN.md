# Desert Chronicles — Story & World-Building Design Doc

*A critical pass on the narrative, level structure, mythology handling, and desert mechanics. Written against the current build in `assets/ee/`.*

---

## 1. The honest critique first

Your setup has one structural problem that everything else hangs on: **the story is currently a fetch chain, and the mystery is spatial instead of intellectual.** Map → sites → artifact → win. The player walks east and collects. Nothing the player *learns* changes what they *do*. There's no pressure, no antagonist, no clock, and the payoff is an object on a pedestal. An adventure game's mystery has to be something the player assembles in their head, not something they walk to.

The second problem is the premise's inciting object. A "petroglyph map found in his home" doesn't survive contact with a player who knows what a petroglyph is — they're pecked into rock faces; they don't end up under floorboards, and a "map to treasure" is the weakest thing a petroglyph can be (they're calendars, records, territory markers, religious imagery — almost never maps). Better inciting incidents, pick one:

- **The colleague's box.** A colleague from Walker's 1950s digs has died. His estate ships Walker a box: unprovenanced artifacts — things quietly pocketed off digs decades ago, the way that generation did. Among them, a fragment of a carved **calendar stick** and a photograph of a South Mountain panel with a survey stake in the frame. This gives you the anti-looting theme in scene one and makes it *personal*: Walker's generation took things. The game is him deciding what taking means.
- **The newspaper.** June 1986: the *Arizona Republic* runs two stories on the same page. One: a developer's grading crew has cut into a canal alignment east of Pueblo Grande, salvage archaeology has "two weeks." Two: a crank letter claiming a White Tanks petroglyph records a "star that exploded." Walker recognizes the petroglyph from his own 1956 field notebook — a sketch he never understood. Now he has a deadline and a thirty-year-old question.

Either version fixes your third problem for free: **there's no clock.** Set the game across roughly two weeks of June 1986, ending at the **summer solstice (June 21)**. The alignment network only *reads* on that morning. The heat is at its most lethal (mechanical pressure), the saguaro fruit is ripening (the O'odham new year — see §4), and the bulldozers pour concrete the following Monday. Every day the in-game calendar advances is felt.

And you need an antagonist, but not a mustache-twirler. 1986 Phoenix hands you a real one: **the pothunter-dealer economy riding the development boom.** Freeways and subdivisions were chewing through Hohokam sites; "salvage" was a gold rush; NAGPRA didn't exist yet (it's 1990 — Walker can be four years ahead of the law, which is quietly heroic). Give the dealer a face: a charming ex-colleague of Walker's, someone who made the *other* choice with the same training. He's not evil; he's what Walker could have been. He's also *right* about several clues before Walker is, which makes him dangerous. His crew's flagging tape and looter pits appearing at sites you visited earlier is your visual escalation.

The **Lost Dutchman legend is your control group**, not your plot. The dealer chases gold in the Superstitions because he reads every ancient text as a treasure map. Walker learns to read them as what they are — and that's why Walker wins. The Dutchman thread should *end in nothing*: an empty digging, a heat-killed mule, a rival who wasted the solstice week in the wrong mountains. The desert doesn't curse anyone. It just doesn't care. (Adolph Ruth's skull, found in 1931 minus his body, is period-authentic campfire lore your NPCs can tell — as *lore*, believed by characters, confirmed by nothing.)

### The mystery, restructured in three layers

The unfolding should move through three distinct questions, each one invalidating the previous:

1. **"Where is the treasure?"** (Acts I) — the pulp question the player *thinks* they're asking. Sustained by the Dutchman lore, the dealer, the map fragment.
2. **"What is the instrument?"** (Act II) — the realization that the sites aren't hiding places; they're *components*. Hole-in-the-Rock, the Pueblo Grande doorway, the South Mountain horizon markers are one distributed instrument the size of the valley, and the "map" is not spatial but **temporal**: it tells you *when* to look, not where to dig. This should land as a genuine player epiphany (see the sightline mechanic, §3).
3. **"What was recorded, and who was it for?"** (Act III) — the payoff. The artifact is not gold and not a power source. It's a **record** — a calendar stick (a real O'odham/Pima mnemonic tradition) or carved tally whose entries span centuries: the AD 1006 supernova, canal expansions, floods, the drought years, and a final deliberate entry corresponding to the mid-1400s — not a catastrophe, a *decision*. The cities were let go. The people didn't vanish; they reorganized, dispersed, survived — and their descendants, the O'odham, are down the road in 1986 growing tepary beans. The "mystery of the vanished Hohokam" dissolves, correctly, into the harder and truer question: *why did they choose to walk away from the largest irrigation civilization in North America, and what did they think was worth keeping?* Memory, not treasure, is what got carried out.

The ending choice writes itself: the dealer wants the record because provenance like that is worth a fortune. The museum wants it in a drawer. Walker's third option is to **give it back** — hand it to the O'odham cultural authority, publish only the astronomy, and let the record stay with the people whose ancestors wrote it. In 1986 that choice costs him his legacy paper. Let the player feel that cost. (If you want two endings, the "take it" ending shouldn't be punished by a curse — it should simply be *smaller*: a glass case, a plaque with his name, a valley that learned nothing.)

Finally, Walker's arc: retired man, "one last expedition," feels obsolete next to his own pocket computer. The Hohokam story *is his story* — the question of what remains when the work ends. He starts the game thinking legacy means what you leave with your name on it and ends knowing legacy is what continues without your name anywhere. Say it nowhere. Build it everywhere.

---

## 2. Level progression — landmarks, beats, puzzles

The astronomy/solstice mechanic is the heart, so the progression is designed to teach it in four escalating lessons: **read a light (tutorial) → read a doorway (alignment) → read a horizon (calendar) → read a network (finale).**

Days advance on map transitions and rest. The in-game date is always visible. Some puzzles are only solvable on certain dates/times — the game teaches you to *wait*, which no player expects, and which is exactly the mindset shift the story is about.

| # | Level (real place) | Story beat | Puzzle / mechanic |
|---|---|---|---|
| 1 | **Old Town Scottsdale — Walker's house & the Arizona Canal** | Inciting incident (colleague's box / newspaper). Tutorial. The canal behind his house *is* a Hohokam alignment — the modern city literally waters itself through their engineering. | Tutorial: use the pocket computer to catalog the calendar-stick fragment; notice its notch pattern matches the canal junction map on his wall. Walk the canal path east — the canal is the game's connective tissue between several levels. |
| 2 | **Camelback Mountain — Echo Canyon** (existing level) | Establish the physical stakes: heat, water, terrain. Meet the dealer at the trailhead — friendly, funny, wrong. He's heading to the Superstitions and invites Walker along. Declining is the first characterization choice. | Survival mechanics tutorial (heat/hydration you already have). The Praying Monk formation frames a sightline lesson: from the summit at dawn, the player is shown — not told — that certain peaks line up. |
| 3 | **Papago Park — Hole-in-the-Rock** | First real archaeoastronomy. A natural chamber where a shaft of light through the opening tracks the year on the floor. Walker realizes the fragment's notches are *day counts*. | **Lesson 1: read a light.** The player must return at a specific time of day (wait/camp mechanic) to see the light spot touch a pecked basin in the floor. Doing so decodes one section of the stick: a date. Not a place — a date. |
| 4 | **Pueblo Grande platform mound** (existing "Hohokam settlement" level, upgraded) | The salvage-dig subplot: tape flags, a sympathetic young city archaeologist NPC working against the developer's deadline, and the first sign the dealer has been here reading the same clues. | **Lesson 2: read a doorway.** The platform mound's summer-solstice-aligned doorway. Stand in it at dawn: it frames Hole-in-the-Rock across the valley. Two levels the player has *already visited* snap together into one instrument. This is the epiphany beat — stage it, don't text-dump it. |
| 5 | **The canals** (traversal level: modern SRP canal over ancient alignment) | Connective level between valley sites. Environmental storytelling: 1986 suburbia on top, 900-year-old engineering underneath; a lock keeper NPC whose family has "always worked water." | Navigation by water: canal flow direction as a compass. Optional haboob set piece here (see §5). The dealer's crew is dredging a stretch — sabotage/avoid. |
| 6 | **South Mountain petroglyphs** (upgrade of existing petroglyph level) | The valley's densest rock-art concentration. An O'odham character (see §4) meets Walker here — on purpose; she's been watching someone poke around her ancestors' land, and the dealer got here first. | **Lesson 3: read a horizon.** Horizon-calendar puzzle: match the sun's rising point against notched horizon markers on the ridgeline to identify *which* solstice the stick's final entries count toward. Requires visiting at dawn on two different days and comparing (the pocket computer logs sun positions). |
| 7 | **White Tank Mountains** (existing level, re-pointed) | The supernova panel. The disputed AD 1006 claim is *in the game as disputed* — Walker's 1956 sketch vs. the crank letter vs. the O'odham character's grandmother's story, three readings of one panel. | Dating puzzle: if the panel records SN 1006, it anchors the calendar stick's whole chronology — the player aligns the stick's notch sequence against known dates (supernova, a documented flood) on the computer. The stick's final entry resolves to the 1440s… and to a *location aperture* only readable at the coming solstice. |
| 8 | **Tempe / ASU** (existing lab level, expanded with Hayden Library archives) | Research interlude and quiet act break. Microfiche, survey records, the colleague's old correspondence — and proof the dealer has requested the same boxes. The planetarium lets the player *simulate* June 21 dawn and plan the finale. | The pocket computer pays off: cross-referencing canal survey maps (1912) against aerial photos to find the one alignment segment the bulldozers haven't reached. Sets the finale's location. |
| 9 | **Superstition Mountains** | The misdirection made flesh. The dealer's full camp, the Dutchman obsession, an empty pit. He offers Walker a partnership and is genuinely persuasive — this is the game's best dialogue scene. The mountains are eerie because of what people bring to them, not what's in them. | No treasure here by design. A survival gauntlet (the game's hardest terrain/fauna) to *earn* the anticlimax: the player fights to a marked spot from Dutchman lore and finds nothing but an older looter's pit and a rusted 1930s canteen. The lesson is the level. |
| 10 | **Finale — the solstice, before dawn, June 21** (the canal-junction site from level 8) | Everything converges: last night before the concrete pour, the dealer arrives too, the O'odham character chooses to be present. Dawn comes up. | **Lesson 4: read the network.** The player must physically position themselves using everything learned: the doorway alignment (4), the horizon notch (6), the day-count (3, 7). Light crosses the valley — Hole-in-the-Rock to mound doorway to horizon marker — and touches the undisturbed cache: the complete calendar stick in a sealed olla. Then the ending choice (§1). |

Structural notes:

- Levels 3, 4, 6 each end with the player *voluntarily waiting* for a celestial event. By the finale, waiting for dawn should feel ceremonial, not idle. That's the astronomy mechanic doing thematic work.
- Your existing **ghost town and mine levels** slot cleanly into the Superstitions leg (9) as approach and lore delivery — the miner's-ghost material works better as Dutchman-adjacent Anglo folklore than mixed in with Hohokam material, and separating the two folklore registers (Anglo treasure lore vs. O'odham tradition) is itself good cultural hygiene.
- **Piestewa Peak caution:** the 2003 renaming honors Lori Piestewa; in 1986 the peak carried a name now recognized as a slur. Don't use the old name, and don't use "Piestewa" anachronistically. Cleanest solution: if you use the mountain, have the O'odham character call it **Vainom Do'ag** (its O'odham name) and let Walker adopt it — a quiet character beat that solves a real problem.

---

## 3. The astronomy mechanic, mechanically

Keep it diegetic and physical. No abstract "align the rings" minigame — the player's *avatar position*, the *date*, and the *time of day* are the puzzle inputs, and the existing day/night clock is the puzzle engine:

- **Camp/wait verb.** Add "wait until dawn/dusk" at campfires and shelters. Waiting consumes water and advances the date — so *time is a resource*, and solving a solstice puzzle early in the calendar matters.
- **The pocket computer as astronomy tool.** It logs sun azimuths, stores petroglyph rubbings, and — after ASU — simulates sky positions for any date. This keeps the "computer hobbyist" trait load-bearing instead of flavor. Also period-perfect: a Tandy Model 100 was *the* 1986 field machine.
- **Sightlines as gameplay, not cutscene.** When the player stands in an aligned spot at the right time, render the light doing something on-screen (a shaft, a shadow tangent, a lit basin) rather than dialoguing it. Your 8-bit renderer can sell this beautifully — a single gold pixel line across the whole screen at the finale will hit harder than any text.
- **One optional night-sky layer.** On clear nights, the star field (already in the build) can carry constellations; the White Tanks panel puzzle can ask the player to face the actual patch of sky where Scorpius rises. Cheap to draw, huge for immersion.

---

## 4. The O'odham material — how to do this right

The single most important correction, and it's load-bearing for the whole story: **"vanished mysterious ancients" is not just a cliché here, it's factually and culturally wrong.** *Huhugam* in O'odham refers to ancestors — those who have gone before — and the O'odham understand themselves as the continuity of those people. Archaeology's "collapse mystery" is real and debated (drought, floods, social reorganization), but "they disappeared without a trace" erases living people who are very much still there. Your game gets to be the rare treasure hunt that *debunks its own genre*: the reveal is continuity, not vanishing. Build everything on that.

Practical guidance:

**Put a living O'odham character at the center, with authority.** The current build delivers native perspective through ghosts ("Hohokam Spirit," "Tribal Elder Spirit"). That's the flattening move — it literalizes "dead culture." Replace or outnumber them with a living character: I'd suggest a Salt River or Gila River community member — say, a schoolteacher or hydrology technician in her 50s — who knows more than Walker about half of what he's researching and is *selective* about sharing it. She corrects him. She has her own reasons for caring about the sites (they're her ancestors' — and the salvage-dig subplot threatens actual burials, which is the real 1986 stake). She is not a quest-giver dispensing lore; she decides what Walker has earned. Some questions she answers with "that's not mine to tell you," and the game never unlocks it. **Information the player cannot buy, find, or earn is the most respectful mechanic you can build.**

**Deliver the creation story diegetically and partially.** Earth Maker, the sky meeting earth, I'itoi bringing people up from the underworld — this material varies between tellings and communities, and it is religious, not "content." Never put it in collectible codex entries or omniscient narration. Let the O'odham character tell *a* version, framed as hers ("the way I was taught…"), incomplete on purpose. Walker's notebook can record his imperfect understanding — the game admitting its own outsider position is honesty, not weakness.

**I'itoi and the Man in the Maze (I'itoi Ki:).** The maze-and-figure design is a public, widely shared O'odham symbol (it's on the Tohono O'odham Nation's seal), and its meaning — life's journey, its turns, the goal at center — is safe to invoke and *thematically perfect for your game's structure*. Use the symbol and its journey meaning; do **not** depict I'itoi as a character, an NPC, a boss, or a voice. Presence through absence.

**Do not set a level in I'itoi's cave.** The cave at Baboquivari (Waw Kiwulik) is an active sacred site. Turning it into a dungeon is the appropriation you're worried about. Instead, *invert the custom into a mechanic elsewhere*: at a threshold site late in the game, the player must **leave a gift — permanently** — to pass safely. An inventory item, gone forever, chosen by the player. That's the visitor custom translated into game grammar with its meaning intact: you don't take from these places; you give.

**Fix the Kachina line.** The current Sky People's Shrine dialog references "Kachinas, star spirits" — Katsinam are Hopi/Puebloan tradition, not O'odham. Mixing them is the "all Native cultures are one culture" error. Cut or re-attribute.

**Kill the ancient-aliens subtext dead.** The build currently has petroglyph dialog ("visitors?"), a glowing crater, and blue mine-glow. In 1986, UFO paranoia is period-flavor gold — but the game must land on the debunk: the "visitors" reading is the crank letter's, the lights are flares, and the panel records a *supernova* — meaning the ancients were doing **naked-eye astronomy precise enough to date a stellar explosion**, which is more wondrous than aliens, not less. "Ancient aliens" always means "surely brown people couldn't have built this." Your UFO Watcher NPC is the right vehicle: keep him lovable, let him be wrong, and let him — in his last scene — be *moved* by the true explanation.

**The saguaro harvest ties your calendar theme to living practice.** The O'odham new year is marked by the June saguaro fruit harvest — calendars here aren't just stone alignments; they're an annual practice that never stopped. A June setting means the harvest is *happening during the game*. One scene of the O'odham character with a kuipad (harvest pole), fruit ripening as the solstice nears, quietly proves the game's whole thesis: the knowledge didn't vanish either.

**Process, not just content:** if this game ships publicly, contact the cultural preservation offices (Salt River Pima–Maricopa, Gila River, Tohono O'odham) — describe the project, ask what they'd want handled differently, credit and compensate any review. Todd Bostwick's published work on Hohokam archaeoastronomy (he was Phoenix city archaeologist; *Landscape of the Spirits* covers South Mountain) is your best single research source for the alignments. Ruth Underhill's O'odham song translations are where "crimson evening" lives — quote with attribution, sparingly.

---

## 5. Fauna and desert as mechanics

Rule of thumb: **every animal teaches a desert lesson, and the lesson is always "pay attention," never "kill it."** Real Sonoran fauna is mostly dangerous only when ignored or provoked — which is a better game than combat anyway. Suggested redesign (much of the menagerie is already in the build; this re-points behavior):

**Hazards that reward attention over violence.**
- *Rattlesnake:* **audio-first**. The rattle plays before the snake is visible on screen — from under a bush, inside a rock shadow. Freeze or back away and it de-escalates; keep pressing and you get struck. Teaches the game's core verb (stop, look, listen) in the first hour. A snakebite shouldn't be instant death — it's a slow debuff that forces a costly return to help, which is the *true* consequence.
- *Gila monster:* slow, unbothered, only dangerous if you touch it or corner it near a nest. Make it a *terrain feature that moves* — an orange-and-black "do not step here" that occasionally relocates. Locals will grin: everyone knows you basically have to pick one up to get bitten.
- *Javelina:* herd logic. Placid at distance, catastrophic if you walk between a sow and her young, and they own the paths at night. Movable: toss prickly pear fruit to relocate the herd — the desert's first "environmental key." (Never call them pigs. An NPC should make this joke.)
- *Scorpions & the blacklight:* scorpions fluoresce under UV. Give the pocket computer a plug-in blacklight (period-plausible) — at night, invisible scorpions become glowing hazards, and *so do UV-reactive mineral traces* the ancients used. One tool, hazard-avoidance and secret-finding, night-only. This is your best single fauna-mechanic; it makes night travel a risk/reward choice instead of a palette swap.

**Guides — animals as the desert's signage.**
- *Coyote:* keep your wandering coyotes hostile-adjacent, but add one recurring non-hostile coyote that appears at decision points and trots off. Following it at a distance leads to water or a path — following too close and it's gone. O'odham tradition has Coyote (Ban) as a trickster figure in creation stories, so let the O'odham character name the behavior wryly without the game confirming anything supernatural. The player never knows if it's the same coyote. Don't resolve it.
- *Harris's hawks:* the only raptor that hunts in cooperative packs — a genuinely local flex. A wheeling group of them marks something below: carrion, a looter's pit, a spring. Sky as minimap.
- *Roadrunner:* comic relief with a function — it patrols ground that's safe to cross (roadrunners eat scorpions and kill rattlesnakes; an NPC can say so). Folk detail for flavor: its X-shaped tracks don't reveal direction of travel, which desert lore says confuses evil spirits.
- *Cactus wren & saguaro:* wrens nest in cholla and saguaro boots. Nest presence = this saguaro is stable/safe to approach; silence in a normally noisy wash = something's wrong (predator nearby — pre-telegraph an ambush or event).
- *Desert tortoise:* burrow locations are shareable shelter — the canonical safe spot when the haboob hits or the heat spikes. Finding and remembering burrow locations becomes route knowledge.

**The desert itself.**
- *Heat as the real boss:* you already have hydration; push it further with a **midday lethality band** (11am–4pm in high summer is unsurvivable in open sun without shade). This forces crepuscular play — dawn and dusk activity — which is *exactly when the fauna is active and when the astronomy happens*. One system, three payoffs.
- *The haboob set piece:* stage it on the canal traversal level. The wall of dust rolls in as a visible brown front (your 8-bit renderer will make this iconic), visibility collapses to a few tiles, and the player navigates by **sound** — canal water flow, a wind-chime at the lock keeper's shack, the direction of the wind itself. Optionally, this is where the player and the dealer must briefly shelter *together* — enemies in a tortoise-burrow-sized truce. Best dialogue opportunity in the game.
- *Monsoon flash flood:* one wash-crossing where distant rain (visible lightning on the horizon, no rain here) precedes a flood surge. Teaches the real rule — never camp in a wash — and can wash open the cache site for the finale, since flood-scour revealing buried features is how real discoveries happen.
- *Crimson evening:* make dusk visually distinct (your palette can afford one saturated red-orange pass) and mechanically meaningful — it's when several puzzles read, when fauna guides appear, and when the O'odham character keeps appointments. The most beautiful time of day is also the most useful: that's Sonoran truth.
- *Flora with jobs:* saguaro fruit = healing/hydration item that only exists in the June window (calendar again); cholla = terrain that punishes sloppy pathing (you already have this energy); palo verde = shade tree and "nurse tree" — old saguaros grow where a palo verde sheltered them for decades. One NPC line about nurse trees quietly restates the whole theme: *everything old here was protected by something older.*

---

## 6. Cliché audit

| Cliché you're leaning on | Why it's weak here | The smarter version |
|---|---|---|
| **Vanished mysterious ancients** | Factually wrong (O'odham continuity) and it's the most-used well in the genre | The reveal *is* the debunk: they didn't vanish, they chose, and the descendants are alive in 1986. "Mystery of where they went" becomes "mystery of what they kept." (§1, §4) |
| **Cursed treasure / Lost Dutchman doom** | Curses externalize what the desert already does better | Keep the legend as *in-world folklore characters believe*. Everyone the "curse" kills actually dies of heat, falls, and greed. The game never confirms anything — the Superstitions level's treasure is an empty pit. (§2, level 9) |
| **Ancient aliens / "the visitors"** | Denies indigenous achievement; also just tired | Naked-eye supernova astronomy is the wonder. UFO Watcher stays as beloved period-comic-relief who is *wrong*, and knows it by the end. (§4) |
| **Glowing MacGuffin of power** | An artifact "of immense power" is a fantasy trope wearing an archaeology hat | The artifact is a *record* — a calendar stick. Its power is that someone wrote down four centuries of sky and water and carried it out of a collapsing world. (§1) |
| **Wise ancient ghost exposition** | Literalizes "dead culture"; also lazy delivery | Living O'odham character with selective authority; archival voices (letters, field notes, microfiche) for the Anglo past. Ghost*s* can stay in the ghost town/mine — Anglo miner folklore is the right register for them. (§4) |
| **White discoverer professor** | He "finds" what was never lost | Walker's arc bends from *discovery* to *return*. He ends the game handing the record back and publishing only what's his to publish. The final line of his journal shouldn't contain the word "found." (§1) |
| **"Petroglyph map to the treasure"** | Petroglyphs aren't maps and aren't portable | The calendar-stick fragment + the temporal-map reframe: it tells *when*, not *where*. (§1) |

---

## 7. Tone, and the opening

**The answer is between your two poles, and the mix is time-of-day.** Daytime is pulp: sweat, banter, rattlesnakes, a rival with a better truck — Indiana Jones pacing, and your 8-bit presentation already promises that fun. But dawn, dusk, and night go quiet and literary — the eerie register of Craig Childs' desert writing or *Kentucky Route Zero*: long shadows, a coyote that might be the same coyote, light doing something deliberate on a rock face. Don't blend the registers; **alternate** them. The game's rhythm — pulpy days, numinous dawns — mirrors its argument that the desert is two places depending on when you look.

1986 does tonal work for free: Cold War satellites overhead while Walker studies thousand-year-old sky-watching; a Tandy in a leather satchel; the last summer before the valley's growth curve went vertical. Let the period ironies sit unremarked.

**Opening narration — current version's weaknesses:** it's all setup and no voice ("finds himself drawn back into adventure" is a press release, not a person), it leads with the implausible map, and it sells "one last expedition" sentimentality it hasn't earned. Lead with the canal — the one image that contains the whole game.

*Proposed opening (start-screen crawl, three beats):*

> **JUNE 1986. SCOTTSDALE, ARIZONA.**
>
> The canal behind your house is older than the city. The engineers who dug it in 1912 were following a ditch that had already been there seven hundred years. Nobody thinks about that. The water just comes.
>
> You are Professor James Walker, retired. Thirty years digging in other people's deserts, and you never once worked the one in your backyard. Then yesterday a box arrived from a dead man — a friend, back when you both took things out of the ground without asking whose they were. Inside: his field notes. A photograph of a rock you sketched in 1956 and never understood. And half of something with the year 1006 counted into its edge, notch by notch by notch.
>
> The solstice is in sixteen days. The bulldozers get there Monday after. Fill your canteen.

(Alternate colder ending for the last line, if you want more dread than pulp: *"Sixteen days to the solstice. Whoever counted those notches was waiting for one too."*)

That's three beats: the place is older than it looks; the man owes a debt; the clock is running. Everything else the levels can carry.

---

## 8. What to change in the current build first (priority order)

1. Cut the "Kachinas" line in the Sky People's Shrine; re-point that whole level's text from "came from the stars" to sky-*watching* (§4).
2. Replace/reframe the Hohokam ghost NPCs with the living O'odham character; keep ghosts only in the ghost town/mine (Anglo folklore register).
3. Add the wait/camp verb and date display — the solstice mechanic and the clock both need it (§3).
4. Rewrite the start screen narration (§7) and re-point the inciting object from "petroglyph map" to the colleague's box / calendar-stick fragment.
5. Re-slot existing levels into the progression table (§2): White Tanks gets the supernova panel content; the settlement level becomes Pueblo Grande with the doorway alignment; ghost town + mine become the Superstitions approach.
6. Give the dealer a face and three scenes (Camelback trailhead, haboob shelter, finale). One antagonist, placed early, retroactively organizes everything.

