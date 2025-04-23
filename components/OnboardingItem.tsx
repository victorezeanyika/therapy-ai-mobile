import { View, StyleSheet, Dimensions, Text, Image } from 'react-native';
import { ImageBackground } from 'expo-image';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');



interface OnboardingItemProps {
  item: {
    id: string;
    titleParts: string[];
    highlightIndex: number;
    description: string;
    image: any;
  };
}

export default function OnboardingItem({ item }: OnboardingItemProps) {
  return (
    <View
      style={[styles.container, { width }]}
    >
      {/* Top main image */}
      <View style={styles.imageContainer}>
        <Image
          source={item.image}
          style={styles.image}
        />
      </View>

      {/* Background image for text */}
      <ImageBackground
        source={require('@/assets/images/arc.png')}
        style={styles.textBackground}
        contentFit='fill'
        // transition={1000}
      >
        <Text style={styles.title}>
          {item.titleParts.map((part, index) => (
            <Text
              key={index}
              style={index === item.highlightIndex ? { color: Colors.harmony.primary } : {}}
            >
              {part}
            </Text>
          ))}
        </Text>
        <Text style={styles.description}>{item.description}</Text>
      </ImageBackground>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  imageContainer: {
    width: '100%',
    marginTop:80,
    marginBottom:-80,
    // padding: 10,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 513,
    borderRadius: 10,
  },
  textBackground: {
    width: '100%',
    height: 400,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  textContainer: {
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth:240,
  },
  title: {
    marginTop:102,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Gotham-Bold',
    color: '#000',
    paddingHorizontal: 30,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    opacity: 0.8,
    color: '#fff',
  },
});
