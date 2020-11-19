import { config } from 'dotenv';
import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import User from 'models/User';
import logger from 'logger/logger';
import { Service, Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import Environment from 'models/enums/Environments';
import { setUser } from 'redux/User/userActionCreators';
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

    const user = useSelector<StoreStateType, User>(state => state.user.data);
    const isUserLoggedIn = useSelector<StoreStateType, boolean>(state => state.user.isLoggedIn);

    const [isSignUpOpen, setIsSignUpOpen] = useState<boolean>(false);

    useEffect(() => {
        if(!isUserLoggedIn) {
            initUser();
        }
    }, []);

    const initUser = async () => {
        const initUserLogger = logger.setup({
            workflow: 'login to the app',
        });
        const { userId, userName } = notInLocalEnv() ? await getAuthUserData() : getStubAuthUserData();
        initUserLogger.info('before environment condition', Severity.LOW)
        fetchUser(userId, userName);
    };

    const handleSaveUser = () => {
        handleCloseSignUp();
        fetchUser(user.id, user.userName);
    };

    const handleCloseSignUp = () => setIsSignUpOpen(false);

    const fetchUser = (userId: string, userName: string) => {
        const fetchUserLogger = logger.setup({
            workflow: 'Getting user details',
            user: user.id
        });
        fetchUserLogger.info('launch request to the server', Severity.LOW)
        setIsLoading(true);
        axios.get(`/users/user`).then((result: any) => {
            if (result && result.data.userById) {
                fetchUserLogger.info('recived user from the server', Severity.LOW)
                const userFromDB = result.data.userById;
                setUser({
                    ...userFromDB,
                    id: userId,
                    userName
                });
            } else {
                fetchUserLogger.warn(`user has not been found due to: ${JSON.stringify(result)}`, Severity.MEDIUM)
                setUser({
                    ...user,
                    id: userId,
                    userName
                });
                setIsSignUpOpen(true);
            }

            setIsLoading(false);
        }).catch(err => {
            fetchUserLogger.warn(`got error from the server: ${err}`, Severity.MEDIUM)
            setIsLoading(false);
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
