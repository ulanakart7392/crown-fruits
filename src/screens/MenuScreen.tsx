import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BookOpen, Crown, HelpCircle, Play, Volume2, VolumeX } from 'lucide-react-native';

import ParticleField from '../components/ParticleField';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import StatCard from '../components/StatCard';
import FruitSprite from '../components/FruitSprite';
import { bgMenu, spriteBasket, spriteCrown } from '../assets';
import { C, G, NUMERIC, darkShadow } from '../constants/theme';
import { ROUND_SECONDS, SCREEN_H } from '../constants/config';
import { RECIPES } from '../game/recipes';

type Props = {
  best: number;
  onPlay: () => void;
  onRecipes: () => void;
  onTutorial: () => void;
};

const ART_H = Math.round(SCREEN_H * 0.54);

/** Bottom-sheet menu: palace art up top, the whole control stack in a sheet. */
export default function MenuScreen({ best, onPlay, onRecipes, onTutorial }: Props) {
  const [soundOn, setSoundOn] = useState(true);
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(enter, {
      toValue: 1,
      tension: 50,
      friction: 9,
      useNativeDriver: true,
    }).start();
  }, [enter]);

  const sheetStyle = {
    opacity: enter,
    transform: [
      { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) },
    ],
  };

  return (
    <View style={styles.root}>
      <ImageBackground source={bgMenu} style={styles.art} resizeMode="cover">
        <LinearGradient colors={G.menuArt} style={styles.artWash} />
        <ParticleField count={70} seed={4411} />

        <View style={styles.topRow}>
          <View style={styles.brandBadge}>
            <Image source={spriteCrown} style={styles.brandCrown} resizeMode="contain" />
            <Text style={styles.brandText}>ROYAL FRUITS</Text>
          </View>

          <View style={styles.bestPill}>
            <Crown size={18} color={C.gold} strokeWidth={2.5} />
            <Text style={[styles.bestText, NUMERIC]}>BEST {best}</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroGlow} />
          <Image source={spriteBasket} style={styles.heroBasket} resizeMode="contain" />
          <View style={styles.heroFruitLeft}>
            <FruitSprite id="cherry" size={56} />
          </View>
          <View style={styles.heroFruitTop}>
            <FruitSprite id="lemon" size={52} />
          </View>
          <View style={styles.heroFruitRight}>
            <FruitSprite id="plum" size={56} />
          </View>
        </View>
      </ImageBackground>

      <Animated.View pointerEvents="box-none" style={[styles.sheet, sheetStyle, darkShadow]}>
        <View pointerEvents="none" style={styles.sheetSheen} />

        <View style={styles.titleWrap}>
          <Text style={styles.titleGhost}>CROWN FRUITS</Text>
          <Text style={styles.title}>CROWN FRUITS</Text>
        </View>
        <Text style={styles.tagline}>CATCH THE ROYAL RECIPE</Text>

        <View style={styles.statsRow}>
          <View style={styles.statSlot}>
            <StatCard value={String(RECIPES.length)} label="RECIPES" valueColor={C.success} />
          </View>
          <View style={styles.statSlot}>
            <StatCard value={ROUND_SECONDS + 's'} label="ROUND" valueColor={C.info} />
          </View>
        </View>

        <PrimaryButton label="PLAY NOW" Icon={Play} onPress={onPlay} />

        <View style={styles.secondRow}>
          <SecondaryButton label="RECIPES" Icon={BookOpen} onPress={onRecipes} />
          <SecondaryButton label="RULES" Icon={HelpCircle} onPress={onTutorial} />
        </View>

        <Pressable
          accessibilityRole="switch"
          accessibilityLabel={soundOn ? 'Sound on' : 'Sound off'}
          onPress={() => setSoundOn(v => !v)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.soundRow}>
          {soundOn ? (
            <Volume2 size={20} color={C.textSoft} strokeWidth={2.2} />
          ) : (
            <VolumeX size={20} color={C.textMuted} strokeWidth={2.2} />
          )}
          <Text style={styles.soundText}>{soundOn ? 'SOUND ON' : 'SOUND OFF'}</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bgBase },
  art: { height: ART_H, width: '100%' },
  artWash: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  topRow: {
    paddingTop: 44,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandBadge: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandCrown: { width: 26, height: 26 },
  brandText: {
    color: C.text,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  bestPill: {
    height: 34,
    borderRadius: 17,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(243,198,76,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(243,198,76,0.45)',
  },
  bestText: {
    color: C.gold,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
    lineHeight: 18,
  },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heroGlow: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: 'rgba(243,198,76,0.22)',
  },
  heroBasket: { width: 180, height: 180 },
  heroFruitLeft: { position: 'absolute', left: 26, bottom: 46 },
  heroFruitTop: { position: 'absolute', top: 6 },
  heroFruitRight: { position: 'absolute', right: 26, bottom: 46 },
  sheet: {
    flex: 1,
    marginTop: -28,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: 'rgba(24,35,59,0.94)',
    borderTopWidth: 1,
    borderColor: 'rgba(243,198,76,0.35)',
    justifyContent: 'center',
    gap: 12,
  },
  sheetSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 46,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  titleWrap: { alignItems: 'center', justifyContent: 'center' },
  titleGhost: {
    position: 'absolute',
    top: -1,
    color: 'rgba(255,241,215,0.35)',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 2,
  },
  title: {
    color: C.gold,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 2,
  },
  tagline: {
    textAlign: 'center',
    color: 'rgba(255,241,215,0.70)',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  statsRow: { flexDirection: 'row', gap: 12 },
  statSlot: { flex: 1 },
  secondRow: { flexDirection: 'row', gap: 12 },
  soundRow: {
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,241,215,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,241,215,0.10)',
  },
  soundText: {
    color: C.textSoft,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
    lineHeight: 20,
  },
});
