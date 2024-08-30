import axios from "axios"

axios.defaults.baseURL = "https://tech-roadmap-drf-6a7361986bbb.herokuapp.com/"
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;