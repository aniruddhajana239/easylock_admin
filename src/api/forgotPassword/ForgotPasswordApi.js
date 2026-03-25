import axiosClient from "../axiosClient";
import { urls } from "../urls";

export const ForgotPasswordApi = {
    sendEmail(params) {
        return axiosClient.post(`${urls.SEND_EMAIL}`, params);
    },
    verifyOtp(params) {
         return axiosClient.post(`${urls.VERIFY_OTP}`, params);
        // return axiosClient.request({method:'get',url:`${urls.VERIFY_OTP}`,data:params,
        //     headers: {
        //         "Content-Type": "application/json",
        //       },
        // })
    },
    changePassword(params) {
        return axiosClient.put(`${urls.FORGOT_PASSWORD}`, params);
    }
};

