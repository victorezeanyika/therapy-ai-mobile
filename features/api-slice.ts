import { createApi, fetchBaseQuery}  from '@reduxjs/toolkit/query/react'


export const apiSlice = createApi({
    reducerPath:'api',
    tagTypes: ["Auth"],
    baseQuery: fetchBaseQuery({
      baseUrl: 'https://therapy-ai-backend-4wke.onrender.com/api/',
      credentials: 'include', // Send/receive cookies
      prepareHeaders(headers){
          return headers;
        },
    }),
    endpoints: () => ({})


})

export default apiSlice;
