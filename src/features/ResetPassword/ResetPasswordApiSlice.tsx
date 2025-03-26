import { apiSlice } from "../../app/apiSlice";

export const resetPasswordApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    resetPassword: builder.mutation({
      query: (userData) => ({
        url: "/resetPassword",
        method: "POST",
        body: { ...userData },
      }),
    }),
    checkTokenExists: builder.mutation({
      query: checkData => {
        return ({
          url: "/checkTokenExists",
          method: "POST",
          body: checkData,
        })
      },
    }),
  }),
  overrideExisting: true,
});

export const { useResetPasswordMutation, useCheckTokenExistsMutation } = resetPasswordApiSlice;
