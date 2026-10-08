import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';

import FruitSprite from './FruitSprite';
import { spriteBasket } from '../assets';
import { C } from '../constants/theme';
import {
  BASKET_BOTTOM,
  BASKET_H,
  BASKET_W,
  BOARD_BORDER,
  BOARD_H,
  BOARD_PAD,
  BOARD_W,
  FRUIT_SIZE,
  LANE_W,
} from '../constants/config';
import { FallingItem, Outcome, Popup } from '../hooks/useRound';

type Props = {
  items: FallingItem[];
  popups: Popup[];
  lane: number;
  catchFlash: Animated.Value;
  missFlash: Animated.Value;
  ending: Outcome | null;
};

const END_TEXT: Record<Outcome, string> = {
  win: 'ALL RECIPES SERVED',
  busted: 'FEAST RUINED',
  timeup: 'KITCHEN CLOSED',
};

const ITEM_OFFSET = Math.round((LANE_W - FRUIT_SIZE) / 2);
const BASKET_OFFSET = Math.round((LANE_W - BASKET_W) / 2);

/** The three chutes: falling fruit, the royal basket and round feedback. */
export default function LaneBoard({
  items,
  popups,
  lane,
  catchFlash,
  missFlash,
  ending,
}: Props) {
  const slide = useRef(new Animated.Value(lane * LANE_W)).current;

  useEffect(() => {
    Animated.spring(slide, {
      toValue: lane * LANE_W,
      tension: 120,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [lane, slide]);

  return (
    <View style={styles.board}>
      <View style={styles.content}>
        <View pointerEvents="none" style={[styles.divider, { left: LANE_W }]} />
        <View pointerEvents="none" style={[styles.divider, { left: LANE_W * 2 }]} />

        {items.map(item => (
          <Animated.View
            key={item.key}
            pointerEvents="none"
            style={[
              styles.item,
              {
                left: item.lane * LANE_W + ITEM_OFFSET,
                opacity: item.fade,
                transform: [{ translateY: item.fall }],
              },
            ]}>
            <FruitSprite id={item.fruit} size={FRUIT_SIZE} />
          </Animated.View>
        ))}

        <Animated.View
          pointerEvents="none"
          style={[
            styles.basket,
            { left: BASKET_OFFSET, transform: [{ translateX: slide }] },
          ]}>
          <View style={styles.basketGlow} />
          <Image source={spriteBasket} style={styles.basketImg} resizeMode="contain" />
        </Animated.View>

        {popups.map(p => (
          <Animated.View
            key={p.key}
            pointerEvents="none"
            style={[
              styles.popup,
              {
                left: p.lane * LANE_W,
                opacity: p.anim.interpolate({
                  inputRange: [0, 0.7, 1],
                  outputRange: [1, 0.9, 0],
                }),
                transform: [
                  {
                    translateY: p.anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -34],
                    }),
                  },
                ],
              },
            ]}>
            <Text
              style={[
                styles.popupText,
                { color: p.tone === 'good' ? C.success : C.danger },
              ]}>
              {p.tone === 'good' ? '+1' : '✗'}
            </Text>
          </Animated.View>
        ))}

        <Animated.View
          pointerEvents="none"
          style={[styles.flash, styles.flashGood, { opacity: catchFlash }]}
        />
        <Animated.View
          pointerEvents="none"
          style={[styles.flash, styles.flashBad, { opacity: missFlash }]}
        />

        {ending ? (
          <View pointerEvents="none" style={styles.endWrap}>
            <View style={styles.endCard}>
              <Text style={styles.endText}>{END_TEXT[ending]}</Text>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: BOARD_W,
    height: BOARD_H,
    padding: BOARD_PAD,
    borderWidth: BOARD_BORDER,
    borderRadius: 20,
    borderColor: 'rgba(243,198,76,0.45)',
    backgroundColor: 'rgba(8,13,26,0.60)',
    overflow: 'hidden',
  },
  content: { flex: 1 },
  divider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,241,215,0.10)',
  },
  item: {
    position: 'absolute',
    top: 0,
    width: FRUIT_SIZE,
    height: FRUIT_SIZE,
  },
  basket: {
    position: 'absolute',
    bottom: BASKET_BOTTOM,
    width: BASKET_W,
    height: BASKET_H,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  basketGlow: {
    position: 'absolute',
    bottom: -6,
    width: BASKET_W,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(243,198,76,0.32)',
  },
  basketImg: { width: BASKET_W, height: BASKET_H },
  popup: {
    position: 'absolute',
    bottom: BASKET_BOTTOM + BASKET_H + 4,
    width: LANE_W,
    alignItems: 'center',
  },
  popupText: { fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  flash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 14,
    borderWidth: 3,
  },
  flashGood: { borderColor: C.success, backgroundColor: 'rgba(84,195,123,0.10)' },
  flashBad: { borderColor: C.danger, backgroundColor: 'rgba(232,76,92,0.18)' },
  endWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(7,12,24,0.55)',
  },
  endCard: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: C.borderGoldStrong,
    backgroundColor: 'rgba(10,16,30,0.92)',
  },
  endText: {
    color: C.gold,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.6,
    textAlign: 'center',
  },
});
