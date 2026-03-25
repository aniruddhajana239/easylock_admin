import axiosClient from "../axiosClient";
import { urls } from "../urls";

export const EmiApi = {
  getAll(params) {
    return axiosClient.get(`${urls.GETALL_EMI}`, { params });
  },

  singleGet(params) {
    return axiosClient.get(
      `${urls.SINGLE_GET_EMI}/${params}`
    );
  },
  
  search: (params) => {
    return axiosClient.get(`${urls.EMI_SEARCH}`, { params })
  }
};
