import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { API_CONFIG } from "./config";

//Create axios instance
const tmdbClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

//Request interceptor
tmdbClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    //add api key as query
    if (!config.params) {
      config.params = {};
    }
    config.params.api_key = API_CONFIG.API_KEY;

    console.log("TMDB Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error: AxiosError) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  },
);

//Response Interceptors
tmdbClient.interceptors.response.use(
  (response) => {
    console.log("TMDB Response:", response.status, response.config.url);
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      console.error("TMDB Error:", error.response.status, error.response.data);

      //Handle specific TMDB errors
      switch (error.response.status) {
        case 401:
          console.error("Invalid API Key");
          break;
        case 404:
          console.error("Resource Not Found");
          break;
        case 429:
          console.error("Too Many Requests - rate limit exceeded");
      }
    } else if (error.request) {
      console.error("Network Error: No Response Received");
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default tmdbClient;
