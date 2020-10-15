import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import SignUpFields from 'models/enums/SignUpFields';
import SignUpUser from 'models/SignUpUser';
import City from 'models/City'
import County from 'models/County';
import SourceOrganization from 'models/SourceOrganization'
import Language from 'models/Language';
import { Service, Severity } from 'models/Logger';
import axios from 'Utils/axios'
import logger from 'logger/logger'
import StoreStateType from 'redux/storeStateType';
import { setCities } from 'redux/City/cityActionCreators';

const UserInitialValues: SignUpUser = {
    [SignUpFields.FULL_NAME] : {
        [SignUpFields.FIRST_NAME]: undefined,
        [SignUpFields.LAST_NAME]: undefined,
    },
    [SignUpFields.LANGUAGES]: [],
}

const useSignUp = (props: useSignUpFormInCome) : useSignUpFormOutCome  => {

    const { setCounties, setSourcesOrganization, setLanguages, handleSaveUser } = props;

    const userId = useSelector<StoreStateType, string>(state => state.user.id);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const fetchCities = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching cities',
            step: 'launching cities request',
            user: userId,
            investigation: epidemiologyNumber
        })
        axios.get('/addressDetails/cities')
            .then((result: any) => {
                const cities: Map<string, City> = new Map();
                result && result.data && result.data.forEach((city: City) => {
                    cities.set(city.id, city)
                });
                setCities(cities);
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Fetching cities',
                    step: 'got results back from the server',
                    user: userId,
                    investigation: epidemiologyNumber
                });
            })
            .catch(err => {
                handleFailedRequest('לא ניתן היה לקבל ערים');
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Fetching cities',
                    step: 'didnt get results back from the server',
                    user: userId,
                    investigation: epidemiologyNumber
                });
            });
    };

    const fetchCounties = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching counties',
            step: 'launching counties request',
            user: userId,
            investigation: epidemiologyNumber
        })
        axios.get('/counties')
            .then(result => {
                result?.data && setCounties(result?.data);
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Fetching counties',
                    step: 'got results back from the server',
                    user: userId,
                    investigation: epidemiologyNumber
                });
            })
            .catch(err => {
                handleFailedRequest('לא ניתן היה לקבל נפות');
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Fetching counties',
                    step: 'didnt get results back from the server',
                    user: userId,
                    investigation: epidemiologyNumber
                });         
            });
    };

    const fetchSourcesOrganization = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching sourcesOrganization',
            step: 'launching sourcesOrganization request',
            user: userId,
            investigation: epidemiologyNumber
        })
        axios.get('/users/sourcesOrganization')
            .then(result => {
                result?.data && setSourcesOrganization(result?.data);
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Fetching sourcesOrganization',
                    step: 'got results back from the server',
                    user: userId,
                    investigation: epidemiologyNumber
                });
            })
            .catch(err => {
                handleFailedRequest('לא ניתן היה לקבל מסגרות');
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Fetching sourcesOrganization',
                    step: 'didnt get results back from the server',
                    user: userId,
                    investigation: epidemiologyNumber
                });         
            });
    }

    const fetchLanguages = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching languages',
            step: 'launching languages request',
            user: userId,
            investigation: epidemiologyNumber
        })
        axios.get('/users/languages')
            .then(result => {
                result?.data && setLanguages(result?.data);
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Fetching languages',
                    step: 'got results back from the server',
                    user: userId,
                    investigation: epidemiologyNumber
                });
            })
            .catch(err => {
                handleFailedRequest('לא ניתן היה לקבל שפות');
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Fetching languages',
                    step: 'didnt get results back from the server',
                    user: userId,
                    investigation: epidemiologyNumber
                });         
            });
    }

    useEffect(() => {
        fetchCities();
        fetchCounties();
        fetchSourcesOrganization();
        fetchLanguages();
    }, [])

    const getDefaultValues = () : SignUpUser => {
        return {
            ...UserInitialValues,
            [SignUpFields.MABAR_USER_NAME]: userId,
        }
    }

    const createUser = (newUser: SignUpUser) => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Create user',
            step: 'launching createUser request',
            user: userId,
            investigation: epidemiologyNumber
        });
        axios.post('/users', newUser)
        .then(() => {
            handleSaveUser();
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Create user',
                step: 'user was created successfully',
                user: userId,
                investigation: epidemiologyNumber
            });
        })
        .catch(err => {
            handleFailedRequest('לא ניתן היה ליצור משתמש חדש');
            logger.error({
                service: Service.CLIENT,
                severity: Severity.CRITICAL,
                workflow: 'Create user',
                step: 'create user was failed',
                user: userId,
                investigation: epidemiologyNumber
            });         
        
        })
    }

    const handleFailedRequest = (message: string) => {
        Swal.fire({
          title: message,
          icon: 'error',
        })
    }

    return {
        getDefaultValues,
        createUser
    }
}
interface useSignUpFormInCome {
    setCounties: React.Dispatch<React.SetStateAction<County[]>>;
    setLanguages: React.Dispatch<React.SetStateAction<Language[]>>;
    setSourcesOrganization: React.Dispatch<React.SetStateAction<SourceOrganization[]>>;
    handleSaveUser: () => void;
}

interface useSignUpFormOutCome {
    getDefaultValues: () => SignUpUser;
    createUser: (data: SignUpUser) => void;
}

export default useSignUp;