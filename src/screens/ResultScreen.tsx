import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Rect } from 'react-native-svg';
import { Home, RotateCcw } from 'lucide-react-native';

import FruitSprite from '../components/FruitSprite';
import PrimaryButton from '../components/PrimaryButton';
import RecipeCard from '../components/RecipeCard';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import StatCard from '../components/StatCard';
import { C, G, NUMERIC } from '../constants/theme';
import { RESULT_AUTO_REPLAY_MS, SCREEN_W } from '../constants/config';
import { RECIPES } from '../game/recipes';
import { RunResult } from '../hooks/useRound';
import { percent } from '../utils/format';

type Props = {
  result: RunResult;
  best: number;
  onPlayAgain: () => void;
  onMenu: () => void;
};

const TITLES: Record<RunResult['outcome'], string> = {
  win: 'YOU WON!',
  busted: 'BUSTED!',
  timeup: 'NO LUCK!',
};

const TITLE_TINT: Record<RunResult['outcome'], string> = {
  win: '#54C37B',
  busted: '#E84C5C',
  timeup: '#F3C64C',
};

const SUBTITLES: Record<RunResult['outcome'], string> = {
  win: 'THE ROYAL FEAST IS SERVED',
  busted: 'THREE WRONG CATCHES ENDED THE SHIFT',
  timeup: 'THE FEAST BELL RANG TOO SOON',
};

/** Round summary — the discrete game-over state of the app. */
export default function ResultScreen({ result, best, onPlayAgain, onMenu }: Props) {
  const enter = useRef(new Animated.Value(0)).current;
  const [replayIn, setReplayIn] = useState(Math.round(RESULT_AUTO_REPLAY_MS / 1000));
  const replayRef = useRef(onPlayAgain);
  replayRef.current = onPlayAgain;

  /** Hold the summary, then roll straight into the next round on its own. */
  useEffect(() => {
    let left = Math.round(RESULT_AUTO_REPLAY_MS / 1000);
    const id = setInterval(() => {
      left -= 1;
      setReplayIn(left > 0 ? left : 0);
      if (left <= 0) {
        clearInterval(id);
        replayRef.current();
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    Animated.spring(enter, {
      toValue: 1,
      tension: 60,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [enter]);

  const confetti = useMemo(() => {
    if (result.outcome !== 'win') {
      return [];
    }
    let state = 1337;
    const rnd = () => {
      state ^= state << 13;
      state >>>= 0;
      state ^= state >> 17;
      state ^= state << 5;
      state >>>= 0;
      return state / 4294967296;
    };
    const tints = ['#F3C64C', '#E84C5C', '#54C37B', '#FFF1D7'];
    const out = [];
    for (let i = 0; i < 60; i++) {
      out.push({
        x: rnd() * SCREEN_W,
        y: rnd() * 320,
        fill: tints[i % tints.length],
        rot: Math.round(rnd() * 90 - 45),
      });
    }
    return out;
  }, [result.outcome]);

  const nextIndex = Math.min(result.recipesDone, RECIPES.length - 1);
  const allServed = result.recipesDone >= RECIPES.length;
  const nextRecipe = RECIPES[nextIndex];

  const cardStyle = {
    opacity: enter,
    transform: [
      { scale: enter.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] }) },
    ],
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={G.result} style={styles.wash} />
      {confetti.length > 0 ? (
        <View pointerEvents="none" style={styles.confetti}>
          <Svg width={SCREEN_W} height={320}>
            {confetti.map((c, i) => (
              <Rect
                key={i}
                x={c.x}
                y={c.y}
                width={4}
                height={10}
                rx={1}
                fill={c.fill}
                fillOpacity={0.75}
                transform={'rotate(' + c.rot + ' ' + c.x + ' ' + c.y + ')'}
              />
            ))}
          </Svg>
        </View>
      ) : null}

      <Pressable
        style={styles.tapLayer}
        accessibilityRole="button"
        accessibilityLabel="PLAY AGAIN"
        onPress={onPlayAgain}
      />

      <ScreenHeader title="ROUND RESULT"
        right={<Text style={[styles.bestText, NUMERIC]}>BEST {best}</Text>}
      />

      <Animated.View pointerEvents="box-none" style={[styles.body, cardStyle]}>
        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: TITLE_TINT[result.outcome] }]}>
            {TITLES[result.outcome]}
          </Text>
          <Text style={styles.subtitle}>{SUBTITLES[result.outcome]}</Text>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreCap}>SCORE</Text>
            <Text style={[styles.scoreValue, NUMERIC]}>{result.score}</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {RECIPES.map((r, i) => (
            <View key={r.id} style={styles.gridSlot}>
              <RecipeCard recipe={r} order={i + 1} served={i < result.recipesDone} compact />
            </View>
          ))}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statSlot}>
            <StatCard
              value={result.recipesDone + '/' + RECIPES.length}
              label="RECIPES"
              valueColor={C.success}
            />
          </View>
          <View style={styles.statSlot}>
            <StatCard
              value={percent(result.correct, result.mistakes)}
              label="ACCURACY"
              valueColor={C.gold}
            />
          </View>
          {result.mistakes > 0 ? (
            <View style={styles.statSlot}>
              <StatCard
                value={String(result.mistakes)}
                label="MISTAKES"
                valueColor={C.danger}
              />
            </View>
          ) : null}
        </View>

        <View style={styles.nextPill}>
          {allServed ? (
            <Text style={styles.nextText}>ALL RECIPES SERVED</Text>
          ) : (
            <>
              <Text style={styles.nextCap}>NEXT</Text>
              <Text style={[styles.nextText, { color: nextRecipe.color }]}>
                {nextRecipe.title}
              </Text>
              <View style={styles.nextFruits}>
                {nextRecipe.fruits.map(f => (
                  <FruitSprite key={f} id={f} size={24} glow={false} />
                ))}
              </View>
            </>
          )}
        </View>

        <View style={styles.actions}>
          <Text style={styles.replayHint}>
            {replayIn > 0 ? 'TAP ANYWHERE - NEXT ROUND IN ' + replayIn : 'STARTING NEXT ROUND'}
          </Text>
          <PrimaryButton label="PLAY AGAIN" Icon={RotateCcw} onPress={onPlayAgain} />
          <View style={styles.menuRow}>
            <SecondaryButton label="MENU" Icon={Home} onPress={onMenu} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bgBase },
  wash: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  confetti: { position: 'absolute', top: 0, left: 0, right: 0 },
  bestText: {
    color: C.gold,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    lineHeight: 18,
  },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 18, gap: 12 },
  titleBlock: { alignItems: 'center' },
  title: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 3 },
  },
  subtitle: {
    marginTop: 6,
    color: C.textSoft,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    textAlign: 'center',
  },
  scoreRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(243,198,76,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(243,198,76,0.42)',
  },
  scoreCap: {
    color: C.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  scoreValue: {
    color: C.gold,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 26,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridSlot: { width: '48%' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statSlot: { flex: 1 },
  nextPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,241,215,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,241,215,0.12)',
  },
  nextCap: {
    color: C.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  nextText: {
    color: C.text,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  nextFruits: { flexDirection: 'row', gap: 6 },
  actions: { marginTop: 'auto', gap: 10 },
  tapLayer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  replayHint: {
    color: C.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.3,
    textAlign: 'center',
    marginBottom: 2,
  },
  menuRow: { flexDirection: 'row' },
});
