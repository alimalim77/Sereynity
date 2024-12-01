import axios from "axios";

const api = axios.create({
  baseURL: "https://sereynity.vercel.app/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
