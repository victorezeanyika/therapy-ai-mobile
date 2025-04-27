import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedView } from '@/components/ThemedView';
import TopHeader from '@/components/TopHeader';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

const SubscriptionScreen = () => {
  const navigation = useNavigation();
  const cardBg = useThemeColor({ light: '#FFFFFF', dark: '#232627' }, 'bgCard');

  const plans = [
    { title: 'Basic', image: require('@/assets/images/basic.png'), description: 'Get started with essential features to stay organized and focused.' },
    { title: 'Standard', image: require('@/assets/images/standard.png'), description: 'Unlock powerful tools to boost your productivity and track progress.' },
    { title: 'Premium', image: require('@/assets/images/premium.png'), description: 'Experience the full power of Goalkeeper with exclusive features and VIP support.' },
  ];

  const handlePlanPress = (planTitle: string) => {
    if (planTitle === 'Basic') {
      navigation.navigate('(subscriptions)/basic');
    } else if (planTitle === 'Standard') {
      navigation.navigate('(subscriptions)/standard');
    } else if (planTitle === 'Premium') {
      navigation.navigate('(subscriptions)/premium');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TopHeader title="Subscription Plan" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {plans.map((plan, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handlePlanPress(plan.title)}
            style={[styles.card, { backgroundColor: cardBg }]} // <<<<<< THIS IS FIXED
          >
            <View style={styles.cardHeader}>
              <Image source={plan.image} style={styles.iconPlaceholder} />
              <ThemedText style={styles.cardTitle}>{plan.title}</ThemedText>
            </View>
            <ThemedText style={styles.cardDescription}>{plan.description}</ThemedText>
            <ThemedText style={styles.cancelText}>Cancel Anytime</ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  cancelText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'left',
  },
});
