import { url } from "inspector";
import { apiSlice } from "../../app/apiSlice";

export const ChandleryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        Chandlery: builder.query({
            query: () => ({
                url: "/chandlery",
                method: "GET",
            }),
        }),
        getCouponCode: builder.mutation({
            query: (passData) => ({
                url: "/getCouponCode",
                method: "POST",
                body: passData,
            }),
        }),
    }),
    overrideExisting: true,
});

export const {
    useChandleryQuery,
    useGetCouponCodeMutation,
} = ChandleryApiSlice