import axiosClient from "../axiosClient";
import { urls } from "../urls";



export const SuperDistributorAPI = {
  add: (params) => {
    return axiosClient.post(urls.ADD_SUPERDISTRIBUTOR, params, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
  },
  getAll(params) {
    return axiosClient.get(`${urls.GETALL_SUPERDISTRIBUTOR}`, { params });
  },
  singleGet(superDistributorId) {
    return axiosClient.get(
      `${urls.SINGLE_GET_SUPERDISTRIBUTOR}?superDistributorId=${superDistributorId}`
    );
  },
    updateAccountStatus(body) {
    return axiosClient.put(`${urls.SUPERDISTRIBUTOR_UPDATE_ACCOUNT_STATUS}`, body);
  },

  getSuperDistributorProfile() {
    return axiosClient.get(`${urls.SINGLE_GET_SUPERDISTRIBUTOR}`);
  },
  search: (params) => {
    return axiosClient.get(`${urls.SUPERDISTRIBUTOR_SEARCH}`, { params });
  },
};