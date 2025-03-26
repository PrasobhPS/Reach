import { apiSlice } from "../../../app/apiSlice";

export const MemberNotificationsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        MemberNotifications: builder.mutation({
            query: ({ member_id }) => ({
                url: `/member/notificationList`,
                method: "POST",
                body: { member_id },
            }),
        }),

        readNotifications: builder.mutation({
            query: ({ member_id }) => ({
                url: `/member/readNotification`,
                method: "POST",
                body: { member_id },
            }),
        }),
    }),

    overrideExisting: true,
});

export const {
    useMemberNotificationsMutation,
    useReadNotificationsMutation
} = MemberNotificationsApiSlice