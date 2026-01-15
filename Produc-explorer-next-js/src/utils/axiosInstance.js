import axios from "axios";

const BACKEND_URL = "https://fakestoreapi.com";

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
});

export default axiosInstance;
