import axiosClient from "../../axiosClient";
import { urls } from "../../urls";

export const PendingAndRejectRetailerApi = {
  pendingAndRejectGetAll(params) {
    return axiosClient.get(`${urls.GETALL_RETAILER}`, {
      params,
    });
  },
  search: (params) => {
    return axiosClient.get(`${urls.RETAILER_SEARCH}`, { params })
  }
};
