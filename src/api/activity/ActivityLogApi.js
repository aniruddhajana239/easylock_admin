import axiosClient from "../axiosClient";
import { urls } from "../urls";

export const ActivityLogApi = {
  getAll(id,params) {
    return axiosClient.get(`${urls.ACTIVITY_LOG}/${id}`, { params });
  },
}