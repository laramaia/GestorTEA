import axios from "axios";

const CONFIGS = {
  VISUAL: "http://localhost:5055/api",
  RENDER: "https://gestortea.onrender.com/api",
};

const api = axios.create({
  baseURL: CONFIGS.RENDER,
});

export default api;
