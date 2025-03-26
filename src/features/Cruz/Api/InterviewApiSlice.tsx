import { apiSlice } from "../../../app/apiSlice";

export const InterviewApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        ScheduleInterview: builder.mutation({
            query: ({ job_id, employee_id, interview_time, interview_date, interview_timezone, status, interview_id }) => ({
                url: `/employer/bookAInterview`,
                method: "POST",
                body: { job_id, employee_id, interview_time, interview_date, interview_timezone, status, interview_id },
            }),
            invalidatesTags: ['SideMenu'],
        }),
        InterviewBookedTimes: builder.mutation({
            query: ({ interview_date, job_id }) => ({
                url: `/employer/bookedInterviews`,
                method: "POST",
                body: { interview_date, job_id },
            }),
        }),
        acceptInterview: builder.mutation({
            query: ({ interview_id, status, is_cancel }) => ({
                url: `/employer/acceptInterview`,
                method: "POST",
                body: { interview_id, status, is_cancel },
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            invalidatesTags: ['SideMenu'],
        }),
        myInterviewList: builder.query({
            query: () => ({
                url: "/employee/myInterviewList",
                method: "GET",
            }),
        }),
        jobInterviewList: builder.query({
            query: () => ({
                url: "/employee/jobInterviewList",
                method: "GET",
            }),
        }),
        getInterviewAvailableTime: builder.mutation({
            query: ({ member_id, interview_date }) => ({
                url: `/employee/getAvailableInterviewSlots`,
                method: "POST",
                body: { member_id, interview_date },
            }),
        }),
    }),

    overrideExisting: true,
});

export const {
    useScheduleInterviewMutation,
    useInterviewBookedTimesMutation,
    useAcceptInterviewMutation,
    useMyInterviewListQuery,
    useJobInterviewListQuery,
    useGetInterviewAvailableTimeMutation,
} = InterviewApiSlice