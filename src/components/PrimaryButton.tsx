import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { C, G, goldShadow } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

type Props = {
  label: string;
  onPress: () => void;
  Icon?: React.ComponentType<any>;
  colors?: string[];
  labelColor?: string;
  height?: number;
};

const ICON = 24;

/**
 * Gold CTA. Pressable is the parent, the animated layer is its child — the
 * arrangement that keeps onPress alive on Android release builds.
 */
export default function PrimaryButton({
  label,
  onPress,
  Icon,
  colors,
  labelColor,
  height = 62,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.96);
  const fill = colors || G.gold;
  const ink = labelColor || '#18233B';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.press, { height }]}>
      <Animated.View
        style={[styles.body, { height, transform: [{ scale }] }, goldShadow]}>
        <LinearGradient
          colors={fill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.fill}
        />
        <LinearGradient pointerEvents="none" colors={G.glossTop} style={styles.sheen} />
        <View style={styles.row}>
          {Icon ? <Icon size={ICON} color={ink} strokeWidth={2.6} /> : null}
          <Text style={[styles.label, { color: ink }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%' },
  body: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  sheen: { position: 'absolute', top: 0, left: 0, right: 0, height: '42%' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 20,
    lineHeight: ICON,
    fontWeight: '900',
    letterSpacing: 2,
    color: C.bgBase,
  },
});
