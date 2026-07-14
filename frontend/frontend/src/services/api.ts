import axios from "axios";

const CONFIGS = {
  RIDER: "http://localhost:5055/api",
  VISUAL_STUDIO: "https://localhost:7230/api" 
};

const api = axios.create({
  baseURL: CONFIGS.RIDER, 
});

export default api;