import { apiSlice } from "../../app/apiSlice";

export const HomeApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        HomeDetails: builder.query({
            query: () => ({
                url: "/getSiteHomeDetails",
                method: "GET",
            }),
        }),
    }),
    overrideExisting: true,
});
export const {
    useHomeDetailsQuery
} = HomeApiSlice