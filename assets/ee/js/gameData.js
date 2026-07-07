import { CANVAS_WIDTH, CANVAS_HEIGHT, HYDRATION_PER_DRINK, GAME_STATE } from './constants.js';

export function getObjectTypes() {
    return {
        cactus: { width: 32, height: 48, solid: true, color: '#2D7D40' },
        fruit_cactus: { name: "Prickly Pear", width: 32, height: 30, solid: true, interactive: true, color: '#3E7C4A', contains: 'prickly_pear', opened: false, text: "You pick a ripe prickly pear fruit. Mind the glochids." },
        rock: { width: 32, height: 32, solid: true, color: '#7D7064' },
        crater: { name: "Old Excavation", width: 80, height: 40, solid: false, interactive: true, text: "A backfilled excavation trench from a 1930s dig. They took what they wanted and wrote down almost nothing.", color: '#5B3A29' },
        chest: { width: 32, height: 32, solid: true, interactive: true, color: '#8B4513', opened: false },
        sign: { width: 32, height: 32, solid: false, interactive: true, color: '#DAA520' },
        interactive_point: { width: 32, height: 32, solid: false, interactive: true, color: '#DAA520' },
        petroglyph_panel: { name: "Petroglyphs", width: 48, height: 48, solid: false, interactive: true, color: '#8B4513' },
        ancient_symbol: { name: "Petroglyph Panel", width: 32, height: 32, solid: false, interactive: true, color: '#DAA520' },
        doorway: { width: 48, height: 16, solid: false, portal: true, color: '#555555', interactive: true },
        water_source: { width: 32, height: 32, solid: false, interactive: true, color: '#3377CC' },
        computer_terminal: { name: "Computer", width: 32, height: 32, solid: true, interactive: true, color: '#222222' },
        lab_bench: { name: "Lab Bench", width: 96, height: 32, solid: true, interactive: false, color: '#777777' },
        server_rack: { name: "Server Rack", width: 48, height: 128, solid: true, interactive: true, color: '#333333', text: "Humming servers... data unknown." },
        secret_panel: { name: "Loose Panel", width: 32, height: 48, solid: true, interactive: true, color: '#6B5B4B' },
        pedestal: {
            name: "Sealed Olla", width: 32, height: 32, solid: true, interactive: true, color: '#8888AA', opened: false, triggersPuzzle: true,
            puzzleDetails: {
                question: "The great star carved beside the star-scorpion. When did it blaze?",
                options: ["AD 1006", "AD 1054", "AD 1450"],
                correctAnswerIndex: 0
            }
        },
        hohokam_canal: { name: "Ancient Canal", width: 128, height: 32, solid: false, interactive: true, color: '#658EA9', text: "A canal alignment, nine hundred years old. The modern SRP canal two miles north follows this exact grade. The engineers of 1912 trusted the engineers of 1100." },
        platform_mound: { name: "Platform Mound", width: 96, height: 48, solid: true, interactive: true, color: '#B08D57', text: "An earthen platform mound. Whatever stood up here, the whole village could see it, and it could see the whole horizon." },
        sky_hole_wall: { name: "Observatory Wall", width: 32, height: 96, solid: true, interactive: true, color: '#A08C78', text: "A circular port in the caliche wall. At the summer solstice, the setting sun looks straight through it." },
        phoenix_statue: { name: "Phoenix Statue", width: 48, height: 48, solid: true, interactive: true, color: '#FF8C00', text: "The university's phoenix. A bird that rises. A statue that doesn't. Push what cannot fly..." },
        fire_pit: { name: "Fire Pit", width: 48, height: 32, solid: true, interactive: true, color: '#A0522D', text: "A hearth, rebuilt and re-used for centuries. Ash on ash on ash." },
        skull_turret: { name: "Carved Guardian", width: 32, height: 32, solid: true, interactive: false, color: '#E0E0E0' },
        tumbleweed: { name: "Tumbleweed", width: 24, height: 24, solid: false, interactive: false, color: '#A08050' },
        dead_tree: { name: "Dead Tree", width: 40, height: 56, solid: true, interactive: true, color: '#6B4226', text: "A sun-bleached ironwood. It was alive when Coronado passed through, give or take." },
        animal_bones: { name: "Animal Bones", width: 36, height: 20, solid: false, interactive: true, color: '#E8DCC8', text: "Bleached bones scattered in the sand. The desert doesn't curse anyone. It just doesn't care." },
        campfire_remains: { name: "Campsite", width: 32, height: 24, solid: false, interactive: true, rest: true, color: '#444' },
        desert_flower: { name: "Desert Flower", width: 16, height: 20, solid: false, interactive: true, color: '#FF69B4', text: "A resilient desert bloom. Everything old here was protected by something older." },
        trail_marker: { name: "Trail Marker", width: 20, height: 28, solid: true, interactive: true, color: '#B8860B' },
        sand_dune: { name: "Sand Dune", width: 80, height: 32, solid: false, interactive: false, color: '#D4B483' },
        // Ghost town
        old_building: { name: "Abandoned Building", width: 96, height: 80, solid: true, interactive: true, color: '#8A7358', text: "Boarded windows and a sagging roof. Nobody's home... probably." },
        saloon: { name: "Old Saloon", width: 128, height: 90, solid: true, interactive: true, color: '#9A8265', text: "The 'Golden Gulch Saloon'. The piano inside still seems to play on windy nights." },
        wagon: { name: "Broken Wagon", width: 64, height: 40, solid: true, interactive: true, color: '#6B4226', text: "A pioneer wagon, abandoned mid-journey. The wheel is snapped clean off." },
        barrel: { name: "Barrel", width: 20, height: 26, solid: true, interactive: true, color: '#7A5438', text: "An old rain barrel. Bone dry." },
        well: { name: "Town Well", width: 40, height: 44, solid: true, interactive: true, color: '#7D7064' },
        // Mine
        mine_portal: { name: "Mine Entrance", width: 56, height: 48, solid: false, portal: true, interactive: true, color: '#3A2B1A' },
        rail_track: { name: "Rail Track", width: 96, height: 16, solid: false, interactive: false, color: '#5A4D41' },
        mine_cart: { name: "Mine Cart", width: 40, height: 28, solid: true, interactive: true, color: '#4A4A52', text: "A rusted ore cart, still half-full of copper ore." },
        crystal: { name: "Copper Ore Vein", width: 24, height: 32, solid: true, interactive: true, color: '#66DDEE', text: "Chrysocolla and azurite: copper ore, blue-green in the lamplight. This is the 'blue glow' the miners sang about. Beautiful, and worth exactly enough to die for." },
        stalagmite: { name: "Stalagmite", width: 24, height: 32, solid: true, interactive: false, color: '#5F534B' },
        // White Tank Mountains
        tinaja: { name: "Tinaja", width: 44, height: 32, solid: false, interactive: true, color: '#B9CBD6', text: "A tinaja: a natural granite tank holding rainwater. The White Tanks are named for these. Cold, clear, and older than any story about them." },
        granite_boulder: { name: "Granite Boulder", width: 44, height: 40, solid: true, interactive: false, color: '#C8BEA8' },
        petroglyph_cliff: { name: "Petroglyph Cliff", width: 100, height: 64, solid: true, interactive: true, color: '#3A3546', text: "A whole cliff face crowded with petroglyphs: spirals, sheep, dancers, stars. Thousands of them across these hills. Not one is signed, and every one was meant to last." },
        // Casa Grande
        great_house: { name: "The Great House", width: 96, height: 130, solid: true, interactive: true, color: '#C9A876' },
        canopy_post: { name: "Canopy Post", width: 10, height: 120, solid: true, interactive: true, color: '#8A8A8A', text: "A steel post from the 1932 canopy, built to shield the ruins from the rain. Even the shelter is a relic now." },
        compound_wall: { name: "Compound Wall", width: 84, height: 22, solid: true, interactive: false, color: '#B89A6E' },
        ballcourt: { name: "Ballcourt", width: 120, height: 52, solid: false, interactive: true, color: '#B08D57', text: "A sunken oval ballcourt. The Hohokam played a rubber-ball game here, half sport, half ceremony. The cheering has been gone seven hundred years." },
        // ASU campus flavor
        sparky_statue: { name: "Sparky Statue", width: 40, height: 56, solid: true, interactive: true, color: '#8C1D40', text: "A bronze Sparky, pitchfork raised mid-jab. Some donor class of '58 paid for it. The plaque says FEAR THE FORK." },
        asu_banner: { name: "Sun Devils Banner", width: 84, height: 36, solid: true, interactive: true, color: '#8C1D40', text: "Maroon and gold: ARIZONA STATE SUN DEVILS. Someone has pinned a hand-drawn rose next to it. Big hopes for the fall season." },
        trophy_case: { name: "Trophy Case", width: 56, height: 44, solid: true, interactive: true, color: '#4A3A28', text: "Football and baseball hardware behind glass. There is an empty spot on the top shelf, dusted and waiting. The label reads: ROSE BOWL." },
        bulletin_board: { name: "Bulletin Board", width: 48, height: 40, solid: true, interactive: true, color: '#B08D57', text: "Flyers: 'COMPUTER CLUB, THURS 7PM.' 'GAMMAGE SUMMER ORGAN SERIES.' 'ROOMMATE WANTED, MILL AVE, NON-SMOKER.' And one in red marker: 'WHO KEEPS UNLOCKING THE BASEMENT?'" },
        potted_palm: { name: "Potted Palm", width: 28, height: 52, solid: true, interactive: true, color: '#3E7C4A', text: "A fan palm in a terracotta pot. A tiny piece of Palm Walk, indoors." },
        // Archaeoastronomy
        hole_in_the_rock: { name: "Hole-in-the-Rock", width: 110, height: 80, solid: true, interactive: true, color: '#C97B5A' },
        aligned_doorway: { name: "Aligned Doorway", width: 64, height: 48, solid: true, interactive: true, color: '#B08D57' },
        horizon_marker: { name: "Horizon Notch", width: 72, height: 40, solid: true, interactive: true, color: '#4A3B2A' },
        survey_flag: { name: "Survey Flag", width: 14, height: 26, solid: false, interactive: true, color: '#FF6A00', text: "Orange surveyor's tape, tied fresh. Someone is mapping this ground, and it isn't the city." },
        looter_pit: { name: "Looter's Pit", width: 48, height: 28, solid: false, interactive: true, color: '#3A2B1A' },
        // The Arizona Canal traversal
        srp_canal: { name: 'Arizona Canal', width: 280, height: 56, solid: true, interactive: true, color: '#2A5A8A', text: "Cold, fast, and older than it looks. The flow runs east. Even blind, you could follow it." },
        footbridge: { name: 'Footbridge', width: 64, height: 64, solid: false, interactive: false, color: '#8A6B45' },
        wind_chime: { name: 'Wind Chime', width: 16, height: 30, solid: false, interactive: true, color: '#C8C8A8', text: "Copper tubes on braided wire, hung by the lock keeper's door. In a dust wall you'd hear it fifty yards off. That's not decoration. That's navigation." },
        // The Superstitions
        stone_needle: { name: "Weaver's Needle", width: 56, height: 110, solid: true, interactive: true, color: '#6B5B4A', text: "The Needle. Every version of the Dutchman legend triangulates from it, and every summer it watches somebody die of certainty. It is a rock. It keeps no gold and no opinions." },
        // Blacklight finds: invisible without the UV lamp in the dark
        uv_trace: { name: 'UV Trace', width: 36, height: 26, solid: false, interactive: true, uv: true, color: '#224422' },
        // The vault threshold: leave something, permanently, before you take
        offering_ledge: { name: 'Offering Ledge', width: 48, height: 26, solid: true, interactive: true, color: '#6A5A6A' },
        // Red Rock Canyon
        canyon_wall: { name: 'Canyon Wall', width: 160, height: 100, solid: true, interactive: false, color: '#A0522D' },
        balanced_rock: { name: 'Balanced Rock', width: 56, height: 72, solid: true, interactive: true, color: '#B0603A', text: "A boulder the size of a truck balanced on a neck of stone the size of a fencepost. It has been about to fall for ten thousand years. The desert is not in a hurry." },
        dry_wash: { name: 'Dry Wash', width: 490, height: 30, solid: false, interactive: false, groundLayer: true, color: '#D8B98C' },
        // Desert outskirts
        pickup_truck: { name: "Walker's Truck", width: 76, height: 44, solid: true, interactive: true, color: '#4E8A8A', text: "Your truck. A '61 Ford, older than half your students and better company. The seat still holds the shape of the drive out. It will wait. It's good at that." },
        palo_verde: { name: 'Palo Verde', width: 64, height: 72, solid: true, interactive: true, color: '#7A9A4A', text: "A palo verde, green-barked and patient, with a young saguaro growing in its shade. Nurse trees: every old giant in this desert spent its first fifty years protected by something older." },
        // Indoors (ASU)
        interior_wall: { name: 'Wall', width: 20, height: 220, solid: true, interactive: false, color: '#8A8578' },
        bookshelf: { name: 'Archive Stacks', width: 70, height: 100, solid: true, interactive: true, color: '#6B4A2E', text: "Hayden Library overflow: bound theses, survey ledgers, boxed field notes. Every drawer a career. Most of them unopened since their author died." },
        // Camelback Mountain
        mountain_slope: { name: 'Mountain Slope', width: 200, height: 60, solid: true, interactive: false, color: '#8A8A72' },
        praying_monk: { name: 'The Praying Monk', width: 60, height: 92, solid: true, interactive: true, color: '#C1583A', text: "A red sandstone figure kneeling at the camel's head, hands together, facing east. Climbers rope up its spine; the monk doesn't mind. It has faced the sunrise for twenty million years, which is one way to pray." },
        trail_path: { name: 'Trail', width: 80, height: 24, solid: false, interactive: false, groundLayer: true, color: '#C9B189' },
    };
}

export function getEnemyTypes() {
    return {
        scorpion: { name: 'Scorpion', width: 32, height: 28, damage: 5, speed: 0.8, health: 30, color: '#704214', solid: true, interactive: true },
        // Audio-first hazard: rattles before you see it, holds its ground, only
        // strikes if you keep pressing in. Backing off always de-escalates.
        snake: { name: 'Rattlesnake', width: 40, height: 12, damage: 12, speed: 2.2, health: 20, color: '#006400', solid: false, interactive: true, rattler: true, warnRange: 120, strikeRange: 64, venom: true },
        coyote: { name: 'Coyote', width: 40, height: 28, damage: 10, speed: 1.5, health: 50, color: '#B8860B', solid: true, interactive: true },
        spider: { name: 'Giant Spider', width: 36, height: 32, damage: 7, speed: 1.1, health: 40, color: '#3A3A3A', solid: true, interactive: false },
        attacking_ghost: { name: 'Restless Spirit', width: 24, height: 32, damage: 6, speed: 1.3, health: 35, color: '#A0B0D0', isEthereal: true, aggroRange: 180, solid: false, interactive: true },
        gila_monster: { name: 'Gila Monster', width: 36, height: 18, damage: 12, speed: 0.6, health: 60, color: '#E2725B', solid: true, interactive: true },
        vulture: { name: 'Vulture', width: 36, height: 24, damage: 6, speed: 1.7, health: 25, color: '#3B2F2F', isFlying: true, circles: true, aggroRange: 200, solid: false, interactive: false },
        javelina: { name: 'Javelina', width: 42, height: 30, damage: 14, speed: 1.9, health: 70, color: '#4A4038', charges: true, aggroRange: 170, solid: true, interactive: true },
        bat: { name: 'Cave Bat', width: 20, height: 14, damage: 4, speed: 1.9, health: 15, color: '#1A1A22', isFlying: true, erratic: true, aggroRange: 160, solid: false, interactive: false },
    };
}

export function getCritterTypes() {
    return {
        jackrabbit: { name: 'Jackrabbit', width: 22, height: 18, speed: 1.2, fleeRange: 85 },
        roadrunner: { name: 'Roadrunner', width: 26, height: 20, speed: 1.9, fleeRange: 75 },
        lizard: { name: 'Lizard', width: 18, height: 10, speed: 0.9, fleeRange: 50 },
        quail: { name: 'Quail', width: 18, height: 16, speed: 1.0, fleeRange: 70 },
        tortoise: { name: 'Desert Tortoise', width: 26, height: 18, speed: 0.2, fleeRange: 0 },
        // Waits at a distance, trots ahead when you follow, gone after the last
        // waypoint. The game never says whether it's the same coyote.
        guide_coyote: { name: 'Coyote', width: 40, height: 28, speed: 1.5, fleeRange: 0, guide: true },
    };
}

export function getItemTypes() {
    return {
        canteen: {
            name: 'Canteen', description: 'Keeps you hydrated. Refill at water sources.',
            useFunc: (game) => {
                if (game.player.hydration < game.player.maxHydration) {
                    game.player.hydrate(HYDRATION_PER_DRINK);
                    game.ui.showDialog("You take a drink of water.", "Canteen");
                    game.sound.playSound('drink');
                } else {
                    game.ui.showDialog("You're not thirsty right now.", "Canteen");
                }
                game.setGameState(GAME_STATE.DIALOG);
            }
        },
        compass: {
            name: 'Field Map', description: "Walker's map of the Salt River Valley. The alignments draw themselves in as you read them. (M)",
            useFunc: (game) => game.openMap()
        },
        pocket_computer: {
            name: 'Model 100', description: "Your pocket computer: a Tandy Model 100 in a leather satchel. Logs the sky and keeps the count. The UV lamp clips to it.",
            useFunc: (game) => {
                const p = game.player;
                const date = game.gameDate;
                const hour = game.gameHour;
                const min = Math.floor((game.gameTime % 3600) / 60);
                const dateLabel = date <= 30 ? `JUN ${date}` : `JUL ${date - 30}`;
                const records = ['artifact1', 'artifact2', 'artifact3'].filter(k => p.hasItem(k)).length;
                const readings = ['alignment_light', 'alignment_doorway', 'alignment_horizon'].filter(id => p.quests.some(q => q.id === id)).length;
                const toSolstice = 21 - date;
                const solsticeLine = toSolstice > 0 ? `SOLSTICE IN ${toSolstice} DAY${toSolstice === 1 ? '' : 'S'}`
                    : (toSolstice === 0 ? 'SOLSTICE: TODAY' : 'SOLSTICE PASSED');
                game.ui.showDialog(
                    `TRS-80 MODEL 100 · ${dateLabel} 1986, ${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')} · ` +
                    `DAWN READS 05:00-08:00 · DUSK READS 17:00-20:00 · ${solsticeLine} · ` +
                    `RECORDS ${records}/3 · READINGS ${readings}/3` +
                    (p.venomTicks > 0 ? ' · !! VENOM IN BLOOD: EAT PRICKLY PEAR' : ''),
                    "Model 100");
                game.setGameState(GAME_STATE.DIALOG);
            }
        },
        newspaper: {
            name: 'Arizona Republic', description: 'June 5, 1986. Two stories on one page.',
            useFunc: (game) => {
                game.ui.showDialog("Page B1: 'GRADING CREW CUTS INTO ANCIENT CANAL NEAR AIRPORT. City archaeologists given two weeks for salvage before the pour, scheduled Monday, June 23.' Page B7: 'READER CLAIMS MOUNTAIN CARVING SHOWS EXPLODING STAR.' The letter is signed only: 'A Watcher of Skies.'", "Arizona Republic");
                game.setGameState(GAME_STATE.DIALOG);
            }
        },
        field_notebook: {
            name: '1956 Field Notebook', description: 'Your own field notes, thirty years old.',
            useFunc: (game) => {
                game.ui.showDialog("One page is dog-eared soft: a sketch from the White Tank Mountains: a scorpion of stars beside a circle far too bright to be the moon. Under it, in your own young handwriting: 'What is this? Ask someone who knows.'", "1956 Notebook");
                game.setGameState(GAME_STATE.DIALOG);
            }
        },
        journal: { name: 'Journal', description: 'Contains research notes and quests.', useFunc: (game) => game.ui.toggleQuestLog() },
        prickly_pear: {
            name: 'Prickly Pear', description: 'A sweet cactus fruit. Restores 35 HP and clears rattlesnake venom.',
            stackable: true, maxStack: 5,
            useFunc: (game) => {
                const p = game.player;
                const venomous = p.venomTicks > 0;
                if (p.health < p.maxHealth || venomous) {
                    p.heal(35);
                    p.venomTicks = 0;
                    p.removeItem('prickly_pear');
                    game.sound.playSound('drink');
                    game.ui.showDialog(venomous
                        ? "You eat the prickly pear, seeds and all. The fruit settles your blood and the venom's grip loosens. (+35 HP, venom cleared)"
                        : "You eat the prickly pear. Sweet and restoring! (+35 HP)", "Prickly Pear");
                } else {
                    game.ui.showDialog("You're at full health. Better save it for later.", "Prickly Pear");
                }
                game.setGameState(GAME_STATE.DIALOG);
            }
        },
        old_pickaxe: { name: 'Old Pickaxe', description: "The Prospector's beloved pickaxe. Rusty but sturdy." },
        rusted_canteen: { name: 'Rusted Canteen', description: "A 1930s army canteen, holed by rust, found beside an empty hole in the Superstitions. Worth nothing. Says everything." },
        blacklight: {
            name: 'UV Lamp', description: 'A computer-club blacklight that clips to the pocket computer. In the dark it shows what the sun hides.',
            useFunc: (game) => {
                game.ui.showDialog(game.uvActive
                    ? "The lamp hums violet. Scorpions burn green in the dark, and here and there the rock itself remembers things: pigment, chalk, mineral. Look close at the old places."
                    : "The lamp needs darkness to say anything. Wait for night, or take it underground.", "UV Lamp");
                game.setGameState(GAME_STATE.DIALOG);
            }
        },
        lucky_charm: { name: 'Lucky Rabbit Foot', description: 'A worn charm from a braver era. It feels... lucky.' },
        artifact1: { name: 'Calendar Stick Fragment', description: 'Half of a notched wooden record. The counts are dates, day-counts toward something. One of three records.' },
        artifact2: { name: 'Etched Olla Shard', description: 'Pottery shard etched with canal lines and notch counts. One of three records.' },
        artifact3: { name: 'Star Chart Rubbing', description: 'Charcoal rubbing of the 1006 star panel, made with your own hands. One of three records.' },
        final_artifact: { name: 'Calendar Stick', description: 'Four centuries of sky and water, carved notch by notch. It is not yours to keep.' },
    };
}

export function getMaps() {
    return {
        desert: {
            name: 'Sonoran Desert Outskirts', background: '#E2C9A1',
            objects: [
                // The road ends here: Walker's truck, and a track east into the hills
                { type: 'pickup_truck', x: 24, y: 168 },
                { type: 'trail_path', x: 104, y: 236, width: 488, height: 26 },
                { type: 'trail_path', x: 284, y: 262, width: 40, height: 202 },
                { type: 'cactus', x: 100, y: 80 },
                { type: 'cactus', x: 430, y: 120 },
                { type: 'cactus', x: 480, y: 380 },
                { type: 'cactus', x: 60, y: 400 },
                { type: 'palo_verde', x: 430, y: 290 },
                { type: 'rock', x: 250, y: 176 },
                { type: 'rock', x: 350, y: 50, width: 40, height: 32 },
                { type: 'rock', x: 550, y: 300, width: 48, height: 36 },
                { type: 'sand_dune', x: 150, y: 360 },
                { type: 'dead_tree', x: 180, y: 292 },
                { type: 'campfire_remains', x: 170, y: 150 },
                { type: 'fruit_cactus', x: 230, y: 350 },
                { type: 'desert_flower', x: 360, y: 180 },
                { type: 'tumbleweed', x: 280, y: 110 },
                { type: 'trail_marker', x: 550, y: 190, text: "The canyon entrance lies ahead." },
                { type: 'sign', x: 140, y: 200, text: "Caution: desert conditions. Between 11 and 4 the sun is not negotiable. Travel at dawn and dusk." },
                { type: 'interactive_point', x: 380, y: 384, text: "Lizard tracks crisscross the sand. Something heavier passed through too: tire tracks, out-of-state tread." },
                { type: 'interactive_point', x: 560, y: 430, text: "A lawn chair, a thermos, and a spiral notebook: sightings, times, azimuths, weather. Say what you like about the man; he takes DATA." },
                { type: 'water_source', x: 50, y: 300 },
                { type: 'doorway', x: CANVAS_WIDTH - 48, y: 232, toMap: 'canyon', toX: 50, toY: 240, text: "To Canyon" },
                { type: 'doorway', x: 296, y: CANVAS_HEIGHT - 16, toMap: 'ghost_town', toX: 296, toY: 40, text: "To Old Town" }
            ],
            npcs: [
                { name: 'Ranger Rick', x: 200, y: 300, dialog: [
                    "Howdy, Professor! Dehydration is no joke out here. Rest at a campsite if you're caught out past dusk — or wait out the midday heat there for the evening light.",
                    "Keep that canteen over half full and your body mends itself. Water is life out here. For worse wounds, look for prickly pear with ripe red fruit on top.",
                    "Got a map? Press M and get your bearings. A man who knows where the mountains sit never counts as lost.",
                    "You read the Republic this morning? Grading crew hit canal features by the airport. Salvage crew's got two weeks. Breaks your heart.",
                    "If you're heading east, watch for rattlers near the rocks. You'll hear them before you see them. And if a roadrunner's working a patch of ground, cross THERE — they eat the things that bite.",
                    "See hawks wheeling tight over one spot? Harris's hawks, they hunt as a family — only raptor that does. Whatever they're circling, something's down there worth a look.",
                    "Press F to swing your walking stick if the wildlife gets too bold. Most of it just wants to be left alone."
                ]},
                { name: 'Old Prospector', x: 100, y: 440, dialog: (player, game) => {
                    const q = player.quests.find(q => q.id === 'prospector_pickaxe');
                    if (!q) {
                        player.addQuest({ id: 'prospector_pickaxe', description: "Find the Prospector's pickaxe in the Abandoned Mine.", completed: false });
                        return "Lost my trusty pickaxe down in the old copper mine, past the ghost town south of here. Too many bats for these old bones. Fetch it, and I'll tell you a secret worth more than gold!";
                    }
                    if (!q.completed && player.hasItem('old_pickaxe')) {
                        player.completeQuest('prospector_pickaxe');
                        return "My pickaxe! Bless you, Professor! Now listen close... at the university, the ancients' door hides behind the Phoenix. Push what cannot fly.";
                    }
                    if (q.completed) return "Push what cannot fly, Professor. Remember it.";
                    return "The mine's south of here, through the ghost town. Watch for bats, and mind the gila monsters!";
                }},
                { name: 'UFO Watcher', x: 520, y: 400, dialog: (() => {
                    let i = 0;
                    const lines = [
                        "Shhh! I'm listening... they broadcast on 1420 megahertz, you know.",
                        "You saw my letter in the Republic? 'A Watcher of Skies'? That's me! The carving in the White Tanks. A star that EXPLODED, professor. I know how it sounds.",
                        "Three nights ago a light zigzagged over the White Tanks. The Air Force says flares. Flares don't zigzag. ...Do they?",
                        "Go look at the carving yourself. You're the expert. Just... tell me what it is. Even if it isn't what I want it to be."
                    ];
                    return (player) => {
                        if (player.quests.find(q => q.id === 'supernova_read')) {
                            return "You read the panel? A supernova. The year 1006. They charted it with their own eyes and counted the days, nine hundred years before radio telescopes. I wrote that letter hoping for visitors. This is better. Professor, this is BETTER.";
                        }
                        return lines[i++ % lines.length];
                    };
                })()}
            ],
            enemies: [
                { type: 'scorpion', x: 300, y: 400 },
                { type: 'snake', x: 450, y: 90 },
                { type: 'coyote', x: 380, y: 300 }
            ],
            critters: [
                { type: 'jackrabbit', x: 240, y: 300 },
                { type: 'roadrunner', x: 420, y: 400 },
                { type: 'tortoise', x: 500, y: 200 },
                { type: 'guide_coyote', x: 560, y: 140, path: [[420, 200], [240, 240], [90, 290]] }
            ]
        },
        canyon: {
            name: 'Red Rock Canyon', background: '#BC6C25',
            objects: [
                // Slot canyon walls: a shaded north corridor, a central cache
                // chamber, and the wash running out the south — the fast route,
                // and the wrong place to linger.
                { type: 'canyon_wall', x: 0, y: 40, width: 160, height: 100 },
                { type: 'canyon_wall', x: 240, y: 0, width: 140, height: 150 },
                { type: 'canyon_wall', x: 170, y: 220, width: 130, height: 120 },
                { type: 'canyon_wall', x: 420, y: 120, width: 100, height: 150 },
                { type: 'canyon_wall', x: 60, y: 380, width: 200, height: 90 },
                { type: 'canyon_wall', x: 380, y: 380, width: 140, height: 100 },
                { type: 'canyon_wall', x: 570, y: 210, width: 70, height: 110 },
                { type: 'balanced_rock', x: 470, y: 24 },
                // The wash
                { type: 'dry_wash', x: 150, y: 342 },
                { type: 'interactive_point', x: 240, y: 344, text: "Flood-tumbled gravel, swept clean. Brush and a bleached cooler hang in the debris line six feet up the wall. When it rains somewhere you can't see, this fills in seconds. Never camp in a wash." },
                // The cache chamber
                { type: 'chest', x: 340, y: 190, contains: 'artifact1', text: "Wrapped in oilcloth inside: half of a notched wooden stick. The oilcloth is modern. Someone cached this here recently. Someone is protecting it." },
                { type: 'crater', x: 315, y: 275, width: 100, height: 50 },
                { type: 'interactive_point', x: 375, y: 240, lightBeam: true, timeGated: {
                    startHour: 11, endHour: 16,
                    successText: "Noon. Sunlight drops straight down the slot and stands on the canyon floor like a blade: one burning column with dust swimming inside it. The deadliest hour of the desert day, spending itself on being beautiful for nobody. You keep to the shade and watch.",
                    failText: "A gap in the rim, high overhead. The floor below it is polished pale in one spot, the way stone gets when light has stood in the same place a million noons. Come back at midday. If you can bear to be out in it.",
                    record: { id: 'canyon_beam', description: 'Watched the noon light-blade stand in Red Rock Canyon.', completed: true }
                }},
                // West entry: the hermit's camp, pitched above the debris line
                { type: 'water_source', x: 30, y: 150 },
                { type: 'campfire_remains', x: 36, y: 300 },
                { type: 'fruit_cactus', x: 108, y: 330 },
                { type: 'ancient_symbol', x: 205, y: 182, text: "A single spiral pecked into the varnish, chest-high. Hohokam hands, a long walk from the river. Even out here, somebody was keeping count of something." },
                { type: 'uv_trace', x: 240, y: 178, questTrigger: {
                    id: 'uv_spiral', completed: true,
                    description: 'UV: the canyon spiral trails a painted tail of dots.',
                    startText: "Under the lamp the pecked spiral grows a tail: a sweep of pigment dots curving off toward the east rim. A pointer, or a count, or both. Either way, it isn't done saying things."
                }},
                // Past the wash: a cache for whoever bothers to look
                { type: 'chest', x: 596, y: 420, contains: 'prickly_pear', text: "A tobacco tin wedged in the rocks, lid weighted with a stone. Inside, a prickly pear wrapped in a page of the 1971 Republic. The hermit's habit: leave a place better stocked than you found it." },
                { type: 'cactus', x: 538, y: 424 },
                { type: 'animal_bones', x: 530, y: 350 },
                { type: 'tumbleweed', x: 322, y: 158 },
                { type: 'desert_flower', x: 296, y: 156 },
                { type: 'doorway', x: 0, y: 232, toMap: 'desert', toX: CANVAS_WIDTH - 70, toY: 240, text: "To Desert" },
                { type: 'doorway', x: CANVAS_WIDTH - 48, y: 100, toMap: 'camelback', toX: 50, toY: 100, text: "To Mt." }
            ],
            npcs: [
                { name: 'Old Hermit', x: 100, y: 190, dialog: (() => {
                    let i = 0;
                    const before = [
                        "You walk like a man following directions. Whose, I wonder.",
                        "Eleven years I've kept this canyon. Kept, not owned. That's a difference your colleagues never learned.",
                        "A man came through in March. City hat, dying slow and knowing it. He buried something up the slot and stood over it a long while, bare-headed in the sun. I let the place keep it.",
                        "Camp on the high ground, professor. The wash is the fast way through, and the fast way is how the flood likes you.",
                        "The earth groans under the weight of secrets. Some are best left buried... or returned to whoever buried them first."
                    ];
                    return (player) => {
                        if (player.hasItem('artifact1')) {
                            if (!player.quests.find(q => q.id === 'hermit_blessing')) {
                                player.addQuest({ id: 'hermit_blessing', description: "The Hermit: the dying man said someone would come who'd know what the stick counted.", completed: true });
                                return "So you found his cache. Easy, professor — I'm not the digging kind. The man who buried it said someone would come along who'd know what the counting meant. And he said: tell him the rest is where the water was. I supposed that meant something to somebody. Now it's yours to suppose.";
                            }
                            return "'The rest is where the water was,' he said. Canals, tanks, rivers... this whole valley is where the water was. A cruel way to leave a clue. Or a patient one.";
                        }
                        return before[i++ % before.length];
                    };
                })()}
            ],
            enemies: [
                { type: 'snake', x: 200, y: 60 },
                { type: 'gila_monster', x: 330, y: 352 },
                { type: 'coyote', x: 390, y: 300 },
                { type: 'vulture', x: 550, y: 370 }
            ],
            critters: [
                { type: 'lizard', x: 140, y: 250 },
                { type: 'quail', x: 60, y: 330 },
                { type: 'quail', x: 84, y: 342 },
                { type: 'jackrabbit', x: 590, y: 445 }
            ]
        },
        camelback: {
            name: 'Camelback Mountain Trail', background: '#A0B084',
            objects: [
                // Three terraces climbing south-to-north, linked by switchback
                // gaps: east gap up from the trailhead, west gap up to the summit.
                { type: 'mountain_slope', x: 0, y: 330, width: 460, height: 60 },
                { type: 'mountain_slope', x: 560, y: 330, width: 80, height: 60 },
                { type: 'mountain_slope', x: 100, y: 120, width: 540, height: 60 },
                { type: 'mountain_slope', x: 120, y: 0, width: 120, height: 64 },
                // The trail itself, worn into the mountain
                { type: 'trail_path', x: 60, y: 420, width: 420, height: 26 },
                { type: 'trail_path', x: 486, y: 330, width: 48, height: 70 },
                { type: 'trail_path', x: 140, y: 280, width: 380, height: 26 },
                { type: 'trail_path', x: 30, y: 150, width: 48, height: 140 },
                { type: 'trail_path', x: 250, y: 72, width: 180, height: 24 },
                // Trailhead (bottom terrace)
                { type: 'sign', x: 60, y: 440, text: "Echo Canyon Trailhead. Carry water. The mountain doesn't." },
                { type: 'campfire_remains', x: 560, y: 430 },
                { type: 'animal_bones', x: 350, y: 448 },
                { type: 'cactus', x: 20, y: 396 },
                { type: 'trail_marker', x: 470, y: 398 },
                // Mid terrace: the climb
                { type: 'interactive_point', x: 220, y: 236, text: "Halfway up. Below, the 1986 city quits at the mountain's feet: orange groves, then open desert. Enjoy the view. It's the last summer it will look like this." },
                { type: 'fruit_cactus', x: 100, y: 250 },
                { type: 'cactus', x: 300, y: 200 },
                { type: 'desert_flower', x: 250, y: 312 },
                { type: 'desert_flower', x: 420, y: 300 },
                { type: 'tumbleweed', x: 450, y: 240 },
                { type: 'trail_marker', x: 500, y: 296 },
                { type: 'trail_marker', x: 90, y: 302 },
                { type: 'rock', x: 560, y: 260, color: '#8A8A72' },
                // Summit ridge: the monk, the echo, and the lesson
                { type: 'praying_monk', x: 440, y: 0 },
                { type: 'interactive_point', x: 176, y: 84, text: "ECHO CANYON. Shout here and the rock hands your voice back a half-second late, unimpressed. The mountain has heard it all." },
                { type: 'interactive_point', x: 320, y: 36, timeGated: {
                    startHour: 5, endHour: 8,
                    successText: "First light comes up over the Superstitions and runs west along the valley like a fuse: Papago's red buttes catch, then the mound by the airport, then the dark ridge of South Mountain. One line. Nobody arranges mountains. But somebody noticed the arrangement, and built to agree with it.",
                    failText: "Scenic overlook. From up here the valley's peaks line up like beads on a string: Papago's buttes, the mound by the airport, the ridge of South Mountain. Almost like it's arranged. You'd want first light to be sure.",
                    record: { id: 'camelback_sightline', description: 'Dawn from Camelback: the valley peaks light up in one line.', completed: true }
                }},
                { type: 'chest', x: 600, y: 50, contains: 'prickly_pear', text: "A climber's cache tucked behind the monk: a prickly pear in a bandana, left for whoever needs it worse. Mountain manners." },
                { type: 'doorway', x: 0, y: 100, toMap: 'canyon', toX: CANVAS_WIDTH - 70, toY: 100, text: "To Canyon" },
                { type: 'doorway', x: CANVAS_WIDTH - 48, y: 200, toMap: 'papago_park', toX: 50, toY: 240, text: "To Papago" }
            ],
            npcs: [
                // Sharing water is the mountain's real lesson: it costs you
                { name: 'Tired Hiker', x: 350, y: 288, dialog: (player, game) => {
                    if (player.quests.find(q => q.id === 'hiker_helped')) {
                        return "I owe you one, professor. It's all downhill from here. For me, I mean. Literally.";
                    }
                    if (player.hydration > 50) {
                        player.hydration -= 25;
                        game.ui.updateHydration(player.hydration, player.maxHydration);
                        const gavePear = player.addItem('prickly_pear');
                        player.addQuest({ id: 'hiker_helped', description: 'Shared your water with a dry hiker on Camelback.', completed: true });
                        return "Water... you're a saint. " + (gavePear
                            ? "Here — prickly pear, picked it lower down, can't stomach the seeds. "
                            : "I'd pay you back, but you're better provisioned than I am. So take a tip instead: ")
                            + "Be on the summit at FIRST LIGHT some morning. The whole valley lines up. Worth the climb twice.";
                    }
                    return "Almost... at the top... came up with half a canteen like an idiot. Don't share if you can't spare it, professor. This mountain doesn't forgive twice.";
                }},
                { name: 'Vance Cutler', x: 170, y: 420, dialog: [
                    "Jim Walker! Twenty years, and you still haven't bought a better hat. Vance Cutler. Don't make that face. I'm legitimate now. Mostly.",
                    "I'm taking a crew into the Superstitions. Dutchman gold, Jim. The signs finally line up. Come along. The split beats a pension.",
                    "Still reading rocks for free? Everything old is worth something to somebody. That's not cynicism, that's appraisal.",
                    "Suit yourself, old friend. If you beat me to anything out there... I'll make you a fair offer. I always do."
                ]},
                { name: 'Photographer', x: 260, y: 84, dialog: [
                    "Hold still, the light is PERFECT right now.",
                    "I've shot sunrises on six continents, but nothing beats the crimson evening out here. That's what the O'odham call it, a fella told me.",
                    "Caught a javelina on film yesterday. Don't call them pigs, and don't get between a mother and her young. That's all the wisdom I have."
                ]}
            ],
            enemies: [
                { type: 'snake', x: 490, y: 352 },
                { type: 'javelina', x: 300, y: 430 },
                { type: 'javelina', x: 344, y: 414 },
                { type: 'gila_monster', x: 560, y: 236 },
                { type: 'vulture', x: 350, y: 96 }
            ],
            critters: [
                { type: 'quail', x: 140, y: 300 },
                { type: 'quail', x: 162, y: 312 },
                { type: 'lizard', x: 600, y: 440 },
                { type: 'roadrunner', x: 240, y: 430 }
            ]
        },
        papago_park: {
            name: 'Papago Park', background: '#D89B6A',
            objects: [
                { type: 'hole_in_the_rock', x: 250, y: 90, timeGated: {
                    startHour: 5, endHour: 8,
                    successText: "First light pours through the opening and creeps across the chamber floor to a shallow pecked basin. Today it stops just short of center. Notch by notch, day by day, the light is walking toward the solstice.",
                    failText: "A natural chamber in the sandstone, open to the east. The floor bears a worn, pecked basin, polished by centuries of watching feet. Come back at first light.",
                    record: { id: 'alignment_light', description: 'Read the dawn light at Hole-in-the-Rock.', completed: true }
                }},
                { type: 'rock', x: 80, y: 140, width: 56, height: 44, color: '#C97B5A' },
                { type: 'rock', x: 480, y: 120, width: 64, height: 48, color: '#B96E4E' },
                { type: 'water_source', x: 120, y: 340 },
                { type: 'sign', x: 200, y: 300, text: "Papago Park, City of Phoenix. Fishing ponds stocked seasonally. Please respect the buttes." },
                { type: 'interactive_point', x: 380, y: 250, text: "Herons stalk the pond edge, ignoring the city entirely. The red buttes glow like coals at dusk." },
                { type: 'campfire_remains', x: 460, y: 380 },
                { type: 'fruit_cactus', x: 340, y: 330 },
                { type: 'cactus', x: 40, y: 120 },
                { type: 'cactus', x: 560, y: 300 },
                { type: 'desert_flower', x: 300, y: 400 },
                { type: 'tumbleweed', x: 200, y: 430 },
                { type: 'doorway', x: 0, y: 232, toMap: 'camelback', toX: CANVAS_WIDTH - 70, toY: 200, text: "To Camelback" },
                { type: 'doorway', x: CANVAS_WIDTH - 48, y: 232, toMap: 'canal_path', toX: 50, toY: 380, text: "To the Canal" }
            ],
            npcs: [
                { name: 'Morning Fisherman', x: 180, y: 380, dialog: [
                    "City stocks the ponds with trout. The herons figured that out before I did.",
                    "That butte with the hole clean through it? At dawn the sun crawls right across the floor inside. My grandfather called it a church.",
                    "Best hour out here is the first one. Everything after is just heat."
                ]},
                { name: 'Lost Tourist', x: 470, y: 330, dialog: [
                    "Oh thank goodness, a person. Is this the way to the zoo? The map at the trailhead was mostly a drawing of a lizard.",
                    "I have passed that same red rock three times now. Unless it's three different red rocks. Do rocks migrate?",
                    "The fishing fella said 'follow the water uphill.' That's a RIDDLE, sir, not directions.",
                    "You look like a man with a map. One of those press-M types. I'll just... stay near the pond. The pond makes sense."
                ]}
            ],
            enemies: [
                { type: 'snake', x: 400, y: 350 },
                { type: 'scorpion', x: 520, y: 200 }
            ],
            critters: [
                { type: 'quail', x: 300, y: 200 },
                { type: 'jackrabbit', x: 450, y: 300 },
                { type: 'roadrunner', x: 100, y: 200 },
                { type: 'tortoise', x: 540, y: 420 }
            ]
        },
        hohokam_site: {
            name: "Pueblo Grande Platform Mound", background: "#D2B48C",
            objects: [
                { type: "platform_mound", x: 280, y: 100, width: 140, height: 70 },
                { type: 'aligned_doorway', x: 320, y: 60, timeGated: {
                    startHour: 5, endHour: 8,
                    successText: "Dawn floods the doorway, and there, dead level across twelve miles of valley, the light finds the hole in the red butte. Hole-in-the-Rock. Two rooms of one instrument. Your hands are shaking.",
                    failText: "A doorway atop the mound, facing the sunrise line. Dr. Delgado said: stand here early. Come back at dawn.",
                    record: { id: 'alignment_doorway', description: 'Read the mound doorway at dawn: it frames Hole-in-the-Rock.', completed: true }
                }},
                { type: "platform_mound", x: 100, y: 350, width: 80, height: 40 },
                { type: "hohokam_canal", x: 50, y: 250, width: 540, height: 40 },
                { type: 'survey_flag', x: 480, y: 180 },
                { type: 'survey_flag', x: 510, y: 220 },
                { type: 'survey_flag', x: 540, y: 190 },
                { type: 'looter_pit', x: 460, y: 380, text: "A fresh pit, dug at night, screened neatly. Pothunters. They knew exactly where to dig. That's the frightening part." },
                { type: 'chest', x: 420, y: 430, contains: 'artifact2', text: "Tucked under a salvage tarp: an etched olla shard, canal lines and notch counts scored into the clay. The pothunters missed it by a shovel's width." },
                { type: "interactive_point", x: 100, y: 50, text: "Salvage stakes and string grids. Two weeks to record nine hundred years, and then the concrete comes." },
                { type: "rock", x: 500, y: 400 },
                { type: 'campfire_remains', x: 60, y: 420 },
                { type: "doorway", x: 0, y: 232, toMap: 'canal_path', toX: CANVAS_WIDTH - 118, toY: 380, text: "To the Canal" },
                { type: "doorway", x: CANVAS_WIDTH - 48, y: 150, toMap: 'casa_grande', toX: 50, toY: 240, text: "To Great House" }
            ],
            npcs: [
                { name: 'Dr. Delgado', x: 350, y: 200, dialog: (() => {
                    let i = 0;
                    const beforePour = [
                        "Dr. Delgado, city archaeology. We've got two weeks to salvage what we can before the pour. Two weeks, for nine hundred years of engineering.",
                        "Someone's been here at night. Neat holes, screened spoil: pothunters, professional ones. They knew where to dig, which scares me more than the bulldozers.",
                        "We catalogued an etched olla shard last week and now it's missing from the tray. If the diggers dropped it in their hurry, it's still on this site. Under a tarp, maybe. Keep an eye out.",
                        "The doorway up on the mound? At summer solstice dawn it frames Hole-in-the-Rock, straight across the valley. Stand in it early some morning. It'll change how you see this whole city.",
                        "If you find anything out there, anything at all, document, don't dig. Promise me that, Professor. The pour is June 23. After that, whatever we haven't recorded is gone."
                    ];
                    return (player, game) => {
                        if (game.gameDate >= 23) {
                            if (!player.hasItem('artifact2')) {
                                player.addItem('artifact2');
                                return "It's done. They poured at first light; I watched. But here — I pulled this from the salvage tray before the trucks came. An etched olla shard, canal lines and notch counts. Take it. Document it. Someone should carry it out of here who won't sell it.";
                            }
                            return "Nine hundred years of engineering, under four inches of grey. Two weeks was never enough, and everyone signing the permits knew it. Write down what you saw here, Professor. That's all that's left to do.";
                        }
                        return beforePour[i++ % beforePour.length];
                    };
                })()}
            ],
            enemies: [
                { type: 'scorpion', x: 450, y: 350 },
                { type: 'coyote', x: 150, y: 150 },
                { type: 'snake', x: 400, y: 300 },
                { type: 'javelina', x: 520, y: 60 }
            ],
            critters: [
                { type: 'quail', x: 250, y: 400 },
                { type: 'lizard', x: 420, y: 180 }
            ]
        },
        casa_grande: {
            name: "Casa Grande Ruins", background: "#C19A6B",
            objects: [
                // The Great House, sheltered under the 1932 steel canopy
                { type: "great_house", x: 272, y: 70, timeGated: {
                    startHour: 17, endHour: 20,
                    successText: "You climb to the observation port as the sun drops. Light spears clean through the round aperture and lands on the far inner wall, dead on a painted mark. Venus will follow it within the hour. Seven hundred years on, the Great House still keeps perfect time.",
                    failText: "The Great House. Four stories of caliche, its upper ports drilled to catch the sun, the moon, and Venus. Alvarez says the round port lights up at dusk. Come back near sundown.",
                    record: { id: 'casa_venus', description: 'Watched the Great House solstice port catch the dusk sun.', completed: true }
                }},
                { type: "canopy_post", x: 250, y: 60 },
                { type: "canopy_post", x: 380, y: 60 },
                { type: "canopy_post", x: 250, y: 210 },
                { type: "canopy_post", x: 380, y: 210 },
                // Compound walls shaping the plaza (with gaps to walk through)
                { type: "compound_wall", x: 60, y: 300 },
                { type: "compound_wall", x: 150, y: 300 },
                { type: "compound_wall", x: 430, y: 300 },
                { type: "compound_wall", x: 520, y: 300 },
                // Hohokam ballcourt
                { type: "ballcourt", x: 90, y: 360 },
                { type: "sky_hole_wall", x: 180, y: 120, width: 32, height: 96 },
                { type: "sky_hole_wall", x: 428, y: 120, width: 32, height: 96 },
                // Excavation and desert detail
                { type: "interactive_point", x: 300, y: 250, text: "A roped-off excavation square. Pot sherds and a caliche floor, brushed clean. The Park Service has been careful here, unlike some." },
                { type: "animal_bones", x: 500, y: 250 },
                { type: "cactus", x: 40, y: 200 },
                { type: "fruit_cactus", x: 110, y: 170 },
                { type: "desert_flower", x: 340, y: 260 },
                { type: "tumbleweed", x: 130, y: 250 },
                { type: "campfire_remains", x: 300, y: 410 },
                { type: "sign", x: 470, y: 400, text: "Casa Grande Ruins National Monument. Established 1918. Please stay on the marked paths." },
                { type: "doorway", x: 0, y: 232, toMap: 'hohokam_site', toX: CANVAS_WIDTH - 70, toY: 150, text: "To the Mound" },
                { type: "doorway", x: CANVAS_WIDTH - 48, y: 180, toMap: 'sky_people_shrine', toX: 50, toY: 240, text: "To South Mtn." }
            ],
            npcs: [
                { name: 'Ranger Alvarez', x: 200, y: 250, dialog: [
                    "Welcome to the Great House. Four stories of caliche, and we still argue about what it was for.",
                    "See the round port up on the wall? It lines up with the setting sun at the solstice, and there are others for the moon and for Venus. This was an observatory. That's where my money is, anyway.",
                    "That steel canopy went up in '32 to keep the rain off. We built a ruin to shelter a ruin. Say that three times fast.",
                    "Folks ask me where the builders 'went.' Ask the O'odham down the road. They'll tell you nobody went anywhere."
                ]},
                { name: 'Amateur Astronomer', x: 420, y: 240, dialog: [
                    "I drove down from Mesa with my telescope. If the ancients could track Venus with a hole in a wall, the least I can do is show up.",
                    "Come back at dusk and stand by the Great House. That port will light up like a struck match. I've got it timed to the minute.",
                    "People chase saucers out here. Me? I chase the real sky. It's stranger than anything they imagine, and it actually shows up."
                ]}
            ],
            enemies: [
                { type: 'spider', x: 120, y: 200 },
                { type: 'attacking_ghost', x: 500, y: 130 },
                { type: 'scorpion', x: 380, y: 420 }
            ],
            critters: [
                { type: 'lizard', x: 150, y: 440 },
                { type: 'quail', x: 340, y: 340 },
                { type: 'quail', x: 360, y: 350 },
                { type: 'jackrabbit', x: 540, y: 430 }
            ]
        },
        sky_people_shrine: {
            name: "South Mountain Petroglyphs", background: "#483D8B",
            objects: [
                { type: "ancient_symbol", x: 150, y: 150, text: "Spirals pecked into the basalt. Some researchers read them as counts: tallies of days between horizon events." },
                { type: "ancient_symbol", x: 450, y: 150, text: "A human figure holding a crook, facing the sunrise side of the panel. Below it, a line of dots marching toward a notch shape." },
                { type: 'horizon_marker', x: 280, y: 80, timeGated: {
                    startHour: 17, endHour: 20,
                    successText: "The sun settles into the notch on the ridge. Crimson evening. From exactly this worn spot, the horizon is a calendar, and tonight it reads: almost. A few more days. The stick's final count ends at the solstice.",
                    failText: "A notch cut into the ridgeline, and a spot at its base worn smooth by generations of standing feet. Frances said: watch from here at dusk.",
                    record: { id: 'alignment_horizon', description: 'Read the horizon notch at dusk on South Mountain.', completed: true }
                }},
                { type: "fire_pit", x: CANVAS_WIDTH / 2 - 24, y: 220 },
                { type: "skull_turret", x: 100, y: 300 },
                { type: "skull_turret", x: CANVAS_WIDTH - 132, y: 300 },
                { type: 'ancient_symbol', x: 380, y: 300, text: "A bighorn sheep pecked in mid-leap. Hunters marked good ground here for a hundred generations." },
                { type: 'rock', x: 60, y: 100, color: '#3A3546' },
                { type: 'rock', x: 545, y: 60, width: 48, height: 36, color: '#3A3546' },
                { type: 'rock', x: 200, y: 430, color: '#3A3546' },
                { type: "interactive_point", x: 320, y: 40, text: "Thousands of petroglyphs spread across these ridges. Not messages from the vanished. Records, from people whose grandchildren live twenty minutes away." },
                { type: 'campfire_remains', x: 520, y: 400 },
                { type: "doorway", x: 0, y: 232, toMap: 'casa_grande', toX: CANVAS_WIDTH - 70, toY: 180, text: "To Ruins" },
                { type: "doorway", x: CANVAS_WIDTH - 48, y: 200, toMap: 'white_tanks_petroglyphs', toX: 50, toY: 240, text: "To White Tanks" }
            ],
            npcs: [
                { name: 'Frances Antone', x: 300, y: 350, dialog: [
                    "You're the professor poking around Delgado's salvage dig. I'm Frances Antone, Salt River. Hydrology, for the district. I keep an eye on this mountain.",
                    "You say 'Hohokam' like they're a riddle. Huhugam means our ancestors, the ones who came before. We never went anywhere, Professor. The cities changed. The people didn't stop.",
                    "Some of these markings are calendars. The notch on that ridge catches the sun on the longest day. My grandmother knew more about it than your whole department, and that part isn't mine to give you.",
                    "The saguaro fruit is ripening. The harvest marks our new year. Your calendar is carved in rock; ours never stopped being alive. Both count the same sun.",
                    "If a coyote walks ahead of you and keeps looking back — that's not a coyote in a hurry. Old family, that one. Follow at a respectful distance, don't thank him out loud, and pay attention to where you end up.",
                    "Watch the horizon at dusk, from the worn spot below the notch. Then you'll understand what this mountain is for."
                ]}
            ],
            enemies: [],
            critters: [
                { type: 'jackrabbit', x: 150, y: 420 },
                { type: 'lizard', x: 480, y: 380 }
            ]
        },
        white_tanks_petroglyphs: {
            name: "White Tank Mountains Petroglyphs", background: "#C96A28",
            objects: [
                // Cliff face crowded with glyphs, along the top
                { type: "petroglyph_cliff", x: 250, y: 16 },
                // The tally panel and the all-important star-scorpion panel
                { type: "petroglyph_panel", x: 70, y: 120, width: 64, height: 64, text: "Spirals and tally lines. You count one sequence twice: it comes out the same both times. Deliberate. Precise." },
                { type: "petroglyph_panel", x: 400, y: 250, width: 64, height: 64, text: "The star-scorpion panel. A circle with rays beside Scorpius. AD 1006, the anchor of the whole calendar.", questTrigger: {
                    id: 'supernova_read',
                    description: 'The star panel: the great star of AD 1006 anchors the calendar.',
                    completed: true,
                    grantsItem: 'artifact3',
                    startText: "There it is. A scorpion of stars, and beside it, a circle with rays, far too bright to be the moon. Your 1956 sketch, line for line. If this records the great star of AD 1006, then every count on the calendar stick is a DATE. You take out charcoal and paper and make a careful rubbing. (Star Chart Rubbing added.)"
                }},
                { type: "petroglyph_panel", x: 470, y: 120, width: 48, height: 48, text: "Broad-shouldered figures with rayed heads. The crank in the Republic reads them as visitors from the sky. They are just as likely dancers, or shamans, or nobody in particular. The rock does not say." },
                // Night sky-watching spot (the whole point of this place)
                { type: "interactive_point", x: 300, y: 200, width: 32, height: 32, solid: false, interactive: true, color: '#5A4A3A', timeGated: {
                    startHour: 20, endHour: 5,
                    successText: "You lie back on the warm granite. Scorpius wheels up over the eastern ridge, red Antares at its heart, exactly where the panel puts the guest star. For a moment you are standing beside whoever chiseled it, nine hundred years ago, watching the same sky refuse to hold still.",
                    failText: "A smooth granite shelf, worn by generations of people lying back to watch the sky. Alvarez would say wait for full dark. Come back at night.",
                    record: { id: 'scorpius_rising', description: 'Watched Scorpius rise over the White Tanks, as the ancients did.', completed: true }
                }},
                // The White Tanks themselves: granite water pools
                { type: "tinaja", x: 90, y: 330 },
                { type: "granite_boulder", x: 180, y: 150 },
                { type: "granite_boulder", x: 300, y: 380 },
                { type: "granite_boulder", x: 520, y: 360 },
                { type: "rock", x: 150, y: 420, color: '#8A7967' },
                { type: 'cactus', x: 60, y: 120 },
                { type: 'fruit_cactus', x: 480, y: 410 },
                { type: 'desert_flower', x: 250, y: 300 },
                { type: 'sand_dune', x: 380, y: 440 },
                { type: 'campfire_remains', x: 200, y: 400 },
                // UFO debunk beat
                { type: "interactive_point", x: 540, y: 250, text: "Scorch marks on the caliche and a scrap of burned magnesium casing. Military flare, not a saucer. The strange lights have a boring answer. The rock carvings do not." },
                // Blacklight find: the panels were painted once
                { type: 'uv_trace', x: 400, y: 320, questTrigger: {
                    id: 'uv_pigment', completed: true,
                    description: 'UV: ghost-lines of ochre pigment on the star panel.',
                    startText: "Under the lamp the panel's edges bloom: ghost-lines of ochre, invisible by day. The carvings were PAINTED once. Nine hundred summers took the color and kept the count."
                }},
                { type: "doorway", x: 0, y: 232, toMap: 'sky_people_shrine', toX: CANVAS_WIDTH - 70, toY: 200, text: "To South Mtn." },
                { type: "doorway", x: CANVAS_WIDTH - 48, y: 120, toMap: 'asu_lab', toX: 50, toY: 240, text: "To ASU" }
            ],
            npcs: [
                { name: "Petroglyph Researcher", x: 150, y: 250, dialog: [
                    "These panels are centuries old. The star-and-scorpion one? There's a claim it records the supernova of 1006: Scorpius rising, the guest star beside it. It's disputed. It should be disputed. That's how this works.",
                    "But disputed isn't debunked. If it's right, somebody here did naked-eye astronomy precise enough to date a stellar explosion. No telescope. Just patience and a chisel.",
                    "People keep asking me if it's aliens. It's better than aliens. It's people.",
                    "If you need a panel with you, do what we do: charcoal and butcher paper. A good rubbing is as true as the rock."
                ]},
                { name: "Star Party Host", x: 340, y: 260, dialog: [
                    "The county runs star parties out here. Darkest sky within an hour of Phoenix, and the ancients knew it first.",
                    "Lie back on that granite shelf after dark. Scorpius climbs the east ridge and you'll see exactly what the star panel is pointing at.",
                    "Every few weeks somebody swears they saw a UFO over these mountains. Nine times out of ten it's the base flying flares. The tenth time it's Venus, and they won't believe you."
                ]}
            ],
            enemies: [
                { type: 'coyote', x: 150, y: 350 },
                { type: 'gila_monster', x: 430, y: 430 },
                { type: 'vulture', x: 520, y: 200 },
                { type: 'snake', x: 300, y: 440 }
            ],
            critters: [
                { type: 'jackrabbit', x: 360, y: 160 },
                { type: 'lizard', x: 220, y: 340 },
                { type: 'quail', x: 120, y: 300 },
                { type: 'roadrunner', x: 440, y: 380 },
                { type: 'guide_coyote', x: 560, y: 420, path: [[380, 400], [220, 380], [110, 350]] }
            ]
        },
        ghost_town: {
            name: 'Dusty Gulch Ghost Town', background: '#C9A876',
            objects: [
                { type: 'saloon', x: 150, y: 55 },
                { type: 'old_building', x: 40, y: 65 },
                { type: 'old_building', x: 380, y: 65 },
                { type: 'well', x: 300, y: 230 },
                { type: 'wagon', x: 100, y: 300 },
                { type: 'barrel', x: 170, y: 148 },
                { type: 'barrel', x: 330, y: 150 },
                { type: 'barrel', x: 500, y: 130 },
                { type: 'survey_flag', x: 420, y: 200 },
                { type: 'survey_flag', x: 445, y: 230 },
                { type: 'tumbleweed', x: 250, y: 320 },
                { type: 'tumbleweed', x: 450, y: 260 },
                { type: 'tumbleweed', x: 80, y: 200 },
                { type: 'animal_bones', x: 520, y: 350 },
                { type: 'dead_tree', x: 560, y: 200 },
                { type: 'cactus', x: 30, y: 400 },
                { type: 'sign', x: 240, y: 400, text: "Welcome to Dusty Gulch. Population: 0 (and holding)" },
                { type: 'interactive_point', x: 420, y: 330, text: "Fresh truck tracks and surveyor's tape. Cutler's crew came through here, heading east toward the Superstitions." },
                { type: 'chest', x: 60, y: 160, contains: 'prickly_pear', text: "Someone stashed a fresh prickly pear in here. Still good!" },
                { type: 'campfire_remains', x: 540, y: 420 },
                { type: 'doorway', x: 296, y: 0, toMap: 'desert', toX: 296, toY: CANVAS_HEIGHT - 60, text: "To Desert" },
                { type: 'doorway', x: CANVAS_WIDTH - 48, y: 120, toMap: 'superstition_mountains', toX: 60, toY: 240, text: "To Superstitions" },
                { type: 'mine_portal', x: CANVAS_WIDTH - 60, y: 300, toMap: 'abandoned_mine', toX: 60, toY: 240, text: "To Mine" }
            ],
            npcs: [
                { name: 'Tumbleweed Ted', x: 380, y: 220, dialog: [
                    "Name's Ted. Been drifting through Dusty Gulch since '79. The rent is unbeatable.",
                    "This town emptied out when the copper mine went bust in 1912.",
                    "Fella named Cutler came through with a crew and maps. Paid cash for directions to the Superstitions. Smiled too much.",
                    "Everybody who chases the Dutchman finds the same thing, friend. Heat, falls, and an empty hole. The desert don't curse people. It don't have to.",
                    "The mine's east of town. Folks hear picks tapping down there some nights..."
                ]},
                { name: "Saloon Keeper's Ghost", x: 250, y: 165, dialog: [
                    "Welcome to the Golden Gulch! What'll it be? We've got dust, and... dust.",
                    "A hundred and fourteen years behind this bar, and you're my first customer since Roosevelt. The FIRST one.",
                    "The miners used to sing about a blue glow deep in the shaft. Copper ore, turns out. Chrysocolla. Prettiest thing a man ever died over."
                ]},
                { name: 'Wandering Musician', x: 480, y: 400, dialog: [
                    "Every ghost town's got a song, friend. This one's in D minor. The dustiest of keys.",
                    "I play for the coyotes, mostly. Tough crowd. They only howl for the sad ones.",
                    "There's a rhythm to the desert. Old-timers heard it. The people before them carved it into the mountains."
                ]}
            ],
            enemies: [
                { type: 'javelina', x: 150, y: 420 },
                { type: 'coyote', x: 540, y: 420 },
                { type: 'vulture', x: 480, y: 70 },
                { type: 'scorpion', x: 400, y: 180 }
            ],
            critters: [
                { type: 'jackrabbit', x: 200, y: 250 },
                { type: 'roadrunner', x: 350, y: 380 },
                { type: 'lizard', x: 120, y: 250 }
            ]
        },
        abandoned_mine: {
            name: 'Abandoned Copper Mine', background: '#2B2119', indoor: true,
            objects: [
                { type: 'rail_track', x: 60, y: 340 },
                { type: 'rail_track', x: 156, y: 340 },
                { type: 'rail_track', x: 252, y: 340 },
                { type: 'mine_cart', x: 300, y: 328 },
                { type: 'stalagmite', x: 120, y: 100 },
                { type: 'stalagmite', x: 200, y: 60 },
                { type: 'stalagmite', x: 480, y: 100 },
                { type: 'stalagmite', x: 540, y: 400 },
                { type: 'stalagmite', x: 80, y: 430 },
                { type: 'crystal', x: 420, y: 80 },
                { type: 'crystal', x: 560, y: 250 },
                { type: 'crystal', x: 160, y: 400 },
                { type: 'rock', x: 350, y: 180, color: '#4A3B2A' },
                { type: 'sign', x: 100, y: 250, text: "DANGER: Shaft 7 closed by order of the Territorial Mining Office, 1912." },
                { type: 'looter_pit', x: 480, y: 330, text: "A fresh pit among the old workings. Cutler's crew tested here and moved on. Nothing worth their while. Their idea of 'worth' is the whole problem." },
                { type: 'uv_trace', x: 340, y: 220, questTrigger: {
                    id: 'uv_chalk', completed: true,
                    description: "UV: the miners' chalk waymarks, still glowing in the dark.",
                    startText: "Chalk arrows flare blue-white on the timbers: the old miners' waymarks, invisible for seventy years. Every one of them points OUT. Men who mark the way out are men who mean to come back."
                }},
                { type: 'chest', x: 520, y: 160, contains: 'old_pickaxe', text: "The Prospector's old pickaxe! It's dusted blue-green. Copper ore, nothing stranger. Mostly." },
                { type: 'chest', x: 240, y: 430, contains: 'lucky_charm', text: "A lucky rabbit foot on a worn chain. Some miner's talisman." },
                { type: 'doorway', x: 0, y: 232, toMap: 'ghost_town', toX: CANVAS_WIDTH - 120, toY: 300, text: "To Town" }
            ],
            npcs: [
                { name: "Miner's Ghost", x: 400, y: 250, dialog: [
                    "Forty years I swung a pick down here. Didn't let a little thing like 1912 stop me.",
                    "We dug for the blue glow. Chrysocolla, the company man called it. We called it rent.",
                    "The bats moved in after we... moved on. Mind their swooping."
                ]}
            ],
            enemies: [
                { type: 'bat', x: 200, y: 150 },
                { type: 'bat', x: 350, y: 100 },
                { type: 'bat', x: 500, y: 380 },
                { type: 'gila_monster', x: 300, y: 420 },
                { type: 'attacking_ghost', x: 450, y: 200 }
            ],
            critters: []
        },
        asu_lab: {
            name: 'ASU Hayden Archives and Lab', background: '#4A4A52', indoor: true,
            objects: [
                // West wing: the lab. East wing: the Hayden archives. A dividing
                // wall with a walkway gap at the south end joins them.
                { type: 'interior_wall', x: 336, y: 20, width: 20, height: 220 },
                { type: 'asu_banner', x: 130, y: 36 },
                { type: 'computer_terminal', x: 90, y: 100, text: "ASU mainframe: solar ephemeris loaded. JUNE 21 1986: SUNRISE 05:18, AZIMUTH 60.9 DEG. Simulation copied to your pocket computer. The alignments will read at dawn and dusk." },
                { type: 'lab_bench', x: 130, y: 160 },
                { type: 'server_rack', x: 262, y: 70 },
                { type: 'sparky_statue', x: 40, y: 150 },
                { type: 'bulletin_board', x: 60, y: 300 },
                // The archives
                { type: 'bookshelf', x: 380, y: 60 },
                { type: 'bookshelf', x: 466, y: 60 },
                { type: 'bookshelf', x: 552, y: 60 },
                { type: 'bookshelf', x: 420, y: 210 },
                { type: 'bookshelf', x: 520, y: 210 },
                { type: 'interactive_point', x: 462, y: 340, text: "Microfiche: 1912 canal survey maps overlaid on last year's aerial photos. One alignment segment sits just outside the grading permit. Untouched. For now." },
                { type: 'interactive_point', x: 606, y: 176, text: "Through the window: Palm Walk shimmers in the heat, and past it the gold 'A' on the butte above Tempe. People were pecking symbols into that hill a thousand years before anyone painted a letter on it." },
                { type: 'trophy_case', x: 580, y: 380 },
                { type: 'potted_palm', x: 40, y: 400 },
                { type: 'potted_palm', x: 380, y: 410 },
                // 'The ancients' door hides behind the Phoenix. Push what cannot fly.'
                { type: 'phoenix_statue', x: 296, y: 348 },
                { type: 'secret_panel', x: 300, y: 400, portalOnInteract: true, toMap: 'artifact_chamber', toX: CANVAS_WIDTH / 2 - 16, toY: CANVAS_HEIGHT - 80,
                    requiredItems: ['artifact1', 'artifact2', 'artifact3'],
                    lockedText: "A panel, locked from behind. Three shallow slots are cut into the frame: one shaped like a notched stick, one like a curved shard, one a flat sheet.",
                    requiredRecords: ['alignment_light', 'alignment_doorway', 'alignment_horizon'],
                    recordHints: {
                        alignment_light: "the dawn light on the chamber floor at Hole-in-the-Rock (Papago, first light)",
                        alignment_doorway: "the mound doorway at dawn (Pueblo Grande, first light)",
                        alignment_horizon: "the sun settling into the horizon notch at dusk (South Mountain)",
                    },
                    interactionText: "The stick fragment, the olla shard, the rubbing. Each slips into its slot like a tooth of a key, and the counts line up into one unbroken calendar. You have stood in the light three times; now the counts read like a clock face. Push what cannot fly. The statue grinds aside: a maintenance stair, down into the old utility vault. The canal segment runs directly below." },
                { type: 'doorway', x: 0, y: 232, toMap: 'white_tanks_petroglyphs', toX: CANVAS_WIDTH - 70, toY: 120, text: "Exit" }
            ],
            npcs: [
                { name: "Grad Student", x: 400, y: 300, dialog: (() => {
                    let i = 0;
                    const lines = [
                        "Working on my thesis... don't mind the mess.",
                        "You're the second person this month to pull the 1912 canal surveys. A Mr. Cutler requested the same boxes last week. Paid the copy fees in cash.",
                        "If you need a break, Mill Avenue has coffee, and Gammage runs a summer organ series. Frank Lloyd Wright built it. It's sort of our pyramid.",
                        "The planetarium's ephemeris program is on the mainframe if you need sky positions. Any date you want. It's 1986. The future is now, Professor.",
                        "How's the UV lamp working out? Scorpions glow green. So does old rock pigment. We didn't expect that second part."
                    ];
                    return (player) => {
                        if (!player.hasItem('blacklight')) {
                            player.addItem('blacklight');
                            return "Oh — you're the professor with the Model 100. Computer club made these: UV lamp, clips right onto it. Scorpions light up green under it at night. So does old mineral pigment, it turns out, which nobody expected. Take one, we made a dozen.";
                        }
                        return lines[i++ % lines.length];
                    };
                })()},
                { name: 'Sparky', x: 470, y: 400, dialog: [
                    "FEAR THE FORK! ...Sorry, Professor. Contractually obligated. It is one hundred and nine degrees inside this head.",
                    "Football this fall? We are going ALL the way. Rose Bowl. Write it down. I am never wrong when I am wearing the head.",
                    "Devil's advice: Palm Walk has the only shade on campus worth having. Stick to it before noon.",
                    "That gold 'A' on the butte? Folks were carving that hill three thousand years before we ever painted it. Even a mascot knows whose mountain it was first. Go Devils!"
                ]}
            ],
            enemies: [],
            critters: []
        },
        canal_path: {
            name: 'The Arizona Canal', background: '#D8B488', haboob: true,
            objects: [
                // The canal crosses the whole reach; a footbridge is the only way over
                { type: 'srp_canal', x: 0, y: 200, width: 280, height: 56 },
                { type: 'srp_canal', x: 344, y: 200, width: 296, height: 56, text: "Nine hundred years ago the water ran the same direction, twenty feet down, for the same reason. The 1912 engineers just agreed with it." },
                { type: 'footbridge', x: 280, y: 196 },
                // North bank: the lock keeper's place
                { type: 'old_building', x: 90, y: 50, shelter: true, text: "The lock keeper's house. SRP, 1912. The kitchen light is on at all hours; water doesn't keep office hours." },
                { type: 'wind_chime', x: 196, y: 96 },
                { type: 'sign', x: 250, y: 120, text: "SRP - ARIZONA CANAL, LOCK 9. Keeper: J. Vega. This reach follows a Hohokam alignment, surveyed 1912." },
                { type: 'interactive_point', x: 430, y: 130, text: "Dredge spoil in neat screened piles, and fresh tire tracks. Cutler's crew sieved this stretch and moved on. The canal didn't give up whatever they wanted." },
                { type: 'survey_flag', x: 470, y: 110 },
                { type: 'survey_flag', x: 505, y: 145 },
                { type: 'chest', x: 570, y: 70, contains: 'prickly_pear', text: "A lunch cooler someone forgot on the bank. One ripe prickly pear inside, still cool." },
                // South bank
                { type: 'campfire_remains', x: 70, y: 400 },
                { type: 'water_source', x: 390, y: 290 },
                { type: 'cactus', x: 40, y: 300 },
                { type: 'fruit_cactus', x: 470, y: 420 },
                { type: 'desert_flower', x: 310, y: 340 },
                { type: 'tumbleweed', x: 180, y: 370 },
                { type: 'dead_tree', x: 590, y: 300 },
                { type: 'interactive_point', x: 240, y: 300, text: "The water moves east, steady as a clock, whispering over the concrete. In a whiteout you could walk this whole reach by sound alone." },
                { type: 'doorway', x: 0, y: 380, toMap: 'papago_park', toX: CANVAS_WIDTH - 70, toY: 240, text: "To Papago" },
                { type: 'doorway', x: CANVAS_WIDTH - 48, y: 380, toMap: 'hohokam_site', toX: 50, toY: 240, text: "To the Mound" }
            ],
            npcs: [
                { name: 'Lock Keeper Vega', x: 150, y: 150, dialog: [
                    "Vega. Salt River Project. My grandfather tended this reach, and his people ran water here before there was an SRP to pay for it. Somebody in my family has always worked water.",
                    "This canal? 1912 concrete on a nine-hundred-year-old grade. The engineers didn't invent anything. They just agreed with people who'd already done the math.",
                    "When the dust wall comes through, don't run and don't rub your eyes. Get low, get inside, and listen. The water tells you where the canal is. My chime tells you where the door is.",
                    "Cutler's crew dredged east of Lock 9 last week. Pulled up two bicycles and a shopping cart. Some men can't hear water unless it rings like a register."
                ]}
            ],
            enemies: [
                { type: 'snake', x: 480, y: 340 },
                { type: 'scorpion', x: 220, y: 430 }
            ],
            critters: [
                { type: 'roadrunner', x: 350, y: 410 },
                { type: 'quail', x: 100, y: 340 },
                { type: 'quail', x: 128, y: 352 },
                { type: 'jackrabbit', x: 540, y: 440 }
            ]
        },
        superstition_mountains: {
            name: 'Superstition Mountains', background: '#8A6248',
            objects: [
                { type: 'stone_needle', x: 292, y: 30 },
                { type: 'granite_boulder', x: 80, y: 110, color: '#7A5A48' },
                { type: 'granite_boulder', x: 500, y: 100, color: '#7A5A48' },
                { type: 'rock', x: 180, y: 170, color: '#6B4A38' },
                { type: 'rock', x: 430, y: 210, width: 48, height: 36, color: '#6B4A38' },
                { type: 'cactus', x: 34, y: 320 },
                { type: 'cactus', x: 570, y: 250 },
                { type: 'fruit_cactus', x: 120, y: 420 },
                { type: 'dead_tree', x: 530, y: 360 },
                { type: 'animal_bones', x: 240, y: 310 },
                { type: 'animal_bones', x: 410, y: 440 },
                { type: 'tumbleweed', x: 310, y: 390 },
                { type: 'campfire_remains', x: 80, y: 350 },
                // Cutler's camp, flagged like a crime scene
                { type: 'survey_flag', x: 470, y: 300 },
                { type: 'survey_flag', x: 508, y: 322 },
                { type: 'survey_flag', x: 545, y: 295 },
                { type: 'barrel', x: 452, y: 260 },
                { type: 'interactive_point', x: 495, y: 345, text: "Cutler's camp: cots, a generator, a card table with a map pinned under a whiskey bottle. The map is annotated in three colors of certainty." },
                // The marked spot from the legend, and what's actually there
                { type: 'interactive_point', x: 330, y: 170, text: "From the worn spot the legend names, the Needle lines up exactly with the notch in the ridge. You check the bearing twice. A hundred dead men took it before you, standing right here, every one of them sure." },
                { type: 'looter_pit', x: 296, y: 224, width: 64, height: 36, questTrigger: {
                    id: 'dutchman_bust',
                    description: 'The Dutchman spot: an empty hole and a rusted canteen.',
                    completed: true,
                    startText: "The marked spot. Somebody dug here half a century before Cutler: the spoil is crusted hard as the caliche. The hole is empty. It was always going to be empty. Above you the Needle keeps not caring. The desert doesn't curse anyone. It just doesn't pay out."
                }},
                { type: 'chest', x: 352, y: 244, contains: 'rusted_canteen', text: "Half-buried beside the pit: a rusted 1930s army canteen, holed clean through. Somebody chased the legend this far, then lightened their load on the way out. Or didn't walk out." },
                { type: 'sign', x: 190, y: 440, text: "TONTO NATIONAL FOREST. Carry water. Tell someone where you went." },
                { type: 'doorway', x: 0, y: 232, toMap: 'ghost_town', toX: CANVAS_WIDTH - 120, toY: 140, text: "To Dusty Gulch" }
            ],
            npcs: [
                { name: 'Vance Cutler', x: 440, y: 390, dialog: [
                    "Jim Walker, in my camp. Sit; there's shade, and the coffee's terrible. You went and got principles, I went and got a generator. Look which one of us sleeps on a cot.",
                    "Here's my map. The military crest, the Needle's shadow at four o'clock, the old Peralta bearings. It all LINES UP, Jim. You know that feeling. It's the same one you chase. I just cash mine out.",
                    "Partner with me. Full split, your name on whatever paper you want. You read rock better than any man I ever robbed a museum with. That was a joke. Mostly.",
                    "You keep looking at my dig like it's a grave. It's a hole. If it's empty I dig another one. That's the difference between us: you think the desert is telling you something, I think it's hiding something. One of us goes home rich.",
                    "Suit yourself, old friend. When you change your mind, follow the flags."
                ]}
            ],
            enemies: [
                { type: 'javelina', x: 150, y: 210 },
                { type: 'javelina', x: 195, y: 235 },
                { type: 'gila_monster', x: 380, y: 330 },
                { type: 'snake', x: 250, y: 410 },
                { type: 'snake', x: 540, y: 430 },
                { type: 'vulture', x: 320, y: 90 },
                { type: 'scorpion', x: 100, y: 300 }
            ],
            critters: [
                { type: 'jackrabbit', x: 560, y: 410 },
                { type: 'lizard', x: 210, y: 350 }
            ]
        },
        artifact_chamber: {
            name: 'The Vault Beneath the Canal Line', background: '#301020', indoor: true,
            objects: [
                { type: 'pedestal', x: CANVAS_WIDTH / 2 - 16, y: CANVAS_HEIGHT / 2 - 16 },
                { type: 'doorway', x: 0, y: 232, toMap: 'asu_lab', toX: 344, toY: 410, text: "Up the stair" },
                { type: 'offering_ledge', x: 84, y: 300 },
                { type: 'crystal', x: 100, y: 120 },
                { type: 'crystal', x: CANVAS_WIDTH - 124, y: 120 },
                { type: 'stalagmite', x: 60, y: 350 },
                { type: 'stalagmite', x: CANVAS_WIDTH - 84, y: 350 },
                { type: 'interactive_point', x: CANVAS_WIDTH / 2 - 24, y: CANVAS_HEIGHT - 48, width: 48, height: 16, solid: true, interactive: true, color: '#3E2731', text: "A brass survey benchmark, stamped 1912. The canal engineers stood in this vault too, following the same water as everyone before them." }
            ],
            npcs: [
                { name: 'Vance Cutler', x: 200, y: 160, dialog: [
                    "Hello, Jim. Don't be sore. Your trail was easy to follow. You always did take good notes.",
                    "The Superstitions were a bust, by the way. Empty hole, dead mule, two weeks of my life. So I came back and did what you did: read the rocks properly.",
                    "A stick. Four centuries of sky and water on a stick. Do you have any idea what a collector pays for provenance like that?",
                    "Go on then, take the olla. But ask yourself, old friend: a museum drawer, my buyer's vault, or a plaque with your name on it. Those are the choices... unless you know a fourth one. Prove me wrong."
                ]}
            ],
            enemies: [
                { type: 'bat', x: 450, y: 300 }
            ],
            critters: []
        }
    };
}

export const MAP_MUSIC = {
    canal_path: 'canalTheme',
    superstition_mountains: 'superstitionsTheme',
    desert: 'firstScenarioTheme',
    canyon: 'secondScenarioTheme',
    camelback: 'thirdScenarioTheme',
    papago_park: 'papagoTheme',
    hohokam_site: 'hohokamTheme',
    casa_grande: 'casaGrandeTheme',
    sky_people_shrine: 'skyPeopleTheme',
    white_tanks_petroglyphs: 'whiteTanksTheme',
    ghost_town: 'ghostTownTheme',
    abandoned_mine: 'mineTheme',
    asu_lab: 'asuLabTheme',
    artifact_chamber: 'chamberTheme',
};
