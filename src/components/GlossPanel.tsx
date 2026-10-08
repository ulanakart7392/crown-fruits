import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { C, G } from '../constants/theme';

type Props = {
  children?: React.ReactNode;
  borderColor?: string;
  background?: string;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

/** Glossy Y2K surface: coloured glow border, inner highlight, top sheen. */
export default function GlossPanel({
  children,
  borderColor,
  background,
  radius = 18,
  style,
}: Props) {
  return (
    <View
      style={[
        styles.wrap,
        {
          borderRadius: radius,
          borderColor: borderColor || C.borderGold,
          backgroundColor: background || 'rgba(10,16,30,0.72)',
        },
        style,
      ]}>
      <View
        pointerEvents="none"
        style={[styles.inner, { borderRadius: radius - 2 }]}
      />
      <LinearGradient
        pointerEvents="none"
        colors={G.glossTop}
        style={[
          styles.sheen,
          { borderTopLeftRadius: radius, borderTopRightRadius: radius },
        ]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 2,
    overflow: 'hidden',
  },
  inner: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  sheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
});
