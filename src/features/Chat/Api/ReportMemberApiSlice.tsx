import { apiSlice } from "../../../app/apiSlice";

export const ReportMemberApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        ReportMember: builder.mutation({
            query: ({ reported_member_id, reported_by_member_id, report_reason }) => ({
                url: `/chatReportMember`,
                method: "POST",
                body: { reported_member_id, reported_by_member_id, report_reason },
            }),
        }),
    }),

    overrideExisting: true,
});

export const {
    useReportMemberMutation
} = ReportMemberApiSlice