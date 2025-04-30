import { View, StyleSheet, Animated, Text } from 'react-native';
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

export default function SplashScreen() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start scale animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 10,
      friction: 2,
      useNativeDriver: true,
    }).start();

    // Navigate to welcome page after animation
    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemedView
      lightColor={Colors.harmony.primary}
      darkColor={Colors.harmony.primarydark}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.titleContainer,
          {
            transform: [
              {
                scale: scaleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            ],
            opacity: scaleAnim,
          },
        ]}

      >
        <ThemedView
        lightColor={Colors.harmony.primary}
        darkColor='#141718'
        style={{
          flex:1,
          justifyContent:'center',
          alignItems:'center',
        }}
        >
        <Text style={styles.title}>Serentis</Text>
        </ThemedView>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    fontFamily:'Hc',
    color:'#fff',
  },
}); 