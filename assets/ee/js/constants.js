export const CANVAS_WIDTH = 640;
export const CANVAS_HEIGHT = 480;
export const PLAYER_SPEED = 2;
export const HYDRATION_RATE = 0.05;
export const HYDRATION_PER_DRINK = 30;
export const GAME_TIME_MULTIPLIER = 60;
export const INTERACTION_RANGE = 20;
export const DEHYDRATION_DAMAGE_INTERVAL = 120;
export const DEHYDRATION_DAMAGE = 1;
export const ANIMATION_CYCLE_FRAMES = 8;
export const WALK_FRAMES = 4;
export const SCREEN_FLASH_DURATION = 100;
export const SAVE_NOTIFICATION_DURATION = 1500;
export const SHAKE_DURATION = 500;
export const SHAKE_INTERVAL = 50;
export const SHAKE_INTENSITY = 10;
export const ARROW_LIFESPAN = 180;
export const TURRET_COOLDOWN = 180;
export const TURRET_ARROW_SPEED = 3;
export const TURRET_ARROW_DAMAGE = 10;
export const TURRET_AGGRO_RANGE = 200;
export const DEFAULT_AGGRO_RANGE = 150;
export const DEFAULT_ATTACK_RANGE = 20;
export const DEFAULT_ATTACK_COOLDOWN = 120;
export const ENEMY_KNOCKBACK = 10;
export const DAY_START_HOUR = 6;
export const DAY_END_HOUR = 20;
export const INITIAL_GAME_HOUR = 8;

// Player melee combat
export const PLAYER_ATTACK_DAMAGE = 25;
export const PLAYER_ATTACK_RANGE = 34;
export const PLAYER_ATTACK_COOLDOWN = 35;
export const PLAYER_ATTACK_DURATION = 14;
export const PLAYER_ATTACK_KNOCKBACK = 26;

// Enemy idle behavior
export const ENEMY_WANDER_SPEED_FACTOR = 0.4;
export const ENEMY_WANDER_RADIUS = 80;

// Checkpoint save slot in localStorage
export const SAVE_KEY = 'desert_chronicles_save_v1';

export const GAME_STATE = {
    START_SCREEN: 'START_SCREEN',
    INTRO: 'INTRO',
    LOADING: 'LOADING',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    DIALOG: 'DIALOG',
    PUZZLE: 'PUZZLE',
    MAP_VIEW: 'MAP_VIEW',
    WIN: 'WIN',
    GAME_OVER: 'GAME_OVER',
};
