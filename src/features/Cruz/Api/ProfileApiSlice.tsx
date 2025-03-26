import { apiSlice } from "../../../app/apiSlice";

export const ProfileApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProfileDashboard: builder.query({
            query: () => ({
                url: "/employee/dashboard",
                method: "GET",
            }),
            providesTags: ['SideMenu'],
        }),
        getAvailableJobs: builder.query({
            query: () => ({
                url: "/employee/viewAvailableJobs",
                method: "GET",
            }),
            providesTags: ['SideMenu'],
        }),
        setStatus: builder.mutation({
            query: (profileData) => ({
                url: "/employee/employeeSetStatus",
                method: "POST",
                body: profileData,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetProfileDashboardQuery,
    useGetAvailableJobsQuery,
    useSetStatusMutation,
} = ProfileApiSlice;
