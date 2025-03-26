import { apiSlice } from "../../app/apiSlice";

// Create the profileApiSlice using injectEndpoints
export const contactApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    contact: builder.mutation({
      query: (credentials) => ({
        url: "/contactUs",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-API-Key": "493d25ea-24d9-4662-ae7b-c96255ecbbe6",
        },
        body: { ...credentials },
      }),
    }),
  }),
  overrideExisting: true,
});

// Destructure the useProfileMutation hook from profileApiSlice
export const { useContactMutation } = contactApiSlice;
