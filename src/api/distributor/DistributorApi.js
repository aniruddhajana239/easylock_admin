import axiosClient from "../axiosClient";
import { urls } from "../urls";

export const DistributorApi = {
  add: (params) => {
    return axiosClient.post(urls.ADD_DISTRIBUTOR, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getAll(params) {
    return axiosClient.get(`${urls.GETALL_DISTRIBUTOR}`, { params });
  },
  singleGet(distributorId) {
    return axiosClient.get(
      `${urls.SINGLE_GET_DISTRIBUTOR}?distributorId=${distributorId}`
    );
  },

  getDistributorProfile() {
    return axiosClient.get(`${urls.SINGLE_GET_DISTRIBUTOR}`);
  },
  updateStatus(body) {
    return axiosClient.put(`${urls.DISTRIBUTOR_STATUS_UPDATE}`, body);
  },
  updateAccountStatus(body) {
    return axiosClient.put(`${urls.DISTRIBUTOR_UPDATE_ACCOUNT_STATUS}`, body);
  },
  addToken: (params) => {
    return axiosClient.put(urls.DISTRIBUTOR_ADD_TOKEN, params, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  registrationRequest: (params) => {
    return axiosClient.post(urls.DISTRIBUTOR_REGISTRATION_REQUEST, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  search: (params) => {
    return axiosClient.get(`${urls.DISTRIBUTOR_SEARCH}`, { params });
  },
  updatePasswordByAdmin: (params) => {
    return axiosClient.put(urls.UPDATE_PASSWORD_BY_ADMIN, params);
  },
};
