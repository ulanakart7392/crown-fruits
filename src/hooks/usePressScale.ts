import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';

/**
 * Press feedback for buttons. The Pressable stays the PARENT and drives this
 * from onPressIn/onPressOut; the animated layer lives inside it.
 */
export function usePressScale(pressedScale = 0.95) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: pressedScale,
      tension: 300,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [pressedScale, scale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 300,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}
