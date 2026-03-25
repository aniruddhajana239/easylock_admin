import axiosClient from "../axiosClient";
import { urls } from "../urls";

export const GroupApi = {
    getAll(params) {
        return axiosClient.get(`${urls.GET_GROUPS}`, { params });
    },
};
