import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface FeatureCardProps {
  feature: { id: string, title: string, description: string, image: any };
}

export default function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <View style={styles.card}>
       <Image source={feature.image} style={styles.image}/>
      <ThemedText style={styles.title}>{feature.title}</ThemedText>
      <ThemedText style={styles.description}>{feature.description}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  image:{
    width:20,
    height:20,
  },
  card: { 
     marginBottom: 15 ,
     maxWidth:120,
     alignItems:'center',
     borderRadius:10,
    },
  title: { fontSize: 11, fontWeight: 'bold', textAlign:'center', },
  description: { fontSize: 10, color: 'gray', textAlign:'center' }
});
