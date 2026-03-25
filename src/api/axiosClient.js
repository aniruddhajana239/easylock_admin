import axios from "axios";
const axiosClient = axios.create({
  // baseURL: "http://65.2.174.247:3000/api",
  baseURL: "https://elrising-api.idlpro.cloud/api",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },
});
axiosClient.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("error:", error);
    if (error.response && error.response.status === 401) {
      // if (localStorage?.getItem("userType") === "distributor") {
      //   localStorage.clear();
      //   alert("session expired");
      //   window.location.replace("/idl-admin");
      // } else {
      //   localStorage.clear();
      //   alert("session expired");
      //   window.location.replace("/idl-admin");
      // }
      localStorage.clear();
      alert("session expired");
      window.location.replace("/");
    }
    return Promise.reject(error);
  }
);
export default axiosClient;
