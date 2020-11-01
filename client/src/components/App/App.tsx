import { config } from 'dotenv';
import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';

import User from 'models/User';
import axios from 'Utils/axios';
import logger from 'logger/logger';
import userType from 'models/enums/UserType';
import { Service, Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import Environment from 'models/enums/Environments';
import { setUser } from 'redux/User/userActionCreators';

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

const notInLocalEnv = () => (
    process.env.REACT_APP_ENVIRONMENT === Environment.PROD ||
    process.env.REACT_APP_ENVIRONMENT === Environment.DEV_AUTH ||
    process.env.REACT_APP_ENVIRONMENT === Environment.TEST
);

const getAuthUserData = async () => {
    const { protocol, hostname } = window.location;
    const { data } = await axios.get<AuthenticationReturn>(`${protocol}//${hostname}/.auth/me`);
    const userId = data[0].user_id.split('@')[0];
    const userName = data[0].user_claims.find(claim => claim.typ === userNameClaimType)?.val as string;
    return { userId, userName };
};

const getStubAuthUserData = () => ({
    userId: '7',
    userName: 'stubuser'
});

const App: React.FC = (): JSX.Element => {

    const user = useSelector<StoreStateType, User>(state => state.user);

    const [isSignUpOpen, setIsSignUpOpen] = useState<boolean>(false);

    useEffect(() => {
        initUser();
    }, []);

    const initUser = async () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'login to the app',
            step: 'before environment condition'
        })

        const { userId, userName } = notInLocalEnv() ? await getAuthUserData() : getStubAuthUserData();
        fetchUser(userId, userName);
    };

    const handleSaveUser = () => {
        handleCloseSignUp();
        fetchUser(user.id, user.userName);
    };

    const handleCloseSignUp = () => setIsSignUpOpen(false);

    const fetchUser = (userId: string, userName: string) => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Getting user details',
            step: 'launch request to the server',
            user: user.id
        });
        axios.get(`/users/user`).then((result: any) => {
            if (result && result.data.userById) {
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Getting user details',
                    step: 'recived user from the server',
                    user: result.data.userById
                })
                const userFromDB = result.data.userById;
                setUser({
                    ...userFromDB
                });
            } else {
                logger.warn({
                    service: Service.CLIENT,
                    severity: Severity.MEDIUM,
                    workflow: 'Getting user details',
                    step: `user has not been found due to: ${JSON.stringify(result)}`,
                    user: user.id
                })
                setUser({
                    ...user,
                    id: userId,
                    userName
                });
                setIsSignUpOpen(true);
            }
        }).catch(err => {
            logger.error({
                service: Service.CLIENT,
                severity: Severity.MEDIUM,
                workflow: 'Getting user details',
                step: `got error from the server: ${err}`,
                user: user.id
            })
        })
    }

    return (
        <>
            <AppToolbar />
            <Content isSignUpOpen={isSignUpOpen} handleSaveUser={handleSaveUser} handleCloseSignUp={handleCloseSignUp} />
        </>
    );
}

export default App;
