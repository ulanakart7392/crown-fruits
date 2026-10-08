import React, { useCallback } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { X } from 'lucide-react-native';

import LaneBoard from '../components/LaneBoard';
import LanePad from '../components/LanePad';
import MistakeDots from '../components/MistakeDots';
import RecipeBar from '../components/RecipeBar';
import ScreenHeader from '../components/ScreenHeader';
import { bgGame } from '../assets';
import { C, G, NUMERIC, darkShadow } from '../constants/theme';
import {
  ARENA_PAD_BOTTOM,
  ARENA_PAD_TOP,
  CONTROLS_BOTTOM,
  CONTROLS_H,
  LANES,
  SCORE_STRIP_H,
} from '../constants/config';
import { RECIPES } from '../game/recipes';
import { RunResult, useRound } from '../hooks/useRound';

type Props = {
  onGameOver: (result: RunResult) => void;
  onQuit: () => void;
};

const LANE_LIST = [0, 1, 2].slice(0, LANES);

/** Floating-controls gameplay: three chutes, one basket, one live recipe. */
export default function GameScreen({ onGameOver, onQuit }: Props) {
  const round = useRound(onGameOver);
  const {
    items,
    popups,
    lane,
    setLane,
    secondsLeft,
    mistakes,
    recipeIndex,
    progress,
    score,
    ending,
    catchFlash,
    missFlash,
    barPulse,
  } = round;

  const low = secondsLeft <= 10;
  const recipe = RECIPES[recipeIndex];

  const selectLane = useCallback((index: number) => setLane(index), [setLane]);
  /** Tapping the board itself walks the basket to the next chute. */
  const nextLane = useCallback(() => setLane((lane + 1) % LANES), [lane, setLane]);

  return (
    <ImageBackground source={bgGame} style={styles.root} resizeMode="cover">
      <LinearGradient colors={G.screen} style={styles.wash} />

      <ScreenHeader title="ROYAL KITCHEN" onBack={onQuit} backLabel="Quit round" BackIcon={X}
        right={<MistakeDots mistakes={mistakes} />}
      />

      <View style={styles.scoreStrip}>
        <Text style={styles.scoreLabel}>SCORE</Text>
        <Text style={[styles.scoreValue, NUMERIC]}>{score}</Text>
        <View style={styles.timerPill}>
          <Text style={[styles.timerText, NUMERIC, low ? styles.timerLow : null]}>
            {secondsLeft}
          </Text>
          <Text style={styles.timerUnit}>SEC</Text>
        </View>
      </View>

      <View style={styles.barWrap}>
        <RecipeBar
          recipe={recipe}
          progress={progress}
          index={recipeIndex}
          total={RECIPES.length}
          pulse={barPulse}
        />
      </View>

      <Pressable
        style={styles.arena}
        accessibilityRole="button"
        accessibilityLabel="Move basket"
        onPress={nextLane}
      >
        <LaneBoard
          items={items}
          popups={popups}
          lane={lane}
          catchFlash={catchFlash}
          missFlash={missFlash}
          ending={ending}
        />
      </Pressable>

      <View style={styles.controls}>
        <LinearGradient colors={G.sheet} style={styles.controlsFill} />
        <View pointerEvents="none" style={styles.controlsSheen} />
        <View style={styles.pads}>
          {LANE_LIST.map(i => (
            <LanePad key={i} index={i} active={lane === i} onSelect={selectLane} />
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bgDeep },
  wash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.86,
  },
  scoreStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    height: SCORE_STRIP_H,
    gap: 8,
  },
  scoreLabel: {
    color: C.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  scoreValue: {
    flex: 1,
    color: C.text,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(243,198,76,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(243,198,76,0.42)',
    justifyContent: 'center',
  },
  timerText: {
    color: C.text,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 24,
  },
  timerLow: { color: C.danger },
  timerUnit: {
    color: C.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    lineHeight: 14,
  },
  barWrap: { paddingHorizontal: 16, paddingTop: 12 },
  arena: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: ARENA_PAD_TOP,
    paddingBottom: ARENA_PAD_BOTTOM,
  },
  controls: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: CONTROLS_BOTTOM,
    height: CONTROLS_H,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(243,198,76,0.40)',
    justifyContent: 'center',
    ...darkShadow,
  },
  controlsFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  controlsSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 34,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  pads: { flexDirection: 'row', gap: 10, paddingHorizontal: 12 },
});
