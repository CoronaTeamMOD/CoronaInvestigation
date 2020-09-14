import axios from 'axios';

import { store } from 'redux/store';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

const instance = axios.create({
    baseURL: process.env.REACT_APP_DB_API,
    withCredentials: true,
});

instance.interceptors.request.use(
    (config) => {
        config.headers.Authorization = store.getState().user.token;
        setIsLoading(true);
        return config;
    }, 
    (error) => Promise.reject(error)
);

instance.interceptors.response.use(
    (config) => {
        setIsLoading(false);
        return config;
    }, 
    (error) => {
        setIsLoading(false);
        return Promise.reject(error);
    }
);

export default instance;