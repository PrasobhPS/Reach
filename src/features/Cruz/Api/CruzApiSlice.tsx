import { apiSlice } from "../../../app/apiSlice";

export const cruzApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJobRole: builder.query({
      query: () => ({
        url: "/job-role",
        method: "GET",
      }),
    }),
    getJobDuration: builder.query({
      query: () => ({
        url: "/job-duration",
        method: "GET",
      }),
    }),
    getBoatLocation: builder.query({
      query: () => ({
        url: "/boat-location",
        method: "GET",
      }),
    }),
    getBoatType: builder.query({
      query: () => ({
        url: "/boat-type",
        method: "GET",
      }),
    }),
    getLanguages: builder.query({
      query: () => ({
        url: "/getLanguages",
        method: "GET",
      }),
    }),
    getQualifications: builder.query({
      query: () => ({
        url: "/getQualifications",
        method: "GET",
      }),
    }),
    getExperience: builder.query({
      query: () => ({
        url: "/getExperience",
        method: "GET",
      }),
    }),
    getAvailability: builder.query({
      query: () => ({
        url: "/getAvailability",
        method: "GET",
      }),
    }),
    getPositions: builder.query({
      query: () => ({
        url: "/getPositions",
        method: "GET",
      }),
    }),
    getSalaryExpectations: builder.query({
      query: () => ({
        url: "/getSalaryExpectations",
        method: "GET",
      }),
    }),
    saveJob: builder.mutation({
      query: (jobData) => ({
        url: "/employer/post-job",
        method: "POST",
        body: jobData,
      }),
    }),


  }),
  overrideExisting: true,
});

export const {
  useGetJobRoleQuery,
  useGetJobDurationQuery,
  useGetBoatLocationQuery,
  useGetBoatTypeQuery,
  useGetLanguagesQuery,
  useGetQualificationsQuery,
  useGetExperienceQuery,
  useGetAvailabilityQuery,
  useGetPositionsQuery,
  useGetSalaryExpectationsQuery,
  useSaveJobMutation,
} = cruzApiSlice;
