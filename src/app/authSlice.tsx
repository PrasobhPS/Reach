import { createSlice } from "@reduxjs/toolkit";
type RootState = {
  auth: {
    user: string | null;
    token: string | null;
  };
  // Define other slices if present
};
const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: null },
  reducers: {
    setCredentials: (state, action) => {
      const { users, Token } = action.payload;
      state.user = users;
      state.token = Token;
      // console.log(state.token + " - " + state.user, "action");
    },
    logOut: (state, action) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;
