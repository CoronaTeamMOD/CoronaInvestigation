import axios from 'axios';

import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

const instance = axios.create({
    // TODO: add env variables
    baseURL: 'http://localhost:8080/clientToDBApi'
});

instance.interceptors.request.use(
    (config) => {
        setIsLoading(true)
        return config
    }, 
    (error) => Promise.reject(error)
);

instance.interceptors.response.use(
    (config) => {
        setIsLoading(false)
        return config
    }, 
    (error) => {
        setIsLoading(false)
        Promise.reject(error)
    }
);

export default instance;