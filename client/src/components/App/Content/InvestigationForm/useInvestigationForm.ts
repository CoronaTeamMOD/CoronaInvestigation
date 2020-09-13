import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import StoreStateType from 'redux/storeStateType';

import City from 'models/City';
import axios from 'Utils/axios';
import { Tab } from 'models/Tab';
import theme from 'styles/theme';
import Country from 'models/Country';
import TabNames from 'models/enums/TabNames';
import {timeout} from 'Utils/Timeout/Timeout';
import {landingPageRoute} from 'Utils/Routes/Routes';
import {setCities} from 'redux/City/cityActionCreators';
import { setCountries } from 'redux/Country/countryActionCreators';

import useStyles from './InvestigationFormStyles';
import { defaultTab, tabs } from './TabManagement/TabManagement';
import { useInvestigationFormOutcome, useInvestigationFormParameters } from './InvestigationFormInterfaces';
import { fieldsNames, ExposureAndFlightsDetails } from 'commons/Contexts/ExposuresAndFlights';

const finishInvestigationStatus = 'טופלה';

const useInvestigationForm = (parameters: useInvestigationFormParameters): useInvestigationFormOutcome => {

    const { clinicalDetailsVariables, personalInfoData, exposuresAndFlightsVariables, setPersonalInfoData } = parameters;

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigatedPatientId = useSelector<StoreStateType, number>(state => state.investigation.investigatedPatientId);
    const creator = useSelector<StoreStateType, string>(state => state.investigation.creator);
    const lastUpdator = useSelector<StoreStateType, string>(state => state.investigation.lastUpdator);

    let history = useHistory();
    const [currentTab, setCurrentTab] = useState<Tab>(defaultTab);

    const classes = useStyles({});

    useEffect(() => {
        axios.get('/addressDetails/cities')
            .then((result: any) => {
                const cities: Map<string, City> = new Map();
                result && result.data && result.data.forEach((city: City) => {
                    cities.set(city.id, city)
                });
                setCities(cities);
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(()=> {
        axios.get('/addressDetails/countries')
        .then((result: any) => {
            const countries: Map<string, Country> = new Map();
            result && result.data && result.data.forEach((country: Country) => {
                countries.set(country.id, country)
            });
            setCountries(countries);
        })
        .catch(err=> console.log(err));
    }, []);

    const confirmFinishInvestigation = (epidemiologyNumber: number) => {
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
                axios.post('/investigationInfo/updateInvestigationStatus', {
                    investigationStatus: finishInvestigationStatus,
                    epidemiologyNumber
                }).then(() => {
                    handleInvestigationFinish();
                }).catch(() => {
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
        timeout(1900).then(() => history.push(landingPageRoute));
    };

    const handleSwitchTab = () => {
        switch(currentTab.name) {
            case(TabNames.PERSONAL_INFO): {
                savePersonalInfoData();
                break;
            }
            case(TabNames.CLINICAL_DETAILS): {
                saveClinicalDetails();
                break;
            }
            case(TabNames.EXPOSURES_AND_FLIGHTS): {
                saveExposureAndFlightData();
                break;
            }
        }
    }

    const savePersonalInfoData = () => {
        axios.post('/personalDetails/updatePersonalDetails', 
        {
            id : investigatedPatientId, 
            personalInfoData: personalInfoData, 
        })
        .then(() => {
            setCurrentTab(tabs[currentTab.id + 1]);
        });
    }
    
    const handleInvestigationFinishFailed = () => {
        Swal.fire({
            title: 'לא ניתן היה לסיים את החקירה',
            icon: 'error',
        })
    };

    const saveClinicalDetails = () => {
        const clinicalDetails = ({
            ...clinicalDetailsVariables.clinicalDetailsData,
            'investigatedPatientId': investigatedPatientId,
            'epidemioligyNumber' : epidemiologyNumber,
            'creator' : creator,
            'lastUpdator' : lastUpdator,
        });
        axios.post('/clinicalDetails/saveClinicalDetails', ({clinicalDetails}));
    };

    const saveExposureAndFlightData = () => {
        if (exposuresAndFlightsVariables.exposureAndFlightsData.id) {
            axios.put('/exposure', {
                exposureDetails: extractExposuresAndFlightData(exposuresAndFlightsVariables.exposureAndFlightsData,
                                                               exposuresAndFlightsVariables.setExposureDataAndFlights)
            })
            .then(() => {
                setCurrentTab(tabs[currentTab.id + 1]);
            }).catch(err => {
                console.log(err);
            })
        } else {
            axios.post('/exposure', {
                exposureDetails: {
                    ...extractExposuresAndFlightData(exposuresAndFlightsVariables.exposureAndFlightsData,
                                                     exposuresAndFlightsVariables.setExposureDataAndFlights),
                    investigationId: epidemiologyNumber
                } 
            }).then(() => {
                setCurrentTab(tabs[currentTab.id + 1]);
            }).catch(err => {
                console.log(err);
            })
        }
    }

    const extractExposuresAndFlightData = (exposuresAndFlightsData : ExposureAndFlightsDetails,
                                           setExposuresAndFlightsData: React.Dispatch<React.SetStateAction<ExposureAndFlightsDetails>>) => {
        let exposureAndDataToReturn = exposuresAndFlightsData;
        if (!exposuresAndFlightsData.wasConfirmedExposure) {
            exposureAndDataToReturn = {
                ...exposureAndDataToReturn,
                [fieldsNames.firstName]: '',
                [fieldsNames.lastName]: '',
                [fieldsNames.date]: undefined,
                [fieldsNames.address]: null,
                [fieldsNames.placeType]: null,
                [fieldsNames.placeSubType] : null,
            }
        } 
        if (!exposuresAndFlightsData.wasAbroad) {
            exposureAndDataToReturn = {
                ...exposureAndDataToReturn,
                [fieldsNames.destinationCountry]: null,
                [fieldsNames.destinationCity]: '',
                [fieldsNames.destinationAirport]: '',
                [fieldsNames.originCountry]: null,
                [fieldsNames.originCity]: '',
                [fieldsNames.originAirport]: '',
                [fieldsNames.flightStartDate]: undefined,
                [fieldsNames.flightEndDate]: undefined,
                [fieldsNames.airline]: '',
                [fieldsNames.flightNumber]: ''
            }
        }
        return exposureAndDataToReturn;
    }

    return {
        currentTab,
        setCurrentTab,
        confirmFinishInvestigation,
        handleInvestigationFinish,
        handleSwitchTab,
    };
};

export default useInvestigationForm;
