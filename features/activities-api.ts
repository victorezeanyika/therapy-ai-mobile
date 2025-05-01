import { apiSlice } from "./api-slice";

export interface Activity {
  _id: string;
  userId: string;
  title: string;
  description: string;
  type: "meditation" | "cbt" | "breathing" | "journaling" | "exercise";
  duration: number;
  difficultyLevel: "beginner" | "intermediate" | "advanced";
  tags: string[];
  instructions?: string[];
}

export const activitiesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActivities: builder.query<Activity[], void>({
      query: () => '/activities/recommended',
    }),
  }),
  overrideExisting: true
});

export const { useGetActivitiesQuery } = activitiesApi;