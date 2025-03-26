import { apiSlice } from "../../../../app/apiSlice";

export const employeeProfileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    employeeProfile: builder.query({
      query: () => ({
        url: "/employee/reviewProfile",
        method: "GET",
      }),
      providesTags: ['SideMenu'],
    }),

    availableJobsList: builder.mutation({
      query: (jobData) => ({
        url: "/employee/availableJobsList",
        method: "POST",
        body: jobData,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    likeEmployee: builder.mutation({
      query: (jobData) => ({
        url: "/employee/likeEmployee",
        method: "POST",
        body: jobData,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: [{ type: 'SideMenu' }],
    }),

    employeeMyMatches: builder.query({
      query: () => ({
        url: "/employee/myMatchesList",
        method: "GET",
      }),
      providesTags: ['SideMenu'],
    }),

    employeeLikedJob: builder.query({
      query: () => ({
        url: "/employee/myLikedList",
        method: "GET",
      }),
      providesTags: ['SideMenu'],
    }),

    unlikeEmployee: builder.mutation({
      query: (jobData) => ({
        url: "/employee/unlikeEmployee",
        method: "POST",
        body: jobData,
        headers: {
          'Content-Type': 'application/json',
        },

      }),
      invalidatesTags: ['SideMenu'],
    }),
    employeeDisLikedJob: builder.query({
      query: () => ({
        url: "/employee/myDislikedList",
        method: "GET",

      }),
      providesTags: ['SideMenu'],
    }),


  }),
  overrideExisting: true,
});

export const {
  useEmployeeProfileQuery,
  useAvailableJobsListMutation,
  useLikeEmployeeMutation,
  useEmployeeMyMatchesQuery,
  useEmployeeLikedJobQuery,
  useUnlikeEmployeeMutation,
  useEmployeeDisLikedJobQuery,
} = employeeProfileApiSlice;
