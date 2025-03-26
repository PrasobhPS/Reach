import { apiSlice } from "../../app/apiSlice";

// Create the cmsContentApiSlice using injectEndpoints
export const PaymentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        paymentInitialize: builder.mutation({
            query: () => ({
                url: `/paymentInitialize`,
                method: "POST",
            }),
        }),
    }),
    overrideExisting: true,
});

export const {
    usePaymentInitializeMutation,
} = PaymentApiSlice;
