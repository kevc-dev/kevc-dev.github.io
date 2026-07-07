# Desert Chronicles: The Arizona Artifact

A story-driven 8-bit adventure set in the Salt River Valley, June 1986. Retired
archaeologist James Walker has sixteen days until the summer solstice to read a
valley-sized astronomical instrument the Hohokam left behind — and to decide
what to do with what it protects. Vanilla JavaScript + Canvas, no dependencies.

Design rationale and narrative bible: [STORY_DESIGN.md](STORY_DESIGN.md).

## Controls

| Input | Action |
|---|---|
| WASD / Arrows | Move |
| E / Space | Interact / advance dialog |
| F / J | Swing walking stick |
| M | Walker's field map (tracks records and alignment readings) |
| I / Q | Satchel / journal |
| 1 / 2 / 3 | Answer choices |
| P | Pause · ESC skips the intro |

Touch controls appear automatically on mobile. Progress checkpoints to
localStorage on every map change, camp, and pickup.

## Code layout

```
index.html            shell, HUD, CSS
js/Game.js            state machine, fixed-timestep loop, save/continue, field map
js/GameMap.js         map loading, rendering, day/night, haboob, ambient fauna
js/gameData.js        all content: object types, items, maps, NPCs, dialog
js/SoundManager.js    music (96k AAC) + SFX, crossfades, WebAudio synth ambience
js/UIManager.js       DOM HUD, dialog box with portraits, satchel, journal
js/portraits.js       16x16 dialog portraits (characters only)
js/entities/          Player, NPC (+npcSprites), Enemy, Critter, InteractiveObject
tests/                headless test suites (no browser needed)
```

## Tests

```sh
node tests/smoke.mjs        # systems: saves, time gates, audio wiring, fauna, UI
node tests/playthrough.mjs  # full quest-line via real interactions + BFS pathability
```

Both stub the DOM/Audio and drive the real modules; `playthrough.mjs` finishes
the entire game through actual object interactions and flood-fills the walkable
grid to prove every quest-critical target is reachable.
