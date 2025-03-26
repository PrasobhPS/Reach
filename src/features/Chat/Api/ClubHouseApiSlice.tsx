import { url } from "inspector";
import { apiSlice } from "../../../app/apiSlice";

export const ClubHouseApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        ClubHouse: builder.mutation({
            query: () => ({
                url: "/clubHouse",
                method: "GET",
            }),
        }),
    }),
    overrideExisting: true,
});
export const {
    useClubHouseMutation,
} = ClubHouseApiSlice