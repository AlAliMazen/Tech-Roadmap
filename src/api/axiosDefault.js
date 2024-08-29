import axios from "axios"

axios.defaults.baseURL = "https://tech-roadmap-drf-6a7361986bbb.herokuapp.com/"

// we need to use the multipart, because the app used media file sand needs to send photos as well
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;