import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface FeatureCardProps {
  feature: { id: string, title: string, description: string, image: any };
}

export default function FeatureCard({ feature }: FeatureCardProps) {
  const iconColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'icon');

  return (
    <View style={styles.card}>
      <Image 
        source={feature.image} 
        style={[styles.image, { tintColor: iconColor }]}
      />
      <ThemedText style={styles.title}>{feature.title}</ThemedText>
      <ThemedText style={styles.description}>{feature.description}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  image:{
    width: 20,
    height: 20,
  },
  card: { 
    marginBottom: 15,
    width: '30%',
    minWidth: 100,
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
  },
  title: { fontSize: 11, fontWeight: 'bold', textAlign: 'center', marginTop: 5 },
  description: { fontSize: 10, color: 'gray', textAlign: 'center', marginTop: 3 }
});