import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ImageBackground } from 'expo-image';

const { width } = Dimensions.get('window');

interface OnboardingItemProps {
  item: {
    id: string;
    title: string;
    description: string;
    image: any;
  };
}

export default function OnboardingItem({ item }: OnboardingItemProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(1000).springify()}
      style={[styles.container, { width }]}
    >
      {/* Top main image */}
      <View style={styles.imageContainer}>
        <ImageBackground
          source={item.image}
          style={styles.image}
          contentFit="cover"
          transition={1000}
        />
      </View>

      {/* Background image for text */}
      <Image
        source={require('@/assets/images/arc.png')}
        style={styles.textBackground}
        contentFit="cover"
        transition={1000}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          {/* <Text style={styles.description}>{item.description}</Text> */}
        </View>
      </Image>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  imageContainer: {
    width: '100%',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 513,
    borderRadius: 10,
  },
  textBackground: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Gotham-Bold',
    color: '#fff',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    opacity: 0.8,
    color: '#fff',
  },
});
