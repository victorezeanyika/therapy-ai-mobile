import { createApi, fetchBaseQuery}  from '@reduxjs/toolkit/query/react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://therapy-ai-backend-4wke.onrender.com/api/',
  credentials: 'include',
  prepareHeaders: async (headers) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  tagTypes: ["Auth"],
  baseQuery: async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    // Handle 401 Unauthorized responses
    if (result.error?.status === 401) {
      // Clear token and redirect to login
      await AsyncStorage.removeItem('accessToken');r
      // You might want to dispatch a logout action here
    }
    
    return result;
  },
  endpoints: () => ({})
});

export default apiSlice;
