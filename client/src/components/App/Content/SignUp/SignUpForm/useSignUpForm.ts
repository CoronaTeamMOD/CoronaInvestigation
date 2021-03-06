import axios  from 'axios';
import { useState, useEffect } from 'react';

import Desk from 'models/Desk';
import City from 'models/City';
import logger from 'logger/logger';
import Language from 'models/Language';
import Authority from 'models/Authority';
import { Severity } from 'models/Logger';
import SignUpUser from 'models/SignUpUser';
import { setCities } from 'redux/City/cityActionCreators';
import SourceOrganization from 'models/SourceOrganization';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import { setAuthorities } from 'redux/Authority/authorityActionCreators';

const AUTHORITY_INVESTIGATOR = 'חוקר רשות';
const AUTHORITY_ALERT = 'לא ניתן היה לקבל רשויות';

const useSignUp = ({ handleSaveUser }: useSignUpFormInCome) : useSignUpFormOutCome  => {

    const [desks, setDesks] = useState<Desk[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [sourcesOrganization, setSourcesOrganization] = useState<SourceOrganization[]>([]);
    const { alertError, alertSuccess } = useCustomSwal();

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

    const fetchAuthorities = () => {
        const fetchAuthoritiesLogger = logger.setup('Fetching Authorities');
        fetchAuthoritiesLogger.info('launching authorities request', Severity.LOW);
        return axios.get('/authorities')
            .then((result: any) => {
                const authorities: Map<string, Authority> = new Map();
                result && result.data && result.data.forEach((authority: Authority) => {
                    authorities.set(authority.id, authority)
                });
                setAuthorities(authorities);
                fetchAuthoritiesLogger.info('got results back from the server', Severity.LOW);
            })
            .catch(() => {
                alertError(AUTHORITY_ALERT);
                fetchAuthoritiesLogger.error('didnt get results back from the server', Severity.HIGH);
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
    };

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
    };
    
    const fetchDesks = (countyId?: number) => {            
        const fetchDesksLogger = logger.setup('Getting desks');
        if (!countyId) {
            fetchDesksLogger.info('launching desks request', Severity.LOW);
            return axios.get('/desks').then(response => {
                fetchDesksLogger.info('The desks were fetched successfully', Severity.LOW);
                const { data } = response;
                setDesks(data);
            }).catch(err => {
                fetchDesksLogger.error(`got error from the server: ${err}`, Severity.HIGH);
            }); 
        } else {
            fetchDesksLogger.info('launching desks request by countyId', Severity.LOW);
            axios.post('/desks/county', { countyId }).then(result => {
                if (result?.data) {
                    setDesks(result.data);
                    fetchDesksLogger.info('got results back from the server', Severity.LOW);
                }  
            }).catch(err => {
                fetchDesksLogger.error(`got error from the server: ${err}`, Severity.HIGH);
            });
        }
    };

    useEffect(() => {
        setIsLoading(true);
        Promise.all([
        fetchCities(),
        fetchAuthorities(),
        fetchSourcesOrganization(),
        fetchLanguages(),
        fetchDesks(),
        ])
        .finally(() => setIsLoading(false))
    }, []);

    const parseUserToSend = (user: SignUpUser) => {
        return {
            ...user,
            languages : user.languages || [], 
            city : user.city?.id, 
            investigationGroup : user.investigationGroup?.id,
            desk : user.desk?.id ? user.desk?.id : null,
            authority: user.sourceOrganization === AUTHORITY_INVESTIGATOR ? user.authority?.id : null
        }
    }

    const createUser = (newUser: SignUpUser) => {
        const createUserLogger = logger.setup('Create user');
        createUserLogger.info('launching createUser request', Severity.LOW);
        const userToSend = parseUserToSend(newUser);
        axios.post('/users', userToSend)
        .then(() => {
            handleSaveUser && handleSaveUser();
            createUserLogger.info('user was created successfully', Severity.LOW);
        })
        .catch(() => {
            alertError('לא ניתן היה ליצור משתמש חדש');
            createUserLogger.error('create user was failed', Severity.CRITICAL);        
        })
        .finally(() => setIsLoading(false));
    };

    const editUser = (updatedUser: SignUpUser) => {
        const updateUserLogger = logger.setup('Update user');
        updateUserLogger.info('launching updateUser request', Severity.LOW);
        const userToSend = parseUserToSend(updatedUser);
        axios.put('/users', userToSend)
        .then(() => {
            updateUserLogger.info('user was updated successfully', Severity.LOW);                
            alertSuccess('משתמש עודכן').then(() => {
                window.location.reload(false);  
            })            
            handleSaveUser && handleSaveUser();
        })
        .catch(() => {
            alertError('לא ניתן היה לעדכן משתמש ');
            updateUserLogger.error('update user was failed', Severity.CRITICAL);        
        })
        .finally(() => setIsLoading(false));
    };

    return {
        languages,
        desks,
        fetchDesks,
        sourcesOrganization,
        createUser,
        editUser
    };
}
interface useSignUpFormInCome {
    handleSaveUser?: () => void;
};

interface useSignUpFormOutCome {
    desks: Desk[];
    fetchDesks: (countiId?: number) => void;
    languages: Language[];
    sourcesOrganization: SourceOrganization[];
    createUser: (data: SignUpUser) => void;
    editUser: (data: SignUpUser) => void;
};

export default useSignUp;