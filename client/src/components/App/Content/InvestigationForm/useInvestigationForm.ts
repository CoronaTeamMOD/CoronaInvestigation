import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import StoreStateType from 'redux/storeStateType';
import { useState, useEffect, useContext } from 'react';

import City from 'models/City';
import axios from 'Utils/axios';
import { Tab } from 'models/Tab';
import theme from 'styles/theme';
import Country from 'models/Country';
import TabNames from 'models/enums/TabNames';
import {timeout} from 'Utils/Timeout/Timeout';
import Validator from 'Utils/Validations/Validator';
import {landingPageRoute} from 'Utils/Routes/Routes';
import {setCities} from 'redux/City/cityActionCreators';
import { setCountries } from 'redux/Country/countryActionCreators';
import InvestigationStatus from 'models/enums/InvestigationStatus';
import IdentificationTypes from 'models/enums/IdentificationTypes';
import useExposuresSaving from 'Utils/ControllerHooks/useExposuresSaving';
import { interactedContactsContext } from 'commons/Contexts/InteractedContactsContext';

import useStyles from './InvestigationFormStyles';
import { defaultTab, tabs } from './TabManagement/TabManagement';
import { useInvestigationFormOutcome, useInvestigationFormParameters  } from './InvestigationFormInterfaces';
import { otherSymptomFieldName, otherBackgroundDiseaseFieldName } from './TabManagement/ClinicalDetails/ClinicalDetails';

const useInvestigationForm = (parameters: useInvestigationFormParameters): useInvestigationFormOutcome => {
    const {clinicalDetailsVariables, personalInfoData, exposuresAndFlightsVariables} = parameters;

    const {saveExposureAndFlightData} = useExposuresSaving(exposuresAndFlightsVariables);
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigatedPatientId = useSelector<StoreStateType, number>(state => state.investigation.investigatedPatientId);
    const context = useContext(interactedContactsContext);

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

    useEffect(() => {
        context.interactedContacts = [];

        axios.get('/contactedPeople/' + epidemiologyNumber).then((result: any) => {
            result?.data?.data?.allContactedPeople?.nodes?.forEach((contact: any) => {
                context.interactedContacts.push(
                    {
                        id: contact.personByPersonInfo.id,
                        firstName: contact.personByPersonInfo.firstName,
                        lastName: contact.personByPersonInfo.lastName,
                        phoneNumber: contact.personByPersonInfo.phoneNumber,
                        identificationType: contact.personByPersonInfo.identificationType ? contact.personByPersonInfo.identificationType : IdentificationTypes.ID,
                        identificationNumber: contact.personByPersonInfo.identificationNumber,
                        birthDate: contact.personByPersonInfo.birthDate,
                        additionalPhoneNumber: contact.personByPersonInfo.additionalPhoneNumber,
                        gender: contact.personByPersonInfo.gender,
                        contactDate: contact.contactEventByContactEvent.startTime,
                        contactType: contact.contactType,
                        cantReachContact: contact.cantReachContact,
                        extraInfo: contact.extraInfo,
                        relationship: contact.relationship,
                        contactedPersonCity: contact.contactedPersonCity,
                        doesFeelGood: contact.doesFeelGood,
                        doesHaveBackgroundDiseases: contact.doesHaveBackgroundDiseases,
                        doesLiveWithConfirmed: contact.doesLiveWithConfirmed,
                        doesNeedHelpInIsolation: contact.doesNeedHelpInIsolation,
                        occupation: contact.occupation,
                        repeatingOccuranceWithConfirmed: contact.repeatingOccuranceWithConfirmed,
                    }
                )
            });
        })
    },[]);

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
        currentTab,
        setCurrentTab,
        confirmFinishInvestigation,
        handleInvestigationFinish,
        handleSwitchTab,
        isButtonDisabled,
        saveCurrentTab
    };
};

export default useInvestigationForm;
