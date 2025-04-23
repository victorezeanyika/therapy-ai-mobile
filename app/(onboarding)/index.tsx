import { useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import OnboardingItem from '@/components/OnboardingItem';
import Pagination from '@/components/Pagination';
import {
    configureReanimatedLogger,
    ReanimatedLogLevel,
  } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { Dimensions, StyleSheet, View, TouchableOpacity } from 'react-native';
import CustomButton from '@/components/ui/Button';
  
  // This is the default configuration
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: true, // Reanimated runs in strict mode by default
  });
const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Welcome to Therapy AI',
    description: 'Your personal mental health companion, available 24/7 to support your journey to better mental well-being.',
    image: require('../../assets/images/onboard-1.png'),
  },
  {
    id: '2',
    title: 'Personalized Support',
    description: 'Get tailored guidance and support based on your unique needs and preferences.',
    image: require('../../assets/images/onboard-2.png'),
  },
  {
    id: '3',
    title: 'Track Your Progress',
    description: 'Monitor your mental health journey with detailed insights and progress tracking.',
    image: require('../../assets/images/onboard-3.png'),
  },
  {
    id: '4',
    title: 'Start Your Journey',
    description: 'Begin your path to better mental health with our comprehensive support system.',
    image: require('../../assets/images/onboard-4.png'),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef<Animated.FlatList<any>>(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    setCurrentIndex(viewableItems[0]?.index ?? 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < onboardingData.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView
        lightColor={Colors.harmony.primary}
        darkColor={Colors.harmony.primarydark}
        style={styles.container}
      >
        <View style={styles.slidesContainer}>
          <Animated.FlatList
            data={onboardingData}
            renderItem={({ item }) => <OnboardingItem item={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={false}
            keyExtractor={(item) => item.id}
            onScroll={scrollHandler}
            scrollEventThrottle={32}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            ref={slidesRef}
          />
        </View>
        {/* <Pagination data={onboardingData} scrollX={scrollX} />
        <CustomButton
          onPress={scrollTo}
          style={{
          width:80,
          height:80,
        }} /> */}
      </ThemedView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slidesContainer: {
    flex: 3,
    width: '100%',
  },
  button: {
    marginBottom: 40,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});