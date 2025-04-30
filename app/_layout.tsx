import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { Provider } from 'react-redux';
import { store } from '@/features/store';
import { ToastProvider } from '@/context/toast-context';
import { ThemeProvider } from '@/context/theme-context';
import { useTheme } from '@/context/theme-context';
import CheckoutScreen from './checkout-screen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { theme } = useTheme();
  const [loaded] = useFonts({
    GothamBook: require('../assets/fonts/Gotham-Book.otf'),
    GothamMedium: require('../assets/fonts/Gotham-Medium.otf'),
    GothamBold: require('../assets/fonts/Gotham-Bold.otf'),
    GothamLight: require('../assets/fonts/Gotham-Light.otf'),
    Hb: require('../assets/fonts/hb.ttf'),
    Hc: require('../assets/fonts/hc.otf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <NavigationThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <ToastProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="subscriptions" options={{ headerShown: false }} />
          <Stack.Screen name="chat-detail" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/assessment" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/verify-otp" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/forgot-password" options={{ headerShown: false }} />
          <Stack.Screen name="(settings)/accountinfo" options={{ headerShown: false }} />
          <Stack.Screen name="(settings)/personalinfo" options={{ headerShown: false }} />
          <Stack.Screen name="(settings)/security" options={{ headerShown: false }} />
          <Stack.Screen name="(settings)/delete" options={{ headerShown: false }} />
          <Stack.Screen name="(settings)/update-password" options={{ headerShown: false }} />
          <Stack.Screen name="(subscriptions)/basic" options={{ headerShown: false }} />
          <Stack.Screen name="(subscriptions)/standard" options={{ headerShown: false }} />
          <Stack.Screen name="(subscriptions)/premium" options={{ headerShown: false }} />
          <Stack.Screen name="conversations" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(onboarding)/index" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="(settings)/app-theme" options={{ headerShown: false }} />
          <Stack.Screen name="checkout-screen"   options={{ headerShown: false }} />

        </Stack>
      </ToastProvider>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </Provider>
  );
}
