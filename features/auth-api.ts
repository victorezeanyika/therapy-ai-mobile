import { IUser } from "@/types";
import apiSlice from "./api-slice";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Store the token
          await AsyncStorage.setItem('accessToken', data.accessToken);
        } catch (error) {
          // Handle error if needed
          console.error('Login failed:', error);
        }
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          // Clear the token
          await AsyncStorage.removeItem('accessToken');
        } catch (error) {
          console.error('Logout failed:', error);
        }
      },
    }),
    register: builder.mutation({
      query: (newUser) => ({
        url: '/auth/register',
        method: 'POST',
        body: newUser,
      }),
      // transformResponse: (responseData: any) => responseData,
    }),
    getUser: builder.query<IUser, { id: string }>({
      query: ({ id }) => `/users/${id}`, // 🔹 Corrected the `id` reference
    }),
    getProfile:builder.query<any, void>({
      query:() =>  `/users/profile`
    }),
    updateProfile:builder.mutation<any, void>({
      query: (email) => ({
        url: '/users/profile',
        method: 'PUT',
      }),
    }),
    verifyEmail: builder.mutation({
      query: (email) => ({
        url: '/auth/verify/email',
        method: 'POST',
        body: email,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: '/auth/password/forgot',
        method: 'POST',
        body: email,
      }),
    }),
    verifyOtp: builder.mutation({
      query: ({email,otp} ) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body:{
          email,
          otp
        },
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/password/reset',
        method: 'POST',
        body: data,
      }),
    }),
    refreshToken: builder.query({
      query: () => 'auth/refresh-token',
    }),
    submitUserPreferences: builder.mutation<void, Preferences>({
      query: (preferences) => ({
        url: '/auth/users/preferences',
        method: 'POST',
        body: { preferences },
      }),
    }),
  }),
});

export const { 
  useLoginMutation, 
  useLogoutMutation,
  useGetUserQuery,
  useRegisterMutation,
  useForgotPasswordMutation,
  useVerifyEmailMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useSubmitUserPreferencesMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
 } = authApi;