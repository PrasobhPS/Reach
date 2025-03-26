import { apiSlice } from "../../app/apiSlice";

export const forgotPasswordApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    forgotPassword: builder.mutation({
      query: (userData) => ({
        url: "/forgotPassword",
        method: "POST",
        body: { ...userData },
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useForgotPasswordMutation } = forgotPasswordApiSlice;
