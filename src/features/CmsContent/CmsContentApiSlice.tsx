import { apiSlice } from "../../app/apiSlice";

// Create the cmsContentApiSlice using injectEndpoints
export const CmsContentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        CMSPage: builder.mutation({
            query: ({ slug }) => ({
                url: `/getCmsContents?slug=${slug}`,
                method: "GET",
            }),
        }),
    }),
    overrideExisting: true,
});

export const {
    useCMSPageMutation,
} = CmsContentApiSlice;
