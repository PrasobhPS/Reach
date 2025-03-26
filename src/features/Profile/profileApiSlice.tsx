import { apiSlice } from "../../app/apiSlice";

// Create the profileApiSlice using injectEndpoints
export const profileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    profile: builder.mutation({
      query: () => ({
        url: "/member/getProfile",
        method: "GET",
      }),
    }),
    updateProfile: builder.mutation({
      query: ({ credentials, token }) => ({
        url: "/member/updateProfile",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    removePicture: builder.mutation({
      query: (token) => ({
        url: "/member/removePicture",
        method: "POST",
      }),
    }),
    deleteProfile: builder.mutation({
      query: (token) => ({
        url: "/member/deleteProfile",
        method: "POST",
      }),
    }),
    deactivateProfile: builder.mutation({
      query: (token) => ({
        url: "/member/deactivateProfile",
        method: "POST",
      }),
    }),
    statusUpdate: builder.mutation({
      query: (credentials) => ({
        url: "/member/updateStatus",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    getMemberDetails: builder.mutation({
      query: ({ id }) => ({
        url: `/member/getMemberDetails/${id}`,
        method: "GET",
      }),
    }),
    referralList: builder.query({
      query: () => ({
        url: "/member/myReferralList",
        method: "GET",
      }),
    }),

    saveCallRate: builder.mutation({
      query: (rateData) => ({
        url: "/specialists/setSpecialistCallRate",
        method: "POST",
        body: rateData,
      }),
    }),

    getCallRate: builder.query({
      query: () => ({
        url: "/specialists/getSpecialistCallRate",
        method: "GET",
      }),
    }),

    saveWorkingHours: builder.mutation({
      query: workingHours => {
        return ({
          url: "/member/setWorkingHours",
          method: "POST",
          body: workingHours,
        })
      },
    }),

    updateWorkingHours: builder.mutation({
      query: workingHours => {
        return ({
          url: "/member/updateWorkingHours",
          method: "POST",
          body: workingHours,
        })
      },
    }),
    deleteWorkingHours: builder.mutation({
      query: workingHours => {
        return ({
          url: "/member/deleteWorkingHours",
          method: "POST",
          body: workingHours,
        })
      },
    }),
    getWorkingHours: builder.query({
      query: () => ({
        url: "/member/getWorkingHours",
        method: "GET",
      }),
    }),

    saveUnavailableHours: builder.mutation({
      query: unavailableHours => {
        return ({
          url: "/member/unavailableList",
          method: "POST",
          body: unavailableHours,
        })
      },
    }),

    deleteUnavailableHours: builder.mutation({
      query: unavailableHours => {
        return ({
          url: "/member/deleteUnavilableList",
          method: "POST",
          body: unavailableHours,
        })
      },
    }),

    getUnavailableHours: builder.query({
      query: () => ({
        url: "/member/getUnavailableList",
        method: "GET",
      }),
    }),

    getUnsuscribePlan: builder.mutation({
      query: () => ({
        url: "/member/unsubscribePlan",
        method: "GET",
      }),
    }),
    createStripeAccount: builder.mutation({
      query: () => ({
        url: "/member/createStripeAccount",
        method: "GET",
      }),
    }),

    redeemAmount: builder.mutation({
      query: withdrawData => {
        return ({
          url: "/member/withdrawAmount",
          method: "POST",
          body: withdrawData,
        })
      },
    }),

    getTransaction: builder.query({
      query: () => ({
        url: "/member/transactionhistory",
        method: "GET",
      }),
    }),

    paymentCardChange: builder.mutation({
      query: (passData) => ({
        url: "/member/payment_card_change",
        method: "POST",
        body: passData,
      }),
    }),

    getCountryIso: builder.query({
      query: () => ({
        url: "/member/country_iso",
        method: "GET",
      }),
    }),



  }),
  overrideExisting: true,
});

// Destructure the useProfileMutation hook from profileApiSlice
export const {
  useProfileMutation,
  useUpdateProfileMutation,
  useRemovePictureMutation,
  useDeleteProfileMutation,
  useDeactivateProfileMutation,
  useStatusUpdateMutation,
  useGetMemberDetailsMutation,
  useReferralListQuery,
  useSaveCallRateMutation,
  useGetCallRateQuery,
  useSaveWorkingHoursMutation,
  useUpdateWorkingHoursMutation,
  useDeleteWorkingHoursMutation,
  useGetWorkingHoursQuery,
  useSaveUnavailableHoursMutation,
  useDeleteUnavailableHoursMutation,
  useGetUnavailableHoursQuery,
  useGetUnsuscribePlanMutation,
  useCreateStripeAccountMutation,
  useRedeemAmountMutation,
  useGetTransactionQuery,
  usePaymentCardChangeMutation,
  useGetCountryIsoQuery,
} = profileApiSlice;
