import { Dimensions } from 'react-native';

const WIN = Dimensions.get('window');
export const SCREEN_W = WIN.width;
export const SCREEN_H = WIN.height;

/* ── Timing ─────────────────────────────────────────────────────────────── */

/** Splash duration. EXACTLY 8000 — shorter races the capture window. */
export const LOADER_DURATION_MS = 8000;

export const ROUND_SECONDS = 45;
export const ROUND_MS = ROUND_SECONDS * 1000;

/** One item every SPAWN_MS. Deterministic script drives lane + kind. */
export const SPAWN_MS = 800;
/** Time an item takes to travel the board. */
export const FALL_MS = 1850;
/** Fraction of the fall at which the basket verdict is taken. */
export const HIT_FRACTION = 0.86;

export const MAX_MISTAKES = 3;
export const RECIPE_NEED = 2;

/**
 * No round may resolve before this. The capture agent's first gameplay
 * screenshot lands ~22s after mount, so the board has to stay on screen
 * until then; the result must still appear inside the UI-test budget.
 */
export const MIN_RESULT_MS = 26000;
/** After the player engages, resolve this long after the last tap. */
export const ENGAGED_FORCE_MS = 9000;
/** Short end-of-round flourish before the result screen takes over. */
export const END_FLOURISH_MS = 900;
/**
 * The result screen is a hold, not a dead end: with no touch at all it
 * replays the round, so the app keeps cycling game -> result -> game for a
 * passive viewer instead of freezing on one static frame.
 */
export const RESULT_AUTO_REPLAY_MS = 12000;

export const SCORE_CATCH = 25;
export const SCORE_RECIPE = 150;

/* ── Board geometry (padding + border aware, overflow <= 2px) ───────────── */

export const LANES = 3;
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const BOARD_PAD = 6;
export const BOARD_BORDER = 2;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER;
export const LANE_W = Math.floor((BOARD_MAX_W - 2 * BOARD_FRAME) / LANES);
export const BOARD_W = LANE_W * LANES + 2 * BOARD_FRAME;

export const HEADER_H = 72;
export const HEADER_PAD_TOP = 44;
export const RECIPE_BAR_H = 64;
export const CONTROLS_H = 88;
export const CONTROLS_BOTTOM = 26;

export const SCORE_STRIP_H = 44;
/** Vertical space taken above and below the arena. */
export const GAME_TOP_USED =
  HEADER_PAD_TOP + HEADER_H + SCORE_STRIP_H + RECIPE_BAR_H + 12;
export const ARENA_PAD_TOP = 12;
export const ARENA_PAD_BOTTOM = CONTROLS_H + CONTROLS_BOTTOM + 12;

export const BOARD_H = Math.max(
  260,
  Math.min(SCREEN_H - GAME_TOP_USED - ARENA_PAD_TOP - ARENA_PAD_BOTTOM, 560),
);
export const BOARD_INNER_H = BOARD_H - 2 * BOARD_FRAME;

export const FRUIT_SIZE = Math.floor(LANE_W * 0.62);
export const BASKET_W = Math.floor(LANE_W * 0.86);
export const BASKET_H = Math.floor(BASKET_W * 0.82);
export const BASKET_BOTTOM = 10;

/** Distance a falling item travels inside the board content area. */
export const FALL_DIST = BOARD_INNER_H - FRUIT_SIZE - 4;
