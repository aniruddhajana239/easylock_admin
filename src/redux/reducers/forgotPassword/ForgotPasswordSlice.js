 
import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "../initialState";

const ForgotPassword = createSlice({
    name: "forgot_password",
    initialState,
    reducers: {
        sendEmail: (state) => {
            state.isFetching = true;
        },
        VerifyOtp: (state) => {
            state.isFetching = true
        },
        forgotPassword: (state) => {
            state.isFetching = true
        },
        success: (state, action) => {

            state.data = action.payload.data
            state.isFetching = false
        },
        failed: (state, action) => {
            state.data = action.payload
            state.isFetching = false
        },
        reset: (state) => {
            Object.assign(state, initialState)
        },
        clearMessage: (state) => {
            state.data.message = null
        }
    }
})
export const ForgotPasswordActions = ForgotPassword.actions;
export const ForgotPasswordReducers = ForgotPassword.reducer;