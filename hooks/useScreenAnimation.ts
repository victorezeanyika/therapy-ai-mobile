import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

export const useScreenAnimation = (type: 'fade' | 'slide' | 'scale' = 'fade') => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    }).start();
  }, []);

  const getAnimatedStyle = () => {
    switch (type) {
      case 'fade':
        return {
          opacity: animatedValue,
        };
      case 'slide':
        return {
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        };
      case 'scale':
        return {
          opacity: animatedValue,
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        };
      default:
        return {
          opacity: animatedValue,
        };
    }
  };

  return getAnimatedStyle();
}; 