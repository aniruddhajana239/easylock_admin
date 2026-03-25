import axiosClient from "../axiosClient";
import { urls } from "../urls";
export const AuthApi = {
  login(params) {
    return axiosClient.post(`${urls.LOGIN_URL}`, params);
  },

  refreshLogin(params) {
    return axiosClient.post(`${urls.REFRESH_LOGIN_URL}`, params);
  },
  update_password(params){
      return axiosClient.put(`${urls.UPDATE_PASSWORD}`, params);
  },
  updateRefferalEmail(body){
      return axiosClient.put(`${urls.UPDATE_REFERRAL_EMAIL}`, body);
  },
};
