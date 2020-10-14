import { config } from 'dotenv';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import User from 'models/User';
import axios from 'Utils/axios';
import logger from 'logger/logger';
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

const App: React.FC = (): JSX.Element => {

    const user = useSelector<StoreStateType, User>(state => state.user);

    const [isUserUpdated, setIsUserUpdated] = useState<boolean>(true);
    const [isSignUpOpen, setIsSignUpOpen] = useState<boolean>(false);

    const handleCloseSignUp = () => setIsSignUpOpen(false);

    const handleSaveUser = () => {
        setIsSignUpOpen(false);
        setIsUserUpdated(false);
    }

    const setCurrentAndGroupUsers = (userId: string, userName: string, userToken: string) => {
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
                const user = result.data.userById;
                setUser({
                    ...user,
                    id: userId,
                    userName: userName,
                    token: userToken,
                });
                setIsUserUpdated(true);
                return user;
            } else {
                setIsSignUpOpen(true);
                logger.warn({
                    service: Service.CLIENT,
                    severity: Severity.MEDIUM,
                    workflow: 'Getting user details',
                    step: `user has not been found due to: ${JSON.stringify(result)}`,
                    user: userId
                })
            }
        }).catch(err => {
            logger.error({
                service: Service.CLIENT,
                severity: Severity.MEDIUM,
                workflow: 'Getting user details',
                step: `got error from the server: ${err}`,
                user: userId
            })
        })
    }

    React.useEffect(() => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'login to the app',
            step: 'before environment condition'
        })
        if (process.env.REACT_APP_ENVIRONMENT === Environment.PROD || process.env.REACT_APP_ENVIRONMENT === Environment.DEV_AUTH) {
            axios.get<AuthenticationReturn>(`${window.location.protocol}//${window.location.hostname}/.auth/me`)
                .then((response) => {
                    const { data } = response;

                    const userId = data[0].user_id.split('@')[0];
                    const userName = data[0].user_claims.find(claim => claim.typ === userNameClaimType)?.val as string;
                    const userToken = data[0].id_token;

                    setUser({
                        investigationGroup: -1,
                        isActive: true,
                        isAdmin: false,
                        phoneNumber: '123',
                        serialNumber: 34,
                        id: userId,
                        userName: userName,
                        token: userToken,
                    });
                    setIsUserUpdated(false);
                })
        } else {
            const userId = '7'
            const userName = 'stubuser';
            const userToken = 'fake token!';

            setUser({
                investigationGroup: -1,
                isActive: true,
                isAdmin: false,
                phoneNumber: '123',
                serialNumber: 34,
                id: userId,
                userName: userName,
                token: userToken,
            });
            setIsUserUpdated(false);
        }
    }, [])

    React.useEffect(() => {
        !isUserUpdated && setCurrentAndGroupUsers(user.id, user.userName, user.token);
    }, [isUserUpdated])

    return (
        <>
            <AppToolbar />
            <Content isSignUpOpen={isSignUpOpen} handleSaveUser={handleSaveUser} handleCloseSignUp={handleCloseSignUp} />
        </>
    );
}

export default App;
