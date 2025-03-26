import { apiSlice } from "../../app/apiSlice";

// Create the cmsContentApiSlice using injectEndpoints
export const partnersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    partners: builder.query({
      query: () => ({
        url: "/ourPartners",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: true,
});

export const { usePartnersQuery } = partnersApiSlice;
