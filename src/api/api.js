{/*import axios from "axios";
import { logout } from "../Utils/HandleLogout";
import { isTokenExpired } from "../Utils/IsTokenExpired";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && !isTokenExpired(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    logout();
  }

  return config;
});

export default api;*/}