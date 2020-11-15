import axios, { AxiosRequestConfig } from 'axios';

import { store } from 'redux/store';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

let pendingRequestsCount = 0;

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
        pendingRequestsCount++;
        activateIsLoading(config);
        return config;
    }, 
    (error) => Promise.reject(error)
);

export const activateIsLoading = (config: AxiosRequestConfig) => {
    if (!config.url?.includes('/optionalExposureSources') && pendingRequestsCount === 1) {
        setIsLoading(true);  
    } 
}

instance.interceptors.response.use(
    (config) => {
        pendingRequestsCount--;
        if (pendingRequestsCount === 0) {
            setIsLoading(false);
        }
        return config;
    }, 
    (error) => {
        pendingRequestsCount--;
        if (pendingRequestsCount === 0) {
            setIsLoading(false);
        }
        return Promise.reject(error);
    }
);

export default instance;