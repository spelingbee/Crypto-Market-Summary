// Create a new ofetch instance with a custom base URL and default headers (if needed)
import {ofetch} from "ofetch";

export const myApiFetch = ofetch.create({
    baseURL: '/api',
    timeout: 5000
});