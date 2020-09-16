import axios from 'axios'; 
import React from 'react';
import { config } from 'dotenv';

import { Environment } from 'models/enums/Environments';
import { setUser } from 'redux/User/userActionCreatores';

import Content from './Content/Content';
import AppToolbar from './AppToolbar/AppToolbar';
import HospitalsInput from 'commons/HospitalsInput/HospitalsInput';

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

    React.useEffect(() => {
        if (process.env.REACT_APP_ENVIRONMENT === Environment.PROD || process.env.REACT_APP_ENVIRONMENT === Environment.DEV_AUTH) {
                axios.get<AuthenticationReturn>(`${window.location.protocol}//${window.location.hostname}/.auth/me`)
                .then((response) => {
                    const { data } = response;
                    setUser({
                        id: data[0].user_id.split('@')[0],
                        name: data[0].user_claims.find(claim => claim.typ === userNameClaimType)?.val as string,
                        token: data[0].id_token
                    });
                })
        } else {
            setUser({
                id: 'pkra004',
                name: 'stubuser',
                token: 'fake token!'
            });
        }
    }, [])

    return (
        <>
            <HospitalsInput />
            <AppToolbar/>
            <Content/>
        </>
    );
}

export default App;
