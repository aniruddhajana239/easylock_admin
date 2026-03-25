import axiosClient from "../axiosClient";
import { urls } from "../urls";

export const DeviceApi = {
  getAll(params) {
    return axiosClient.get(`${urls.GETALL_DEVICE}`, { params });
  },

  singleGet(params) {
    return axiosClient.get(
      `${urls.SINGLE_GET_DEVICE}/${params}`
    );
  },
  singleGetByImei(params) {
    return axiosClient.get(
      `${urls.GET_DEVICE_BY_IMEI}/${params}`
    );
  },
  updateStatus(body) {
    return axiosClient.put(
      `${urls.UPDATE_DEVICE_STATUS}`,
      body
    );
  },
  getAppLockStatus(params) {
    return axiosClient.get(
      `${urls.GET_DEVICE_APP_LOCK_DETAILS}/${params}`
    );
  },
  updateAppLockStatus(body) {
    return axiosClient.put(
      `${urls.UPDATE_APPLOCK_STATUS}/${body.deviceId}`,
      body
    );
  },
  
  search: (params) => {
    return axiosClient.get(`${urls.DEVICE_SEARCH}`, { params })
  }
};
