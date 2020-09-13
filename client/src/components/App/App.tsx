import axios from 'axios'; 
import React from 'react';
import { config } from 'dotenv';

import User from 'models/User';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import { Environment } from 'models/enums/Environments';
import { setUser } from 'redux/User/userActionCreatores';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

import Content from './Content/Content';
import AppToolbar from './AppToolbar/AppToolbar';

config();

type AuthenticationReturn = [{
    access_token: string;
    expires_on: Date;
    id_token: string;
    provider_name: string;
    refresh_token: string;
    user_claims: [{
        typ: string;
        val: string;
    }];
    user_id: string;
}];

const userNameClaimType = 'name';

const App: React.FC = (): JSX.Element => {

    const user = useSelector<StoreStateType, User>(state => state.user);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    React.useEffect(() => {
        axios.interceptors.request.use(
            (config) => {
                config.headers.Authorization = user.token;
                config.headers.EpidemiologyNumber = epidemiologyNumber;
                setIsLoading(true);
                return config;
            },
            (error) => Promise.reject(error)
        );
    }, [epidemiologyNumber])
    
    React.useEffect(() => {
        if (process.env.REACT_APP_ENVIRONMENT === Environment.PROD || process.env.REACT_APP_ENVIRONMENT === Environment.DEV) {
            axios.get<AuthenticationReturn>(`${window.location.protocol}//${window.location.hostname}/.auth/me`)
            .then((response) => {
                const { data } = response;
                setUser({
                    id: data[0].user_id,
                    name: data[0].user_claims.find(claim => claim.typ === userNameClaimType)?.val as string,
                    token: data[0].id_token
                });
            })
        } else {
            setUser({
                id: '7',
                name: 'stub_user',
                token: 'fake token!'
            });
        }
    }, [])

    return (
        <>
            <AppToolbar/>
            <Content/>
        </>
    );
}

export default App;
