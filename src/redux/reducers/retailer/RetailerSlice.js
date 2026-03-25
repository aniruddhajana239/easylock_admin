import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "../initialState";

const retailer = createSlice({
  name: "retailer",
  initialState: initialState,
  reducers: {
    add: (state) => {
      state.isFetching = true;
    },
    getAll:(state)=>{
      state.isFetching=true;
    },
    getByDistributorId:(state)=>{
      state.isFetching=true;
    },
    singleGet:(state)=>{
      state.isFetching=true;
    },
    Search:(state)=>{
      state.isFetching=true;
    },
    addToken: (state) => {
      state.isFetching = true;
    },
    updateStatus:(state)=>{
      state.isFetching=true;
    },
    updateAccountStatus:(state)=>{
      state.isFetching=true;
    },
    updatePasswordByAdmin:(state)=>{
      state.isFetching=true;
    },
    success: (state, action) => {
      if (action?.payload) {
        state.data = action?.payload;
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
export const retailerActions = retailer.actions;
export const retailerReducers = retailer.reducer;
