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
    };
}

export function getEnemyTypes() {
    return {
        scorpion: { name: 'Scorpion', width: 32, height: 28, damage: 5, speed: 0.8, health: 30, color: '#704214', solid: true, interactive: true },
        snake: { name: 'Snake', width: 40, height: 12, damage: 8, speed: 1.2, health: 20, color: '#006400', solid: false, interactive: true },
        coyote: { name: 'Coyote', width: 40, height: 28, damage: 10, speed: 1.5, health: 50, color: '#B8860B', solid: true, interactive: true },
        spider: { name: 'Giant Spider', width: 36, height: 32, damage: 7, speed: 1.1, health: 40, color: '#3A3A3A', solid: true, interactive: false },
        attacking_ghost: { name: 'Restless Spirit', width: 24, height: 32, damage: 6, speed: 1.3, health: 35, color: '#A0B0D0', isEthereal: true, aggroRange: 180, solid: false, interactive: true },
        gila_monster: { name: 'Gila Monster', width: 36, height: 18, damage: 12, speed: 0.6, health: 60, color: '#E2725B', solid: true, interactive: true },
        vulture: { name: 'Vulture', width: 36, height: 24, damage: 6, speed: 1.7, health: 25, color: '#3B2F2F', isFlying: true, circles: true, aggroRange: 200, solid: false, interactive: false },
        javelina: { name: 'Javelina', width: 42, height: 30, damage: 14, speed: 1.9, health: 70, color: '#4A4038', charges: true, aggroRange: 170, solid: true, interactive: true },
        bat: { name: 'Cave Bat', width: 20, height: 14, damage: 4, speed: 1.9, health: 15, color: '#1A1A22', isFlying: true, erratic: true, aggroRange: 160, solid: false, interactive: false },
        mummy: { name: 'Ancient Guardian', width: 26, height: 36, damage: 15, speed: 0.7, health: 120, color: '#C8BCA0', aggroRange: 220, solid: true, interactive: false },
    };
}

export function getCritterTypes() {
    return {
        jackrabbit: { name: 'Jackrabbit', width: 22, height: 18, speed: 1.2, fleeRange: 85 },
        roadrunner: { name: 'Roadrunner', width: 26, height: 20, speed: 1.9, fleeRange: 75 },
        lizard: { name: 'Lizard', width: 18, height: 10, speed: 0.9, fleeRange: 50 },
        quail: { name: 'Quail', width: 18, height: 16, speed: 1.0, fleeRange: 70 },
        tortoise: { name: 'Desert Tortoise', width: 26, height: 18, speed: 0.2, fleeRange: 0 },
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
        compass: { name: 'Compass', description: 'Helps you navigate.' },
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
            name: 'Prickly Pear', description: 'A sweet cactus fruit. Restores 35 HP.',
            useFunc: (game) => {
                if (game.player.health < game.player.maxHealth) {
                    game.player.heal(35);
                    game.player.removeItem('prickly_pear');
                    game.sound.playSound('drink');
                    game.ui.showDialog("You eat the prickly pear. Sweet and restoring! (+35 HP)", "Prickly Pear");
                } else {
                    game.ui.showDialog("You're at full health. Better save it for later.", "Prickly Pear");
                }
                game.setGameState(GAME_STATE.DIALOG);
            }
        },
        old_pickaxe: { name: 'Old Pickaxe', description: "The Prospector's beloved pickaxe. Rusty but sturdy." },
        lucky_charm: { name: 'Lucky Rabbit Foot', description: 'A worn charm from a braver era. It feels... lucky.' },
        artifact1: { name: 'Calendar Stick Fragment', description: 'Half of a notched wooden record. The counts are dates, day-counts toward something.' },
        final_artifact: { name: 'Calendar Stick', description: 'Four centuries of sky and water, carved notch by notch. It is not yours to keep.' },
    };
}

export function getMaps() {
    return {
        desert: {
            name: 'Sonoran Desert Outskirts', background: '#E2C9A1',
            objects: [
                { type: 'cactus', x: 100, y: 80 },
                { type: 'cactus', x: 430, y: 120 },
                { type: 'cactus', x: 480, y: 380 },
                { type: 'cactus', x: 60, y: 400 },
                { type: 'rock', x: 250, y: 190 },
                { type: 'rock', x: 350, y: 50, width: 40, height: 32 },
                { type: 'rock', x: 550, y: 300, width: 48, height: 36 },
                { type: 'sand_dune', x: 150, y: 360 },
                { type: 'dead_tree', x: 310, y: 280 },
                { type: 'campfire_remains', x: 170, y: 150 },
                { type: 'fruit_cactus', x: 230, y: 350 },
                { type: 'desert_flower', x: 350, y: 220 },
                { type: 'tumbleweed', x: 280, y: 110 },
                { type: 'trail_marker', x: 550, y: 190, text: "The canyon entrance lies ahead." },
                { type: 'sign', x: 150, y: 240, text: "Caution: desert conditions. Between 11 and 4 the sun is not negotiable. Travel at dawn and dusk." },
                { type: 'interactive_point', x: 380, y: 350, text: "Lizard tracks crisscross the sand. Something heavier passed through too: tire tracks, out-of-state tread." },
                { type: 'water_source', x: 50, y: 300 },
                { type: 'doorway', x: CANVAS_WIDTH - 48, y: 232, toMap: 'canyon', toX: 50, toY: 240, text: "To Canyon" },
                { type: 'doorway', x: 296, y: CANVAS_HEIGHT - 16, toMap: 'ghost_town', toX: 296, toY: 40, text: "To Old Town" }
            ],
            npcs: [
                { name: 'Ranger Rick', x: 200, y: 300, dialog: [
                    "Howdy, Professor! Dehydration is no joke out here. Rest at a campsite if you're caught out past dusk.",
                    "Keep that canteen over half full and your body mends itself. Water is life out here. For worse wounds, look for prickly pear with ripe red fruit on top.",
                    "You read the Republic this morning? Grading crew hit canal features by the airport. Salvage crew's got two weeks. Breaks your heart.",
                    "If you're heading east, watch for rattlers near the rocks. You'll hear them before you see them.",
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
                { type: 'tortoise', x: 500, y: 200 }
            ]
        },
        canyon: {
            name: 'Red Rock Canyon', background: '#BC6C25',
            objects: [
                { type: 'rock', x: 100, y: 100 },
                { type: 'chest', x: 400, y: 200, contains: 'artifact1', text: "Wrapped in oilcloth inside: half of a notched wooden stick. The oilcloth is modern. Someone cached this here recently. Someone is protecting it." },
                { type: 'doorway', x: 0, y: 232, toMap: 'desert', toX: CANVAS_WIDTH - 70, toY: 240, text: "To Desert" },
                { type: 'doorway', x: CANVAS_WIDTH - 48, y: 100, toMap: 'camelback', toX: 50, toY: 100, text: "To Mt." },
                { type: 'crater', x: 300, y: 350, width: 100, height: 50 },
                { type: 'rock', x: 150, y: 350, width: 60, height: 40, solid: true, color: '#6B4226' },
                { type: 'cactus', x: 500, y: 80 },
                { type: 'animal_bones', x: 220, y: 420 },
                { type: 'tumbleweed', x: 480, y: 300 },
            ],
            npcs: [{ name: 'Old Hermit', x: 250, y: 150, dialog: "The earth groans under the weight of secrets. Some are best left buried... or returned to whoever buried them." }],
            enemies: [
                { type: 'coyote', x: 350, y: 100 },
                { type: 'gila_monster', x: 480, y: 400 },
                { type: 'vulture', x: 450, y: 60 }
            ],
            critters: [
                { type: 'lizard', x: 200, y: 300 },
                { type: 'jackrabbit', x: 500, y: 200 }
            ]
        },
        camelback: {
            name: 'Camelback Mountain Trail', background: '#A0B084',
            objects: [
                { type: 'sign', x: 50, y: 400, text: "Echo Canyon Trailhead. Carry water. The mountain doesn't." },
                { type: 'rock', x: 150, y: 350 },
                { type: 'interactive_point', x: 320, y: 50, text: "Scenic overlook. From up here the valley's peaks line up like beads on a string: Papago's red buttes, the mound by the airport, the dark ridge of South Mountain. Almost like it's arranged." },
                { type: 'campfire_remains', x: 480, y: 380 },
                { type: 'fruit_cactus', x: 100, y: 250 },
                { type: 'doorway', x: 0, y: 100, toMap: 'canyon', toX: CANVAS_WIDTH - 70, toY: 100, text: "To Canyon" },
                { type: 'doorway', x: CANVAS_WIDTH - 48, y: 200, toMap: 'papago_park', toX: 50, toY: 240, text: "To Papago" },
                { type: 'desert_flower', x: 250, y: 300 },
                { type: 'desert_flower', x: 420, y: 380 },
            ],
            npcs: [
                { name: 'Tired Hiker', x: 450, y: 280, dialog: ["Almost... at the top... Need water!", "Watch out for loose rocks."] },
                { name: 'Vance Cutler', x: 220, y: 200, dialog: [
                    "Jim Walker! Twenty years, and you still haven't bought a better hat. Vance Cutler. Don't make that face. I'm legitimate now. Mostly.",
                    "I'm taking a crew into the Superstitions. Dutchman gold, Jim. The signs finally line up. Come along. The split beats a pension.",
                    "Still reading rocks for free? Everything old is worth something to somebody. That's not cynicism, that's appraisal.",
                    "Suit yourself, old friend. If you beat me to anything out there... I'll make you a fair offer. I always do."
                ]},
                { name: 'Photographer', x: 520, y: 120, dialog: [
                    "Hold still, the light is PERFECT right now.",
                    "I've shot sunrises on six continents, but nothing beats the crimson evening out here. That's what the O'odham call it, a fella told me.",
                    "Caught a javelina on film yesterday. Don't call them pigs, and don't get between a mother and her young. That's all the wisdom I have."
                ]}
            ],
            enemies: [
                { type: 'snake', x: 200, y: 150 },
                { type: 'javelina', x: 400, y: 420 }
            ],
            critters: [
                { type: 'quail', x: 300, y: 350 },
                { type: 'quail', x: 330, y: 370 },
                { type: 'lizard', x: 500, y: 150 }
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
                { type: 'doorway', x: CANVAS_WIDTH - 48, y: 232, toMap: 'hohokam_site', toX: 50, toY: 240, text: "To the Mound" }
            ],
            npcs: [
                { name: 'Morning Fisherman', x: 180, y: 380, dialog: [
                    "City stocks the ponds with trout. The herons figured that out before I did.",
                    "That butte with the hole clean through it? At dawn the sun crawls right across the floor inside. My grandfather called it a church.",
                    "Best hour out here is the first one. Everything after is just heat."
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
                { type: "interactive_point", x: 100, y: 50, text: "Salvage stakes and string grids. Two weeks to record nine hundred years, and then the concrete comes." },
                { type: "rock", x: 500, y: 400 },
                { type: 'campfire_remains', x: 60, y: 420 },
                { type: "doorway", x: 0, y: 232, toMap: 'papago_park', toX: CANVAS_WIDTH - 70, toY: 240, text: "To Papago" },
                { type: "doorway", x: CANVAS_WIDTH - 48, y: 150, toMap: 'casa_grande', toX: 50, toY: 240, text: "To Great House" }
            ],
            npcs: [
                { name: 'Dr. Delgado', x: 350, y: 200, dialog: [
                    "Dr. Delgado, city archaeology. We've got two weeks to salvage what we can before the pour. Two weeks, for nine hundred years of engineering.",
                    "Someone's been here at night. Neat holes, screened spoil: pothunters, professional ones. They knew where to dig, which scares me more than the bulldozers.",
                    "The doorway up on the mound? At summer solstice dawn it frames Hole-in-the-Rock, straight across the valley. Stand in it early some morning. It'll change how you see this whole city.",
                    "If you find anything out there, anything at all, document, don't dig. Promise me that, Professor."
                ]}
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
                { type: "sky_hole_wall", x: 200, y: 100, width: 32, height: 120 },
                { type: "sky_hole_wall", x: 400, y: 100, width: 32, height: 120 },
                { type: "sign", x: 300, y: 300, text: "The Great House. Four stories of caliche, seven centuries old, and its upper ports still catch the solstice sun." },
                { type: "doorway", x: 0, y: 232, toMap: 'hohokam_site', toX: CANVAS_WIDTH - 70, toY: 150, text: "To the Mound" },
                { type: "doorway", x: CANVAS_WIDTH - 48, y: 180, toMap: 'sky_people_shrine', toX: 50, toY: 240, text: "To South Mtn." }
            ],
            npcs: [
                { name: 'Ranger Alvarez', x: 300, y: 200, dialog: [
                    "Welcome to the Great House. Four stories of caliche, and we still argue about what it was for.",
                    "See the round port in the upper wall? It lines up with the setting sun at the solstice. There are others for the moon. This was an observatory. That's where my money is, anyway.",
                    "Folks ask me where the builders 'went.' Ask the O'odham down the road. They'll tell you nobody went anywhere."
                ]}
            ],
            enemies: [
                { type: 'spider', x: 100, y: 350 },
                { type: 'spider', x: 500, y: 100 },
                { type: 'attacking_ghost', x: 320, y: 150 }
            ],
            critters: [
                { type: 'lizard', x: 150, y: 420 }
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
            name: "White Tank Mountains Petroglyphs", background: "#D2691E",
            objects: [
                { type: "petroglyph_panel", x: 100, y: 100, width: 64, height: 64, text: "Spirals and tally lines. You count one sequence twice: it comes out the same both times. Deliberate. Precise." },
                { type: "petroglyph_panel", x: 400, y: 250, width: 64, height: 64, text: "The star-scorpion panel. A circle with rays beside Scorpius. AD 1006, the anchor of the whole calendar.", questTrigger: {
                    id: 'supernova_read',
                    description: 'The star panel: the great star of AD 1006 anchors the calendar.',
                    startText: "There it is. A scorpion of stars, and beside it, a circle with rays, far too bright to be the moon. Your 1956 sketch, line for line. If this records the great star of AD 1006, then every count on the calendar stick is a DATE. The whole stick is a ledger of the sky, and its last entry lands on a solstice."
                }},
                { type: "rock", x: 250, y: 150 },
                { type: 'campfire_remains', x: 160, y: 400 },
                { type: 'fruit_cactus', x: 480, y: 400 },
                { type: "doorway", x: 0, y: 232, toMap: 'sky_people_shrine', toX: CANVAS_WIDTH - 70, toY: 200, text: "To South Mtn." },
                { type: "doorway", x: CANVAS_WIDTH - 48, y: 120, toMap: 'asu_lab', toX: 50, toY: 240, text: "To ASU" },
                { type: 'rock', x: 50, y: 200, width: 40, height: 40, solid: true, color: '#8A7967' },
                { type: 'cactus', x: 300, y: 50 },
                { type: 'interactive_point', x: 200, y: 350, text: "The air is unusually still here. Nine hundred years ago, someone stood on this spot and watched a new star outshine everything in the sky for weeks." },
            ],
            npcs: [
                { name: "Petroglyph Researcher", x: 500, y: 100, dialog: [
                    "These panels are centuries old. The star-and-scorpion one? There's a claim it records the supernova of 1006: Scorpius rising, the guest star beside it. It's disputed. It should be disputed. That's how this works.",
                    "But disputed isn't debunked. If it's right, somebody here did naked-eye astronomy precise enough to date a stellar explosion. No telescope. Just patience and a chisel.",
                    "People keep asking me if it's aliens. It's better than aliens. It's people."
                ]}
            ],
            enemies: [
                { type: 'coyote', x: 150, y: 350 },
                { type: 'gila_monster', x: 400, y: 420 },
                { type: 'vulture', x: 520, y: 320 }
            ],
            critters: [
                { type: 'jackrabbit', x: 350, y: 150 },
                { type: 'lizard', x: 180, y: 280 }
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
                { type: 'asu_banner', x: 150, y: 36 },
                { type: 'computer_terminal', x: 100, y: 100, text: "ASU mainframe: solar ephemeris loaded. JUNE 21 1986: SUNRISE 05:18, AZIMUTH 60.9 DEG. Simulation copied to your pocket computer. The alignments will read at dawn and dusk." },
                { type: 'lab_bench', x: 200, y: 150 },
                { type: 'server_rack', x: 500, y: 80 },
                { type: 'phoenix_statue', x: 300, y: 50 },
                { type: 'sparky_statue', x: 56, y: 150 },
                { type: 'bulletin_board', x: 250, y: 250 },
                { type: 'trophy_case', x: 560, y: 280 },
                { type: 'potted_palm', x: 40, y: 380 },
                { type: 'potted_palm', x: 590, y: 410 },
                { type: 'interactive_point', x: 420, y: 160, text: "Through the window: Palm Walk shimmers in the heat, and past it the gold 'A' on the butte above Tempe. People were pecking symbols into that hill a thousand years before anyone painted a letter on it." },
                { type: 'interactive_point', x: 180, y: 300, text: "Microfiche: 1912 canal survey maps overlaid on last year's aerial photos. One alignment segment sits just outside the grading permit. Untouched. For now." },
                { type: 'secret_panel', x: 300, y: 400, portalOnInteract: true, toMap: 'artifact_chamber', toX: CANVAS_WIDTH / 2 - 16, toY: CANVAS_HEIGHT - 80, interactionText: "Push what cannot fly. The statue grinds aside: a maintenance stair, down into the old utility vault beneath the building. The canal segment runs directly below." },
                { type: 'doorway', x: 0, y: 232, toMap: 'white_tanks_petroglyphs', toX: CANVAS_WIDTH - 70, toY: 120, text: "Exit" }
            ],
            npcs: [
                { name: "Grad Student", x: 400, y: 300, dialog: [
                    "Working on my thesis... don't mind the mess.",
                    "You're the second person this month to pull the 1912 canal surveys. A Mr. Cutler requested the same boxes last week. Paid the copy fees in cash.",
                    "If you need a break, Mill Avenue has coffee, and Gammage runs a summer organ series. Frank Lloyd Wright built it. It's sort of our pyramid.",
                    "The planetarium's ephemeris program is on the mainframe if you need sky positions. Any date you want. It's 1986. The future is now, Professor."
                ]},
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
        artifact_chamber: {
            name: 'The Vault Beneath the Canal Line', background: '#301020', indoor: true,
            objects: [
                { type: 'pedestal', x: CANVAS_WIDTH / 2 - 16, y: CANVAS_HEIGHT / 2 - 16 },
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
