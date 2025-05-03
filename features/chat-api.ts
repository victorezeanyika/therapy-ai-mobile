import apiSlice from "./api-slice";

export const chatApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getChat: builder.query<any, void>({
            query: () => '/chat',
        }),
        getAllSessions: builder.query<any, void>({
            query: () => '/chat/sessions',
            
        }),
        getSessionById: builder.query<any, string>({
            query: (sessionId) => `/chat/sessions/${sessionId}`,
        }),
        getAllSessionsBasic: builder.query<any, void>({
            query: () => '/chat/sessions/basic',
            
        }),
        createSession: builder.mutation<any, void>({
            query: () => ({
                url: '/chat/session',
                method: 'POST',
            }),
        }),
        endSession: builder.mutation<any, string>({
            query: (sessionId) => ({
                url: `/chat/session/${sessionId}/end`,
                method: 'POST',
            }),
        }),
        sendMessage: builder.mutation<any, any>({
            query: ({message, sessionId}) => ({
                url: `/chat/session/${sessionId}/message`,
                method: 'POST',
                body: {
                    message,
                    sessionId,
                },
            }),
        }),
    }),
})

export const { 
    useGetChatQuery,
    useCreateSessionMutation,
    useSendMessageMutation,
    useGetAllSessionsQuery,
    useGetSessionByIdQuery,
    useGetAllSessionsBasicQuery,
    useEndSessionMutation,
 } = chatApi;

export default chatApi;
