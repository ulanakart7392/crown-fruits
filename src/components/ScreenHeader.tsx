import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

import { C, R } from '../constants/theme';
import { HEADER_H, HEADER_PAD_TOP } from '../constants/config';

type Props = {
  title: string;
  onBack?: () => void;
  backLabel?: string;
  right?: React.ReactNode;
  BackIcon?: React.ComponentType<any>;
};

/** Single header used by every screen so badges and padding never drift. */
export default function ScreenHeader({ title, onBack, backLabel, right, BackIcon }: Props) {
  const Icon = BackIcon || ArrowLeft;
  return (
    <View style={styles.wrap}>
      <View style={styles.slot}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={backLabel || 'Back'}
            onPress={onBack}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.backBtn}>
            <Icon size={20} color={C.gold} strokeWidth={2.5} />
          </Pressable>
        ) : (
          <View style={styles.backSpacer} />
        )}
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.slotRight}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: HEADER_H + HEADER_PAD_TOP,
    paddingTop: HEADER_PAD_TOP,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.30)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(243,198,76,0.25)',
  },
  slot: { width: 56, alignItems: 'flex-start', justifyContent: 'center' },
  slotRight: { minWidth: 56, alignItems: 'flex-end', justifyContent: 'center' },
  backSpacer: { width: 48, height: 48 },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: R.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,241,215,0.08)',
    borderWidth: 1,
    borderColor: C.borderGold,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: C.gold,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.6,
  },
});
