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
    titleParts: ['Personalize Your ', 'Mental Health State', ' With AI'],
    highlightIndex: 1,
    image: require('../../assets/images/onboard-1.png'),
  },
  {
    id: '2',
    titleParts: ['', 'Intelligent', ' Mood Tracking & AI Emotion Insights'],
    highlightIndex: 1,
    image: require('../../assets/images/onboard-2.png'),
  },
  {
    id: '3',
    titleParts: ['AI ', 'Mental', ' Journaling & AI Therapy Chatbot'],
    highlightIndex: 1,
    image: require('../../assets/images/onboard-3.png'),
  },
  {
    id: '4',
    titleParts: ['Mindful ', 'Resources', ' That Makes You Happy'],
    highlightIndex: 1,
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
      router.replace('/(auth)');
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView
        lightColor='#fff'
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
        <View style={{
            position:'absolute',
            bottom:250,
          }}>
      <Pagination data={onboardingData} scrollX={scrollX} />
        </View>

          <View style={{
            position:'absolute',
            bottom:30,
          }}>
        <CustomButton
          onPress={scrollTo}
          style={{
            width:80,
            height:80,
          }} />
          </View>
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
    // flex: 3,
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