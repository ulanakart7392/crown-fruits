import React from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';

import FruitSprite from './FruitSprite';
import GlossPanel from './GlossPanel';
import { spriteCrown } from '../assets';
import { C, NUMERIC } from '../constants/theme';
import { RECIPE_BAR_H, RECIPE_NEED } from '../constants/config';
import { Progress } from '../game/engine';
import { Recipe } from '../game/recipes';

type Props = {
  recipe: Recipe;
  progress: Progress;
  index: number;
  total: number;
  pulse: Animated.Value;
};

/** The golden slot frame: which recipe is live and how much of it is stocked. */
export default function RecipeBar({ recipe, progress, index, total, pulse }: Props) {
  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });

  return (
    <Animated.View pointerEvents="box-none" style={[styles.wrap, { transform: [{ scale }] }]}>
      <GlossPanel borderColor={C.gold} radius={16} style={styles.panel}>
        <View style={styles.inner}>
          <View style={styles.left}>
            <Text style={styles.kicker}>RECIPE</Text>
            <Text style={[styles.count, NUMERIC]}>
              {index + 1}/{total}
            </Text>
          </View>

          <Text style={[styles.title, { color: recipe.color }]} numberOfLines={1}>
            {recipe.title}
          </Text>

          <View style={styles.fruits}>
            {recipe.fruits.map(f => {
              const have = progress[f] || 0;
              const full = have >= RECIPE_NEED;
              return (
                <View key={f} style={styles.slot}>
                  <FruitSprite id={f} size={30} glow={false} />
                  <Text
                    style={[
                      styles.tally,
                      NUMERIC,
                      { color: full ? C.success : C.textSoft },
                    ]}>
                    {have}/{RECIPE_NEED}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </GlossPanel>

      <Image source={spriteCrown} style={styles.crown} resizeMode="contain" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  panel: { width: '100%', height: RECIPE_BAR_H },
  inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
  },
  left: { alignItems: 'flex-start', width: 52 },
  kicker: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: C.textMuted,
  },
  count: {
    fontSize: 18,
    fontWeight: '900',
    color: C.gold,
  },
  title: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  fruits: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  slot: { alignItems: 'center', width: 34 },
  tally: {
    marginTop: 1,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  crown: {
    position: 'absolute',
    top: -13,
    width: 26,
    height: 26,
  },
});
