import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { FRUIT_COLORS, FRUIT_SPRITES, FruitId } from '../game/recipes';

type Props = {
  id: FruitId;
  size: number;
  glow?: boolean;
};

/**
 * Transparent AI sprite over a soft coloured glow. No overflow:hidden wrapper —
 * the sprites already ship cut out, a clipping wrapper would add a visible bubble.
 */
export default function FruitSprite({ id, size, glow = true }: Props) {
  const tint = FRUIT_COLORS[id];
  const halo = Math.round(size * 0.82);
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {glow ? (
        <View
          pointerEvents="none"
          style={[
            styles.halo,
            {
              width: halo,
              height: halo,
              borderRadius: halo / 2,
              backgroundColor: tint + '3A',
            },
          ]}
        />
      ) : null}
      <Image
        source={FRUIT_SPRITES[id]}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute' },
});
