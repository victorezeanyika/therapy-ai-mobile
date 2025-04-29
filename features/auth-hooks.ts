import { useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppSelector } from './hooks';

export const useAuthCheck = (redirectPath: string = '/(tabs)') => {
  const { user } = useAppSelector(state => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken && user) {
        router.replace(redirectPath);
      }
    };
    checkAuth();
  }, [user, redirectPath]);
};

export const useAuthRedirect = async (redirectPath: string = '/(tabs)') => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  const { user } = useAppSelector(state => state.auth);
  
  if (accessToken && user) {
    router.replace(redirectPath);
    return true;
  }
  return false;
}; 