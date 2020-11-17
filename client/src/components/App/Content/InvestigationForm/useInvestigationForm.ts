import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import City from 'models/City';
import axios from 'Utils/axios';
import logger from 'logger/logger';
import theme from 'styles/theme';
import Country from 'models/Country';
import ContactType from 'models/ContactType';
import { timeout } from 'Utils/Timeout/Timeout';
import StoreStateType from 'redux/storeStateType';
import { Severity } from 'models/Logger';
import { defaultEpidemiologyNumber } from 'Utils/consts';
import { setCities } from 'redux/City/cityActionCreators';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import useStatusUtils from 'Utils/StatusUtils/useStatusUtils';
import { InvestigationStatus } from 'models/InvestigationStatus';
import { setStatuses } from 'redux/Status/statusesActionCreators';
import { setCountries } from 'redux/Country/countryActionCreators';
import InvestigationMainStatus from 'models/enums/InvestigationMainStatus';
import { setContactType } from 'redux/ContactType/contactTypeActionCreators';
import { setSubStatuses } from 'redux/SubStatuses/subStatusesActionCreators';
import InvestigationComplexityByStatus from 'models/enums/InvestigationComplexityByStatus';
import { setIsInInvestigation } from 'redux/IsInInvestigations/isInInvestigationActionCreators';

import { useInvestigationFormOutcome } from './InvestigationFormInterfaces';
import { LandingPageTimer, defaultUser } from './InvestigationInfo/InvestigationInfoBar';

const useInvestigationForm = (): useInvestigationFormOutcome => {

    const { updateIsDeceased, updateIsCurrentlyHospitialized } = useStatusUtils();

    const { alertError, alertWarning, alertSuccess } = useCustomSwal();

    const userId = useSelector<StoreStateType, string>(state => state.user.data.id);
    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigationStatus = useSelector<StoreStateType, InvestigationStatus>(state => state.investigation.investigationStatus);

    const [areThereContacts, setAreThereContacts] = useState<boolean>(false);

    const initializeTabShow = () => {
        const tabShowLogger = logger.setup({
            workflow: 'Getting Amount Of Contacts',
            user: userId,
            investigation: epidemiologyNumber
        });
        tabShowLogger.info('launching amount of contacts request', Severity.LOW);
        axios.get('/contactedPeople/amountOfContacts/' + epidemiologyNumber).then((result: any) => {
            tabShowLogger.info('amount of contacts request was successful', Severity.LOW);
            setAreThereContacts(result?.data?.data?.allContactedPeople?.totalCount > 0);
        }).catch((error) => {
            tabShowLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
        });
    };

    const fetchCities = () => {
        if (cities && cities.size === 0) {
            const cityLogger = logger.setup({
                workflow: 'Fetching Cities',
                user: userId,
                investigation: epidemiologyNumber
            });
            cityLogger.info('launching cities request', Severity.LOW);
            axios.get('/addressDetails/cities')
                .then((result: any) => {
                    cityLogger.info('cities request was successful', Severity.LOW);
                    const cities: Map<string, City> = new Map();
                    result && result.data && result.data.forEach((city: City) => {
                        cities.set(city.id, city)
                    });
                    setCities(cities);
                })
                .catch(error => {
                    cityLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
                });
        }
    };

    const fetchContactTypes = () => {
        const contactTypesLogger = logger.setup({
            workflow: 'Fetching Contact Types',
            user: userId,
            investigation: epidemiologyNumber
        });
        contactTypesLogger.info('launching contact types request', Severity.LOW);
        axios.get('/intersections/contactTypes')
            .then((result: any) => {
                contactTypesLogger.info('contact types request was successful', Severity.LOW);
                const contactTypes: Map<number, ContactType> = new Map();
                result && result.data && result.data.forEach((contactType: ContactType) => {
                    contactTypes.set(contactType.id, contactType)
                });
                setContactType(contactTypes);
            })
            .catch(error => {
                contactTypesLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
            });
    }

    const fetchCountries = () => {
        const countriesLogger = logger.setup({
            workflow: 'Fetching Countries',
            user: userId,
            investigation: epidemiologyNumber
        });
        countriesLogger.info('launching countries request', Severity.LOW);
        axios.get('/addressDetails/countries')
            .then((result: any) => {
                countriesLogger.info('countries request was successful', Severity.LOW);
                const countries: Map<string, Country> = new Map();
                result && result.data && result.data.forEach((country: Country) => {
                    countries.set(country.id, country)
                });
                setCountries(countries);
            })
            .catch(error => {
                countriesLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
            });
    };

    const fetchSubStatusesByStatus = (parentStatus: string) => {
        const subStatusesByStatusLogger = logger.setup({
            workflow: 'Fetching Sub Statuses',
            user: userId,
            investigation: epidemiologyNumber
        });
        subStatusesByStatusLogger.info('launching sub statuses request', Severity.LOW);
        axios.get('/investigationInfo/subStatuses/' + parentStatus).then((result: any) => {
            subStatusesByStatusLogger.info(`recieved DB response ${JSON.stringify(result)}`, Severity.LOW);
            const resultNodes = result?.data?.data?.allInvestigationSubStatuses?.nodes;
            if (resultNodes) {
                setSubStatuses(resultNodes.map((element: any) => element.displayName));
            }
        }).catch((err: any) => {
            subStatusesByStatusLogger.error( `error DB response ${JSON.stringify(err)}`,  Severity.LOW);
        });
    };

    const fetchStatuses = () => {
        const statusesLogger = logger.setup({
            workflow: 'GraphQL GET statuses request to the DB',
            user: userId,
            investigation: epidemiologyNumber
        });
        axios.get('/landingPage/investigationStatuses').
            then((result) => {
                if (result?.data && result.headers['content-type'].includes('application/json')) {
                    statusesLogger.info('The investigations statuses were fetched successfully', Severity.LOW);
                    const allStatuses: string[] = result.data;
                    setStatuses(allStatuses);
                } else {
                    statusesLogger.error('Got 200 status code but results structure isnt as expected', Severity.HIGH);
                }
            })
            .catch((err) => {
                statusesLogger.error(err, Severity.HIGH);
            })
    };

    useEffect(() => {
        if (epidemiologyNumber !== defaultEpidemiologyNumber && userId !== defaultUser.id) {
            fetchCities();
            fetchCountries();
            fetchContactTypes();
            fetchSubStatusesByStatus(investigationStatus.mainStatus);
            fetchStatuses();
            initializeTabShow();
        }
    }, [epidemiologyNumber, userId]);

    useEffect(() => {
        if (epidemiologyNumber !== defaultEpidemiologyNumber && userId !== defaultUser.id) {
            fetchSubStatusesByStatus(investigationStatus.mainStatus);
        }
    }, [investigationStatus.mainStatus]);

    const confirmFinishInvestigation = (epidemiologyNumber: number, onCancel: () => void) => {
        const finishInvestigationLogger= logger.setup({
            workflow: 'Ending Investigation',
            user: userId,
            investigation: epidemiologyNumber
        });
        finishInvestigationLogger.info('the user has been offered the oppurtunity to finish the investigation',  Severity.LOW);
        alertWarning('האם אתה בטוח שאתה רוצה לסיים ולשמור את החקירה?', {
            showCancelButton: true,
            cancelButtonText: 'בטל',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך'
        }).then((result) => {
            if (result.value) {
                finishInvestigationLogger.info('launching investigation status request', Severity.LOW);
                axios.post('/investigationInfo/updateInvestigationStatus', {
                    investigationMainStatus: InvestigationMainStatus.DONE,
                    investigationSubStatus: null,
                    statusReason: null,
                    epidemiologyNumber: epidemiologyNumber
                }).then(() => {
                    finishInvestigationLogger.info('update investigation status request was successful', Severity.LOW);
                    finishInvestigationLogger.info('launching investigation end time request', Severity.LOW);
                    if (investigationStatus.subStatus === InvestigationComplexityByStatus.IS_DECEASED) {
                        updateIsDeceased(handleInvestigationFinish);
                    } else if (investigationStatus.subStatus === InvestigationComplexityByStatus.IS_CURRENTLY_HOSPITIALIZED) {
                        updateIsCurrentlyHospitialized(handleInvestigationFinish);
                    } else {
                        handleInvestigationFinish();
                    }
                }).catch((error) => {
                    finishInvestigationLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
                    alertError('לא ניתן היה לסיים את החקירה');
                    
                })
            } else {
                onCancel();
            }
        });
    };

    const handleInvestigationFinish = () => {
        alertSuccess('החקירה הסתיימה! הנך מועבר לעמוד הנחיתה', {
            timer: 1750,
            showConfirmButton: false
        });
        timeout(LandingPageTimer).then(() => {
            setIsInInvestigation(false);
            window.close();
        });
    };

    return {
        confirmFinishInvestigation,
        handleInvestigationFinish,
        areThereContacts,
        setAreThereContacts
    };
};

export default useInvestigationForm;
