import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image } from "expo-image";
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from "react-native";
import { useState, useRef } from "react";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";

const { width } = Dimensions.get('window');

export default function Auth() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const scrollX = useSharedValue(0);
  const scrollViewRef = useRef<Animated.ScrollView>(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleTabPress = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    scrollViewRef.current?.scrollTo({
      x: tab === 'login' ? 0 : width,
      animated: true,
    });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemedView
          style={styles.container}
          lightColor="#F7F4F2"
          darkColor=""
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Image 
              source={require('@/assets/images/authheader.png')}
              style={styles.headerImage}
            />
            <View style={styles.content}>
              <ThemedText type="title">
                Get Started Now
              </ThemedText>
              <ThemedText type="subtitle" style={styles.subtitle}>
                Create an account or log in to explore about our app
              </ThemedText>

              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'login' && styles.activeTab]}
                  onPress={() => handleTabPress('login')}
                >
                  <ThemedText style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>
                    Login
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'signup' && styles.activeTab]}
                  onPress={() => handleTabPress('signup')}
                >
                  <ThemedText style={[styles.tabText, activeTab === 'signup' && styles.activeTabText]}>
                    Sign Up
                  </ThemedText>
                </TouchableOpacity>
              </View>

              <Animated.ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                onMomentumScrollEnd={(event) => {
                  const newTab = event.nativeEvent.contentOffset.x === 0 ? 'login' : 'signup';
                  setActiveTab(newTab);
                }}
              >
                <View style={[styles.formContainer, { width }]}>
                  <LoginForm />
                </View>
                <View style={[styles.formContainer, { width }]}>
                  <SignupForm />
                </View>
              </Animated.ScrollView>
            </View>
          </ScrollView>
        </ThemedView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerImage: {
    width: '100%',
    height: '20%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 222,
    marginTop: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: 'rgba(42, 157, 143, 0.1)',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#2A9D8F',
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
  },
});