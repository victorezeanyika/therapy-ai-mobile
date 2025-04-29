import React from 'react';
import { StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';

const CheckoutScreen = () => {
  const { url:sessionUrl } = useLocalSearchParams();

  console.log(sessionUrl, 'fdf')
  if (!sessionUrl) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#000" style={styles.loader} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <WebView
        source={{ uri: sessionUrl as string }}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator size="large" color="#000" style={styles.loader} />
        )}
        onNavigationStateChange={(event) => {
          if (event.url.includes('success')) {
            router.replace('/subscriptions'); // Replace with your actual post-payment screen
          }
        }}
      />
    </ThemedView>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
});
