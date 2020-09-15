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
import InvestigationStatus from 'models/enums/InvestigationStatus';
import { fieldsNames, ExposureAndFlightsDetails } from 'commons/Contexts/ExposuresAndFlights';

import useStyles from './InvestigationFormStyles';
import { defaultTab, tabs } from './TabManagement/TabManagement';
import { useInvestigationFormOutcome, useInvestigationFormParameters  } from './InvestigationFormInterfaces';

const useInvestigationForm = (parameters: useInvestigationFormParameters): useInvestigationFormOutcome => {

    const { clinicalDetailsVariables, personalInfoData, exposuresAndFlightsVariables  } = parameters;

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigatedPatientId = useSelector<StoreStateType, number>(state => state.investigation.investigatedPatientId);
   
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
                    epidemiologyNumber,
                    investigationStatus: InvestigationStatus.DONE,
                }).then(() => {
                    axios.post('/investigationInfo/updateInvestigationEndTime', {
                        investigationEndTime: new Date(),
                        epidemiologyNumber
                    }).then(() => handleInvestigationFinish()).catch(() => handleInvestigationFinishFailed())
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
        timeout(1900).then(() => {
            history.push(landingPageRoute);
        });
    };

    const saveCurrentTab = () => {
        switch(currentTab.name) {
            case(TabNames.PERSONAL_INFO): {
                return savePersonalInfoData();
            }
            case(TabNames.CLINICAL_DETAILS): {
                return saveClinicalDetails();
            }
            case(TabNames.EXPOSURES_AND_FLIGHTS): {
                return saveExposureAndFlightData();
            }
            default: {
                return new Promise<void>((resolve, reject) => resolve());
            }
        }
    }

    const handleSwitchTab = () => {
        saveCurrentTab().then(() => {
            setCurrentTab(tabs[currentTab.id + 1]);
        }).catch(() => {
            Swal.fire({
                title: 'לא הצלחנו לשמור את השינויים, אנא נסה שוב בעוד מספר דקות',
                icon: 'error'
            });
        });
    }

    const savePersonalInfoData = (): Promise<void> => {
        return axios.post('/personalDetails/updatePersonalDetails', 
        {
            id : investigatedPatientId, 
            personalInfoData, 
        })
    }

    const handleInvestigationFinishFailed = () => {
        Swal.fire({
            title: 'לא ניתן היה לסיים את החקירה',
            icon: 'error',
        })
    };

    const saveExposureAndFlightData = () : Promise<void> => {
        if (exposuresAndFlightsVariables.exposureAndFlightsData.id) {
            return axios.put('/exposure', {
                exposureDetails: extractExposuresAndFlightData(exposuresAndFlightsVariables.exposureAndFlightsData)
            });
         } else {
            return axios.post('/exposure', {
                exposureDetails: {
                    ...extractExposuresAndFlightData(exposuresAndFlightsVariables.exposureAndFlightsData),
                    investigationId: epidemiologyNumber
                } 
            });
        }
    }

    const saveClinicalDetails = (): Promise<void> => {
        const clinicalDetails = ({
            ...clinicalDetailsVariables.clinicalDetailsData,
            isolationAddress: clinicalDetailsVariables.clinicalDetailsData.isolationAddress.city === '' ? 
                null : clinicalDetailsVariables.clinicalDetailsData.isolationAddress,
            investigatedPatientId,
            epidemiologyNumber
        });

        if (!clinicalDetails.wasHospitalized) {
            clinicalDetails.hospital = '';
            clinicalDetails.hospitalizationStartDate = null;
            clinicalDetails.hospitalizationEndDate = null;
        }

        if (!clinicalDetails.isInIsolation) {
            clinicalDetails.isolationStartDate = null;
            clinicalDetails.isolationEndDate = null;
        }

        if (!clinicalDetails.doesHaveSymptoms) {
            clinicalDetails.symptoms = [];
            clinicalDetails.symptomsStartDate = null;
        }

        if (!clinicalDetails.doesHaveBackgroundDiseases) {
            clinicalDetails.backgroundDeseases = [];
        }

        return axios.post('/clinicalDetails/saveClinicalDetails', ({clinicalDetails}));
    };

    const extractExposuresAndFlightData = (exposuresAndFlightsData : ExposureAndFlightsDetails ) => {
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
        saveCurrentTab
    };
};

export default useInvestigationForm;
