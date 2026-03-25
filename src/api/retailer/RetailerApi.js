import axiosClient from "../axiosClient";
import { urls } from "../urls";

export const RetailerApi = {
  add: (params) => {
    return axiosClient.post(urls.ADD_RETAILER, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getAll(params) {
    return axiosClient.get(`${urls.GETALL_RETAILER}`, { params });
  },

  getByDistributorId(params) {
    return axiosClient.get(
      `${urls.GETALL_RETAILER}?distributorId=${params?.distributorId}`
    );
  },
  singleGet(retailerId) {
    return axiosClient.get(
      `${urls.SINGLE_GET_RETAILER}?retailerId=${retailerId}`
    );
  },
  updateStatus(body) {
    return axiosClient.put(
      `${urls.RETAILER_STATUS_UPDATE}`, body
    );
  },
  updateAccountStatus(body) {
    return axiosClient.put(
      `${urls.RETAILER_UPDATE_ACCOUNT_STATUS}`, body
    );
  },
  registrationRequest: (params) => {
    return axiosClient.post(urls.RETAILER_REGISTRATION_REQUEST, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  search: (params) => {
    return axiosClient.get(`${urls.RETAILER_SEARCH}`, { params })
  },
  updatePasswordByAdmin: (params) => {
    return axiosClient.put(urls.UPDATE_PASSWORD_BY_ADMIN, params);
  },

  // Get pending retailer count for notifications
  getPendingCount: () => {
    return axiosClient.get(`${urls.GETALL_RETAILER}`, {
      params: { status: "pending", limit: 1, page: 1 },
    });
  },
};
