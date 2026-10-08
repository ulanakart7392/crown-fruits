import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, StatusBar, StyleSheet, View } from 'react-native';

import GameScreen from './src/screens/GameScreen';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import RecipesView from './src/views/RecipesView';
import ResultScreen from './src/screens/ResultScreen';
import TutorialView from './src/views/TutorialView';
import { C } from './src/constants/theme';
import { RunResult } from './src/hooks/useRound';

type Screen = 'loader' | 'menu' | 'recipes' | 'tutorial' | 'game' | 'result';

/** App shell: a plain state machine, no navigation library. */
export default function App() {
  const [screen, setScreen] = useState<Screen>('loader');
  const [best, setBest] = useState(0);
  const [lastRun, setLastRun] = useState<RunResult | null>(null);
  const [runKey, setRunKey] = useState(0);

  const goMenu = useCallback(() => setScreen('menu'), []);
  const goRecipes = useCallback(() => setScreen('recipes'), []);
  const goTutorial = useCallback(() => setScreen('tutorial'), []);

  const startRound = useCallback(() => {
    setRunKey(k => k + 1);
    setScreen('game');
  }, []);

  /** Back never leaves the app — it walks one step toward the menu. */
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      setScreen(prev => (prev === 'loader' || prev === 'menu' ? prev : 'menu'));
      return true;
    });
    return () => sub.remove();
  }, []);

  const finishRound = useCallback((result: RunResult) => {
    setLastRun(result);
    setBest(prev => (result.score > prev ? result.score : prev));
    setScreen('result');
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {screen === 'loader' ? <LoaderScreen onDone={goMenu} /> : null}

      {screen === 'menu' ? (
        <MenuScreen
          best={best}
          onPlay={startRound}
          onRecipes={goRecipes}
          onTutorial={goTutorial}
        />
      ) : null}

      {screen === 'recipes' ? (
        <RecipesView served={lastRun ? lastRun.recipesDone : 0} onBack={goMenu} />
      ) : null}

      {screen === 'tutorial' ? (
        <TutorialView onStart={startRound} onBack={goMenu} />
      ) : null}

      {screen === 'game' ? (
        <GameScreen key={runKey} onGameOver={finishRound} onQuit={goMenu} />
      ) : null}

      {screen === 'result' && lastRun ? (
        <ResultScreen
          result={lastRun}
          best={best}
          onPlayAgain={startRound}
          onMenu={goMenu}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bgDeep },
});
