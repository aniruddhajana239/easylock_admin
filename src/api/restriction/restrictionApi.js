import axiosClient from "../axiosClient";
import { urls } from "../urls";
export const restrictionApi = {
    getAll(params) {
        return axiosClient.get(`${urls.RESTRICTION_GET}/${params?.id}`, { params });
    },
    updateStatus(data) {
        return axiosClient.post(`${urls.RESTRICTION_UPDATE}/${data?.id}`, data);
    },
}