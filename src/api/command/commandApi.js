import axiosClient from "../axiosClient";
import { urls } from "../urls";

export const commandApi = {
  sendCommand(params) {
    return axiosClient.post(`${urls.SEND_COMMAND}/${params?.id}`, params);
  },
};
