import { apiSlice } from "../../app/apiSlice";


// Create the profileApiSlice using injectEndpoints
export const MyBookingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    specbookings: builder.mutation({
      query: () => ({
        url: "/specialists/bookingHistory",
        method: "GET",
      }),
    }),

    memberbookings: builder.mutation({
      query: () => ({
        url: "/member/bookingHistory",
        method: "GET",
      }),
    }),
    acceptStatus: builder.mutation({
      query: ({ booking_id }) => ({
        url: `/specialists/acceptBooking`,
        method: "POST",
        body: { booking_id },
      }),
    }),
    cancelStatus: builder.mutation({
      query: ({ booking_id }) => ({
        url: `/specialists/cancelBooking`,
        method: "POST",
        body: { booking_id },
      }),
    }),
    videoCallDuration: builder.mutation({
      query: (passData) => ({
        url: `/member/videoDuration`,
        method: "POST",
        body: passData,
      }),
    }),

  }),
  overrideExisting: true,
});

// Destructure the useProfileMutation hook from profileApiSlice
export const {
  useSpecbookingsMutation, useMemberbookingsMutation, useAcceptStatusMutation, useCancelStatusMutation, useVideoCallDurationMutation
} = MyBookingsApiSlice;
