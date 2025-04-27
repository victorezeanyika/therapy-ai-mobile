import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedView } from '@/components/ThemedView';
import TopHeader from '@/components/TopHeader';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
const { width } = Dimensions.get('window');

const StandardPlanScreen = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const plans = [
    {
      title: 'Monthly',
      price: '$20',
      features: ['Access Standard tools', 'Track 3 goals', 'Community Support', 'Standard Reports', 'Cancel anytime'],
    },
    {
      title: 'Annually',
      price: '$240',
      features: ['Access Standard tools', 'Track 3 goals', 'Community Support', 'Standard Reports', 'Save 20% yearly'],
    },
  ];

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.planBadge}>
        <Text style={styles.planBadgeText}>Standard</Text>
      </View>
      <View style={{
        height: 178,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1, // <-- Only bottom border
        borderBottomColor: '#001133',
        borderStyle: 'dashed', // <-- Dashed style will now apply properly
        backgroundColor: '#fff',
        width: '100%',
        overflow: 'hidden',
        borderRadius: 10.9,
        }}>
        <Text style={styles.planTitle}>{item.title}</Text>
        <Text style={styles.planPrice}>{item.price}</Text>
        </View>


      <View style={styles.featureList}>
        {item.features.map((feature: string, idx: number) => (
          <View key={idx} style={styles.featureItem}>
            {/* <View style={styles.bullet} /> */}
            <View style={{flexDirection: 'row', alignItems: 'center', gap:5}}>
             <View style={styles.bullet} >
                <MaterialIcons name="chevron-right" size={12} color={Colors.harmony.primary} />
            </View>
            <Text style={styles.featureText}>{feature}</Text>
            </View>
            <View style={styles.check}>
            <MaterialIcons name="check" size={12} color="white" />
            </View>
          </View>
        ))}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      </View>

    </View>
  );

  return (
    <ThemedView style={styles.container}>
     <TopHeader title='Plan Overview' />

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

      {/* Pagination Indicator */}
      <View style={styles.pagination}>
        {plans.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: currentIndex === index ? '#009688' : '#ccc' },
            ]}
          />
        ))}
      </View>
    </ThemedView>
  );
};

export default StandardPlanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },

  card: {
    width: width * 0.8,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    alignSelf: 'center',
    // elevation: 3,
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: 2 },
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
    fontSize: 14,
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
});
