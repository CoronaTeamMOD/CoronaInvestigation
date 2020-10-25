import axios, { AxiosRequestConfig } from 'axios';

import { store } from 'redux/store';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

const instance = axios.create({
    baseURL: '/db',
    headers: {
        'content-type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
    }
});

instance.interceptors.request.use(
    async (config) => {
        config.headers.EpidemiologyNumber = store.getState().investigation.epidemiologyNumber;
        activateIsLoading(config);
        return config;
    }, 
    (error) => Promise.reject(error)
);

export const activateIsLoading = (config: AxiosRequestConfig) => {
    !config.url?.includes('/optionalExposureSources') && setIsLoading(true);
}

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