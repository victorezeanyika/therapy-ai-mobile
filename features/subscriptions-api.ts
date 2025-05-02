import apiSlice from "./api-slice";

export const subscriptionsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriptions: builder.query<any, void>({
            query: () => '/subscription/plans?lang=en',
        }),
        getSubscriptionStatus: builder.query<any, void>({
            query: () => '/subscription/status',
        }),
        createPaymentIntent: builder.mutation<any, {plan: string, email: string, billingPeriod: "monthly" | "annual"}>({  
            query: ({plan, email, billingPeriod}: {plan: string, email: string, billingPeriod: "monthly" | "annual"}) => ({
                url: '/subscription/create',
                method: 'POST',
                body: { 
                    email,
                    plan, // Remove the toUpperCase() to send the plan name as-is
                    billingPeriod 
                },
            }),
        }),
    }),
    overrideExisting: true
}); 

export const { 
    useGetSubscriptionsQuery,
    useCreatePaymentIntentMutation,
    useGetSubscriptionStatusQuery,
 } = subscriptionsApi;