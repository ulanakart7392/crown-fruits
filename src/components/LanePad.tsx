import React, { useCallback } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { C, G } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

type Props = {
  index: number;
  active: boolean;
  onSelect: (index: number) => void;
};

/** Lane pad. The word TAP is part of the harness vocabulary on purpose. */
export default function LanePad({ index, active, onSelect }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.94);
  const press = useCallback(() => onSelect(index), [index, onSelect]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={'Move basket to lane ' + (index + 1)}
      onPress={press}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={styles.press}>
      <Animated.View
        style={[
          styles.body,
          active ? styles.bodyActive : styles.bodyIdle,
          { transform: [{ scale }] },
        ]}>
        {active ? (
          <LinearGradient
            pointerEvents="none"
            colors={G.gold}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.fill}
          />
        ) : null}
        <LinearGradient pointerEvents="none" colors={G.glossTop} style={styles.sheen} />
        <Text style={[styles.tap, { color: active ? '#18233B' : C.text }]}>TAP</Text>
        <Text
          style={[
            styles.sub,
            { color: active ? 'rgba(24,35,59,0.70)' : C.textMuted },
          ]}>
          LANE {index + 1}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { flex: 1, height: 64 },
  body: {
    width: '100%',
    height: 64,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  bodyIdle: {
    backgroundColor: 'rgba(255,241,215,0.08)',
    borderColor: 'rgba(243,198,76,0.30)',
  },
  bodyActive: {
    borderColor: 'rgba(255,255,255,0.55)',
    backgroundColor: 'transparent',
  },
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  sheen: { position: 'absolute', top: 0, left: 0, right: 0, height: '42%' },
  tap: { fontSize: 16, fontWeight: '900', letterSpacing: 1.4, lineHeight: 20 },
  sub: { fontSize: 9, fontWeight: '700', letterSpacing: 1.2, marginTop: 2 },
});
