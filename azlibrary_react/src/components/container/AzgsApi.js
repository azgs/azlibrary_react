import axios from "axios";

const api = axios.create({
    baseURL: "https://data.azgs.arizona.edu/api/v1",
});

export default api;