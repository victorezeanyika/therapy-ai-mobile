import apiSlice from "./api-slice";

export const chatApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getChat: builder.query<any, void>({
            query: () => '/chat',
        }),
        createSession: builder.mutation<any, void>({
            query: () => ({
                url: '/chat/session',
                method: 'POST',
            }),
        }),
        sendMessage: builder.mutation<any, any>({
            query: ({message, sessionId}) => ({
                url: '/chat/message',
                method: 'POST',
                body: {message, sessionId},
            }),
        }),
    }),
})

export const { 
    useGetChatQuery,
    useCreateSessionMutation,
    useSendMessageMutation,
 } = chatApi;

export default chatApi;
