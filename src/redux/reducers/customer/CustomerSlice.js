import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "../initialState";

const customer = createSlice({
  name: "customer",
  initialState: initialState,
  reducers: {
    add: (state) => {
      state.isFetching = true;
    },
    getAll:(state)=>{
      state.isFetching=true;
    },
    singleGet:(state)=>{
      state.isFetching=true;
    },
    addToken: (state) => {
      state.isFetching = true;
    },
    search: (state) => {
      state.isFetching = true;
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
export const customerActions = customer.actions;
export const customerReducers = customer.reducer;
