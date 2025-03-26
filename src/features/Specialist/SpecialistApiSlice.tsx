import { apiSlice } from "../../app/apiSlice";

export const SpecialistsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        Specialist: builder.mutation({
            query: () => ({
                url: "/getSpecialistsList",
                method: "GET",
            }),
        }),
        SpecialistProfile: builder.mutation({
            query: ({ id }) => ({
                url: `/getSpecialistsProfile/${id}`,
                method: "GET",
            }),
        }),
        SpecialistVideos: builder.mutation({
            query: ({ id }) => ({
                url: `/getSpecialistsVideos/${id}`,
                method: "GET",
            }),
        }),
        CallSchedule: builder.mutation({
            query: ({ specialist_id, call_scheduled_date, timeSlot }) => ({
                url: `/specialists/getAvailableTimeSlots`,
                method: "POST",
                body: { specialist_id, call_scheduled_date, timeSlot },
            }),
        }),
        BookSpecialist: builder.mutation({
            query: ({ specialist_id, call_scheduled_date, call_scheduled_time, call_scheduled_timezone, call_scheduled_reason, type, timeSlot, booking_id, call_status, is_member, currency, meeting_id, member_id, stripeToken }) => ({
                url: `/specialists/bookACall`,
                method: "POST",
                body: { specialist_id, call_scheduled_date, call_scheduled_time, call_scheduled_timezone, call_scheduled_reason, type, timeSlot, booking_id, call_status, is_member, currency, meeting_id: meeting_id ?? null, stripeToken: stripeToken ?? null, member_id },
            }),
        }),
        CallScheduleWithSpecialist: builder.mutation({
            query: ({ specialist_id }) => ({
                url: `/member/CallScheduleWithSpecialist`,
                method: "POST",
                body: { specialist_id },
            }),
        }),
        GetAvailableTime: builder.mutation({
            query: ({ specialist_id, call_scheduled_date, timeSlot }) => ({
                url: `/specialists/getAvailableTimeSlots`,
                method: "POST",
                body: { specialist_id, call_scheduled_date, timeSlot },
            }),
        }),
        GetSpecialistRating: builder.query({
            query: ({ userId }) => ({
                url: `/specialists/getAllRatings/${userId}`,
                method: "GET",
            }),
        }),
        GetMemberCardDetails: builder.query({
            query: () => ({
                url: 'member/getmemberCardDetails',
                method: "GET",
            }),
        }),
        GetPaymentInfo: builder.query({
            query: () => ({
                url: '/getPaymentInfo',
                method: "GET",
            })
        }),
        ReserveCall: builder.mutation({
            query: (data) => ({
                url: `specialists/reserveACall`,
                method: "POST",
                body: data,
            }),
        }),
        UpdateBookingStatus: builder.mutation({
            query: (data) => ({
                url: `specialists/updateBookingStatus`,
                method: "POST",
                body: data,
            }),
        }),


    }),
    overrideExisting: true,
});

export const {
    useSpecialistMutation,
    useSpecialistProfileMutation,
    useSpecialistVideosMutation,
    useCallScheduleMutation,
    useBookSpecialistMutation,
    useCallScheduleWithSpecialistMutation,
    useGetAvailableTimeMutation,
    useGetSpecialistRatingQuery,
    useGetMemberCardDetailsQuery,
    useGetPaymentInfoQuery,
    useReserveCallMutation,
    useUpdateBookingStatusMutation,
} = SpecialistsApiSlice