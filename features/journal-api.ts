// /api/journal/

import { apiSlice } from "./api-slice";

export interface JournalEntry {
    entryId?: string | undefined;
    title: string;
    content: string;
    tags: string[];
    createdAt?: string;
}

export interface DashboardData {
    moodData: {
        moods: Array<{
            rating: number;
            note: string;
            tags: string[];
            triggers: string[];
            createdAt: string;
            aiAnalysis?: {
                aiAnalysis: any;
                createdAt: string;
                entryId: string;
                note: string;
                rating: number;
                tags: string[];
                triggers: string[];
            };
        }>;
    };
    journalEntries: JournalEntry[];
}

export const journalApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getJournalEntries: builder.query<JournalEntry[], void>({
            query: () => '/journal',
        }),
        getActivities: builder.query<JournalEntry[], void>({
            query: () => '/activities/recommended',
        }),
        getDashboard: builder.query<DashboardData, void>({
            query: () => '/dashboard',
        }),
        addJournalEntry: builder.mutation<JournalEntry, JournalEntry>({
            query: (entry) => ({
                url: '/journal',
                method: 'POST',
                body: entry,
            }),
        }),
        updateJournalEntry: builder.mutation<JournalEntry, { entryId: string; entry: JournalEntry }>({
            query: ({ entryId, entry }) => ({
                url: `/journal/${entryId}`,
                method: 'PUT',
                body: entry,
            }),
        }),
        deleteJournalEntry: builder.mutation<void, string>({
            query: (entryId) => ({
                url: `/journal/${entryId}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const { 
    useGetJournalEntriesQuery,
     useAddJournalEntryMutation, 
     useUpdateJournalEntryMutation, 
     useDeleteJournalEntryMutation,
     useGetDashboardQuery,
     useGetActivitiesQuery,
    } = journalApi;
