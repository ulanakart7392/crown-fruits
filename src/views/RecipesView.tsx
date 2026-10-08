import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Crown } from 'lucide-react-native';

import ParticleField from '../components/ParticleField';
import RecipeCard from '../components/RecipeCard';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import { C, G } from '../constants/theme';
import { RECIPES } from '../game/recipes';

type Props = {
  served: number;
  onBack: () => void;
};

/** The four festive recipes and how far the kitchen got through them. */
export default function RecipesView({ served, onBack }: Props) {
  return (
    <View style={styles.root}>
      <LinearGradient colors={G.screen} style={styles.wash} />
      <View pointerEvents="none" style={[styles.blob, styles.blobA]} />
      <View pointerEvents="none" style={[styles.blob, styles.blobB]} />
      <ParticleField count={60} seed={9182} />

      <ScreenHeader title="ROYAL RECIPES" onBack={onBack} backLabel="Back to palace"
        right={<Crown size={20} color={C.gold} strokeWidth={2.5} />}
      />

      <View style={styles.body}>
        <Text style={styles.lead}>
          Two fruits per recipe, two of each. Fill them all before the feast bell.
        </Text>

        <View style={styles.list}>
          {RECIPES.map((r, i) => (
            <RecipeCard key={r.id} recipe={r} order={i + 1} served={i < served} />
          ))}
        </View>

        <View style={styles.footer}>
          <SecondaryButton label="BACK TO PALACE" onPress={onBack} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bgBase },
  wash: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  blob: { position: 'absolute', borderRadius: 160 },
  blobA: {
    width: 300,
    height: 300,
    top: 60,
    left: -110,
    backgroundColor: 'rgba(243,198,76,0.07)',
  },
  blobB: {
    width: 260,
    height: 260,
    bottom: 40,
    right: -90,
    backgroundColor: 'rgba(85,174,226,0.07)',
  },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 20 },
  lead: {
    color: C.textSoft,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
    marginBottom: 14,
  },
  list: { flex: 1, gap: 12 },
  footer: { flexDirection: 'row', marginTop: 14 },
});
