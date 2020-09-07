import axios from 'axios';

const instance = axios.create({
    // TODO: add env variables
    baseURL: 'http://localhost:8080/mohApi'
});

export default instance;