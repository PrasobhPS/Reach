import { apiSlice } from "../../app/apiSlice";

export const changePasswordApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    changePassword: builder.mutation({
      query: (userData) => ({
        url: "/member/changePassword",
        method: "POST",
        body: { ...userData },
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useChangePasswordMutation } = changePasswordApiSlice;
