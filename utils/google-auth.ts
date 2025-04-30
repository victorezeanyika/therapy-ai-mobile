import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useGoogleAuthMutation } from '@/features/auth-api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/features/auth-slice';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from '@/context/toast-context';
import * as AuthSession from 'expo-auth-session';


const redirectUri = AuthSession.makeRedirectUri(
  { 
    native: 'com.kidscantech.TherapyAi',
    scheme: 'TherapyAi',
   }
);


console.log(
  redirectUri,
  "google signin"
);



WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = '526420142631-fhec6u2ke48sk10soblcm3hpnamd2mqh.apps.googleusercontent.com';

export const useGoogleSignIn = () => {
  const { success, error: toastError } = useToast();
  const [googleAuth] = useGoogleAuthMutation();
  const dispatch = useDispatch();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    scopes: ['profile', 'email'],
    redirectUri,
  });
  
  const handleGoogleSignIn = async () => {
    try {
      const result = await promptAsync();
      if (result.type === 'success') {
        const { authentication } = result;
        if (authentication?.accessToken) {
          const response = await googleAuth({ token: authentication.accessToken }).unwrap();
          console.log(response, 'google response')
          // Save access token
          await AsyncStorage.setItem('accessToken', response.accessToken);
          
          // Dispatch user credentials
          dispatch(setCredentials({ user: response.user, accessToken: response.accessToken }));
          
          success('Login successful');
          router.replace('/(tabs)');
        }
      }
    } catch (error: any) {
      console.error('Google auth error:', error);
      toastError(error?.data?.message || error?.message || 'An error occurred during Google sign in');
    }
  };

  return { handleGoogleSignIn, isGoogleSignInReady: !!request };
}; 