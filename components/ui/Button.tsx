import React from 'react';
import {
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
  StyleProp,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

type Props = {
  title?: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  icon?: React.ReactNode;
};

const CustomButton: React.FC<Props> = ({
  title,
  onPress,
  style,
  textStyle,
  icon,
  disabled = false,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.96, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  const renderIcon = () => {
    if (icon) return icon;
    return <Ionicons name="arrow-forward" size={20} color="#fff" />;
  };

  return (
    <Animated.View style={[animatedStyle]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          {
            backgroundColor: Colors.harmony.primary,
            height: 50,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: disabled ? 0.5 : 1,
            width: 189,
            paddingHorizontal: 20,
            flexDirection: 'row',
          },
          style,
        ]}
        activeOpacity={0.8}
      >
        {title ? (
          <>
            <Text
              style={[
                {
                  color: '#fff',
                  fontWeight: 'bold',
                  fontFamily: 'Gotham-Bold',
                  marginRight: 8,
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
            {renderIcon()}
          </>
        ) : (
          renderIcon()
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CustomButton;
