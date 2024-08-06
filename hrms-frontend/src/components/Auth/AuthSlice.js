import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Initially, no user is logged in
  isAuthenticated: false,
  role: null,
  firstName: null,
  lastName: null,
  userId: null,
  profile: null,
};

const authSlices = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.role = action.payload;
      state.firstName = action.payload;
      state.lastName = action.payload;
      state.userId = action.payload;
      state.profile = action.payload;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.firstName = null;
      state.lastName = null;
      state.role = null;
      state.userId = null;
      state.profile = null;
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlices.actions;
export default authSlices.reducer;
