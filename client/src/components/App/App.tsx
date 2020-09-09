import axios from 'axios'; 
import React from 'react';
import { config } from 'dotenv';

import { Environment } from 'models/enums/Environments';
import { setUser } from 'redux/User/userActionCreatores';

import Content from './Content/Content';
import AppToolbar from './AppToolbar/AppToolbar';

config();

type AuthenticationReturn = [{
    access_token: string;
    expires_on: Date;
    id_token: string;
    provider_name: string;
    refresh_token: string;
    user_clamis: [{
        typ: string;
        val: string;
    }];
    user_id: string;
}];

const userNameClaimType = 'name';

const App: React.FC = (): JSX.Element => {
    
    React.useEffect(() => {
        if (process.env.REACT_APP_ENVIRONMENT === Environment.PROD) {
            axios.get<AuthenticationReturn>(`${process.env.REACT_APP_CLIENT_URL}/.auth/me`)
            .then((response) => {
                const { data } = response;
                setUser({
                    id: data[0].user_id,
                    name: data[0].user_clamis.find(claim => claim.typ === userNameClaimType)?.val as string,
                    token: data[0].id_token
                });
            })
        } else {
            setUser({
                id: '7',
                name: 'חוקר פיקטיבי',
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
