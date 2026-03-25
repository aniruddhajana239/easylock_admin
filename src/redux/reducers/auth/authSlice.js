import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "../initialState";

const auth = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    login: (state) => {
      state.isFetching = true;
    },
    refreshLogin: (state) => {
      state.isFetching = true;
    },
    getUserData: (state) => {
      state.isFetching = true;
    }, 
    updatePassword: (state) => {
      state.isFetching = true
  },
    success: (state, action) => {
      if (action?.payload?.data) {
        state.data = action?.payload?.data;
      }
      if (action?.payload?.message) {
        state.data.message = action?.payload?.message;
      }
      if (
        action?.payload?.status === true ||
        action?.payload?.status === false
      ) {
        state.data.status = action?.payload?.status;
      }
      state.isFetching = false;
    },
    failed: (state, action) => {
      state.data = action.payload;
      state.isFetching = false;
    },
    reset: (state) => {
      Object.assign(state, initialState);
    },
    clearMessage: (state) => {
      state.data.message = null;
    },
  },
});
export const authActions = auth.actions;
export const authReducers = auth.reducer;
