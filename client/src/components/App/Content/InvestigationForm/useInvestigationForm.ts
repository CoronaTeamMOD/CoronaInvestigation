import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';

import City from 'models/City';
import theme from 'styles/theme';
import logger from 'logger/logger';
import Country from 'models/Country';
import { Severity } from 'models/Logger';
import ContactType from 'models/ContactType';
import StoreStateType from 'redux/storeStateType';
import { defaultUser } from 'Utils/UsersUtils/userUtils';
import { defaultEpidemiologyNumber } from 'Utils/consts';
import { setCities } from 'redux/City/cityActionCreators';
import IdentificationType from 'models/IdentificationType';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import useStatusUtils from 'Utils/StatusUtils/useStatusUtils';
import { InvestigationStatus } from 'models/InvestigationStatus';
import { setStatuses } from 'redux/Status/statusesActionCreators';
import { setCountries } from 'redux/Country/countryActionCreators';
import InvestigationMainStatus from 'models/InvestigationMainStatus';
import BroadcastMessage, { BC_TABS_NAME } from 'models/BroadcastMessage';
import { setContactType } from 'redux/ContactType/contactTypeActionCreators';
import { setSubStatuses } from 'redux/SubStatuses/subStatusesActionCreators';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';
import { setEducationGrade } from 'redux/EducationGrade/educationGradeActionCreators';
import InvestigationComplexityByStatus from 'models/enums/InvestigationComplexityByStatus';
import { setIdentificationTypes } from 'redux/IdentificationTypes/identificationTypesActionCreators';
import UpdateTrackingRecommendation from 'Utils/TrackingRecommendation/updateTrackingRecommendation';

import { useInvestigationFormOutcome } from './InvestigationFormInterfaces';
import { fetchAllInvestigatorReferenceStatuses } from 'httpClient/investigationInfo';
import KeyValuePair from 'models/KeyValuePair';
import { setInvestigatorReferenceStatuses } from 'redux/investigatorReferenceStatuses/investigatorReferenceStatusesActionCreator';
import { setTrackingRecommendationChanged } from 'redux/Investigation/investigationActionCreators';

const useInvestigationForm = (): useInvestigationFormOutcome => {

    const { updateIsDeceased, updateIsCurrentlyHospitialized } = useStatusUtils();
    const { updateTrackingReccomentaion } = UpdateTrackingRecommendation();
    const { alertError, alertWarning, alertSuccess } = useCustomSwal();
    const dispatch = useDispatch();

    const userId = useSelector<StoreStateType, string>(state => state.user.data.id);
    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigationStatus = useSelector<StoreStateType, InvestigationStatus>(state => state.investigation.investigationStatus);
    const datesToInvestigate = useSelector<StoreStateType, Date[]>(state => state.investigation.datesToInvestigate);
    const identificationTypes = useSelector<StoreStateType, IdentificationType[]>(state => state.identificationTypes);
    const investigatorReferenceStatuses = useSelector<StoreStateType, KeyValuePair[]>(state => state.investigatorReferenceStatuses);
    const trackingRecommendationChanged = useSelector<StoreStateType,boolean>(state => state.investigation.trackingRecommendationChanged);
    const [areThereContacts, setAreThereContacts] = useState<boolean>(false);

    const checkAreThereContacts = () => {
        const tabShowLogger = logger.setup('Getting Amount Of Contacts');
        tabShowLogger.info('launching amount of contacts request', Severity.LOW);
        const minimalDateToFilter = datesToInvestigate.slice(-1)[0];
        const formattedMinimalDate = typeof minimalDateToFilter !== 'string' ? minimalDateToFilter.toISOString() : minimalDateToFilter;
        axios.get(`/contactedPeople/getContactsCount/${formattedMinimalDate}`)
            .then((result: any) => {
                tabShowLogger.info('amount of contacts request was successful', Severity.LOW);
                setAreThereContacts(result?.data.contactsCount> 0);
            }).catch((error) => {
                tabShowLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
            });
    };

    const fetchCities = () => {
        if (cities && cities.size === 0) {
            const cityLogger = logger.setup('Fetching Cities');
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
        const contactTypesLogger = logger.setup('Fetching Contact Types');
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
    };

    const fetchIdentificationTypes = () => {
        const identificationTypesLogger = logger.setup('Fetching Identification Types');
        identificationTypesLogger.info('launching request to get identification types', Severity.LOW);
        axios.get<IdentificationType[]>('/investigationInfo/identificationTypes')
            .then((result) => {
                identificationTypesLogger.info('request to get identification types was successful', Severity.LOW);
                setIdentificationTypes(result.data);
            })
            .catch(error => {
                identificationTypesLogger.error(`got errors in server while trying to get identification types, result: ${error}`, Severity.HIGH);
            });
    };

    const fetchCountries = () => {
        const countriesLogger = logger.setup('Fetching Countries');
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

    const fetchSubStatusesByStatus = (parentStatus: number) => {
        const subStatusesByStatusLogger = logger.setup('Fetching Sub Statuses');
        subStatusesByStatusLogger.info('launching sub statuses request', Severity.LOW);
        axios.get('/investigationInfo/subStatuses/' + parentStatus).then((result: any) => {
            subStatusesByStatusLogger.info(`recieved DB response ${JSON.stringify(result)}`, Severity.LOW);
            const resultNodes = result?.data?.data?.allInvestigationSubStatuses?.nodes;
            if (resultNodes) {
                setSubStatuses(resultNodes);
            }
        }).catch((err: any) => {
            subStatusesByStatusLogger.error(`error DB response ${JSON.stringify(err)}`, Severity.LOW);
        });
    };

    const fetchStatuses = () => {
        const statusesLogger = logger.setup('Get Investigation Statuses');
        statusesLogger.info('sending request to DB', Severity.LOW);
        axios.get('/landingPage/investigationStatuses').
            then((result) => {
                if (result?.data && result.headers['content-type'].includes('application/json')) {
                    statusesLogger.info('The investigations statuses were fetched successfully', Severity.LOW);
                    const allStatuses: InvestigationMainStatus[] = result.data;
                    setStatuses(allStatuses);
                } else {
                    statusesLogger.error('Got 200 status code but results structure isnt as expected', Severity.HIGH);
                }
            })
            .catch((err) => {
                statusesLogger.error(err, Severity.HIGH);
            })
    };

    const fetchEducationGrades = () => {
        const educationGradesLogger = logger.setup('Fetching education grades');
        educationGradesLogger.info('launching education grades request', Severity.LOW);
        axios.get('/education/grades')
            .then((result: any) => {
                if (result?.data && result.headers['content-type'].includes('application/json')) {
                    educationGradesLogger.info('educationGrades request was successful', Severity.LOW);
                    setEducationGrade(result?.data);
                } else {
                    educationGradesLogger.error('educationGrades request was successful but data isnt as expected', Severity.LOW);
                }
            })
            .catch(error => {
                educationGradesLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
            });
    };

    const GetAllInvestigatorReferenceStatuses = () => {
        if (investigatorReferenceStatuses.length == 0) {
            fetchAllInvestigatorReferenceStatuses().then(data => {
                if (data) dispatch(setInvestigatorReferenceStatuses(data));
            });
        }
    }

    useEffect(() => {
        if (identificationTypes.length === 0) {
            fetchIdentificationTypes();
        }
    }, [identificationTypes]);

    useEffect(() => {
        if (epidemiologyNumber !== defaultEpidemiologyNumber && userId !== defaultUser.id) {
            fetchCities();
            fetchCountries();
            fetchContactTypes();
            fetchStatuses();
            investigationStatus.mainStatus && fetchSubStatusesByStatus(investigationStatus.mainStatus);
            fetchEducationGrades();
            GetAllInvestigatorReferenceStatuses();
        };
    }, [epidemiologyNumber, userId]);

    useEffect(() => {
        datesToInvestigate?.length > 0 && checkAreThereContacts();
    }, [datesToInvestigate]);

    useEffect(() => {
        if (investigationStatus.mainStatus &&
            epidemiologyNumber !== defaultEpidemiologyNumber &&
            userId !== defaultUser.id) {
            fetchSubStatusesByStatus(investigationStatus.mainStatus);
        }
    }, [investigationStatus.mainStatus]);

    const confirmFinishInvestigation = (epidemiologyNumber: number, onCancel: () => void) => {
        const finishInvestigationLogger = logger.setup('Ending Investigation');
        finishInvestigationLogger.info('the user has been offered the oppurtunity to finish the investigation', Severity.LOW);
        alertWarning('האם אתה בטוח שאתה רוצה לסיים ולשמור את החקירה?', {
            text: 'מגעים עבורם הוקם דיווח בידוד או בעלי שם, משפחה ומספר טלפון יועברו בסיום החקירה ל"הושלם התחקור" (למעט "לא ניתן להשגה" ו"לא משתף פעולה") ולא יהיו ניתנים לעריכה',
            showCancelButton: true,
            cancelButtonText: 'בטל',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'הבנתי'
        }).then((result) => {
            if (result.value) {
                finishInvestigationLogger.info('launching investigation status request', Severity.LOW);
                axios.post('/investigationInfo/updateInvestigationStatus', {
                    investigationMainStatus: InvestigationMainStatusCodes.DONE,
                    investigationSubStatus: null,
                    statusReason: null,
                    epidemiologyNumber: epidemiologyNumber
                }).then(async () => {
                    finishInvestigationLogger.info('update investigation status request was successful', Severity.LOW);
                    finishInvestigationLogger.info('launching investigation end time request', Severity.LOW);
                    if (trackingRecommendationChanged){
                        await updateTrackingReccomentaion();
                        dispatch(setTrackingRecommendationChanged(false));
                    }
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
        }).then(() => {
            const windowTabsBroadcatChannel = new BroadcastChannel(BC_TABS_NAME);
            const finishingBroadcastMessage: BroadcastMessage = {
                message: 'Investigaion finished',
                isInInvestigation: false
            }
            windowTabsBroadcatChannel.postMessage(finishingBroadcastMessage);
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
