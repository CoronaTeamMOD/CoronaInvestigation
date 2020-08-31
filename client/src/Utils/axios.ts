import axios from 'axios';

const instance = axios.create({
    // TODO: add env variables
    baseURL: 'http://localhost:8080/clientToDBApi'
});

export default instance;