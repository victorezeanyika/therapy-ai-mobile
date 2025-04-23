import { Colors } from '@/constants/Colors';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface PaginationProps {
  data: any[];
  scrollX: Animated.SharedValue<number>;
}

export default function Pagination({ data, scrollX }: PaginationProps) {
  return (
    <View style={styles.container}>
      {data.map((_, idx) => {
        const inputRange = [
          (idx - 1) * width,
          idx * width,
          (idx + 1) * width,
        ];

        const dotWidth = interpolate(
          scrollX.value,
          inputRange,
          [10, 20, 10],
          'clamp'
        );

        const opacity = interpolate(
          scrollX.value,
          inputRange,
          [0.3, 1, 0.3],
          'clamp'
        );

        const animatedDotStyle = useAnimatedStyle(() => {
          return {
            width: dotWidth,
            opacity,
          };
        });

        return (
          <Animated.View
            key={idx.toString()}
            style={[styles.dot, animatedDotStyle]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.harmony.primary,
    marginHorizontal: 8,
  },
}); 