import axios  from 'axios';
import { useState, useEffect } from 'react';

import City from 'models/City';
import logger from 'logger/logger';
import Language from 'models/Language';
import { Severity } from 'models/Logger';
import SignUpUser from 'models/SignUpUser';
import { setCities } from 'redux/City/cityActionCreators';
import SourceOrganization from 'models/SourceOrganization';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

const useSignUp = ({ handleSaveUser }: useSignUpFormInCome) : useSignUpFormOutCome  => {

    const [languages, setLanguages] = useState<Language[]>([]);
    const [sourcesOrganization, setSourcesOrganization] = useState<SourceOrganization[]>([]);

    const { alertError } = useCustomSwal();

    const fetchCities = () => {
        const fetchCitiesLogger = logger.setup('Fetching cities');
        fetchCitiesLogger.info('launching cities request', Severity.LOW);
        return axios.get('/addressDetails/cities')
            .then((result: any) => {
                const cities: Map<string, City> = new Map();
                result && result.data && result.data.forEach((city: City) => {
                    cities.set(city.id, city)
                });
                setCities(cities);
                fetchCitiesLogger.info('got results back from the server', Severity.LOW);
            })
            .catch(() => {
                alertError('לא ניתן היה לקבל ערים');
                fetchCitiesLogger.error('didnt get results back from the server', Severity.HIGH);
            });
    };

    const fetchSourcesOrganization = () => {
        const fetchSourcesOrganizationLogger = logger.setup('Fetching sourcesOrganization');
        fetchSourcesOrganizationLogger.info('launching sourcesOrganization request', Severity.LOW);
        return axios.get('/users/sourcesOrganization')
            .then(result => {
                result?.data && setSourcesOrganization(result?.data);
                fetchSourcesOrganizationLogger.info('got results back from the server', Severity.LOW);
            })
            .catch(() => {
                alertError('לא ניתן היה לקבל מסגרות');
                fetchSourcesOrganizationLogger.error('didnt get results back from the server', Severity.HIGH);      
            });
    }

    const fetchLanguages = () => {
        const fetchLanguagesLogger = logger.setup('Fetching languages');
        fetchLanguagesLogger.info('launching languages request', Severity.LOW);
        return axios.get('/users/languages')
            .then(result => {
                result?.data && setLanguages(result?.data);
                fetchLanguagesLogger.info('got results back from the server', Severity.LOW);
            })
            .catch(() => {
                alertError('לא ניתן היה לקבל שפות');
                fetchLanguagesLogger.error('didnt get results back from the server', Severity.HIGH);    
            });
    }

    useEffect(() => {
        setIsLoading(true);
        Promise.all([
        fetchCities(),
        fetchSourcesOrganization(),
        fetchLanguages(),
        ])
        .finally(() => setIsLoading(false))
    }, [])

    const createUser = (newUser: SignUpUser) => {
        const createUserLogger = logger.setup('Create user');
        createUserLogger.info('launching createUser request', Severity.LOW);
        axios.post('/users', {
            ...newUser, 
            languages : newUser.languages || [], 
            city : newUser.city?.id, 
            investigationGroup : newUser.investigationGroup?.id
        })
        .then(() => {
            handleSaveUser && handleSaveUser();
            createUserLogger.info('user was created successfully', Severity.LOW);
        })
        .catch(() => {
            alertError('לא ניתן היה ליצור משתמש חדש');
            createUserLogger.error('create user was failed', Severity.CRITICAL);        
        })
        .finally(() => setIsLoading(false));
    }

    const editUser = (updatedUser: SignUpUser) => {
        console.log(updatedUser)
        // const createUserLogger = logger.setup('Create user');
        // createUserLogger.info('launching createUser request', Severity.LOW);
        // axios.post('/users', {...updatedUser, languages : updatedUser.languages || []})
        // .then(() => {
        //     // handleSaveUser && handleSaveUser();
        //     createUserLogger.info('user was created successfully', Severity.LOW);
        // })
        // .catch(() => {
        //     alertError('לא ניתן היה ליצור משתמש חדש');
        //     createUserLogger.error('create user was failed', Severity.CRITICAL);        
        // })
        // .finally(() => setIsLoading(false));
    }

    return {
        languages,
        sourcesOrganization,
        createUser,
        editUser
    }
}
interface useSignUpFormInCome {
    handleSaveUser?: () => void;
}

interface useSignUpFormOutCome {
    languages: Language[];
    sourcesOrganization: SourceOrganization[];
    createUser: (data: SignUpUser) => void;
    editUser: (data: SignUpUser) => void;
}

export default useSignUp;