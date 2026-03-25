import axiosClient from "../../axiosClient";
import { urls } from "../../urls";

export const PendingAndRejectDistributorApi = {
  pendingAndRejectGetAll(params) {
    return axiosClient.get(`${urls.GETALL_PENDING_AND_REJECT_DISTRIBUTOR}`, {
      params,
    });
  },
  search: (params) => {
    return axiosClient.get(`${urls.PENDING_AND_REJECT_DISTRIBUTOR_SEARCH}`, { params })
  }
};
