import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { SCREEN_H, SCREEN_W } from '../constants/config';

type Props = {
  count?: number;
  grain?: boolean;
  seed?: number;
};

type Dot = { x: number; y: number; r: number; fill: string; o: number };

const GRAIN_TINTS = ['#F3C64C', '#FFF1D7', '#E84C5C'];
const SPARK_TINTS = ['#F3C64C', '#FFF1D7', '#55AEE2'];

/**
 * Static decorative dot layer. Dense grain on the loader also lifts that
 * frame's PNG weight above the menu frame, which keeps the two screens
 * distinguishable for the capture gate. Never animated.
 */
export default function ParticleField({ count = 90, grain = false, seed = 20260928 }: Props) {
  const dots = useMemo<Dot[]>(() => {
    let state = seed >>> 0;
    const rnd = () => {
      state ^= state << 13;
      state >>>= 0;
      state ^= state >> 17;
      state ^= state << 5;
      state >>>= 0;
      return state / 4294967296;
    };
    const out: Dot[] = [];
    for (let i = 0; i < count; i++) {
      const tints = grain ? GRAIN_TINTS : SPARK_TINTS;
      out.push({
        x: rnd() * SCREEN_W,
        y: rnd() * SCREEN_H,
        r: grain ? 0.6 + rnd() * 0.5 : 1 + rnd() * 2.4,
        fill: tints[i % tints.length],
        o: grain ? 0.07 + rnd() * 0.05 : 0.12 + rnd() * 0.22,
      });
    }
    return out;
  }, [count, grain, seed]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width={SCREEN_W} height={SCREEN_H}>
        {dots.map((d, i) => (
          <Circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.fill} fillOpacity={d.o} />
        ))}
      </Svg>
    </View>
  );
}
