import jwt_decode from 'jwt-decode';
import axios, { AxiosRequestConfig } from 'axios';

import { store } from 'redux/store';
import Environment from 'models/enums/Environments';
import { setToken } from 'redux/User/userActionCreators';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

axios.defaults.baseURL = '/db';
axios.defaults.headers['content-type'] = 'text/plain';
axios.defaults.headers['Access-Control-Allow-Origin'] = '*';

axios.interceptors.request.use(
    (config) => {
        addStateHeaders(config);
        return config;
    },
    (error) => Promise.reject(error)
);

const addStateHeaders = async (config: AxiosRequestConfig) => {
    if(process.env.REACT_APP_ENVIRONMENT === Environment.PROD ||
        process.env.REACT_APP_ENVIRONMENT === Environment.DEV_AUTH ||
        process.env.REACT_APP_ENVIRONMENT === Environment.TEST) {
         try {
             jwt_decode(store.getState().user.token);
         } catch(err) {
             await getNewTokenFromAzureEasyAuth();
         }
     }
     config.headers.Authorization = store.getState().user.token;
     config.headers.EpidemiologyNumber = store.getState().investigation.epidemiologyNumber;
};

const instance = axios.create();

const getNewTokenFromAzureEasyAuth = () => {
    return axios.get(`${window.location.protocol}//${window.location.hostname}/.auth/me`)
    .then((response) => {
        setToken(response.data[0].id_token)
    });
}

instance.interceptors.request.use(
    async (config) => {
        await addStateHeaders(config);
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