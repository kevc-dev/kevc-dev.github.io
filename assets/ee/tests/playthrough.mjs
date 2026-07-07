// Full playthrough simulation: drives the game ONLY through real object
// interactions (no direct quest/item injection) and reports the final quest log.

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let failures = 0;
const check = (name, cond, extra = '') => {
    console.log(`${cond ? 'PASS' : 'FAIL'}: ${name}${cond ? '' : ' ' + extra}`);
    if (!cond) failures++;
};

// ---------- browser stubs ----------
const makeCtx = () => new Proxy({ measureText: () => ({ width: 10 }) }, {
    get(t, p) { if (p in t) return t[p]; return (..._a) => undefined; },
    set(t, p, v) { t[p] = v; return true; },
});
const elements = new Map();
const makeEl = (id) => ({
    id, style: {}, textContent: '', innerHTML: '', title: '', className: '',
    width: 640, height: 480,
    classList: { add() {}, remove() {} },
    addEventListener() {}, removeEventListener() {}, appendChild() {},
    getBoundingClientRect: () => ({ width: 100, height: 100, left: 0, top: 0 }),
    clientWidth: 40, getContext: () => makeCtx(),
});
globalThis.document = {
    getElementById(id) { if (!elements.has(id)) elements.set(id, makeEl(id)); return elements.get(id); },
    createElement: (tag) => makeEl('dyn-' + tag),
    createTextNode: (t) => ({ text: t }),
    addEventListener() {}, removeEventListener() {},
    body: { appendChild() {}, removeChild() {}, addEventListener() {}, classList: { add() {}, remove() {} } },
    readyState: 'complete', documentElement: { style: { setProperty() {} } },
};
globalThis.window = { addEventListener() {}, innerWidth: 2000, innerHeight: 1000 };
Object.defineProperty(globalThis, 'navigator', { value: { userAgent: 'node-test', maxTouchPoints: 0 }, configurable: true });
globalThis.Audio = class {
    constructor(src) { this.src = src; this.volume = 1; this.currentTime = 0; this.duration = NaN; this.loop = false; }
    play() { return Promise.resolve(); } pause() {} load() {} addEventListener() {}
};
const store = new Map();
globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
};
globalThis.requestAnimationFrame = () => 0;

const BASE = new URL('../js', import.meta.url).href;
const { Game } = await import(`${BASE}/Game.js`);
const { GAME_STATE } = await import(`${BASE}/constants.js`);

const game = new Game();
game.startGame(true);
await sleep(700);

const dismiss = () => { let n = 0; while (game.gameState === GAME_STATE.DIALOG && n++ < 10) game.handleKeyUp('e'); };
const findObj = (pred) => game.currentMap.objects.find(pred);
const interact = (pred, label) => {
    const o = findObj(pred);
    check(`${label}: object present on ${game.currentMapName}`, !!o);
    if (o) o.onInteract(game.player);
    return o;
};
const hasQuest = (id) => game.player.quests.some(q => q.id === id);
const questDone = (id) => { const q = game.player.quests.find(q2 => q2.id === id); return !!q && q.completed; };
const campTo = (choice) => { // 0 dawn, 1 dusk
    interact(o => o.objData.rest, 'campfire');
    check('camp choice opened', game.gameState === GAME_STATE.PUZZLE);
    game.handlePuzzleAnswer(choice);
    dismiss();
};

// ---------- reachability: every quest-critical object must have a clear standing spot beside it ----------
const standable = (obj) => {
    const spots = [
        [obj.centerX - 12, obj.y - 36],
        [obj.centerX - 12, obj.y + obj.height + 4],
        [obj.x - 28, obj.centerY - 16],
        [obj.x + obj.width + 4, obj.centerY - 16],
    ];
    return spots.some(([sx, sy]) =>
        sx >= 0 && sy >= 0 && sx <= 640 - 24 && sy <= 480 - 32 &&
        !game.currentMap.checkCollision(sx + 4, sy + 16, 16, 16));
};
const CRITICAL = {
    desert: [o => o.objData.rest, o => o.type === 'pickup_truck', o => o.type === 'palo_verde', o => o.type === 'water_source'],
    canyon: [o => o.objData.contains === 'artifact1', o => o.objData.timeGated, o => o.objData.rest, o => o.objData.contains === 'prickly_pear'],
    camelback: [o => o.objData.timeGated, o => o.objData.rest, o => o.objData.contains === 'prickly_pear', o => o.type === 'praying_monk'],
    papago_park: [o => o.type === 'hole_in_the_rock', o => o.objData.rest],
    canal_path: [o => o.type === 'footbridge', o => o.objData.toMap === 'hohokam_site', o => o.objData.toMap === 'papago_park', o => o.objData.shelter],
    hohokam_site: [o => o.objData.contains === 'artifact2', o => o.type === 'aligned_doorway', o => o.objData.rest],
    casa_grande: [o => o.type === 'great_house', o => o.objData.rest],
    sky_people_shrine: [o => o.type === 'horizon_marker', o => o.objData.rest],
    white_tanks_petroglyphs: [o => !!o.objData.questTrigger || (o.objData.questTriggerSpent), o => o.type === 'interactive_point' && o.objData.timeGated, o => o.objData.rest],
    ghost_town: [o => o.objData.toMap === 'superstition_mountains', o => o.objData.toMap === 'abandoned_mine'],
    abandoned_mine: [o => o.objData.contains === 'old_pickaxe'],
    superstition_mountains: [o => o.objData.questTrigger || o.objData.questTriggerSpent, o => o.objData.contains === 'rusted_canteen', o => o.objData.toMap === 'ghost_town'],
    asu_lab: [o => o.type === 'secret_panel', o => o.type === 'bookshelf', o => o.type === 'computer_terminal'],
    artifact_chamber: [o => o.objData.triggersPuzzle, o => o.objData.toMap === 'asu_lab', o => o.type === 'offering_ledge'],
};
let reachOk = true;
for (const [mapName, preds] of Object.entries(CRITICAL)) {
    game.changeMap(mapName, 320, 440);
    preds.forEach((pred, i) => {
        const o = findObj(pred);
        if (!o) { reachOk = false; console.log(`  MISSING critical object #${i} on ${mapName}`); return; }
        if (!standable(o)) { reachOk = false; console.log(`  UNREACHABLE: ${o.type} at (${o.x},${o.y}) on ${mapName}`); }
    });
}
check('all quest-critical objects have a clear standing spot', reachOk);

// ---------- BFS pathability: the canyon's walls must not seal any route ----------
game.changeMap('canyon', 50, 240);
const bfs = (startX, startY) => {
    const step = 8;
    const cols = Math.ceil(640 / step), rows = Math.ceil(480 / step);
    const seen = new Uint8Array(cols * rows);
    const free = (gx, gy) => {
        const x = gx * step, y = gy * step;
        if (x < 0 || y < 0 || x > 640 - 24 || y > 480 - 32) return false;
        return !game.currentMap.checkCollision(x + 4, y + 16, 16, 16);
    };
    const q = [[Math.round(startX / step), Math.round(startY / step)]];
    if (!free(q[0][0], q[0][1])) return { seen, cols, step };
    seen[q[0][1] * cols + q[0][0]] = 1;
    while (q.length) {
        const [gx, gy] = q.pop();
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nx = gx + dx, ny = gy + dy, idx = ny * cols + nx;
            if (nx < 0 || ny < 0 || nx >= cols || ny >= rows || seen[idx]) continue;
            if (free(nx, ny)) { seen[idx] = 1; q.push([nx, ny]); }
        }
    }
    return { seen, cols, step };
};
const reaches = (res, tx, ty, label) => {
    for (let gy = 0; gy * res.step < 480; gy++) {
        for (let gx = 0; gx < res.cols; gx++) {
            if (!res.seen[gy * res.cols + gx]) continue;
            if (Math.hypot(gx * res.step + 12 - tx, gy * res.step + 24 - ty) < 52) return true;
        }
    }
    console.log(`  NOT PATHABLE: ${label} at (${tx},${ty})`);
    return false;
};
const flood = bfs(50, 240); // west entrance
const targetsOk = [
    [findObj(o => o.objData.contains === 'artifact1'), 'artifact chest'],
    [findObj(o => o.objData.timeGated), 'noon beam'],
    [findObj(o => o.objData.rest), 'campfire'],
    [findObj(o => o.objData.contains === 'prickly_pear'), 'hermit tin'],
    [findObj(o => o.type === 'ancient_symbol'), 'spiral glyph'],
    [findObj(o => o.type === 'water_source'), 'water'],
    [findObj(o => o.objData.toMap === 'camelback'), 'east doorway'],
    [game.currentMap.npcs.find(n => n.name === 'Old Hermit'), 'hermit'],
].every(([o, label]) => o && reaches(flood, o.centerX, o.centerY, label));
check('canyon: every target pathable from the west entrance', targetsOk);

// Camelback: the climb must connect trailhead, terraces, summit, and both doors
game.changeMap('camelback', 50, 100); // arrive from the canyon
const flood2 = bfs(50, 100);
const monk = findObj(o => o.type === 'praying_monk');
const camelbackOk = [
    [findObj(o => o.objData.toMap === 'papago_park'), 'papago door', null],
    [findObj(o => o.type === 'sign'), 'trailhead sign', null],
    [findObj(o => o.objData.rest), 'campfire', null],
    [findObj(o => o.objData.timeGated), 'summit overlook', null],
    [findObj(o => o.objData.contains === 'prickly_pear'), 'summit cache', null],
    [monk, 'praying monk', [monk.centerX, monk.y + monk.height + 8]],
    [game.currentMap.npcs.find(n => n.name === 'Vance Cutler'), 'Cutler at the trailhead', null],
    [game.currentMap.npcs.find(n => n.name === 'Tired Hiker'), 'hiker mid-climb', null],
    [game.currentMap.npcs.find(n => n.name === 'Photographer'), 'photographer on the ridge', null],
].every(([o, label, pt]) => o && reaches(flood2, pt ? pt[0] : o.centerX, pt ? pt[1] : o.centerY, label));
check('camelback: trailhead-to-summit fully pathable', camelbackOk);

// Desert outskirts: the starting map must connect truck, water, and both exits
game.changeMap('desert', 320, 240);
const floodDesert = bfs(320, 240);
const desertOk = [
    [findObj(o => o.type === 'pickup_truck'), 'the truck', null],
    [findObj(o => o.type === 'water_source'), 'water', null],
    [findObj(o => o.objData.toMap === 'canyon'), 'canyon door', null],
    [findObj(o => o.objData.toMap === 'ghost_town'), 'ghost town door', null],
    [game.currentMap.npcs.find(n => n.name === 'Old Prospector'), 'prospector', null],
    [game.currentMap.npcs.find(n => n.name === 'UFO Watcher'), 'UFO watcher', null],
].every(([o, label]) => o && reaches(floodDesert, o.centerX, o.centerY, label));
check('desert outskirts: fully pathable from spawn', desertOk);

// ASU: lab and archive wings must connect, and the panel must be reachable
game.changeMap('asu_lab', 50, 240);
const floodAsu = bfs(50, 240);
const panelObj = findObj(o => o.type === 'secret_panel');
const asuOk = [
    [panelObj, 'secret panel', [panelObj.x - 14, panelObj.centerY]],
    [findObj(o => o.type === 'computer_terminal'), 'mainframe', null],
    [game.currentMap.objects.filter(o => o.type === 'bookshelf')[3], 'archive stacks', null],
    [game.currentMap.npcs.find(n => n.name === 'Grad Student'), 'grad student', null],
    [game.currentMap.npcs.find(n => n.name === 'Sparky'), 'Sparky', null],
    [findObj(o => o.objData.toMap === 'white_tanks_petroglyphs'), 'exit', null],
].every(([o, label, pt]) => o && reaches(floodAsu, pt ? pt[0] : o.centerX, pt ? pt[1] : o.centerY, label));
check('ASU lab: both wings pathable, panel reachable', asuOk);

// Back to the mountain for the hiker encounter
game.changeMap('camelback', 50, 100);

// The hiker encounter: sharing water costs, pays back, and records
game.player.hydration = 80;
const hiker = game.currentMap.npcs.find(n => n.name === 'Tired Hiker');
game.player.removeItem('prickly_pear');
hiker.onInteract(game.player); game.handleKeyUp('e');
check('hiker: water shared (-25 H2O), pear gained, recorded',
    game.player.hydration === 55 && game.player.hasItem('prickly_pear') &&
    game.player.quests.some(q => q.id === 'hiker_helped' && q.completed));
// Summit sightline reads at dawn
game.advanceToHour(6);
const overlook = findObj(o => o.objData.timeGated);
overlook.onInteract(game.player); game.handleKeyUp('e');
check('camelback sightline record at dawn', game.player.quests.some(q => q.id === 'camelback_sightline' && q.completed));

// ---------- the actual playthrough, in order ----------
game.startGame(true);
await sleep(700);

// 1. Prospector quest chain
game.changeMap('desert', 320, 440);
const prospector = game.currentMap.npcs.find(n => n.name === 'Old Prospector');
prospector.onInteract(game.player); dismiss();
check('prospector quest added', hasQuest('prospector_pickaxe'));
game.changeMap('abandoned_mine', 60, 240);
interact(o => o.objData.contains === 'old_pickaxe', 'pickaxe chest'); dismiss();
check('pickaxe obtained', game.player.hasItem('old_pickaxe'));
game.changeMap('desert', 320, 440);
game.currentMap.npcs.find(n => n.name === 'Old Prospector').onInteract(game.player); dismiss();
check('prospector quest completed', questDone('prospector_pickaxe'));

// 2. artifact1 in the canyon, plus the hermit's story and the noon beam
game.changeMap('canyon', 50, 240);
interact(o => o.objData.contains === 'artifact1', 'canyon chest'); dismiss();
check('artifact1 obtained', game.player.hasItem('artifact1'));
game.currentMap.npcs.find(n => n.name === 'Old Hermit').onInteract(game.player); dismiss();
check('hermit acknowledges the cache', questDone('hermit_blessing'));
game.advanceToHour(12);
interact(o => o.objData.timeGated, 'noon light-blade'); dismiss();
check('canyon_beam record earned at midday', questDone('canyon_beam'));

// 3. Papago at dawn: read the light
game.changeMap('papago_park', 50, 240);
campTo(0);
check('camp advanced to dawn', game.gameHour === 6, `hour ${game.gameHour}`);
interact(o => o.type === 'hole_in_the_rock', 'Hole-in-the-Rock'); dismiss();
check('alignment_light earned via interaction', hasQuest('alignment_light') && questDone('alignment_light'));

// 4. Cross the canal, get artifact2, read the doorway at dawn
game.changeMap('canal_path', 50, 380);
game.changeMap('hohokam_site', 50, 240);
interact(o => o.objData.contains === 'artifact2', 'olla shard chest'); dismiss();
check('artifact2 obtained', game.player.hasItem('artifact2'));
campTo(0);
interact(o => o.type === 'aligned_doorway', 'mound doorway'); dismiss();
check('alignment_doorway earned', questDone('alignment_doorway'));

// 5. Casa Grande at dusk (optional record)
game.changeMap('casa_grande', 50, 240);
campTo(1);
check('camp advanced to dusk', game.gameHour === 17, `hour ${game.gameHour}`);
interact(o => o.type === 'great_house', 'Great House'); dismiss();
check('casa_venus earned', questDone('casa_venus'));

// 6. South Mountain at dusk: read the horizon
game.changeMap('sky_people_shrine', 50, 240);
campTo(1);
interact(o => o.type === 'horizon_marker', 'horizon notch'); dismiss();
check('alignment_horizon earned', questDone('alignment_horizon'));

// 7. White Tanks: the star panel and the night sky
game.changeMap('white_tanks_petroglyphs', 50, 240);
interact(o => o.objData.questTrigger && o.objData.questTrigger.id === 'supernova_read', 'star panel'); dismiss();
check('artifact3 granted by star panel', game.player.hasItem('artifact3'));
check('supernova_read quest resolves (not stuck active)', questDone('supernova_read'),
    `-> ${JSON.stringify(game.player.quests.find(q => q.id === 'supernova_read'))}`);
game.advanceToHour(21);
interact(o => o.type === 'interactive_point' && o.objData.timeGated, 'night sky shelf'); dismiss();
check('scorpius_rising earned', questDone('scorpius_rising'));

// 8. Superstitions detour (the anticlimax record)
game.changeMap('ghost_town', 296, 40);
game.changeMap('superstition_mountains', 60, 240);
interact(o => o.objData.questTrigger && o.objData.questTrigger.id === 'dutchman_bust', 'Dutchman pit'); dismiss();
check('dutchman_bust resolves', questDone('dutchman_bust'));

// 9. ASU: the panel opens with items + readings earned in-game
game.changeMap('asu_lab', 50, 240);
const panel = findObj(o => o.type === 'secret_panel');
panel.onInteract(game.player);
check('panel opens on first try with everything earned', panel.objData.isNowPortal === true, `state ${game.gameState}`);
dismiss();
check('arrived in the vault', game.currentMapName === 'artifact_chamber');

// 10. The finale: first the offering, then the vigil
const pedestal = findObj(o => o.objData.triggersPuzzle);
pedestal.onInteract(game.player);
check('pedestal demands an offering first', game.gameState === GAME_STATE.DIALOG && !hasQuest('gift_left'));
dismiss();
const ledge = findObj(o => o.type === 'offering_ledge');
ledge.onInteract(game.player);
check('offering choice opens with a giftable item', game.gameState === GAME_STATE.PUZZLE && game.currentPuzzle.isOfferingChoice);
game.handlePuzzleAnswer(0); // leave the rusted canteen
check('canteen given up, gift recorded', !game.player.hasItem('rusted_canteen') && questDone('gift_left'));
dismiss();
pedestal.onInteract(game.player); dismiss();   // vigil to June 21 dawn
pedestal.onInteract(game.player);
await sleep(700);                               // shake
check('final puzzle opens', game.gameState === GAME_STATE.PUZZLE);
game.handlePuzzleAnswer(0); dismiss();          // correct
check('ending choice opens', game.gameState === GAME_STATE.PUZZLE && game.currentPuzzle.isEndingChoice);
game.handlePuzzleAnswer(2);
check('game finished: THE RETURN', game.gameState === GAME_STATE.WIN && game.endingTitle === 'THE RETURN');
check('main quest completed', questDone('main_artifact'));

// ---------- the user's complaint: what does the quest log look like at the end? ----------
const open = game.player.quests.filter(q => !q.completed);
console.log('\nFinal quest log:');
game.player.quests.forEach(q => console.log(`  [${q.completed ? 'x' : ' '}] ${q.id}: ${q.description}`));
check('no quest left incomplete at the end', open.length === 0, `open: ${open.map(q => q.id).join(', ')}`);

console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
