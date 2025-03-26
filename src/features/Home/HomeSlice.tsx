import { createSlice } from "@reduxjs/toolkit";
type RootState = {
    home: {
        cms: any;
    };
    // Define other slices if present
};
const HomeSlice = createSlice({
    name: "home",
    initialState: { cms: null },
    reducers: {
        setHomeCms: (state, action) => {
            const { cms } = action.payload;
            state.cms = cms;
            // console.log(state.token + " - " + state.user, "action");
        },

    },
});

export const { setHomeCms } = HomeSlice.actions;

export default HomeSlice.reducer;

export const selectHomeCms = (state: RootState) => state.home.cms;
