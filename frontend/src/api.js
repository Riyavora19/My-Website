import axios from "axios";

const API = axios.create({ baseURL: "https://my-website-l2zk.onrender.com/api" });

// Attach token to every request if available
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) req.headers.Authorization = `Bearer ${user.token}`;
  return req;
});

export default API;
