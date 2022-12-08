import axios from "axios";

const api = axios.create({
    // Only place the API base-url is set
    baseURL: "https://data.azgs.arizona.edu/api/v1",
});

export default api;