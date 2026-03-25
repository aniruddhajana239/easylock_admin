import axiosClient from "../axiosClient";
import { urls } from "../urls";

export const DashboardApi = {
  getSalesSummary() {
    return axiosClient.get(`${urls.GET_SALES_SUMMARY}`);
  },
  getDeviceSummary() {
    return axiosClient.get(`${urls.GET_DEVICE_SUMMARY}`);
  },
  getDistributorRetailerSummary() {
    return axiosClient.get(`${urls.GET_DISTRIBUTOR_RETAILER_SUMMARY}`);
  },
  getKeySalesGraph() {
    return axiosClient.get(`${urls.TOKEN_SALES_GRAPH}`);
  }
};
