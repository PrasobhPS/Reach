import { apiSlice } from "../../app/apiSlice";

// Create the profileApiSlice using injectEndpoints
export const CountryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCountry: builder.mutation({
      query: () => ({
        url: "/getCountries",
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-API-Key": "493d25ea-24d9-4662-ae7b-c96255ecbbe6",
        },
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useGetCountryMutation } = CountryApiSlice;
