// import { Snackbar, Alert } from "@mui/material";
import axios from "axios";

const baseURL = "";

const instance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
instance.interceptors.request.use(
  function (config) {
    const token = `Bearer ${localStorage.getItem("accessToken")}`;
    config.headers = { Authorization: token };
    return config;
  },
  function (error) {
    console.log("error", error.status);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      localStorage.clear();
      window.location.assign("/");
    } else if (error?.response?.status === 400) {
      // console.log("error", error.message);
      // console.log("error data", error.response.data);
      return error.response;
    }
  }
);
export default instance;
