import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import TopHeader from '@/components/TopHeader';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useCreatePaymentIntentMutation, useGetSubscriptionsQuery } from '@/features/subscriptions-api';
import { useAppSelector } from '@/features/hooks';
const { width } = Dimensions.get('window');

export default function BasicPlanScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  const flatListRef = useRef(null);
  const { data: plan, isLoading, isError } = useGetSubscriptionsQuery();
  const [createPaymentIntent, { isLoading: isCreatingPaymentIntent }] = useCreatePaymentIntentMutation();
  const {user} = useAppSelector(state => state.auth)

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handlePay = async (planKey: string) => {
    try {
      const response = await createPaymentIntent({
        email: user?.email,
        plan: planKey,
        billingPeriod,
      }).unwrap();

      if (response?.sessionUrl) {
        router.push({
          pathname: '/checkout-screen',
          params: { url: response.sessionUrl }
        });
      } else {
        Alert.alert('Payment Error', 'No checkout URL returned.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Payment Error', 'Failed to initiate payment.');
    }
  };

  const getPrice = (price: number) => {
    if (billingPeriod === "annual") {
      return Math.round(price * 12 * 0.8); // 20% discount for annual
    }
    return price;
  };

  const plans = plan
    ? Object.entries(plan).map(([key, value]) => ({
        key,
        title: value.name,
        price: value.price === 0 ? 'Free' : `€${getPrice(value.price)}`,
        rawPrice: value.price,
        features: value.features,
        period: billingPeriod === "annual" ? "year" : "month"
      }))
    : [];

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.planBadge}>
        <Text style={styles.planBadgeText}>{item.title}</Text>
      </View>
      <View
        style={{
          height: 178,
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#001133',
          borderStyle: 'dashed',
          backgroundColor: '#fff',
          width: '100%',
          overflow: 'hidden',
          borderRadius: 10.9,
          paddingHorizontal: 10,
        }}
      >
        <Text style={[styles.planTitle, { textAlign: 'center' }]}>{item.title}</Text>
        <Text style={[styles.planPrice, { textAlign: 'center' }]}>{item.price}</Text>
        <Text style={[styles.periodText, { textAlign: 'center' }]}>per {item.period}</Text>
      </View>

      <View style={styles.featureList}>
        {item.features.map((feature: string, idx: number) => (
          <View key={idx} style={styles.featureItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <View style={styles.bullet}>
                <MaterialIcons name="chevron-right" size={12} color={Colors.harmony.primary} />
              </View>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
            <View style={styles.check}>
              <MaterialIcons name="check" size={12} color="white" />
            </View>
          </View>
        ))}

        {item.rawPrice > 0 && (
          <TouchableOpacity
            style={[styles.button, isCreatingPaymentIntent && { opacity: 0.7 }]}
            onPress={() => handlePay(item.key)}
            disabled={isCreatingPaymentIntent}
          >
            <Text style={styles.buttonText}>
              {isCreatingPaymentIntent ? 'Processing...' : 'Pay'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <TopHeader title="Plan Overview" />
        <ActivityIndicator size="large" color={Colors.harmony.primary} />
      </ThemedView>
    );
  }

  if (isError || !plan) {
    return (
      <ThemedView style={styles.container}>
        <TopHeader title="Plan Overview" />
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          Failed to load plans. Please try again later.
        </Text>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <TopHeader title="Plan Overview" />
      
      <View style={styles.periodSelector}>
        <TouchableOpacity 
          style={[styles.periodButton, billingPeriod === "monthly" && styles.periodButtonActive]}
          onPress={() => setBillingPeriod("monthly")}
        >
          <Text style={[styles.periodButtonText, billingPeriod === "monthly" && styles.periodButtonTextActive]}>Monthly</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.periodButton, billingPeriod === "annual" && styles.periodButtonActive]}
          onPress={() => setBillingPeriod("annual")}
        >
          <Text style={[styles.periodButtonText, billingPeriod === "annual" && styles.periodButtonTextActive]}>Annual</Text>
          <View style={styles.saveBadge}>
            <Text style={styles.saveBadgeText}>Save 20%</Text>
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={plans}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
      />

      <View style={styles.pagination}>
        {plans.map((_, index: number) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: currentIndex === index ? Colors.harmony.primary : '#ccc' },
            ]}
          />
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  card: {
    width: width * 0.9,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    alignSelf: 'center',
    marginHorizontal: width * 0.1 / 2,
  },
  planBadge: {
    backgroundColor: Colors.harmony.primary,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 10,
    position: 'absolute',
    top: 0,
    zIndex: 100,
    width: 153,
    height: 37,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'Gotham-Bold',
  },
  planTitle: {
    fontSize: 33,
    fontWeight: '400',
    fontFamily: 'Gotham-Book',
  },
  planPrice: {
    fontSize: 50,
    fontWeight: '400',
    fontFamily: 'Gotham-Book',
    marginVertical: 10,
    color: '#001133',
  },
  periodText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Gotham-Book',
    marginTop: 5
  },
  featureList: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10.9,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    width: '100%',
    height: 43,
    backgroundColor: '#F8FAFF',
    padding: 10,
    borderRadius: 10.9,
  },
  check: {
    width: 24,
    height: 24,
    position: 'absolute',
    right: -20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: Colors.harmony.primary,
    marginRight: 10,
  },
  bullet: {
    width: 14,
    height: 14,
    borderRadius: 14,
    borderColor: Colors.harmony.primary,
    marginRight: 10,
    borderWidth: 1,
  },
  featureText: {
    fontSize: 11,
    color: '#001133',
    fontFamily: 'Gotham-Book',
    fontWeight: '500',
  },
  button: {
    marginTop: 30,
    backgroundColor: Colors.harmony.primary,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 25,
    marginBottom: 20,
    marginHorizontal: 20
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  periodButtonActive: {
    backgroundColor: Colors.harmony.primary
  },
  periodButtonText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Gotham-Book'
  },
  periodButtonTextActive: {
    color: '#fff'
  },
  saveBadge: {
    backgroundColor: '#e6f7ed',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8
  },
  saveBadgeText: {
    color: '#059669',
    fontSize: 12,
    fontFamily: 'Gotham-Book'
  }
});