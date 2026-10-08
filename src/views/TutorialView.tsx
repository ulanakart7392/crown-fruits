import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Rect } from 'react-native-svg';

import FruitSprite from '../components/FruitSprite';
import GlossPanel from '../components/GlossPanel';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import { bgGame } from '../assets';
import { C, G } from '../constants/theme';

type Props = {
  onStart: () => void;
  onBack: () => void;
};

/** Three plain steps, then straight into a round. */
export default function TutorialView({ onStart, onBack }: Props) {
  return (
    <ImageBackground source={bgGame} style={styles.root} resizeMode="cover">
      <LinearGradient colors={G.screen} style={styles.wash} />

      <ScreenHeader title="HOW TO PLAY" onBack={onBack} backLabel="Back to menu" />

      <View style={styles.body}>
        <GlossPanel radius={18} style={styles.card}>
          <View style={styles.cardInner}>
            <View style={styles.step}>
              <Text style={styles.stepNum}>1</Text>
            </View>
            <View style={styles.copy}>
              <Text style={styles.title}>MOVE THE BASKET</Text>
              <Text style={styles.text}>
                Tap a lane pad to slide the royal basket between the three chutes.
              </Text>
            </View>
            <Svg width={54} height={44}>
              <Rect x={1} y={1} width={15} height={42} rx={4} fill="rgba(255,241,215,0.10)" />
              <Rect x={19} y={1} width={15} height={42} rx={4} fill="rgba(243,198,76,0.55)" />
              <Rect x={37} y={1} width={15} height={42} rx={4} fill="rgba(255,241,215,0.10)" />
            </Svg>
          </View>
        </GlossPanel>

        <GlossPanel radius={18} style={styles.card}>
          <View style={styles.cardInner}>
            <View style={styles.step}>
              <Text style={styles.stepNum}>2</Text>
            </View>
            <View style={styles.copy}>
              <Text style={styles.title}>CATCH ONLY THE RECIPE</Text>
              <Text style={styles.text}>
                Two fruits are listed on the golden bar. Catch two of each.
              </Text>
            </View>
            <View style={styles.pair}>
              <FruitSprite id="lime" size={30} glow={false} />
              <FruitSprite id="lemon" size={30} glow={false} />
            </View>
          </View>
        </GlossPanel>

        <GlossPanel radius={18} style={styles.card}>
          <View style={styles.cardInner}>
            <View style={styles.step}>
              <Text style={styles.stepNum}>3</Text>
            </View>
            <View style={styles.copy}>
              <Text style={styles.title}>SKIP THE REST</Text>
              <Text style={styles.text}>
                Three wrong catches and the royal feast is ruined.
              </Text>
            </View>
            <View style={styles.marks}>
              <Text style={styles.mark}>✗</Text>
              <Text style={styles.mark}>✗</Text>
              <Text style={styles.mark}>✗</Text>
            </View>
          </View>
        </GlossPanel>

        <View style={styles.footer}>
          <Text style={styles.hint}>ONE TAP MOVES THE BASKET · 45 SECOND ROUND</Text>
          <PrimaryButton label="START ROUND" onPress={onStart} height={56} />
          <View style={styles.backRow}>
            <SecondaryButton label="BACK" onPress={onBack} />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bgBase },
  wash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.82,
  },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 20, gap: 12 },
  card: { width: '100%', height: 104 },
  cardInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 12,
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.gold,
  },
  stepNum: { color: '#18233B', fontSize: 16, fontWeight: '900' },
  copy: { flex: 1 },
  title: {
    color: C.gold,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  text: { color: C.textSoft, fontSize: 12, fontWeight: '600', lineHeight: 17 },
  pair: { flexDirection: 'row', gap: 6 },
  marks: { flexDirection: 'row', gap: 6 },
  mark: { color: C.danger, fontSize: 18, fontWeight: '900', lineHeight: 22 },
  footer: { flex: 1, justifyContent: 'flex-end', gap: 10 },
  hint: {
    textAlign: 'center',
    color: C.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  backRow: { flexDirection: 'row' },
});
