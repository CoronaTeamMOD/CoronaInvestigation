import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import City from 'models/City';
import axios from 'Utils/axios';
import logger from 'logger/logger';
import theme from 'styles/theme';
import Country from 'models/Country';
import ContactType from 'models/ContactType';
import { timeout } from 'Utils/Timeout/Timeout';
import StoreStateType from 'redux/storeStateType';
import { Service, Severity } from 'models/Logger';
import { landingPageRoute } from 'Utils/Routes/Routes';
import { setCities } from 'redux/City/cityActionCreators';
import { setCountries } from 'redux/Country/countryActionCreators';
import InvestigationStatus from 'models/enums/InvestigationMainStatus';
import { setContactType } from 'redux/ContactType/contactTypeActionCreators';
import { setSubStatuses } from 'redux/SubStatuses/subStatusesActionCreators';

import useStyles from './InvestigationFormStyles';
import { LandingPageTimer, defaultUser } from './InvestigationInfo/InvestigationInfoBar';
import { useInvestigationFormOutcome } from './InvestigationFormInterfaces';
import { defaultEpidemiologyNumber } from 'Utils/consts';

const useInvestigationForm = (): useInvestigationFormOutcome => {

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const userId = useSelector<StoreStateType, string>(state => state.user.id);
    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const classes = useStyles({});
    let history = useHistory();
    const [areThereContacts, setAreThereContacts] = useState<boolean>(false);

    const initializeTabShow = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Getting Amount Of Contacts',
            step: `launching amount of contacts request`,
            user: userId,
            investigation: epidemiologyNumber
        });
        axios.get('/contactedPeople/amountOfContacts/' + epidemiologyNumber).then((result: any) => {
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Getting Amount Of Contacts',
                step: `amount of contacts request was successful`,
                user: userId,
                investigation: epidemiologyNumber
            });
            setAreThereContacts(result?.data?.data?.allContactedPeople?.totalCount > 0);
        }).catch((error) => {
            logger.error({
                service: Service.CLIENT,
                severity: Severity.HIGH,
                workflow: 'Getting Amount Of Contacts',
                step: `got errors in server result: ${error}`,
                user: userId,
                investigation: epidemiologyNumber
            });
        });
    };

    const fetchCities = () => {
        if (cities && cities.size === 0) {
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Fetching Cities',
                step: `launching cities request`,
                user: userId,
                investigation: epidemiologyNumber
            });
            axios.get('/addressDetails/cities')
                .then((result: any) => {
                    logger.info({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'Fetching Cities',
                        step: `cities request was successful`,
                        user: userId,
                        investigation: epidemiologyNumber
                    });
                    const cities: Map<string, City> = new Map();
                    result && result.data && result.data.forEach((city: City) => {
                        cities.set(city.id, city)
                    });
                    setCities(cities);
                })
                .catch(error => {
                    logger.error({
                        service: Service.CLIENT,
                        severity: Severity.HIGH,
                        workflow: 'Fetching Cities',
                        step: `got errors in server result: ${error}`,
                        user: userId,
                        investigation: epidemiologyNumber
                    });
                });
        }
    };

    const fetchContactTypes = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching Contact Types',
            step: `launching contact types request`,
            user: userId,
            investigation: epidemiologyNumber
        });
        axios.get('/intersections/contactTypes')
            .then((result: any) => {
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Fetching Contact Types',
                    step: `contact types request was successful`,
                    user: userId,
                    investigation: epidemiologyNumber
                });
                const contactTypes: Map<number, ContactType> = new Map();
                result && result.data && result.data.forEach((contactType: ContactType) => {
                    contactTypes.set(contactType.id, contactType)
                });
                setContactType(contactTypes);
            })
            .catch(error => {
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Fetching Contact Types',
                    step: `got errors in server result: ${error}`,
                    user: userId,
                    investigation: epidemiologyNumber
                });
            });
    }

    const fetchCountries = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching Countries',
            step: `launching countries request`,
            user: userId,
            investigation: epidemiologyNumber
        });
        axios.get('/addressDetails/countries')
            .then((result: any) => {
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Fetching Countries',
                    step: `countries request was successful`,
                    user: userId,
                    investigation: epidemiologyNumber
                });
                const countries: Map<string, Country> = new Map();
                result && result.data && result.data.forEach((country: Country) => {
                    countries.set(country.id, country)
                });
                setCountries(countries);
            })
            .catch(error => {
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Fetching Countries',
                    step: `got errors in server result: ${error}`,
                    user: userId,
                    investigation: epidemiologyNumber
                });
            });
    };

    const fetchSubStatuses = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching Sub Statuses',
            step: `launching sub statuses request`,
            user: userId,
            investigation: epidemiologyNumber
        });
        axios.get('/investigationInfo/subStatuses').then((result: any) => {
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Getting sub statuses',
                step: `recieved DB response ${JSON.stringify(result)}`,
            });

            const resultNodes = result?.data?.data?.allInvestigationSubStatuses?.nodes;

            if (resultNodes) {
                setSubStatuses(
                    resultNodes.filter((element: any) => element.displayName)
                    .map((element: any) => element.displayName)
                )
            }
        }).catch((err: any) => {
            logger.error({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Getting sub statuses',
                step: `error DB response ${JSON.stringify(err)}`,
            });
        });
    };

    useEffect(() => {
        if (epidemiologyNumber !== defaultEpidemiologyNumber && userId !== defaultUser.id)
        fetchCities();
        fetchCountries();
        fetchContactTypes();
        fetchSubStatuses();
        initializeTabShow();
    }, [epidemiologyNumber, userId]);

    const confirmFinishInvestigation = (epidemiologyNumber: number) => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Ending Investigation',
            step: 'the user has been offered the oppurtunity to finish the investigation',
            user: userId,
            investigation: epidemiologyNumber
        });
        Swal.fire({
            icon: 'warning',
            title: 'האם אתה בטוח שאתה רוצה לסיים ולשמור את החקירה?',
            showCancelButton: true,
            cancelButtonText: 'בטל',
            cancelButtonColor: theme.palette.error.main,
            confirmButtonColor: theme.palette.primary.main,
            confirmButtonText: 'כן, המשך',
            customClass: {
                title: classes.swalTitle
            }
        }).then((result) => {
            if (result.value) {
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Ending Investigation',
                    step: `launching investigation status request`,
                    user: userId,
                    investigation: epidemiologyNumber
                });
                axios.post('/investigationInfo/updateInvestigationStatus', {
                    investigationMainStatus: InvestigationStatus.DONE,
                    investigationSubStatus: null,
                    epidemiologyNumber: epidemiologyNumber
                }).then(() => {
                    logger.info({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'Ending Investigation',
                        step: `update investigation status request was successful`,
                        user: userId,
                        investigation: epidemiologyNumber
                    });
                    logger.info({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'Ending Investigation',
                        step: `launching investigation end time request`,
                        user: userId,
                        investigation: epidemiologyNumber
                    });
                    axios.post('/investigationInfo/updateInvestigationEndTime', {
                        investigationEndTime: new Date(),
                        epidemiologyNumber
                    }).then(() => {
                        logger.info({
                            service: Service.CLIENT,
                            severity: Severity.LOW,
                            workflow: 'Ending Investigation',
                            step: `update investigation end time request was successful`,
                            user: userId,
                            investigation: epidemiologyNumber
                        });
                        handleInvestigationFinish()
                    })
                        .catch((error) => {
                            logger.error({
                                service: Service.CLIENT,
                                severity: Severity.HIGH,
                                workflow: 'Ending Investigation',
                                step: `got errors in server result: ${error}`,
                                user: userId,
                                investigation: epidemiologyNumber
                            });
                            handleInvestigationFinishFailed()
                        })
                }).catch((error) => {
                    logger.error({
                        service: Service.CLIENT,
                        severity: Severity.HIGH,
                        workflow: 'Ending Investigation',
                        step: `got errors in server result: ${error}`,
                        user: userId,
                        investigation: epidemiologyNumber
                    });
                    handleInvestigationFinishFailed();
                })
            };
        });
    };

    const handleInvestigationFinish = () => {
        Swal.fire({
            icon: 'success',
            title: 'החקירה הסתיימה! הנך מועבר לעמוד הנחיתה',
            customClass: {
                title: classes.swalTitle
            },
            timer: 1750,
            showConfirmButton: false
        }
        );
        timeout(LandingPageTimer).then(() => {
            window.close();
        });
    };

    const handleInvestigationFinishFailed = () => {
        Swal.fire({
            title: 'לא ניתן היה לסיים את החקירה',
            icon: 'error',
        })
    };

    return {
        confirmFinishInvestigation,
        handleInvestigationFinish,
        areThereContacts,
        setAreThereContacts
    };
};

export default useInvestigationForm;
