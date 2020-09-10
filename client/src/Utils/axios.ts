import axios from 'axios';

import { store } from 'redux/store';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

const instance = axios.create({
    baseURL: process.env.REACT_APP_DB_API
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
        return config;
    }, 
    (error) => {
        setIsLoading(false);
        Promise.reject(error);
    }
);

export default instance;
