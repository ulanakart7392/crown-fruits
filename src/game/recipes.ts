import {
  spriteCherry,
  spriteGrape,
  spriteLemon,
  spriteLime,
  spritePlum,
} from '../assets';

export type FruitId = 'cherry' | 'lemon' | 'lime' | 'plum' | 'grape';

export type Recipe = {
  id: string;
  title: string;
  color: string;
  fruits: FruitId[];
};

/** Four festive recipes, each asking for two fruits (2 of each). */
export const RECIPES: Recipe[] = [
  { id: 'r1', title: 'SPRING TART', color: '#54C37B', fruits: ['lime', 'lemon'] },
  { id: 'r2', title: 'SUMMER PUNCH', color: '#55AEE2', fruits: ['cherry', 'grape'] },
  { id: 'r3', title: 'HARVEST PIE', color: '#E8A24C', fruits: ['plum', 'lemon'] },
  { id: 'r4', title: 'CROWN FEAST', color: '#F3C64C', fruits: ['cherry', 'plum'] },
];

export const FRUIT_POOL: FruitId[] = ['cherry', 'lemon', 'lime', 'plum', 'grape'];

export const FRUIT_SPRITES: Record<FruitId, number> = {
  cherry: spriteCherry,
  lemon: spriteLemon,
  lime: spriteLime,
  plum: spritePlum,
  grape: spriteGrape,
};

export const FRUIT_COLORS: Record<FruitId, string> = {
  cherry: '#E84C5C',
  lemon: '#F3C64C',
  lime: '#54C37B',
  plum: '#9B6BD6',
  grape: '#55AEE2',
};

export const FRUIT_LABELS: Record<FruitId, string> = {
  cherry: 'CHERRY',
  lemon: 'LEMON',
  lime: 'LIME',
  plum: 'PLUM',
  grape: 'GRAPE',
};
