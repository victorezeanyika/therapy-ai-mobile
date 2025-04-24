import { View, StyleSheet, Image, Animated, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import CustomButton from '@/components/ui/Button';

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Staggered animations
    Animated.sequence([
      // Fade in the image
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Slide up the text
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ThemedView
      lightColor={Colors.harmony.white}
      darkColor={Colors.harmony.primarydark}
      style={styles.container}
    >
      <View style={styles.content}>
      <View>
            <ThemedText
            lightColor={Colors.harmony.primary}
            darkColor='#fff'
            style={{
              textAlign:'center',
            }}
            >Welcome to Serentis</ThemedText>
            <ThemedText
            lightColor={Colors.harmony.primary}
            darkColor='#fff'
            type='subtitle' 
            style={{
              marginTop:10,
              textAlign:'center',
            }}
            >Your AI-powered companion for 
            emotional balance, self-reflection,
            and personal growth.
            </ThemedText>
          </View>
        <Animated.View
          style={[
            styles.imageContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        > 
         
          <Image
            source={require('../assets/images/frame1.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim,
                },
              ],
            },
          ]}
        >
          <CustomButton 
           title='Get Started'
           onPress={() => router.push('/(tabs)/settings')}
          />
          {/* <ThemedText 
          type='subtitle'
           style={{
            marginTop:20,
            fontSize:14,
            fontWeight:'bold',
            fontFamily:'Gotham-bold'
          }}>Already have an account? SignIn</ThemedText>
           */}
        </Animated.View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'space-around',
    padding: 20,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  image: {
    width: '80%',
    height: 300,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.8,
  },
}); 