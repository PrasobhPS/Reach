import { apiSlice } from "../../app/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    ioslogin: builder.mutation({
      query: ({ ios_token }) => ({
        url: `/ios-login`,
        method: "POST",
        body: { ios_token },
      }),
    }),
    emailVerify: builder.mutation({
      query: checkData => {
        return ({
          url: "/emailVerify",
          method: "POST",
          body: checkData,
        })
      },
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: { ...userData },
      }),
    }),
    memberSignup: builder.mutation({
      query: (userData) => ({
        url: "/paid-registration",
        method: "POST",
        body: { ...userData },
      }),
    }),
    memberUpdate: builder.mutation({
      query: (userData) => ({
        url: "/member/update-membership",
        method: "POST",
        body: { ...userData },
      }),
    }),
    registrationUpdate: builder.mutation({
      query: (userData) => ({
        url: "/update-registration",
        method: "POST",
        body: { ...userData },
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
    }),
    emailExist: builder.mutation({
      query: (email) => ({
        url: "checkMemberEmailExists",
        method: "POST",
        body: { ...email },
      }),
    }),
    membershipFee: builder.query({
      query: () => ({
        url: "membershipFee",
        method: "GET",
      }),
    }),
    subscribeNewsletter: builder.mutation({
      query: (email) => ({
        url: "subscribeNewsletter",
        method: "POST",
        body: { ...email },
      }),
    }),
    referralDiscount: builder.mutation({
      query: ({ referral_code, currency }) => ({
        url: `/referral-discount`,
        method: "POST",
        body: { referral_code, currency },
      }),

    }),
    validateReferralCode: builder.mutation({
      query: (referral_code) => ({
        url: "validateReferralCode",
        method: "POST",
        body: { ...referral_code },
      }),
    }),
    joinReach: builder.query({
      query: () => ({
        url: "join-reach",
        method: "GET",
      }),
    }),

    resendEmailVerify: builder.mutation({
      query: checkData => {
        return ({
          url: "/resendEmail",
          method: "POST",
          body: checkData,
        })
      },
    }),

    getMemberFeatures: builder.mutation({
      query: (status) => ({
        url: "membership-features",
        method: "POST",
        body: { status },
      }),
    }),

  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
  useIosloginMutation,
  useRegisterMutation,
  useMemberSignupMutation,
  useMemberUpdateMutation,
  useRegistrationUpdateMutation,
  useLogoutMutation,
  useEmailExistMutation,
  useMembershipFeeQuery,
  useSubscribeNewsletterMutation,
  useReferralDiscountMutation,
  useValidateReferralCodeMutation,
  useJoinReachQuery,
  useEmailVerifyMutation,
  useResendEmailVerifyMutation,
  useGetMemberFeaturesMutation,
} = authApiSlice;
