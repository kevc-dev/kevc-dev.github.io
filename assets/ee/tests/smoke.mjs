// Headless smoke test for Desert Chronicles items 1-4.
// Stubs the browser environment, then drives real game flows.

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let failures = 0;
const check = (name, cond, extra = '') => {
    console.log(`${cond ? 'PASS' : 'FAIL'}: ${name}${cond ? '' : ' ' + extra}`);
    if (!cond) failures++;
};

// ---------- browser stubs ----------
const makeCtx = () => new Proxy({ measureText: () => ({ width: 10 }) }, {
    get(t, p) {
        if (p in t) return t[p];
        return (..._a) => undefined; // any method is a no-op
    },
    set(t, p, v) { t[p] = v; return true; },
});

const elements = new Map();
const makeEl = (id) => ({
    id,
    style: {},
    textContent: '',
    innerHTML: '',
    title: '',
    className: '',
    width: 640, height: 480,
    classList: { add() {}, remove() {} },
    listeners: {},
    addEventListener(ev, fn) { (this.listeners[ev] = this.listeners[ev] || []).push(fn); },
    removeEventListener() {},
    appendChild() {},
    getBoundingClientRect: () => ({ width: 100, height: 100, left: 0, top: 0 }),
    clientWidth: 40,
    getContext: () => makeCtx(),
});

globalThis.document = {
    getElementById(id) {
        if (!elements.has(id)) elements.set(id, makeEl(id));
        return elements.get(id);
    },
    createElement: (tag) => makeEl('dyn-' + tag),
    createTextNode: (t) => ({ text: t }),
    addEventListener() {},
    removeEventListener() {},
    body: { appendChild() {}, removeChild() {}, addEventListener() {}, classList: { add() {}, remove() {} } },
    readyState: 'complete',
    documentElement: { style: { setProperty() {} } },
};
globalThis.window = { addEventListener() {}, innerWidth: 2000, innerHeight: 1000 };
Object.defineProperty(globalThis, 'navigator', { value: { userAgent: 'node-test', maxTouchPoints: 0 }, configurable: true });
globalThis.Audio = class {
    constructor(src) { this.src = src; this.volume = 1; this.currentTime = 0; this.duration = NaN; this.loop = false; }
    play() { return Promise.resolve(); }
    pause() {}
    load() {}
    addEventListener() {}
};
const store = new Map();
globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
};
globalThis.requestAnimationFrame = () => 0; // don't run the loop; we drive updates by hand

// ---------- import the real game ----------
const BASE = new URL('../js', import.meta.url).href;
const { Game } = await import(`${BASE}/Game.js`);
const { GAME_STATE, SAVE_KEY } = await import(`${BASE}/constants.js`);

const game = new Game();
game.startGame(true); // skip intro
await sleep(700);

check('game starts on desert map', game.currentMapName === 'desert');
check('game state PLAYING', game.gameState === GAME_STATE.PLAYING);
check('initial date is June 5', game.gameDate === 5, `got ${game.gameDate}`);
check('field map item usable', typeof game.itemTypes.compass.useFunc === 'function');

// --- Item 3: fixed timestep sanity: 120 simulated rAF frames at 120Hz should advance ~1s of sim ---
const t0 = game.gameTime;
const startAnim = game.animationFrame;
let now = 1000;
game.lastFrameTime = now;
for (let i = 0; i < 120; i++) { now += 1000 / 120; game.gameLoop(now); }
const simSteps = game.animationFrame - startAnim;
check('120 frames @120Hz -> ~60 sim steps', simSteps >= 58 && simSteps <= 62, `got ${simSteps}`);
check('game time advanced ~60 game-seconds', Math.abs((game.gameTime - t0) - 60) < 3, `got ${game.gameTime - t0}`);

// --- Item 4: camp choice (dawn/dusk/leave) ---
const campfire = game.currentMap.objects.find(o => o.objData.rest);
check('campfire exists on desert map', !!campfire);
campfire.onInteract(game.player);
check('camp opens choice puzzle', game.gameState === GAME_STATE.PUZZLE && game.currentPuzzle && game.currentPuzzle.isCampChoice);
game.handleKeyUp('2'); // answer via number key: wait for dusk
check('dusk wait via number key -> 5 PM', game.gameHour === 17, `got hour ${game.gameHour}`);
check('dusk wait shows dialog', game.gameState === GAME_STATE.DIALOG);
game.handleKeyUp('e');
campfire.onInteract(game.player);
game.handlePuzzleAnswer(0); // sleep until dawn
check('dawn rest -> 6 AM next day', game.gameHour === 6 && game.gameDate === 6, `hour ${game.gameHour} date ${game.gameDate}`);
game.handleKeyUp('e');
campfire.onInteract(game.player);
game.handlePuzzleAnswer(2); // break camp
check('break camp returns to play', game.gameState === GAME_STATE.PLAYING);

// --- Item 4: field map view ---
game.handleKeyUp('m');
check('M opens field map', game.gameState === GAME_STATE.MAP_VIEW);
game.draw(); // must not throw
game.handleKeyUp('m');
check('M closes field map', game.gameState === GAME_STATE.PLAYING);

// --- Item 1: checkpoint save + continue ---
check('camp created a checkpoint', game.hasSave());
game.changeMap('canyon', 50, 240);
check('map change checkpoints on new map', game.loadSaveData().mapName === 'canyon');
game.player.addItem('artifact1');
const beforeQuests = game.player.quests.length;
const saved = game.loadSaveData();
check('item pickup checkpointed', saved.inventory.includes('artifact1'));

// Simulate a fresh session continue
game.continueGame();
await sleep(500);
check('continue restores map', game.currentMapName === 'canyon');
check('continue restores inventory', game.player.hasItem('artifact1'));
check('continue restores quest count', game.player.quests.length === beforeQuests, `got ${game.player.quests.length} vs ${beforeQuests}`);

// --- mapState: opened chest stays opened across map reloads ---
const chest = game.currentMap.objects.find(o => o.type === 'chest');
check('canyon chest starts closed', chest && !chest.objData.opened);
// artifact1 already owned so addItem returns false; use the ghost town prickly pear chest instead
game.changeMap('ghost_town', 296, 40);
const gtChestIdx = game.currentMap.objects.findIndex(o => o.type === 'chest');
const gtChest = game.currentMap.objects[gtChestIdx];
game.player.removeItem('prickly_pear');
gtChest.onInteract(game.player);
check('chest opened grants item', game.player.hasItem('prickly_pear'));
check('chest open persisted to mapState', game.mapState.ghost_town && game.mapState.ghost_town.objects[gtChestIdx] && game.mapState.ghost_town.objects[gtChestIdx].opened);
game.handleKeyUp('e');
game.changeMap('desert', 100, 100);
game.changeMap('ghost_town', 296, 40);
check('chest stays opened after map reload', game.currentMap.objects[gtChestIdx].objData.opened === true);

// --- Item 2b: records required at the secret panel ---
game.player.addItem('artifact2');
game.player.addItem('artifact3');
game.changeMap('asu_lab', 50, 240);
const panel = game.currentMap.objects.find(o => o.type === 'secret_panel');
panel.onInteract(game.player);
check('panel blocked without readings', game.gameState === GAME_STATE.DIALOG && !panel.objData.isNowPortal);
check('learn_alignments quest added', game.player.quests.some(q => q.id === 'learn_alignments'));
game.handleKeyUp('e');
// Witness the three alignments
game.player.addQuest({ id: 'alignment_light', description: 'x', completed: true });
game.player.addQuest({ id: 'alignment_doorway', description: 'x', completed: true });
game.player.addQuest({ id: 'alignment_horizon', description: 'x', completed: true });
panel.onInteract(game.player);
check('panel opens with items + readings', panel.objData.isNowPortal === true && !!game.pendingPortal);
game.handleKeyUp('e'); // dismiss dialog -> travels through pendingPortal
check('entered the vault', game.currentMapName === 'artifact_chamber', `got ${game.currentMapName}`);

// --- The offering ledge gates the pedestal ---
const pedestal = game.currentMap.objects.find(o => o.objData.triggersPuzzle);
check('pedestal present', !!pedestal);
pedestal.onInteract(game.player);
check('pedestal asks for an offering first', game.gameState === GAME_STATE.DIALOG && !game.player.quests.some(q => q.id === 'gift_left'));
game.handleKeyUp('e');
const ledge = game.currentMap.objects.find(o => o.type === 'offering_ledge');
check('offering ledge present', !!ledge);
ledge.onInteract(game.player);
check('offering choice opens', game.gameState === GAME_STATE.PUZZLE && game.currentPuzzle.isOfferingChoice);
const hydrBefore = game.player.hydration;
game.handlePuzzleAnswer(1); // pour out water
check('water offering costs 30 H2O and records the gift',
    game.player.quests.some(q => q.id === 'gift_left' && q.completed) && game.player.hydration === hydrBefore - 30,
    `hydration ${hydrBefore} -> ${game.player.hydration}`);
game.handleKeyUp('e');

// --- Item 2a: solstice gating at the pedestal ---
check('date is before solstice', game.gameDate < 21, `date ${game.gameDate}`);
pedestal.onInteract(game.player);
check('vault vigil jumps to June 21 dawn', game.gameDate === 21 && game.gameHour === 5, `date ${game.gameDate} hour ${game.gameHour}`);
check('vigil shows dialog', game.gameState === GAME_STATE.DIALOG);
game.handleKeyUp('e');
pedestal.onInteract(game.player); // in window now -> shake then puzzle
await sleep(700); // SHAKE_DURATION
check('solstice dawn triggers the puzzle', game.gameState === GAME_STATE.PUZZLE && game.currentPuzzle && !game.currentPuzzle.isEndingChoice);

// --- Item 2c: wrong answer is retryable, then the three-way choice ---
game.handlePuzzleAnswer(1); // wrong (AD 1054)
check('wrong answer -> no game over', game.gameState === GAME_STATE.DIALOG);
check('pedestal resets for retry', pedestal.objData.opened === false);
game.handleKeyUp('e');
pedestal.onInteract(game.player);
await sleep(700);
check('puzzle retriggers', game.gameState === GAME_STATE.PUZZLE);
game.handlePuzzleAnswer(0); // correct: AD 1006
check('correct answer -> Cutler dialog', game.gameState === GAME_STATE.DIALOG && game.pendingEndingChoice);
check('final artifact granted', game.player.hasItem('final_artifact'));
game.handleKeyUp('e');
check('ending choice presented', game.gameState === GAME_STATE.PUZZLE && game.currentPuzzle.isEndingChoice);
game.handlePuzzleAnswer(2); // the return
check('THE RETURN ending', game.gameState === GAME_STATE.WIN && game.endingTitle === 'THE RETURN');
check('win clears the checkpoint', !game.hasSave());

// --- Item 2a: June 23 pour consequence (fresh run, fast-forwarded) ---
game.startGame(true);
await sleep(700);
game.gameTime = 18 * 86400 + 9 * 3600; // day 19 = June 23, 9 AM
check('fast-forward to June 23', game.gameDate === 23);
game.changeMap('hohokam_site', 50, 240);
const flags = game.currentMap.objects.filter(o => o.type === 'survey_flag');
const shardChest = game.currentMap.objects.find(o => o.type === 'chest');
check('pour removes survey flags', flags.length === 0);
check('pour removes the shard chest', !shardChest);
const canal = game.currentMap.objects.find(o => o.type === 'hohokam_canal');
check('canal is poured concrete', canal.objData.waterColor === '#9A9A94');
const delgado = game.currentMap.npcs.find(n => n.name === 'Dr. Delgado');
delgado.onInteract(game.player);
check('Delgado hands over the shard after the pour', game.player.hasItem('artifact2'));

// --- alternate endings text sanity ---
game.player.addItem('final_artifact');
game.resolveEnding(0);
check('THE SPLIT ending exists', game.endingTitle === 'THE SPLIT');
game.resolveEnding(1);
check('THE PLAQUE ending exists', game.endingTitle === 'THE PLAQUE');

// ============ Items 5-7 ============
game.startGame(true);
await sleep(700);

// --- Item 5: sprite/portrait data integrity ---
const { NPC_SPRITES } = await import(`${BASE}/entities/npcSprites.js`);
const { PORTRAIT_DATA, getPortraitURL, resolvePortraitKey } = await import(`${BASE}/portraits.js`);
let spriteOk = true;
for (const [name, spec] of Object.entries(NPC_SPRITES)) {
    if (spec.frames.length !== 2) { spriteOk = false; console.log(`  sprite ${name}: needs 2 frames`); }
    spec.frames.forEach((rows, f) => {
        if (rows.length !== 16) { spriteOk = false; console.log(`  sprite ${name} frame ${f}: ${rows.length} rows`); }
        rows.forEach((row, r) => {
            if (row.length !== 12) { spriteOk = false; console.log(`  sprite ${name} f${f} row${r}: len ${row.length}`); }
            for (const ch of row) if (ch !== '.' && !(ch in spec.palette)) { spriteOk = false; console.log(`  sprite ${name} f${f} row${r}: unknown '${ch}'`); }
        });
    });
}
check('NPC sprites: 5 entries, all 12x16x2, palette-complete', spriteOk && Object.keys(NPC_SPRITES).length === 5);
let portraitOk = true;
for (const [name, spec] of Object.entries(PORTRAIT_DATA)) {
    if (spec.rows.length !== 16) { portraitOk = false; console.log(`  portrait ${name}: ${spec.rows.length} rows`); }
    spec.rows.forEach((row, r) => {
        if (row.length !== 16) { portraitOk = false; console.log(`  portrait ${name} row${r}: len ${row.length}`); }
        for (const ch of row) if (ch !== '.' && !(ch in spec.palette)) { portraitOk = false; console.log(`  portrait ${name} row${r}: unknown '${ch}'`); }
    });
}
check('portraits: 21 entries, all 16x16, palette-complete', portraitOk && Object.keys(PORTRAIT_DATA).length === 21, `count ${Object.keys(PORTRAIT_DATA).length}`);
check('portrait lookup headless-safe', getPortraitURL('Vance Cutler') === null || typeof getPortraitURL('Vance Cutler') === 'string');
// Every NPC in every map must resolve to a portrait
let coverageOk = true;
for (const [mName, m] of Object.entries(game.maps)) {
    (m.npcs || []).forEach(n => {
        if (!resolvePortraitKey(n.name)) { coverageOk = false; console.log(`  no portrait: ${n.name} (${mName})`); }
    });
}
check('every NPC speaker has a portrait', coverageOk);
check('narration and items stay faceless', resolvePortraitKey('CAMP') === null && resolvePortraitKey('THE VAULT') === null && resolvePortraitKey('Canteen') === null && resolvePortraitKey('System') === null);
game.ui.showDialog('test line', 'Frances Antone'); // must not throw
game.handleKeyUp('e');

// --- post-hit invulnerability ---
game.player.health = 100;
game.player.invulnTimer = 0;
const hit1 = game.player.takeDamage(10, 'Coyote');
const hpAfter1 = game.player.health;
const hit2 = game.player.takeDamage(10, 'Coyote');
check('first hit lands, second blocked by i-frames', hit1 === true && hit2 === false && game.player.health === hpAfter1);
game.player.invulnTimer = 0;
check('venom ignores i-frames machinery', game.player.takeDamage(2, 'Venom') === true);
game.player.health = 100;

// --- Item 5: rattlesnake behavior ---
// Clear roadrunners first: they legitimately keep rattlers calm (tested below)
game.currentMap.critters = game.currentMap.critters.filter(c => c.critterType.name !== 'Roadrunner');
const rattler = game.currentMap.enemies.find(e => e.enemyType.rattler);
check('desert map has a rattlesnake', !!rattler && rattler.enemyType.name === 'Rattlesnake');
// Far away: stays calm
game.player.x = 30; game.player.y = 30;
rattler.x = 500; rattler.y = 400; rattler.spawnX = 500; rattler.spawnY = 400;
rattler.update();
check('rattler calm at distance', rattler.rattlerState === 'calm');
// Inside warn range: rattles, holds ground
game.player.x = rattler.x - 100; game.player.y = rattler.y;
const rx = rattler.x;
rattler.update();
check('rattler warns inside warn range', rattler.rattlerState === 'warn' && rattler.isRattling);
check('warning rattler holds ground', Math.abs(rattler.x - rx) < 1);
// Back off: de-escalates
game.player.x = rattler.x - 300; game.player.y = 100;
rattler.update();
check('rattler de-escalates when player backs off', rattler.rattlerState === 'calm' && !rattler.isRattling);
// Press in past strike range: strikes and envenomates on contact
game.player.x = rattler.x - 40; game.player.y = rattler.y - 6;
rattler.update(); // -> warn
rattler.update(); // -> strike
check('pressing in triggers a strike', rattler.rattlerState === 'strike');
const hpBefore = game.player.health;
for (let i = 0; i < 16 && rattler.rattlerState === 'strike'; i++) rattler.update();
check('strike bites and envenomates', game.player.health < hpBefore && game.player.venomTicks > 0,
    `hp ${hpBefore}->${game.player.health} venom ${game.player.venomTicks}`);
// Venom ticks over time
game.player.health = 100;
game.player.animationFrame = 299;
game.player.update();
check('venom drains over time', game.player.health < 100 && game.player.venomTicks === 7, `hp ${game.player.health} ticks ${game.player.venomTicks}`);
// Prickly pear cures
game.player.addItem('prickly_pear');
game.useItem('prickly_pear');
check('prickly pear clears venom', game.player.venomTicks === 0);
game.handleKeyUp('e');
// Roadrunner presence keeps rattlers calm (safe ground)
rattler.rattlerState = 'calm';
rattler.isRattling = false;
game.currentMap.critters.push({ critterType: { name: 'Roadrunner' }, centerX: rattler.centerX + 40, centerY: rattler.centerY });
game.player.x = rattler.x - 90; game.player.y = rattler.y;
rattler.update();
check('roadrunner nearby keeps rattler calm', rattler.rattlerState === 'calm');
game.currentMap.critters.pop();
rattler.update();
check('rattler warns once the roadrunner leaves', rattler.rattlerState === 'warn');
game.player.x = 30; game.player.y = 30;
rattler.update(); // de-escalate for later tests

// --- guide coyote: leads, waits, vanishes ---
const guide = game.currentMap.critters.find(c => c.critterType.guide);
check('guide coyote present on desert map', !!guide);
game.currentMap.enemies = []; // clear hazards for the follow simulation
let ticks = 0;
while (!guide.gone && ticks++ < 2000) {
    game.player.x = guide.x - 60;
    game.player.y = guide.y + 4;
    game.currentMap.update();
}
check('followed coyote reaches the end and vanishes', guide.gone && !game.currentMap.critters.includes(guide), `ticks ${ticks}`);

// --- blacklight ---
check('UV inactive without the lamp', !game.uvActive);
game.changeMap('abandoned_mine', 60, 240);
const uvTrace = game.currentMap.objects.find(o => o.objData.uv);
check('mine has a UV trace', !!uvTrace);
uvTrace.onInteract(game.player);
check('trace inert without the lamp', game.gameState === GAME_STATE.PLAYING && !game.player.quests.some(q => q.id === 'uv_chalk'));
game.player.addItem('blacklight');
check('lamp + indoors activates UV', game.uvActive);
uvTrace.onInteract(game.player);
check('UV trace readable with the lamp', game.player.quests.some(q => q.id === 'uv_chalk' && q.completed));
game.handleKeyUp('e');

// --- session kills: enemies stay dead on revisit ---
game.changeMap('desert', 320, 440);
const preCount = game.currentMap.enemies.length;
const victim = game.currentMap.enemies[0];
victim.takeDamage(999);
game.changeMap('canyon', 50, 240);
game.changeMap('desert', 320, 440);
check('killed enemy stays dead this session', game.currentMap.enemies.length === preCount - 1, `${game.currentMap.enemies.length} vs ${preCount - 1}`);

// --- Item 6: sound manager wiring ---
const snd = game.sound;
check('new level themes registered', !!snd.music.canalTheme && !!snd.music.superstitionsTheme);
check('volume cycles full/half/silent and persists', (() => {
    const l1 = snd.toggleMute(); // 1 -> 0.5
    const s1 = localStorage.getItem('dc_volume');
    const l2 = snd.toggleMute(); // 0.5 -> 0
    const mutedNow = snd.muted;
    const l3 = snd.toggleMute(); // 0 -> 1
    return l1 === 0.5 && s1 === '0.5' && l2 === 0 && mutedNow && l3 === 1 && !snd.muted;
})());
snd.setNightAmbience(true); snd.setNightAmbience(false);
snd.startRattle(); snd.stopRattle(); snd.resetRattles();
snd.setWind(true); snd.setWind(false);
snd.playChime(); snd.stopAmbience();
check('synth API headless-safe', true);
const fadeTrack = snd.music.canalTheme;
snd.fadeAudio(fadeTrack, 0, 0.5, 100);
await sleep(250);
check('fadeAudio ramps volume', Math.abs(fadeTrack.volume - 0.5) < 0.01, `got ${fadeTrack.volume}`);

// --- Item 7: map graph and new levels ---
check('papago routes to canal', game.maps.papago_park.objects.some(o => o.toMap === 'canal_path'));
check('mound routes to canal', game.maps.hohokam_site.objects.some(o => o.toMap === 'canal_path'));
check('ghost town routes to Superstitions', game.maps.ghost_town.objects.some(o => o.toMap === 'superstition_mountains'));
// Every doorway in every map leads to a real map
let doorsOk = true;
for (const [mName, m] of Object.entries(game.maps)) {
    for (const o of (m.objects || [])) {
        if (o.toMap && !game.maps[o.toMap]) { doorsOk = false; console.log(`  broken door: ${mName} -> ${o.toMap}`); }
    }
}
check('all doorways lead to real maps', doorsOk);
// Every enemy/critter type placed exists
let typesOk = true;
for (const [mName, m] of Object.entries(game.maps)) {
    (m.enemies || []).forEach(e => { if (!game.enemyTypes[e.type]) { typesOk = false; console.log(`  bad enemy ${e.type} in ${mName}`); } });
    (m.critters || []).forEach(c => { if (!game.critterTypes[c.type]) { typesOk = false; console.log(`  bad critter ${c.type} in ${mName}`); } });
    (m.objects || []).forEach(o => { if (!game.objectTypes[o.type]) { typesOk = false; console.log(`  bad object ${o.type} in ${mName}`); } });
}
check('all placed types are defined', typesOk);
// Music keys exist for every mapped theme
const { MAP_MUSIC } = await import(`${BASE}/gameData.js`);
const musicOk = Object.entries(MAP_MUSIC).every(([m, k]) => !!snd.music[k]);
check('every map music key resolves', musicOk);

// Canal level: haboob cycle
game.changeMap('canal_path', 50, 380);
check('canal map loads with haboob system', !!game.currentMap.haboob && game.currentMap.haboob.phase === 'calm');
const hb = game.currentMap.haboob;
hb.timer = 1; game.currentMap.update();
check('haboob approaches', hb.phase === 'approaching');
game.currentMap.draw(makeCtx()); // wall render must not throw
hb.timer = 1; game.currentMap.update();
check('haboob engulfs', hb.phase === 'engulfed');
game.currentMap.draw(makeCtx());
// Shelter in the lock house skips the storm
const shack = game.currentMap.objects.find(o => o.objData.shelter);
check('lock house is a shelter', !!shack);
shack.onInteract(game.player);
check('sheltering ends the haboob', hb.phase === 'calm');
game.handleKeyUp('e');
// Spawn points are not inside solids
const spawnChecks = [
    ['canal_path', 50, 380], ['canal_path', 522, 380],
    ['superstition_mountains', 60, 240], ['ghost_town', 520, 140],
];
let spawnsOk = true;
for (const [mName, sx, sy] of spawnChecks) {
    game.changeMap(mName, sx, sy);
    const p = game.player;
    if (game.currentMap.checkCollision(sx + p.collisionBox.xOffset, sy + p.collisionBox.yOffset, p.collisionBox.width, p.collisionBox.height)) {
        spawnsOk = false;
        console.log(`  spawn inside solid: ${mName} (${sx},${sy})`);
    }
}
check('new spawn points are clear of solids', spawnsOk);

// Superstitions: the anticlimax
game.changeMap('superstition_mountains', 60, 240);
check('Cutler is in his camp', game.currentMap.npcs.some(n => n.name === 'Vance Cutler'));
const pit = game.currentMap.objects.find(o => o.objData.questTrigger && o.objData.questTrigger.id === 'dutchman_bust');
check('Dutchman pit present', !!pit);
pit.onInteract(game.player);
check('pit records the bust', game.player.quests.some(q => q.id === 'dutchman_bust'));
game.handleKeyUp('e');
const canteen = game.currentMap.objects.find(o => o.objData.contains === 'rusted_canteen');
canteen.onInteract(game.player);
check('rusted canteen found', game.player.hasItem('rusted_canteen'));
game.handleKeyUp('e');
game.currentMap.draw(makeCtx()); // stone needle render must not throw
game.handleKeyUp('m');
game.draw(); // field map with new sites must not throw
game.handleKeyUp('m');
check('field map renders with new sites', true);

// --- every referenced audio file must exist on disk ---
const { existsSync } = await import('node:fs');
const { fileURLToPath } = await import('node:url');
const EE_ROOT = fileURLToPath(new URL('..', import.meta.url));
let audioOk = true;
[...Object.values(game.sound.music), ...Object.values(game.sound.sounds)].forEach(a => {
    if (!a.src || !existsSync(EE_ROOT + a.src)) { audioOk = false; console.log(`  missing audio: ${a.src}`); }
});
check('every referenced audio file exists on disk', audioOk);

// --- stackable consumables ---
game.player.inventory = game.player.inventory.filter(k => k !== 'prickly_pear');
game.player.addItem('prickly_pear');
game.player.addItem('prickly_pear');
check('prickly pears stack', game.player.itemCount('prickly_pear') === 2);
for (let i = 0; i < 6; i++) game.player.addItem('prickly_pear');
check('stack caps at 5', game.player.itemCount('prickly_pear') === 5);
game.player.health = 50;
game.useItem('prickly_pear');
game.handleKeyUp('e');
check('using one consumes one from the stack', game.player.itemCount('prickly_pear') === 4 && game.player.health === 85);

// --- NPC idle wander stays near home ---
game.changeMap('desert', 320, 240);
game.player.x = 620; game.player.y = 20;
const wanderer = game.currentMap.npcs[0];
let wanderOk = true;
for (let i = 0; i < 1200; i++) {
    wanderer.update();
    if (Math.abs(wanderer.x - wanderer.homeX) > 45 || Math.abs(wanderer.y - wanderer.homeY) > 35) { wanderOk = false; break; }
}
check('NPC wanders but stays near home', wanderOk);

console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
