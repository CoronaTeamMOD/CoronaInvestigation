import { config } from 'dotenv';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import User from 'models/User';
import axios from 'Utils/axios';
import StoreStateType from 'redux/storeStateType';
import Environment from 'models/enums/Environments';
import { setUser } from 'redux/User/userActionCreators';
import { setGroupUsers } from 'redux/GroupUsers/groupUsersActionCreators';

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

    const setCurrentAndGroupUsers = (userId: string, userName: string, userToken: string) => {
        axios.get(`/users/user`).then((result: any) => {
            
            const user = result && result.data && result.data.userById;
            setUser({
                ...user,
                isAdmin: false,
                id: userId,
                userName: userName,
                token: userToken,
            });

            setIsUserUpdated(true);
            return user;

        }).then((user: any) => {
            user && user.isAdmin && axios.get(`/users/group`)
                .then((result: any) => {
                    const groupUsers: Map<string, User> = new Map();
                    result && result.data && result.data.forEach((user: User) => {
                        groupUsers.set(user.id, user)
                    });
                    setGroupUsers(groupUsers);
                })
                .catch(err => console.log(err));
        })
    }

    React.useEffect(() => {
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
            <Content />
        </>
    );
}

export default App;
