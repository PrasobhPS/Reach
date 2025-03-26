import { createSlice } from "@reduxjs/toolkit";
type RootState = {
    partner: {
        list: any;
    };
    // Define other slices if present
};
const PartnerSlice = createSlice({
    name: "partner",
    initialState: { list: null },
    reducers: {
        setPartnerList: (state, action) => {
            const { list } = action.payload;
            state.list = list;
            // console.log(state.token + " - " + state.user, "action");
        },

    },
});

export const { setPartnerList } = PartnerSlice.actions;

export default PartnerSlice.reducer;

export const selectPartnerList = (state: RootState) => state.partner.list;
