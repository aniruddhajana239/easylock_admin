import axiosClient from "../axiosClient";
import { urls } from "../urls";

export const OffersApi = {
    getAll:()=>{
        return axiosClient.get(`${urls.GETALL_OFFERS}`)
    },
   createOffer: (body) => {
    return axiosClient.post(urls.CREATE_OFFER,body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  updateOffer: (body) => {
    return axiosClient.put(`${urls.UPDATE_OFFER}/${body?.id}`,body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteOffer:(id)=>{
        return axiosClient.delete(`${urls.DELETE_OFFER}/${id}`)
    },
 
};
