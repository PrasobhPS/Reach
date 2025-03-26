import { apiSlice } from "../../../../app/apiSlice";

export const employerProfileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    employerProfile: builder.query({
      query: ({ id }) => ({
        url: `/employer/previewJobAdvert/${id}`,
        method: "GET",
      }),
    }),

    campaignMatchesList: builder.mutation({
      query: (jobData) => ({
        url: "/employer/campaignMatchesList",
        method: "POST",
        body: jobData,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    likeCampaign: builder.mutation({
      query: (jobData) => ({
        url: "/employer/likeCampaign",
        method: "POST",
        body: jobData,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: [{ type: 'SideMenu' }],
    }),

    unLikeCampaign: builder.mutation({
      query: (jobData) => ({
        url: "/employer/unlikeCampaign",
        method: "POST",
        body: jobData,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: [{ type: 'SideMenu' }],
    }),


  }),
  overrideExisting: true,
});

export const {
  useEmployerProfileQuery,
  useCampaignMatchesListMutation,
  useLikeCampaignMutation,
  useUnLikeCampaignMutation,
} = employerProfileApiSlice;
