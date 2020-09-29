import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import StoreStateType from 'redux/storeStateType';

import City from 'models/City';
import axios from 'Utils/axios';
import theme from 'styles/theme';
import Country from 'models/Country';
import TabNames from 'models/enums/TabNames';
import {timeout} from 'Utils/Timeout/Timeout';
import Validator from 'Utils/Validations/Validator';
import {landingPageRoute} from 'Utils/Routes/Routes';
import {setCities} from 'redux/City/cityActionCreators';
import { setCountries } from 'redux/Country/countryActionCreators';
import InvestigationStatus from 'models/enums/InvestigationStatus';
import useExposuresSaving from "Utils/ControllerHooks/useExposuresSaving";

import useStyles from './InvestigationFormStyles';
import { useInvestigationFormOutcome, useInvestigationFormParameters  } from './InvestigationFormInterfaces';
import { otherSymptomFieldName, otherBackgroundDiseaseFieldName } from './TabManagement/ClinicalDetails/ClinicalDetails';

const useInvestigationForm = (parameters: useInvestigationFormParameters): useInvestigationFormOutcome => {
    const {clinicalDetailsVariables, personalInfoData, exposuresAndFlightsVariables} = parameters;

    const {saveExposureAndFlightData} = useExposuresSaving(exposuresAndFlightsVariables);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigatedPatientId = useSelector<StoreStateType, number>(state => state.investigation.investigatedPatientId);
   
    let history = useHistory();

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

    const saveClinicalDetails = (): Promise<void> => {
        const clinicalDetails = ({
            ...clinicalDetailsVariables.clinicalDetailsData,
            isolationAddress: clinicalDetailsVariables.clinicalDetailsData.isolationAddress.city === '' ? 
                null : clinicalDetailsVariables.clinicalDetailsData.isolationAddress,
            investigatedPatientId,
            epidemiologyNumber
        });

        if (clinicalDetails.symptoms.includes(otherSymptomFieldName)) {
            clinicalDetails.symptoms = clinicalDetails.symptoms.filter(symptom => symptom !== otherSymptomFieldName)
        } else {
            clinicalDetails.otherSymptomsMoreInfo = '';
        }

        if (clinicalDetails.backgroundDeseases.includes(otherBackgroundDiseaseFieldName)) {
            clinicalDetails.backgroundDeseases = clinicalDetails.backgroundDeseases.filter(symptom => symptom !== otherBackgroundDiseaseFieldName)
        } else {
            clinicalDetails.otherBackgroundDiseasesMoreInfo = '';
        }

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

    const isButtonDisabled = (tabName: string): boolean => {
        switch (tabName) {
            case(TabNames.PERSONAL_INFO): {
                return Validator.formValidation(personalInfoData);
            }
            default: {
                return false;
            }
        }
    }

    return {
        confirmFinishInvestigation,
        handleInvestigationFinish,
        isButtonDisabled,
    };
};

export default useInvestigationForm;
