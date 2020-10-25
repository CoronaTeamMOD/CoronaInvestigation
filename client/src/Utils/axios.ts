import jwt_decode from 'jwt-decode';
import axios, { AxiosRequestConfig } from 'axios';

import { store } from 'redux/store';
import Environment from 'models/enums/Environments';
import { setToken } from 'redux/User/userActionCreators';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

const instance = axios.create({
    baseURL: '/db',
    headers: {
        'content-type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
    }
});

const getNewTokenFromAzureEasyAuth = () => {
    return axios.get(`${window.location.protocol}//${window.location.hostname}/.auth/me`)
    .then((response) => {
        setToken(response.data[0].id_token)
    });
}

instance.interceptors.request.use(
    async (config) => {
        if(process.env.REACT_APP_ENVIRONMENT === Environment.PROD ||
           process.env.REACT_APP_ENVIRONMENT === Environment.DEV_AUTH ||
           process.env.REACT_APP_ENVIRONMENT === Environment.TEST) {
            try {
                jwt_decode(store.getState().user.token);
            } catch(err) {
                await getNewTokenFromAzureEasyAuth();
            }
        }
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