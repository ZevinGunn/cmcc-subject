import axios from "axios";

const http = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 15000,
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn("[axios-error]", error);
    return Promise.reject(error);
  }
);

export default http;

