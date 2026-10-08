import { FRUIT_POOL, FruitId, Recipe } from './recipes';
import { RECIPE_NEED } from '../constants/config';

export type SpawnKind = 'recipe' | 'other';
export type SpawnStep = { lane: number; kind: SpawnKind };

/**
 * Deterministic spawn script (index = spawn counter, wraps around).
 *
 * The basket starts in the centre lane and stays there when nobody plays, so
 * the script controls exactly what an untouched round looks like: a steady
 * stream of correct catches (recipe progress is visible on screen) and a
 * single wrong catch around the 10s mark. Nothing fatal resolves early, which
 * keeps the board on screen for the whole capture window.
 */
export const SPAWN_SCRIPT: SpawnStep[] = [
  { lane: 0, kind: 'recipe' },
  { lane: 1, kind: 'recipe' },
  { lane: 2, kind: 'other' },
  { lane: 1, kind: 'recipe' },
  { lane: 0, kind: 'other' },
  { lane: 2, kind: 'recipe' },
  { lane: 1, kind: 'recipe' },
  { lane: 0, kind: 'recipe' },
  { lane: 1, kind: 'recipe' },
  { lane: 2, kind: 'other' },
  { lane: 1, kind: 'other' },
  { lane: 0, kind: 'recipe' },
  { lane: 1, kind: 'recipe' },
  { lane: 2, kind: 'recipe' },
  { lane: 0, kind: 'other' },
  { lane: 1, kind: 'recipe' },
  { lane: 2, kind: 'other' },
  { lane: 0, kind: 'recipe' },
  { lane: 1, kind: 'recipe' },
  { lane: 2, kind: 'recipe' },
  { lane: 0, kind: 'other' },
  { lane: 1, kind: 'recipe' },
  { lane: 2, kind: 'other' },
  { lane: 0, kind: 'recipe' },
  { lane: 2, kind: 'recipe' },
  { lane: 1, kind: 'recipe' },
  { lane: 0, kind: 'other' },
  { lane: 2, kind: 'recipe' },
  { lane: 1, kind: 'recipe' },
  { lane: 0, kind: 'recipe' },
  { lane: 2, kind: 'other' },
  { lane: 1, kind: 'recipe' },
  { lane: 0, kind: 'recipe' },
  { lane: 1, kind: 'other' },
  { lane: 2, kind: 'recipe' },
  { lane: 1, kind: 'recipe' },
  { lane: 0, kind: 'other' },
  { lane: 2, kind: 'recipe' },
  { lane: 1, kind: 'recipe' },
  { lane: 0, kind: 'recipe' },
];

export type Progress = Partial<Record<FruitId, number>>;

/** Fruit to drop for a scripted step, given the live recipe and progress. */
export function pickFruit(step: SpawnStep, recipe: Recipe, progress: Progress, seq: number): FruitId {
  if (step.kind === 'recipe') {
    const wanted = recipe.fruits.filter(f => (progress[f] || 0) < RECIPE_NEED);
    const from = wanted.length > 0 ? wanted : recipe.fruits;
    return from[seq % from.length];
  }
  const others = FRUIT_POOL.filter(f => recipe.fruits.indexOf(f) === -1);
  return others[seq % others.length];
}

export type Verdict = 'catch' | 'mistake' | 'spill' | 'missed';

/** What happens when an item reaches the basket line. */
export function verdict(
  itemLane: number,
  basketLane: number,
  fruit: FruitId,
  kind: SpawnKind,
  recipe: Recipe,
  progress: Progress,
): Verdict {
  if (itemLane !== basketLane) {
    return 'missed';
  }
  const wanted = recipe.fruits.indexOf(fruit) !== -1;
  if (wanted && (progress[fruit] || 0) < RECIPE_NEED) {
    return 'catch';
  }
  if (!wanted && kind === 'other') {
    return 'mistake';
  }
  return 'spill';
}

/** True once both fruits of the recipe are stocked. */
export function recipeDone(recipe: Recipe, progress: Progress): boolean {
  return recipe.fruits.every(f => (progress[f] || 0) >= RECIPE_NEED);
}

export function emptyProgress(): Progress {
  return {};
}
