import axios from "axios";
import { BASE_URL } from "./constant";

const API = axios.create({ baseURL: BASE_URL });

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;
