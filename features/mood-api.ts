import { apiSlice } from "./api-slice";

export interface MoodEntry {
    entryId?: string | undefined;
    mood: string;
    rating: number;
    note: string;
    tags: string[];
    triggers: string[];
    createdAt?: string;
}

export const moodApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMoodEntries: builder.query<MoodEntry[], void>({
            query: () => '/mood',
        }),
        addMoodEntry: builder.mutation<MoodEntry, MoodEntry>({
            query: (entry) => ({
                url: '/mood',
                method: 'POST',
                body: entry,
            }),
        }),
        updateMoodEntry: builder.mutation<MoodEntry, { entryId: string; entry: MoodEntry }>({
            query: ({ entryId, entry }) => ({
                url: `/mood/${entryId}`,
                method: 'PUT',
                body: entry,
            }),
        }),
        deleteMoodEntry: builder.mutation<void, string>({
            query: (entryId) => ({
                url: `/mood/${entryId}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetMoodEntriesQuery,
    useAddMoodEntryMutation,
    useUpdateMoodEntryMutation,
    useDeleteMoodEntryMutation,
} = moodApi; 