import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "../../initialState";

const pendingAndRejectDistributor = createSlice({
  name: "pendingAndRejectDistributor",
  initialState: initialState,
  reducers: {
    getAll:(state)=>{
      state.isFetching=true;
    },
    singleGet:(state)=>{
      state.isFetching=true;
    },
    Search:(state)=>{
      state.isFetching=true;
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
export const pendingAndRejectDistributorActions = pendingAndRejectDistributor.actions;
export const pendingAndRejectDistributorReducers = pendingAndRejectDistributor.reducer;
