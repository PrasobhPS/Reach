import { apiSlice } from "../../../app/apiSlice";

export const CampaignApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLiveCampaigns: builder.query({
      query: () => ({
        url: "/employer/getLiveCampaigns",
        method: "GET",
      }),
    }),
    pauseCampaign: builder.mutation({
      query: ({ id, jobStatus }: { id: number; jobStatus: string }) => ({
        url: `/employer/pauseCampaign/${id}/${jobStatus}`,
        method: "GET",
      }),
    }),
    deleteCampaign: builder.mutation({
      query: (id) => ({
        url: `/employer/deleteCampaign/${id}`,
        method: "GET",
      }),
      invalidatesTags: ['SideMenu'],
    }),
    activateCampaign: builder.mutation({
      query: (id) => ({
        url: `/employer/activateCampaign/${id}`,
        method: "GET",
      }),
      invalidatesTags: ['SideMenu'],
    }),
    removeCampaign: builder.mutation({
      query: (id) => ({
        url: `/employer/removeCampaign/${id}`,
        method: "GET",
      }),
      invalidatesTags: ['SideMenu'],
    }),
    myMatchesList: builder.query({
      query: ({ id }) => ({
        url: `/employer/myMatchesList/${id}`,
        method: "GET",
      }),
    }),
    getDraftCampaigns: builder.query({
      query: () => ({
        url: "/employer/getDraftCampaigns",
        method: "GET",
      }),
    }),
    getArchiveCampaigns: builder.query({
      query: () => ({
        url: "/employer/getArchiveCampaigns",
        method: "GET",
      }),
    }),
    myLikedList: builder.query({
      query: ({ id }) => ({
        url: `/employer/myLikedList/${id}`,
        method: "GET",
      }),
    }),
    myUnLikedList: builder.query({
      query: ({ id }) => ({
        url: `/employer/myDislikedList/${id}`,
        method: "GET",
      }),
    }),
    employerVarification: builder.mutation({
      query: () => ({
        url: "/member/createStripeVerification",
        method: "GET",
      }),
    }),
    getVarificationStatus: builder.mutation({
      query: () => ({
        url: "/member/getDocVerificationStatus",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetLiveCampaignsQuery,
  usePauseCampaignMutation,
  useDeleteCampaignMutation,
  useRemoveCampaignMutation,
  useActivateCampaignMutation,
  useMyMatchesListQuery,
  useGetDraftCampaignsQuery,
  useGetArchiveCampaignsQuery,
  useMyLikedListQuery,
  useMyUnLikedListQuery,
  useEmployerVarificationMutation,
  useGetVarificationStatusMutation,
} = CampaignApiSlice;
