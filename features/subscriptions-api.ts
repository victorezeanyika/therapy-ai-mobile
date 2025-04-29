import apiSlice from "./api-slice";

export const subscriptionsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriptions: builder.query<any, void>({
            query: () => '/subscription/plans?lang=en',
        }),
        createPaymentIntent: builder.mutation<any, {plan: string, email: string}>({
            query: ({plan, email}: {plan: string, email: string}) => ({
                url: '/subscription/create',
                method: 'POST',
                body: { email, plan  },
            }),
        }),

    }),
}); 

export const { 
    useGetSubscriptionsQuery,
    useCreatePaymentIntentMutation,
 } = subscriptionsApi;
