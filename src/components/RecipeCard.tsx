import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import FruitSprite from './FruitSprite';
import GlossPanel from './GlossPanel';
import { C, NUMERIC } from '../constants/theme';
import { RECIPE_NEED } from '../constants/config';
import { Recipe } from '../game/recipes';

type Props = {
  recipe: Recipe;
  order: number;
  served: boolean;
  compact?: boolean;
};

/** Recipe tile — full row on the recipes screen, square slot on the result. */
export default function RecipeCard({ recipe, order, served, compact }: Props) {
  const need = RECIPE_NEED * recipe.fruits.length;

  if (compact) {
    return (
      <GlossPanel
        borderColor={served ? recipe.color : 'rgba(255,241,215,0.14)'}
        background={served ? 'rgba(255,241,215,0.08)' : 'rgba(10,16,30,0.55)'}
        radius={16}
        style={styles.slot}>
        <View style={[styles.slotInner, served ? null : styles.dimmed]}>
          <View style={styles.slotFruits}>
            {recipe.fruits.map(f => (
              <FruitSprite key={f} id={f} size={30} glow={served} />
            ))}
          </View>
          <Text
            style={[styles.slotTitle, { color: served ? C.text : C.textMuted }]}
            numberOfLines={1}>
            {recipe.title}
          </Text>
          <Text style={[styles.slotMark, { color: served ? C.success : C.textMuted }]}>
            {served ? '✓ SERVED' : 'LOCKED'}
          </Text>
        </View>
      </GlossPanel>
    );
  }

  return (
    <GlossPanel
      borderColor={recipe.color + '80'}
      background="rgba(255,241,215,0.06)"
      radius={18}
      style={styles.row}>
      <View style={styles.rowInner}>
        <View style={[styles.order, { backgroundColor: recipe.color }]}>
          <Text style={[styles.orderText, NUMERIC]}>{order}</Text>
        </View>

        <View style={styles.rowBody}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {recipe.title}
          </Text>
          <View style={styles.rowFruits}>
            {recipe.fruits.map(f => (
              <View key={f} style={styles.rowFruit}>
                <FruitSprite id={f} size={28} glow={false} />
                <Text style={[styles.rowQty, NUMERIC]}>x{RECIPE_NEED}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.pill, { borderColor: recipe.color }]}>
          <Text style={[styles.pillText, NUMERIC, { color: recipe.color }]}>
            {served ? need : 0}/{need}
          </Text>
        </View>
      </View>
    </GlossPanel>
  );
}

const styles = StyleSheet.create({
  row: { width: '100%', height: 96 },
  rowInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 12,
  },
  order: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderText: { color: '#18233B', fontSize: 16, fontWeight: '900' },
  rowBody: { flex: 1, justifyContent: 'center' },
  rowTitle: {
    color: C.text,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  rowFruits: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 6 },
  rowFruit: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  rowQty: {
    color: C.textSoft,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 14,
  },
  pill: {
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  pillText: { fontSize: 12, fontWeight: '900', letterSpacing: 0.6 },
  slot: { width: '100%', height: 116 },
  slotInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    gap: 4,
  },
  dimmed: { opacity: 0.35 },
  slotFruits: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  slotTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  slotMark: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
});
