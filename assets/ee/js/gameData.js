import { CANVAS_WIDTH, CANVAS_HEIGHT, HYDRATION_PER_DRINK, GAME_STATE } from './constants.js';

export function getObjectTypes() {
    return {
        cactus: { width: 32, height: 48, solid: true, color: '#2D7D40' },
        rock: { width: 32, height: 32, solid: true, color: '#7D7064' },
        crater: { name: "Impact Crater", width: 80, height: 40, solid: false, interactive: true, text: "A strange, smooth crater. It looks recent.", color: '#5B3A29' },
        chest: { width: 32, height: 32, solid: true, interactive: true, color: '#8B4513', opened: false },
        sign: { width: 32, height: 32, solid: false, interactive: true, color: '#DAA520' },
        interactive_point: { width: 32, height: 32, solid: false, interactive: true, color: '#DAA520' },
        petroglyph_panel: { name: "Petroglyphs", width: 48, height: 48, solid: false, interactive: true, color: '#8B4513' },
        ancient_symbol: { name: "Ancient Symbol", width: 32, height: 32, solid: false, interactive: true, color: '#DAA520' },
        doorway: { width: 48, height: 16, solid: false, portal: true, color: '#555555', interactive: true },
        water_source: { width: 32, height: 32, solid: false, interactive: true, color: '#3377CC' },
        computer_terminal: { name: "Computer", width: 32, height: 32, solid: true, interactive: true, color: '#222222' },
        lab_bench: { name: "Lab Bench", width: 96, height: 32, solid: true, interactive: false, color: '#777777' },
        server_rack: { name: "Server Rack", width: 48, height: 128, solid: true, interactive: true, color: '#333333', text: "Humming servers... data unknown." },
        secret_panel: { name: "Loose Panel", width: 32, height: 48, solid: true, interactive: true, color: '#6B5B4B' },
        pedestal: { name: "Artifact Pedestal", width: 32, height: 32, solid: true, interactive: true, color: '#8888AA', opened: false, triggersPuzzle: true, puzzleDetails: { question: "What are the first 5 digits of Pi?", options: ["3.1415", "3.1459", "3.1419"], correctAnswerIndex: 0 } },
        hohokam_canal: { name: "Ancient Canal", width: 128, height: 32, solid: false, interactive: true, color: '#658EA9', text: "A segment of an ancient Hohokam canal. Remarkably preserved." },
        platform_mound: { name: "Platform Mound", width: 96, height: 48, solid: true, interactive: true, color: '#B08D57', text: "This earthen mound likely held important structures." },
        sky_hole_wall: { name: "Observatory Wall", width: 32, height: 96, solid: true, interactive: true, color: '#A08C78', text: "A precisely placed aperture in this wall seems to align with celestial events." },
        phoenix_statue: { name: "Phoenix Statue", width: 48, height: 48, solid: true, interactive: true, color: '#FF8C00', text: "A statue of a Phoenix, symbol of rebirth. It feels warm to the touch." },
        fire_pit: { name: "Sacred Fire", width: 48, height: 32, solid: true, interactive: true, color: '#A0522D', text: "An eternal flame flickers here." },
        skull_turret: { name: "Guardian Skull", width: 32, height: 32, solid: true, interactive: false, color: '#E0E0E0' },
        tumbleweed: { name: "Tumbleweed", width: 24, height: 24, solid: false, interactive: false, color: '#A08050' },
        dead_tree: { name: "Dead Tree", width: 40, height: 56, solid: true, interactive: true, color: '#6B4226', text: "A sun-bleached tree. Nothing has grown here in years." },
        animal_bones: { name: "Animal Bones", width: 36, height: 20, solid: false, interactive: true, color: '#E8DCC8', text: "Bleached bones scattered in the sand. The desert is unforgiving." },
        campfire_remains: { name: "Old Campfire", width: 32, height: 24, solid: false, interactive: true, color: '#444', text: "The remains of a campfire. Someone was here not long ago." },
        desert_flower: { name: "Desert Flower", width: 16, height: 20, solid: false, interactive: true, color: '#FF69B4', text: "A resilient desert bloom. Life finds a way even here." },
        trail_marker: { name: "Trail Marker", width: 20, height: 28, solid: true, interactive: true, color: '#B8860B' },
        sand_dune: { name: "Sand Dune", width: 80, height: 32, solid: false, interactive: false, color: '#D4B483' },
    };
}

export function getEnemyTypes() {
    return {
        scorpion: { name: 'Scorpion', width: 32, height: 28, damage: 5, speed: 0.8, health: 30, color: '#704214', solid: true, interactive: true },
        snake: { name: 'Snake', width: 40, height: 12, damage: 8, speed: 1.2, health: 20, color: '#006400', solid: false, interactive: true },
        coyote: { name: 'Coyote', width: 40, height: 28, damage: 10, speed: 1.5, health: 50, color: '#B8860B', solid: true, interactive: true },
        spider: { name: 'Giant Spider', width: 36, height: 32, damage: 7, speed: 1.1, health: 40, color: '#3A3A3A', solid: true, interactive: false },
        attacking_ghost: { name: 'Restless Spirit', width: 24, height: 32, damage: 6, speed: 1.3, health: 35, color: '#A0B0D0', isEthereal: true, aggroRange: 180, solid: false, interactive: true },
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
        journal: { name: 'Journal', description: 'Contains research notes and quests.', useFunc: (game) => game.ui.toggleQuestLog() },
        artifact1: { name: 'Stone Tablet', description: 'Part of an ancient artifact set.' },
        final_artifact: { name: 'Arizona Artifact', description: 'The legendary treasure! Its power is immense.' },
    };
}

export function getMaps() {
    return {
        desert: {
            name: 'Sonoran Desert Outskirts', background: '#E2C9A1',
            objects: [
                // Cacti scattered around
                { type: 'cactus', x: 100, y: 80 },
                { type: 'cactus', x: 400, y: 130 },
                { type: 'cactus', x: 540, y: 60 },
                { type: 'cactus', x: 30, y: 180 },
                { type: 'cactus', x: 480, y: 380 },
                { type: 'cactus', x: 200, y: 430 },
                // Rocks
                { type: 'rock', x: 250, y: 190 },
                { type: 'rock', x: 350, y: 50, width: 40, height: 32 },
                { type: 'rock', x: 550, y: 300, width: 48, height: 36 },
                { type: 'rock', x: 80, y: 420 },
                // Sand dunes
                { type: 'sand_dune', x: 140, y: 350 },
                { type: 'sand_dune', x: 420, y: 440 },
                // Dead trees
                { type: 'dead_tree', x: 310, y: 280 },
                { type: 'dead_tree', x: 500, y: 180 },
                // Desert details
                { type: 'animal_bones', x: 460, y: 320 },
                { type: 'campfire_remains', x: 170, y: 150 },
                { type: 'desert_flower', x: 340, y: 220 },
                { type: 'desert_flower', x: 75, y: 360 },
                { type: 'desert_flower', x: 570, y: 420 },
                { type: 'tumbleweed', x: 280, y: 120 },
                { type: 'tumbleweed', x: 520, y: 250 },
                { type: 'tumbleweed', x: 60, y: 450 },
                // Trail markers
                { type: 'trail_marker', x: 430, y: 240, text: "Arrow scratched into the rock points east." },
                { type: 'trail_marker', x: 550, y: 190, text: "The canyon entrance lies ahead." },
                // Interactive points
                { type: 'sign', x: 150, y: 240, text: "Caution: Desert conditions ahead! Stay hydrated." },
                { type: 'interactive_point', x: 350, y: 350, text: "Lizard tracks crisscross the sand. Something large passed through here recently." },
                // Water & exit
                { type: 'water_source', x: 50, y: 300 },
                { type: 'doorway', x: CANVAS_WIDTH - 48, y: 232, toMap: 'canyon', toX: 50, toY: 240, text: "To Canyon" }
            ],
            npcs: [
                { name: 'Ranger Rick', x: 200, y: 300, dialog: [
                    "Howdy, Professor! Dehydration is no joke out here.",
                    "Strange lights in the sky lately... military says it's flares.",
                    "If you're heading east, watch for scorpions near the rocks.",
                    "There's an old well nearby if you need water."
                ]},
                { name: 'Lost Tourist', x: 450, y: 200, dialog: [
                    "Excuse me! Do you know the way back to Phoenix?",
                    "My rental car broke down about a mile back...",
                    "I swear I saw something glowing out past those rocks last night."
                ]},
                { name: 'Old Prospector', x: 100, y: 440, dialog: [
                    "Been panning these dry riverbeds for thirty years, son.",
                    "Gold? Nah... I'm looking for something older than gold.",
                    "The Hohokam knew things we've forgotten. Mark my words.",
                    "You look like a man on a mission. Good luck out there."
                ]}
            ],
            enemies: [
                { type: 'scorpion', x: 300, y: 400 },
                { type: 'scorpion', x: 520, y: 140 },
                { type: 'snake', x: 450, y: 90 },
                { type: 'snake', x: 180, y: 380 },
                { type: 'coyote', x: 380, y: 300 }
            ]
        },
        canyon: {
            name: 'Red Rock Canyon', background: '#BC6C25',
            objects: [
                { type: 'rock', x: 100, y: 100 },
                { type: 'chest', x: 400, y: 200, contains: 'artifact1', text: "You found an ancient stone tablet!" },
                { type: 'doorway', x: 0, y: 232, toMap: 'desert', toX: CANVAS_WIDTH - 70, toY: 240, text: "To Desert" },
                { type: 'doorway', x: CANVAS_WIDTH - 48, y: 100, toMap: 'camelback', toX: 50, toY: 100, text: "To Mt." },
                { type: 'crater', x: 300, y: 350, width: 100, height: 50 },
                { type: 'rock', x: 150, y: 350, width: 60, height: 40, solid: true, color: '#6B4226' },
                { type: 'cactus', x: 500, y: 80 },
            ],
            npcs: [{ name: 'Old Hermit', x: 250, y: 150, dialog: "The earth groans under the weight of secrets. Some are best left buried... or are they?" }],
            enemies: [{ type: 'coyote', x: 350, y: 100 }]
        },
        camelback: {
            name: 'Camelback Mountain Trail', background: '#A0B084',
            objects: [
                { type: 'sign', x: 50, y: 400, text: "Echo Canyon Trailhead" },
                { type: 'rock', x: 150, y: 350 },
                { type: 'interactive_point', x: 320, y: 50, text: "Scenic Overlook: A breathtaking view of Scottsdale." },
                { type: 'doorway', x: 0, y: 100, toMap: 'canyon', toX: CANVAS_WIDTH - 70, toY: 100, text: "To Canyon" },
                { type: 'doorway', x: CANVAS_WIDTH - 48, y: 200, toMap: 'hohokam_site', toX: 50, toY: 240, text: "Ancient Path" }
            ],
            npcs: [{ name: 'Tired Hiker', x: 450, y: 280, dialog: ["Almost... at the top... Need water!", "Watch out for loose rocks."] }],
            enemies: [{ type: 'snake', x: 200, y: 150 }]
        },
        hohokam_site: {
            name: "Hohokam Settlement Ruins", background: "#D2B48C",
            objects: [
                { type: "platform_mound", x: 300, y: 100, width: 120, height: 60 },
                { type: "platform_mound", x: 100, y: 350, width: 80, height: 40 },
                { type: "hohokam_canal", x: 50, y: 250, width: 540, height: 40 },
                { type: "interactive_point", x: 100, y: 50, text: "The remains of a vast canal system..." },
                { type: "rock", x: 500, y: 400 },
                { type: "doorway", x: 0, y: 232, toMap: 'camelback', toX: CANVAS_WIDTH - 70, toY: 200, text: "Back Trail" },
                { type: "doorway", x: CANVAS_WIDTH - 48, y: 150, toMap: 'casa_grande', toX: 50, toY: 240, text: "To Great House" }
            ],
            npcs: [{ name: "Hohokam Spirit", x: 350, y: 180, dialog: ["We followed the water... and the stars.", "Why we vanished... even the desert keeps that secret."] }],
            enemies: [{ type: 'scorpion', x: 450, y: 350 }, { type: 'coyote', x: 150, y: 150 }, { type: 'snake', x: 400, y: 300 }]
        },
        casa_grande: {
            name: "Casa Grande Ruins", background: "#C19A6B",
            objects: [
                { type: "sky_hole_wall", x: 200, y: 100, width: 32, height: 120 },
                { type: "sky_hole_wall", x: 400, y: 100, width: 32, height: 120 },
                { type: "sign", x: 300, y: 300, text: "The Great House - An ancient astronomical observatory." },
                { type: "doorway", x: 0, y: 232, toMap: 'hohokam_site', toX: CANVAS_WIDTH - 70, toY: 150, text: "To Settlement" },
                { type: "doorway", x: CANVAS_WIDTH - 48, y: 180, toMap: 'sky_people_shrine', toX: 50, toY: 240, text: "Spiritual Path" }
            ],
            npcs: [{ name: "Astronomer's Ghost", x: 300, y: 200, dialog: ["The sun, moon, Venus... they all danced for us.", "These walls tracked their movements, marking time."] }],
            enemies: [{ type: 'spider', x: 100, y: 350 }, { type: 'spider', x: 500, y: 100 }, { type: 'attacking_ghost', x: 320, y: 150 }]
        },
        sky_people_shrine: {
            name: "Sky People's Shrine", background: "#483D8B",
            objects: [
                { type: "ancient_symbol", x: 150, y: 150, text: "A depiction of the Sipapu, the Hopi emergence portal." },
                { type: "ancient_symbol", x: 450, y: 150, text: "Symbols resembling Kachinas, star spirits." },
                { type: "fire_pit", x: CANVAS_WIDTH / 2 - 24, y: 200 },
                { type: "skull_turret", x: 100, y: 300 },
                { type: "skull_turret", x: CANVAS_WIDTH - 132, y: 300 },
                { type: "interactive_point", x: 320, y: 50, text: "This place feels sacred, humming with ancient energy." },
                { type: "doorway", x: 0, y: 232, toMap: 'casa_grande', toX: CANVAS_WIDTH - 70, toY: 180, text: "To Ruins" },
                { type: "doorway", x: CANVAS_WIDTH - 48, y: 200, toMap: 'white_tanks_petroglyphs', toX: 50, toY: 240, text: "To Petroglyphs" }
            ],
            npcs: [{ name: "Tribal Elder Spirit", x: 300, y: 350, dialog: ["Our ancestors came from the stars.", "They taught us to live in balance with the cosmos."] }],
            enemies: []
        },
        white_tanks_petroglyphs: {
            name: "White Tank Mountains Petroglyphs", background: "#D2691E",
            objects: [
                { type: "petroglyph_panel", x: 100, y: 100, width: 64, height: 64, text: "Spirals and strange figures..." },
                { type: "petroglyph_panel", x: 400, y: 250, width: 64, height: 64, text: "Humanoids with large heads?" },
                { type: "rock", x: 250, y: 150 },
                { type: "doorway", x: 0, y: 232, toMap: 'sky_people_shrine', toX: CANVAS_WIDTH - 70, toY: 200, text: "To Shrine" },
                { type: "doorway", x: CANVAS_WIDTH - 48, y: 120, toMap: 'asu_lab', toX: 50, toY: 240, text: "To ASU" },
                { type: 'rock', x: 50, y: 200, width: 40, height: 40, solid: true, color: '#8A7967' },
                { type: 'cactus', x: 300, y: 50 },
                { type: 'interactive_point', x: 200, y: 350, text: "The air is unusually still here. The rocks seem to watch." },
            ],
            npcs: [{ name: "Petroglyph Researcher", x: 500, y: 100, dialog: ["These symbols are thousands of years old.", "Some say they depict star charts... or even visitors."] }],
            enemies: [{ type: 'coyote', x: 150, y: 350 }]
        },
        asu_lab: {
            name: 'ASU Engineering Lab', background: '#4A4A52',
            objects: [
                { type: 'computer_terminal', x: 100, y: 100, text: "System Offline. Project PHOENIX data corrupted." },
                { type: 'lab_bench', x: 200, y: 150 },
                { type: 'server_rack', x: 500, y: 80 },
                { type: 'phoenix_statue', x: 300, y: 50 },
                { type: 'secret_panel', x: 300, y: 400, portalOnInteract: true, toMap: 'artifact_chamber', toX: CANVAS_WIDTH / 2 - 16, toY: CANVAS_HEIGHT - 80, interactionText: "You push the Phoenix statue. A panel slides open!" },
                { type: 'doorway', x: 0, y: 232, toMap: 'white_tanks_petroglyphs', toX: CANVAS_WIDTH - 70, toY: 120, text: "Exit" }
            ],
            npcs: [{ name: "Grad Student", x: 400, y: 300, dialog: ["Working on my thesis... don't mind the mess.", "Heard whispers of a hidden chamber related to Project Phoenix."] }],
            enemies: []
        },
        artifact_chamber: {
            name: 'Hidden Artifact Chamber', background: '#301020',
            objects: [
                { type: 'pedestal', x: CANVAS_WIDTH / 2 - 16, y: CANVAS_HEIGHT / 2 - 16 },
                { type: 'interactive_point', x: CANVAS_WIDTH / 2 - 24, y: CANVAS_HEIGHT - 48, width: 48, height: 16, solid: true, interactive: true, color: '#3E2731', text: "You never had a choice. You just thought you did. Hope wasn't invited." }
            ],
            npcs: [],
            enemies: []
        }
    };
}

export const MAP_MUSIC = {
    desert: 'firstScenarioTheme',
    canyon: 'secondScenarioTheme',
    camelback: 'thirdScenarioTheme',
    hohokam_site: 'hohokamTheme',
    casa_grande: 'casaGrandeTheme',
    sky_people_shrine: 'skyPeopleTheme',
    white_tanks_petroglyphs: 'whiteTanksTheme',
    asu_lab: 'asuLabTheme',
    artifact_chamber: 'chamberTheme',
};
