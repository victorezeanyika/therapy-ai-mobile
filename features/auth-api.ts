import { IUser } from "@/types";
import apiSlice from "./api-slice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string; user: IUser }, { email: string; password: string }>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
        credentials: 'include', // Ensure cookie is set
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
  }),
});

export const { 
  useLoginMutation, 
  useGetUserQuery,
  useRegisterMutation,
  useForgotPasswordMutation,
  useVerifyEmailMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,

 } = authApi;