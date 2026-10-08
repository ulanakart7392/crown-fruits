import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { C, G } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

type Props = {
  label: string;
  onPress: () => void;
  Icon?: React.ComponentType<any>;
  tint?: string;
  height?: number;
  style?: any;
};

const ICON = 24;

/** Quiet action: translucent fill, thin gold glow border, same icon metrics. */
export default function SecondaryButton({
  label,
  onPress,
  Icon,
  tint,
  height = 50,
  style,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.96);
  const ink = tint || C.text;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.press, { height }, style]}>
      <Animated.View style={[styles.body, { height, transform: [{ scale }] }]}>
        <LinearGradient pointerEvents="none" colors={G.glossTop} style={styles.sheen} />
        <View style={styles.row}>
          {Icon ? <Icon size={ICON} color={ink} strokeWidth={2.4} /> : null}
          <Text style={[styles.label, { color: ink }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { flex: 1 },
  body: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,241,215,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(243,198,76,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheen: { position: 'absolute', top: 0, left: 0, right: 0, height: '38%' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 14,
    lineHeight: ICON,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
});
