import axios  from 'axios';
import { useState, useEffect } from 'react';

import Desk from 'models/Desk';
import City from 'models/City';
import logger from 'logger/logger';
import County from 'models/County';
import Language from 'models/Language';
import { Severity } from 'models/Logger';
import SignUpUser from 'models/SignUpUser';
import { setCities } from 'redux/City/cityActionCreators';
import SourceOrganization from 'models/SourceOrganization';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

const useSignUp = ({ handleSaveUser }: useSignUpFormInCome) : useSignUpFormOutCome  => {

    const [counties, setCounties] = useState<County[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [desks, setDesks] = useState<Desk[]>([]);
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

    const fetchCounties = () => {
        const fetchCountiesLogger = logger.setup('Fetching counties');
        fetchCountiesLogger.info('launching counties request', Severity.LOW);
        return axios.get('/counties')
            .then(result => {
                result?.data && setCounties(result?.data);
                fetchCountiesLogger.info('got results back from the server', Severity.LOW);
            })
            .catch(() => {
                alertError('לא ניתן היה לקבל נפות');
                fetchCountiesLogger.error('didnt get results back from the server', Severity.HIGH);       
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
    
    const fetchDesks = () => {
        const fetchDesksLogger = logger.setup('Getting desks');
        fetchDesksLogger.info('launching desks request', Severity.LOW);
        return axios.get('/desks').then(response => {
            fetchDesksLogger.info('The desks were fetched successfully', Severity.LOW);
            const { data } = response;
            setDesks(data);
        }).catch(err => {
            fetchDesksLogger.error(`got error from the server: ${err}`, Severity.HIGH);
        });
    }

    useEffect(() => {
        setIsLoading(true);
        Promise.all([
        fetchCities(),
        fetchCounties(),
        fetchSourcesOrganization(),
        fetchLanguages(),
        fetchDesks(),
        ])
        .finally(() => setIsLoading(false))
    }, [])

    const createUser = (newUser: SignUpUser) => {
        const createUserLogger = logger.setup('Create user');
        createUserLogger.info('launching createUser request', Severity.LOW);
        axios.post('/users', {...newUser, languages : newUser.languages || []})
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

    return {
        counties, 
        languages,
        desks,
        sourcesOrganization,
        createUser
    }
}
interface useSignUpFormInCome {
    handleSaveUser?: () => void;
}

interface useSignUpFormOutCome {
    desks: Desk[];
    counties: County[];
    languages: Language[];
    sourcesOrganization: SourceOrganization[];
    createUser: (data: SignUpUser) => void;
}

export default useSignUp;