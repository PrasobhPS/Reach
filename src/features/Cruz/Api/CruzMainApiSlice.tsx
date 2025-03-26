import { apiSlice } from "../../../app/apiSlice";

export const CruzMainApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getJobQuestions: builder.query({
            query: () => ({
                url: "/employer/getPostJobDetails",
                method: "GET",
            }),
        }),
        saveJob: builder.mutation({
            query: (jobData) => ({
                url: "/employer/post-job",
                method: "POST",
                body: jobData,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            invalidatesTags: ['SideMenu'],
        }),
        getJobDetails: builder.mutation({
            query: ({ id }) => ({
                url: `/employer/editPostJobDetails/${id}`,
                method: "GET",
            }),
        }),
        removeImage: builder.mutation({
            query: (imageData) => ({
                url: "/employer/removeImage",
                method: "POST",
                body: imageData,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        }),


        getProfileQuestions: builder.query({
            query: () => ({
                url: "/employee/setUpProfile",
                method: "GET",
            }),
        }),

        saveProfile: builder.mutation({
            query: (profileData) => ({
                url: "/employee/saveProfile",
                method: "POST",
                body: profileData,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            invalidatesTags: ['SideMenu'],
        }),

        getProfileDetails: builder.mutation({
            query: ({ id }) => ({
                url: `/employee/editsetUpProfile/${id}`,
                method: "GET",
            }),
        }),

        getChatMember: builder.mutation({
            query: (profileData) => ({
                url: "/member/getChatMemberDetails",
                method: "POST",
                body: profileData,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        }),

        getDashboardCount: builder.query({
            query: () => ({
                url: "/member/getDashboardCount",
                method: "GET",

            }),
            providesTags: ['SideMenu'],
        }),

    }),
    overrideExisting: true,
});

export const {
    useGetJobQuestionsQuery,
    useSaveJobMutation,
    useGetJobDetailsMutation,
    useRemoveImageMutation,
    useGetProfileQuestionsQuery,
    useSaveProfileMutation,
    useGetProfileDetailsMutation,
    useGetChatMemberMutation,
    useGetDashboardCountQuery,
} = CruzMainApiSlice;
