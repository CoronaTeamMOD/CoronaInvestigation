import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import SignUpUser from 'models/SignUpUser';
import City from 'models/City';
import County from 'models/County';
import Desk from 'models/Desk';
import Language from 'models/Language';
import { Service, Severity } from 'models/Logger';
import axios from 'Utils/axios';
import logger from 'logger/logger';
import StoreStateType from 'redux/storeStateType';
import { setCities } from 'redux/City/cityActionCreators';
import SourceOrganization from 'models/SourceOrganization';

const useSignUp = ({ handleSaveUser }: useSignUpFormInCome) : useSignUpFormOutCome  => {

    const [counties, setCounties] = useState<County[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [desks, setDesks] = useState<Desk[]>([]);
    const [sourcesOrganization, setSourcesOrganization] = useState<SourceOrganization[]>([])

    const userId = useSelector<StoreStateType, string>(state => state.user.data.id);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const fetchCities = () => {
        const fetchCitiesLogger = logger.setup({
            workflow: 'Fetching cities',
            user: userId,
            investigation: epidemiologyNumber
        });
        fetchCitiesLogger.info('launching cities request',Severity.LOW)
        axios.get('/addressDetails/cities')
            .then((result: any) => {
                const cities: Map<string, City> = new Map();
                result && result.data && result.data.forEach((city: City) => {
                    cities.set(city.id, city)
                });
                setCities(cities);
                fetchCitiesLogger.info('got results back from the server',Severity.LOW)
            })
            .catch(err => {
                handleFailedRequest('לא ניתן היה לקבל ערים');
                fetchCitiesLogger.error('didnt get results back from the server',Severity.HIGH)
            });
    };

    const fetchCounties = () => {
        const fetchCountiesLogger = logger.setup({
            workflow: 'Fetching counties',
            user: userId,
            investigation: epidemiologyNumber
        });
        fetchCountiesLogger.info('launching counties request',Severity.LOW)
        axios.get('/counties')
            .then(result => {
                result?.data && setCounties(result?.data);
                fetchCountiesLogger.info('got results back from the server',Severity.LOW)
            })
            .catch(err => {
                handleFailedRequest('לא ניתן היה לקבל נפות');
                fetchCountiesLogger.error('didnt get results back from the server',Severity.HIGH)       
            });
    };

    const fetchSourcesOrganization = () => {
        const fetchSourcesOrganizationLogger = logger.setup({
            workflow: 'Fetching sourcesOrganization',
            user: userId,
            investigation: epidemiologyNumber
        });
        fetchSourcesOrganizationLogger.info('launching sourcesOrganization request',Severity.LOW)
        axios.get('/users/sourcesOrganization')
            .then(result => {
                result?.data && setSourcesOrganization(result?.data);
                fetchSourcesOrganizationLogger.info('got results back from the server',Severity.LOW)
            })
            .catch(err => {
                handleFailedRequest('לא ניתן היה לקבל מסגרות');
                fetchSourcesOrganizationLogger.error('didnt get results back from the server',Severity.HIGH)      
            });
    }

    const fetchLanguages = () => {
        const fetchLanguagesLogger = logger.setup({
            workflow: 'Fetching languages',
            user: userId,
            investigation: epidemiologyNumber
        });
        fetchLanguagesLogger.info('launching languages request',Severity.LOW)
        axios.get('/users/languages')
            .then(result => {
                result?.data && setLanguages(result?.data);
                fetchLanguagesLogger.info('got results back from the server',Severity.LOW)
            })
            .catch(err => {
                handleFailedRequest('לא ניתן היה לקבל שפות');
                fetchLanguagesLogger.error('didnt get results back from the server',Severity.HIGH)    
            });
    }
    
    const fetchDesks = () => {
        const fetchDesksLogger = logger.setup({
            workflow: 'Getting desks',
            user: userId,
            investigation: epidemiologyNumber
        });
        fetchDesksLogger.info('launching desks request',Severity.LOW)
        axios.get('/desks').then(response => {
            fetchDesksLogger.info('The desks were fetched successfully',Severity.LOW)
            const { data } = response;
            setDesks(data);
        }).catch(err => {
            fetchDesksLogger.error(`got error from the server: ${err}`,Severity.HIGH)
        })
    }

    useEffect(() => {
        fetchCities();
        fetchCounties();
        fetchSourcesOrganization();
        fetchLanguages();
        fetchDesks();
    }, [])

    const createUser = (newUser: SignUpUser) => {
        const createUserLogger = logger.setup({
            workflow: 'Create user',
            user: userId,
            investigation: epidemiologyNumber
        });
        createUserLogger.info('launching createUser request',Severity.LOW)
        axios.post('/users', {...newUser, languages : newUser.languages || []})
        .then(() => {
            handleSaveUser && handleSaveUser();
            createUserLogger.info('user was created successfully',Severity.LOW)
        })
        .catch(err => {
            handleFailedRequest('לא ניתן היה ליצור משתמש חדש');
            createUserLogger.error('create user was failed',Severity.CRITICAL)        
        })
    }

    const handleFailedRequest = (message: string) => {
        Swal.fire({
          title: message,
          icon: 'error',
        })
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