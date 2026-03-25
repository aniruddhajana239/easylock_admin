import axiosClient from "../axiosClient";
import { urls } from "../urls";

export const CustomerApi = {
  getAll(params) {
    return axiosClient.get(`${urls.GETALL_CUSTOMER}`, { params });
  },
  singleGet(customerId) {
    return axiosClient.get(
      `${urls.SINGLE_GET_CUSTOMER}?customerId=${customerId}`
    );
  },
  
  search: (params) => {
    return axiosClient.get(`${urls.CUSTOMER_SEARCH}`, { params })
  }
};
