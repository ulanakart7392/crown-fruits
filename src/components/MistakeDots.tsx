import React from 'react';
import { StyleSheet, View } from 'react-native';

import { C } from '../constants/theme';
import { MAX_MISTAKES } from '../constants/config';

type Props = { mistakes: number };

/** Three diamonds; each wrong catch lights one up. */
export default function MistakeDots({ mistakes }: Props) {
  const slots = [];
  for (let i = 0; i < MAX_MISTAKES; i++) {
    const used = i < mistakes;
    slots.push(
      <View
        key={i}
        style={[
          styles.dot,
          used ? styles.used : styles.free,
        ]}
      />,
    );
  }
  return <View style={styles.row}>{slots}</View>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  dot: {
    width: 12,
    height: 12,
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
    borderWidth: 1,
  },
  free: {
    backgroundColor: 'rgba(255,241,215,0.10)',
    borderColor: 'rgba(255,241,215,0.30)',
  },
  used: {
    backgroundColor: C.danger,
    borderColor: '#FFC9CE',
    shadowColor: C.danger,
    shadowOpacity: 0.8,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
});
