import React from 'react';
import { StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { useGetProfileQuery } from '@/features/auth-api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/features/auth-slice';

const CheckoutScreen = () => {
  const { url:sessionUrl } = useLocalSearchParams();
  const { refetch: refetchProfile } = useGetProfileQuery();
  const dispatch = useDispatch();

  if (!sessionUrl) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#000" style={styles.loader} />
      </ThemedView>
    );
  }

  const handleSuccess = async () => {
    try {
      const { data: userProfile } = await refetchProfile();
      if (userProfile) {
        dispatch(setCredentials({ user: userProfile }));
      }
      router.replace('/subscriptions');
    } catch (error) {
      console.error('Failed to update user profile:', error);
      router.replace('/subscriptions');
    }
  };

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
            handleSuccess();
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
