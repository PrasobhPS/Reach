import { apiSlice } from "../../app/apiSlice";

export const VideoCallApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        extendSlotAvailable: builder.mutation({
            query: ({ meeting_id }) => ({
                url: "/member/extendslotAvailable",
                method: "POST",
                body: { meeting_id },
            }),
        }),
        joinMeeting: builder.mutation({
            query: ({ meeting_id, member_id }) => ({
                url: "/member/meetingJointime",
                method: "POST",
                body: { meeting_id, member_id },
            }),
        }),
        leftMeeting: builder.mutation({
            query: ({ meeting_id, member_id }) => ({
                url: "/member/meetinglefttime",
                method: "POST",
                body: { meeting_id, member_id },
            }),
        }),
        updateExpertPayment: builder.mutation({
            query: ({ meeting_id }) => ({
                url: `/member/meeting_ended/${meeting_id}`,
                method: "GET",
            }),
        }),
        checkExpertRating: builder.mutation({
            query: ({ meeting_id }) => ({
                url: "/specialists/specialistAlreadyRated",
                method: "POST",
                body: { meeting_id },
            }),
        }),
        expertRating: builder.mutation({
            query: ({ meeting_id,rating,review }) => ({
                url: "/specialists/specialistRating",
                method: "POST",
                body: { meeting_id,rating,review },
            }),
        }),
    }),
    overrideExisting: true,
});

export const {
    useExtendSlotAvailableMutation,
    useJoinMeetingMutation,
    useLeftMeetingMutation,
    useUpdateExpertPaymentMutation,
    useCheckExpertRatingMutation,
    useExpertRatingMutation,
} = VideoCallApiSlice;
