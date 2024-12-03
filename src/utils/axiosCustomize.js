import axios from "axios";
import Nprogress from "nprogress";

Nprogress.configure({
  showSpinner: false,
  trickleSpeed: 100,
});

const instance = axios.create({
  baseURL: "https://quizzlet-19y7.onrender.com/",
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    Nprogress.start();
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    Nprogress.done();
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response && response.data ? response.data : response;
  },
  function (error) {
    Nprogress.done();
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response errors
    return error && error.response && error.response.data
      ? error.response.data
      : Promise.reject(error);
  }
);

export default instance;
