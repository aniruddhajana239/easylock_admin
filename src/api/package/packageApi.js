import axiosClient from "../axiosClient";
import { urls } from "../urls";
export const packageApi = {
    getAll(id,params) {
        return axiosClient.get(`${urls.PACKAGE_GET_ALL}/${id}`, { params });
    }
}