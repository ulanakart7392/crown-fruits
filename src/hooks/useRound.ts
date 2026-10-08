import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Vibration } from 'react-native';

import {
  END_FLOURISH_MS,
  ENGAGED_FORCE_MS,
  FALL_DIST,
  FALL_MS,
  HIT_FRACTION,
  MAX_MISTAKES,
  MIN_RESULT_MS,
  ROUND_SECONDS,
  SCORE_CATCH,
  SCORE_RECIPE,
  SPAWN_MS,
} from '../constants/config';
import {
  Progress,
  SPAWN_SCRIPT,
  SpawnKind,
  pickFruit,
  recipeDone,
  verdict,
} from '../game/engine';
import { FruitId, RECIPES } from '../game/recipes';

export type Outcome = 'win' | 'busted' | 'timeup';

export type RunResult = {
  outcome: Outcome;
  recipesDone: number;
  score: number;
  mistakes: number;
  correct: number;
};

export type FallingItem = {
  key: number;
  lane: number;
  fruit: FruitId;
  kind: SpawnKind;
  fall: Animated.Value;
  fade: Animated.Value;
};

export type Popup = {
  key: number;
  lane: number;
  tone: 'good' | 'bad';
  anim: Animated.Value;
};

type Timer = ReturnType<typeof setTimeout>;

/**
 * Drives one round: scripted spawns, basket verdicts, timer and the backstop
 * that guarantees a result screen even when nobody touches the device.
 */
export function useRound(onFinish: (result: RunResult) => void) {
  const [items, setItems] = useState<FallingItem[]>([]);
  const [popups, setPopups] = useState<Popup[]>([]);
  const [lane, setLaneState] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const [mistakes, setMistakes] = useState(0);
  const [recipeIndex, setRecipeIndex] = useState(0);
  const [progress, setProgress] = useState<Progress>({});
  const [score, setScore] = useState(0);
  const [ending, setEnding] = useState<Outcome | null>(null);

  const catchFlash = useRef(new Animated.Value(0)).current;
  const missFlash = useRef(new Animated.Value(0)).current;
  const barPulse = useRef(new Animated.Value(0)).current;

  const laneRef = useRef(1);
  const progressRef = useRef<Progress>({});
  const recipeIdxRef = useRef(0);
  const mistakesRef = useRef(0);
  const scoreRef = useRef(0);
  const correctRef = useRef(0);
  const doneRef = useRef(0);
  const secRef = useRef(ROUND_SECONDS);
  const seqRef = useRef(0);
  const keyRef = useRef(1);
  const endingRef = useRef(false);
  const startRef = useRef(Date.now());

  const spawnRef = useRef<Timer | null>(null);
  const tickRef = useRef<Timer | null>(null);
  const backstopRef = useRef<Timer | null>(null);
  const endRef = useRef<Timer | null>(null);
  const pendingRef = useRef<Set<Timer>>(new Set());

  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  const track = useCallback((id: Timer) => {
    pendingRef.current.add(id);
    return id;
  }, []);

  const drop = useCallback((key: number) => {
    setItems(prev => prev.filter(it => it.key !== key));
  }, []);

  const flash = useCallback((value: Animated.Value, peak: number) => {
    value.setValue(0);
    Animated.sequence([
      Animated.timing(value, { toValue: peak, duration: 90, useNativeDriver: true }),
      Animated.timing(value, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  const pushPopup = useCallback((itemLane: number, tone: 'good' | 'bad') => {
    const key = keyRef.current++;
    const anim = new Animated.Value(0);
    setPopups(prev => prev.concat({ key, lane: itemLane, tone, anim }));
    Animated.timing(anim, {
      toValue: 1,
      duration: 520,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setPopups(prev => prev.filter(p => p.key !== key));
    });
  }, []);

  const endRound = useCallback((outcome: Outcome) => {
    if (endingRef.current) {
      return;
    }
    endingRef.current = true;
    setEnding(outcome);

    if (spawnRef.current) {
      clearInterval(spawnRef.current);
      spawnRef.current = null;
    }
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    if (backstopRef.current) {
      clearTimeout(backstopRef.current);
      backstopRef.current = null;
    }

    const elapsed = Date.now() - startRef.current;
    const wait = Math.max(END_FLOURISH_MS, MIN_RESULT_MS - elapsed);
    endRef.current = setTimeout(() => {
      finishRef.current({
        outcome,
        recipesDone: doneRef.current,
        score: scoreRef.current,
        mistakes: mistakesRef.current,
        correct: correctRef.current,
      });
    }, wait);
  }, []);

  /** (Re)schedule the backstop so a result always surfaces, tapped or not. */
  const armBackstop = useCallback(
    (atFromStart: number) => {
      if (backstopRef.current) {
        clearTimeout(backstopRef.current);
      }
      const elapsed = Date.now() - startRef.current;
      const wait = Math.max(500, atFromStart - elapsed);
      backstopRef.current = setTimeout(() => endRound('timeup'), wait);
    },
    [endRound],
  );

  const resolveItem = useCallback(
    (item: FallingItem) => {
      if (endingRef.current) {
        return;
      }
      const recipe = RECIPES[recipeIdxRef.current];
      const call = verdict(
        item.lane,
        laneRef.current,
        item.fruit,
        item.kind,
        recipe,
        progressRef.current,
      );
      if (call === 'missed') {
        return;
      }

      item.fall.stopAnimation();
      Animated.timing(item.fade, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(() => drop(item.key));

      if (call === 'spill') {
        return;
      }

      if (call === 'catch') {
        const next: Progress = { ...progressRef.current };
        next[item.fruit] = (next[item.fruit] || 0) + 1;
        progressRef.current = next;
        setProgress(next);

        correctRef.current += 1;
        scoreRef.current += SCORE_CATCH;
        setScore(scoreRef.current);
        pushPopup(item.lane, 'good');
        flash(catchFlash, 1);

        if (recipeDone(recipe, next)) {
          scoreRef.current += SCORE_RECIPE;
          setScore(scoreRef.current);
          doneRef.current += 1;

          barPulse.setValue(0);
          Animated.spring(barPulse, {
            toValue: 1,
            tension: 180,
            friction: 8,
            useNativeDriver: true,
          }).start(() => barPulse.setValue(0));

          if (doneRef.current >= RECIPES.length) {
            endRound('win');
            return;
          }
          recipeIdxRef.current += 1;
          setRecipeIndex(recipeIdxRef.current);
          progressRef.current = {};
          setProgress({});
        }
        return;
      }

      mistakesRef.current += 1;
      setMistakes(mistakesRef.current);
      pushPopup(item.lane, 'bad');
      flash(missFlash, 0.35);
      try {
        Vibration.vibrate(30);
      } catch (e) {
        // haptics are optional
      }
      if (mistakesRef.current >= MAX_MISTAKES) {
        endRound('busted');
      }
    },
    [barPulse, catchFlash, drop, endRound, flash, missFlash, pushPopup],
  );

  const spawn = useCallback(() => {
    if (endingRef.current) {
      return;
    }
    const step = SPAWN_SCRIPT[seqRef.current % SPAWN_SCRIPT.length];
    const recipe = RECIPES[recipeIdxRef.current];
    const fruit = pickFruit(step, recipe, progressRef.current, seqRef.current);
    seqRef.current += 1;

    const item: FallingItem = {
      key: keyRef.current++,
      lane: step.lane,
      fruit,
      kind: step.kind,
      fall: new Animated.Value(0),
      fade: new Animated.Value(1),
    };
    setItems(prev => prev.concat(item));

    Animated.timing(item.fall, {
      toValue: FALL_DIST,
      duration: FALL_MS,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => drop(item.key));

    track(setTimeout(() => resolveItem(item), Math.round(FALL_MS * HIT_FRACTION)));
  }, [drop, resolveItem, track]);

  const setLane = useCallback(
    (next: number) => {
      if (endingRef.current) {
        return;
      }
      laneRef.current = next;
      setLaneState(next);
      const elapsed = Date.now() - startRef.current;
      armBackstop(Math.max(MIN_RESULT_MS, elapsed + ENGAGED_FORCE_MS));
    },
    [armBackstop],
  );

  useEffect(() => {
    startRef.current = Date.now();
    const kickoff = setTimeout(spawn, 200);
    spawnRef.current = setInterval(spawn, SPAWN_MS);
    tickRef.current = setInterval(() => {
      if (endingRef.current) {
        return;
      }
      secRef.current -= 1;
      setSecondsLeft(Math.max(0, secRef.current));
      if (secRef.current <= 0) {
        endRound('timeup');
      }
    }, 1000);
    armBackstop(MIN_RESULT_MS);

    const pending = pendingRef.current;
    return () => {
      clearTimeout(kickoff);
      if (spawnRef.current) {
        clearInterval(spawnRef.current);
      }
      if (tickRef.current) {
        clearInterval(tickRef.current);
      }
      if (backstopRef.current) {
        clearTimeout(backstopRef.current);
      }
      if (endRef.current) {
        clearTimeout(endRef.current);
      }
      pending.forEach(id => clearTimeout(id));
      pending.clear();
    };
    // One round per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
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
  };
}
