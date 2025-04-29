// /api/journal/

import { apiSlice } from "./api-slice";

interface JournalEntry {
    title: string;
    content: string;
    tags: string[];
    
}

export const journalApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getJournalEntries: builder.query<JournalEntry[], void>({
            query: () => '/journal',
        }),
        getDashboard: builder.query<JournalEntry[], void>({
            query: () => '/dashboard',
        }),
        addJournalEntry: builder.mutation<JournalEntry, JournalEntry>({
            query: (entry) => ({
                url: '/journal',
                method: 'POST',
                body: entry,
            }),
        }),
        updateJournalEntry: builder.mutation<JournalEntry, JournalEntry>({
            query: ({ id, ...rest }) => ({
                url: `/journal/${id}`,
                method: 'PUT',
                body: rest,
            }),
        }),
        deleteJournalEntry: builder.mutation<void, number>({
            query: (id) => ({
                url: `/journal/${id}`,
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
    } = journalApi;
