import axios from 'axios';
import { config } from 'dotenv';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import User from 'models/User';
import logger from 'logger/logger';
import Airline from 'models/Airline';
import { Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import Environment from 'models/enums/Environments';
import { setDesks } from 'redux/Desk/deskActionCreators';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { setCounties } from 'redux/County/countyActionCreators';
import { setAirlines } from 'redux/Airlines/airlineActionCreators';
import { setDistricts } from 'redux/District/districtActionCreators';
import { setUser, setUserTypes } from 'redux/User/userActionCreators';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

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

const notInLocalEnv = () => (
    process.env.REACT_APP_ENVIRONMENT === Environment.PROD ||
    process.env.REACT_APP_ENVIRONMENT === Environment.DEV_AUTH ||
    process.env.REACT_APP_ENVIRONMENT === Environment.TEST
);

const userNameClaimType = 'name';

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

const useApp = () => {

    const user = useSelector<StoreStateType, User>(state => state.user.data);
    const isUserLoggedIn = useSelector<StoreStateType, boolean>(state => state.user.isLoggedIn);
    const displayedDistrict = useSelector<StoreStateType, number>(state => state.user.displayedDistrict);
    const airlines = useSelector<StoreStateType, Map<string, string>>(state => state.airlines);

    const [isSignUpOpen, setIsSignUpOpen] = useState<boolean>(false);
    const { alertError } = useCustomSwal();

    const initUser = async () => {
        const initUserLogger = logger.setup('login to the app');
        const { userId, userName } = notInLocalEnv() ? await getAuthUserData() : getStubAuthUserData();
        initUserLogger.info('before environment condition', Severity.LOW);
        fetchUser(userId, userName);
    };

    const handleSaveUser = () => {
        handleCloseSignUp();
        fetchUser(user.id, user.userName);
    };

    const handleCloseSignUp = () => setIsSignUpOpen(false);

    const fetchUser = (userId: string, userName: string) => {
        const fetchUserLogger = logger.setup('Getting user details');
        fetchUserLogger.info('launch request to the server', Severity.LOW);
        setIsLoading(true);
        axios.get(`/users/user`).then((result: any) => {
            if (result && result.data.userById) {
                fetchUserLogger.info('recived user from the server', Severity.LOW);
                const userFromDB = result.data.userById;
                setUser({
                    ...userFromDB,
                    id: userId,
                    userName
                });
            } else {
                fetchUserLogger.warn(`user has not been found due to: ${JSON.stringify(result)}`, Severity.MEDIUM);
                setUser({
                    ...user,
                    id: userId,
                    userName
                });
                setIsSignUpOpen(true);
            }

            setIsLoading(false);
        }).catch(err => {
            fetchUserLogger.warn(`got error from the server: ${err}`, Severity.MEDIUM);
            setIsLoading(false);
        })
    };

    const fetchDistricts = () => {
        const fetchDistrictsLogger = logger.setup('Fetching all Discricts');
        axios.get('/districts')
        .then((result: any) => {
            if (result.data) {
                fetchDistrictsLogger.info('fetched all the districts successfully', Severity.LOW);
                setDistricts(result.data);
            } else {
                fetchDistrictsLogger.info('got 200 but bad structure', Severity.LOW);
            }
        }).catch(err => {
            fetchDistrictsLogger.error(err, Severity.HIGH);
            alertError('לא ניתן לשלוף את המחוזות');
        });
    };

    const fetchAllCounties = () => {
        const fetchAllCountiesLogger = logger.setup('Fetching all counties');
        axios.get('/counties')
        .then((result: any) => {
            if (result.data && result.headers['content-type'].includes('application/json')) {
                fetchAllCountiesLogger.info('fetched all the counties successfully', Severity.LOW);
                setCounties(result.data, user.countyByInvestigationGroup.districtId);
            } else {
                fetchAllCountiesLogger.info('got 200 but bad structure', Severity.LOW);
            }
        }).catch(err => {
            fetchAllCountiesLogger.error(err, Severity.HIGH);
            alertError('לא ניתן לשלוף את הנפות של המחוז');
        });
    };
    
    const fetchDesks = () => {
        const fetchDesksLogger = logger.setup('Getting desks');
        fetchDesksLogger.info('launching desks request', Severity.LOW);
        return axios.get('/desks')
        .then(result => {
            if (result.data && result.headers['content-type'].includes('application/json')) {
                fetchDesksLogger.info('The desks were fetched successfully', Severity.LOW);
                setDesks(result.data);
            } else {
                fetchDesksLogger.info('got 200 but bad structure', Severity.LOW);
            }
        }).catch(err => {
            fetchDesksLogger.error(`got error from the server: ${err}`, Severity.HIGH);
        });
    };

    const fetchUserTypes = () => {
        const fetchUserTypesLogger = logger.setup('Fetching userTypes');
        fetchUserTypesLogger.info('launching userTypes request', Severity.LOW);
        axios.get('/users/userTypes')
            .then(result => {
                if (result?.data) {
                    setUserTypes(result.data);
                    fetchUserTypesLogger.info('got results back from the server', Severity.LOW);
                } 
            })
            .catch(() => {
                alertError('לא ניתן היה לקבל סוגי משתמשים');
                fetchUserTypesLogger.error('didnt get results back from the server', Severity.HIGH);       
            });
    };

    const fetchAirlines = () => {
        const airlineLogger = logger.setup('Fetching Airlines');

        airlineLogger.info('launching DB request', Severity.LOW);
        axios.get<Airline[]>('/airlines')
            .then(result => {
                airlineLogger.info('request was successful', Severity.LOW);

                const airlinesMap = airlineListToMap(result.data);
                setAirlines(airlinesMap);
            })
            .catch(err => {
                airlineLogger.error(`recived error during request, err: ${err}`, Severity.HIGH);
            });
    };

    const airlineListToMap = (airlines : Airline[]) => {
        return new Map(airlines.map(airline => [airline.id, airline.displayName]));
    };

    useEffect(() => {
        if(!isUserLoggedIn) {
            initUser();
        }
        fetchDesks();
        fetchUserTypes();
        fetchDistricts();            
        fetchAllCounties();
        fetchAirlines();
    }, []);

    useEffect(() => {
        fetchAllCounties();
    }, [displayedDistrict]);

    return {
        isSignUpOpen,
        handleSaveUser, 
        handleCloseSignUp
    };
};

export default useApp;