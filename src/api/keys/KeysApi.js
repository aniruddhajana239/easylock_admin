import axiosClient from "../axiosClient";
import { urls } from "../urls";

export const KeysApi = {
    getAll:(params)=>{
        return axiosClient.get(`${urls.KEY_HISTORY_GETALL}`, {params})
    }
    ,
    getAllForDistributorAndRetailer:(params)=>{
      return axiosClient.get(`${urls.KEY_HISTORY_FOR_DISTRIBUTOR_RETAILER_GETALL}`, {params})
  },
  getAllForSuperDistributor:(params)=>{
      return axiosClient.get(`${urls.GET_ALL_SUPERDISTRIBUTOR_TOKEN_HISTORY}`, {params})
  }
  ,
    addRetailerToken: (params) => {
    return axiosClient.put(urls.RETAILER_ADD_TOKEN, params, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
   refundToken: (body) => {
    return axiosClient.put(urls.KEY_REFUND,body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  addDistributorToken: (params) => {
    return axiosClient.put(urls.DISTRIBUTOR_ADD_TOKEN, params, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  addSuperDistributorToken: (params) => {
    return axiosClient.put(urls.SUPER_DISTRIBUTOR_ADD_TOKEN, params, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  search: (params) => {
    return axiosClient.get(`${urls.SEARCH_TOKEN_HISTORY}`, { params });
  },
  tokenSummary:(params)=>{
        return axiosClient.get(`${urls.TOKEN_SUMMARY}`, {params})
    }
};
