import React, { useEffect, useRef } from 'react';
import { Animated, Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import ParticleField from '../components/ParticleField';
import { bgLoader, spriteCrown } from '../assets';
import { C, G } from '../constants/theme';
import { LOADER_DURATION_MS } from '../constants/config';

type Props = { onDone: () => void };

/**
 * Brand card. Dark royal-kitchen art under a heavy navy wash — deliberately
 * far darker than the menu, with a dense static grain layer, a thin progress
 * bar and no interactive controls at all.
 */
export default function LoaderScreen({ onDone }: Props) {
  const rise = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(0)).current;
  const bar = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(rise, {
        toValue: 1,
        tension: 42,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(lift, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();
    // One short, settling fill. A width tween spanning the whole 8s splash
    // repaints every frame on the JS thread, keeps the window non-idle and
    // stalls uiautomator's waitForIdle, so the capture agent never leaves here.

    Animated.timing(bar, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: false,
    }).start();

    const id = setTimeout(onDone, LOADER_DURATION_MS);
    return () => clearTimeout(id);
  }, [bar, lift, onDone, rise]);

  const crownStyle = {
    opacity: rise,
    transform: [
      { scale: rise.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) },
      { translateY: lift.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }) },
    ],
  };

  const fill = bar.interpolate({
    inputRange: [0, 1],
    outputRange: ['4%', '100%'],
  });

  return (
    <ImageBackground source={bgLoader} style={styles.root} resizeMode="cover">
      <LinearGradient
        colors={G.loader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.wash}
      />
      <ParticleField count={1500} grain seed={70021} />

      <View style={styles.center}>
        <Animated.View style={[styles.badge, crownStyle]}>
          <View style={styles.halo} />
          <View style={styles.disc}>
            <View pointerEvents="none" style={styles.discSheen} />
            <Image source={spriteCrown} style={styles.crown} resizeMode="contain" />
          </View>
        </Animated.View>

        <Text style={styles.brand}>ROYAL FRUITS</Text>
        <View style={styles.rule} />
        <Text style={styles.tag}>SERVING THE CROWN</Text>
      </View>

      <View style={styles.foot}>
        <View style={styles.track}>
          <Animated.View style={[styles.fillWrap, { width: fill }]}>
            <LinearGradient
              colors={['#F3C64C', '#E84C5C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.fillBar}
            />
          </Animated.View>
        </View>
        <Text style={styles.loading}>LOADING...</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#070C18' },
  wash: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badge: { alignItems: 'center', justifyContent: 'center', marginBottom: 26 },
  halo: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(243,198,76,0.22)',
  },
  disc: {
    width: 132,
    height: 132,
    borderRadius: 66,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(12,19,35,0.88)',
    borderWidth: 2,
    borderColor: 'rgba(243,198,76,0.65)',
  },
  discSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '34%',
    backgroundColor: 'rgba(255,255,255,0.20)',
  },
  crown: { width: 82, height: 82 },
  brand: {
    color: C.gold,
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 3,
    textShadowColor: 'rgba(232,76,92,0.85)',
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 2 },
  },
  rule: {
    width: 120,
    height: 2,
    marginTop: 12,
    borderRadius: 1,
    backgroundColor: 'rgba(243,198,76,0.75)',
  },
  tag: {
    marginTop: 12,
    color: 'rgba(255,241,215,0.75)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 4,
  },
  foot: { alignItems: 'center', paddingBottom: 72 },
  track: {
    width: 200,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,241,215,0.14)',
  },
  fillWrap: { height: 6, borderRadius: 3, overflow: 'hidden' },
  fillBar: { flex: 1 },
  loading: {
    marginTop: 12,
    color: 'rgba(255,241,215,0.50)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
  },
});
