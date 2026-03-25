import axiosClient from "../axiosClient";
import { urls } from "../urls";
export const profileApi = {
  profileGet(params) {
    return axiosClient.get(`${urls.PROFILE_SINGLE_GET}`, params);
  },
  update_profile(params) {
    return axiosClient.put(`${urls.UPDATE_PROFILE}`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
