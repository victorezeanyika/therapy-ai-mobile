import { IUser } from "@/types";
import apiSlice from "./api-slice";

interface Preferences {
  notifications: boolean;
  theme: 'light' | 'dark';
  language: string;
  reminderFrequency: 'daily' | 'weekly' | 'monthly';
}

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
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
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
    updateProfile:builder.mutation<any, {payload:any}>({
      query: ({payload}) => ({
        url: '/users/profile',
        method: 'PUT',
        body: payload,
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
        body: preferences,
      }),
    }),
    googleAuth: builder.mutation<LoginResponse, { token: string }>({
      query: (credentials) => ({
        url: 'auth/google',
        method: 'POST',
        body: credentials,
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
  useGoogleAuthMutation,
 } = authApi;