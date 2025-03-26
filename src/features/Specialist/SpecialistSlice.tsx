import { createSlice } from "@reduxjs/toolkit";
type RootState = {
    specialist: {
        list: any;
    };
    // Define other slices if present
};
const SpecialistSlice = createSlice({
    name: "specialist",
    initialState: { list: null },
    reducers: {
        setSpecialist: (state, action) => {
            const { list } = action.payload;
            state.list = list;
            // console.log(state.token + " - " + state.user, "action");
        },

    },
});

export const { setSpecialist } = SpecialistSlice.actions;

export default SpecialistSlice.reducer;

export const selectSpecialist = (state: RootState) => state.specialist.list;
