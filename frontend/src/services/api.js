import axios from "axios";

const api = axios.create({
  // Verifique se não há espaços extras aqui
  // O final "api" deve bater com a [Route("api/[controller]")] do C#
  baseURL: "https://localhost:7230/api",
});

export default api;
