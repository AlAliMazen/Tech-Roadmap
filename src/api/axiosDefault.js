import axios from "axios"

axios.defaults.baseURL = "https://tech-roadmap-drf-6a7361986bbb.herokuapp.com/"
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

// create the axios interceptor for request and response

export const axiosReq = axios.create();
export const axiosRes = axios.create();