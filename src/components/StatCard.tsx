import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { C, NUMERIC } from '../constants/theme';

type Props = {
  value: string;
  label: string;
  valueColor: string;
};

/**
 * One stat pill. No raster icons — a coloured accent dot carries the meaning,
 * so every pill in a row has identical geometry.
 */
export default function StatCard({ value, label, valueColor }: Props) {
  return (
    <View style={[styles.card, { borderColor: valueColor + '55' }]}>
      <View style={[styles.dot, { backgroundColor: valueColor }]} />
      <Text style={[styles.value, NUMERIC, { color: valueColor }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: 'rgba(255,241,215,0.06)',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 6,
  },
  value: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  label: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: C.textMuted,
  },
});
