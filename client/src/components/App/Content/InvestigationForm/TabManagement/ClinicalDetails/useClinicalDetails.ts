import axios from 'axios';
import React, {useState} from 'react';
import { useSelector } from 'react-redux';

import Street from 'models/Street';
import logger from 'logger/logger';
import {Severity} from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import IsolationSource from 'models/IsolationSource';
import DBAddress, {initDBAddress} from 'models/DBAddress';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { setFormState } from 'redux/Form/formActionCreators';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';
import {convertDate, getDatesToInvestigate} from 'Utils/DateUtils/useDateUtils';

import ClinicalDetailsSchema from './ClinicalDetailsSchema';
import {useClinicalDetailsIncome, useClinicalDetailsOutcome} from './useClinicalDetailsInterfaces';

export const initialClinicalDetails: ClinicalDetailsData = {
    isolationStartDate: null,
    isolationEndDate: null,
    isolationSource: null,
    isolationAddress: initDBAddress,
    isInIsolation: false,
    isIsolationProblem: false,
    isIsolationProblemMoreInfo: '',
    symptomsStartDate: null,
    symptoms: [],
    doesHaveBackgroundDiseases: false,
    backgroundDeseases: [],
    hospital: '',
    hospitalizationStartDate: null,
    hospitalizationEndDate: null,
    isSymptomsStartDateUnknown: false,
    doesHaveSymptoms: false,
    wasHospitalized: false,
    isPregnant: false,
    otherSymptomsMoreInfo: '',
    otherBackgroundDiseasesMoreInfo: ''
};

const useClinicalDetails = (parameters: useClinicalDetailsIncome): useClinicalDetailsOutcome => {
    const { id, setSymptoms, setBackgroundDiseases,
            setStreetsInCity, didSymptomsDateChangeOccur } = parameters;

    const { alertError } = useCustomSwal();
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigatedPatientId = useSelector<StoreStateType, number>(state => state.investigation.investigatedPatient.investigatedPatientId);
    const tabsValidations  = useSelector<StoreStateType, (boolean | null)[]>(store => store.formsValidations[epidemiologyNumber]);
    const userId = useSelector<StoreStateType, string>(state => state.user.data.id);
    const address = useSelector<StoreStateType, DBAddress>(state => state.address);
    const [coronaTestDate, setCoronaTestDate] = useState<Date | null>(null);
    const [isolationSources, setIsolationSources] = React.useState<IsolationSource[]>([]);
    
    React.useEffect(() => {
        getSymptoms();
        getBackgroundDiseases();
        getIsolationSources();
        getCoronaTestDate();
    }, []);

    const getSymptoms = () => {
        const getSymptomsLogger = logger.setup({
            workflow: 'Fetching Symptoms',
            investigation: epidemiologyNumber,
            user: userId
        });
        getSymptomsLogger.info('launching symptoms request', Severity.LOW);
        axios.get('/clinicalDetails/symptoms').then(result => {
            if (result && result.data && result.data.data) {
                getSymptomsLogger.info('got results back from the server', Severity.LOW);
                setSymptoms((result.data.data.allSymptoms.nodes.map((node: any) => node.displayName as string[]).reverse()))
            } else {
                getSymptomsLogger.warn('got status 200 but wrong data', Severity.HIGH);
            }
        }
        );
    };

    const getCoronaTestDate = () => {
        const fetchCoronaTestDateLogger = logger.setup({
            workflow: 'Fetching corona test date',
            investigation: epidemiologyNumber,
            user: userId
        });
        fetchCoronaTestDateLogger.info('launching corona test date post request', Severity.LOW);
        axios.get(`/clinicalDetails/coronaTestDate`).then((res: any) => {
            if (res.data !== null) {
                fetchCoronaTestDateLogger.info('got results back from the server', Severity.LOW);
                setCoronaTestDate(convertDate(res.data.coronaTestDate));
            } else {
                fetchCoronaTestDateLogger.warn('got status 200 but wrong data', Severity.HIGH);
            }
        });
    }

    const getBackgroundDiseases = () => {
        const getBackgroundDiseasesLogger = logger.setup({
            workflow: 'Fetching Background Diseases',
            investigation: epidemiologyNumber,
            user: userId
        });
        getBackgroundDiseasesLogger.info('launching background diseases request', Severity.LOW);
        axios.get('/clinicalDetails/backgroundDiseases').then(result => {
            if (result?.data && result.data.data) {
                getBackgroundDiseasesLogger.info('got results back from the server', Severity.LOW);
                setBackgroundDiseases(result.data.data.allBackgroundDeseases.nodes.map((node: any) => node.displayName as string[]).reverse())
            } else {
                getBackgroundDiseasesLogger.warn('got status 200 but wrong data', Severity.HIGH);
            }
        }
        );
    };

    const getIsolationSources = () => {
        const getIsolationSourcesLogger = logger.setup({
            workflow: 'Fetching Isolation Sources',
            investigation: epidemiologyNumber,
            user: userId
        });
        getIsolationSourcesLogger.info('Start isolation sources request', Severity.LOW);
        axios.get('/clinicalDetails/isolationSources').then(result => {
            if (result?.data) {
                getIsolationSourcesLogger.info('got results back from the server', Severity.LOW);
                setIsolationSources(result.data);
            } else {
                getIsolationSourcesLogger.warn('got status 200 but wrong data', Severity.HIGH);
            }
        }
        );
    }

    const getStreetByCity = (cityId: string) => {
        const getStreetByCityLogger = logger.setup({
            workflow: 'Getting streets of city',
            investigation: epidemiologyNumber,
            user: userId
        });
        getStreetByCityLogger.info(`launching request to server with parameter ${cityId}`, Severity.LOW);
        axios.get('/addressDetails/city/' + cityId + '/streets').then(result => {
            if (result?.data) {
                getStreetByCityLogger.info('got data from the server', Severity.LOW);
                const streets: Map<string, Street> = new Map();
                result.data.forEach((street: Street) => {
                    streets.set(street.id, street)
                });
                setStreetsInCity(streets);
            } else {
                getStreetByCityLogger.error(`got errors in server result: ${JSON.stringify(result)}`, Severity.HIGH);
            }
        }
        )
    };

    const fetchClinicalDetails = (
        reset: (values?: Record<string, any>, omitResetState?: Record<string, boolean>) => void,
        trigger: (payload?: string | string[]) => Promise<boolean>
    ) => {
        const fetchClinicalDetailsLogger = logger.setup({
            workflow: 'Fetching Clinical Details',
            investigation: epidemiologyNumber,
            user: userId
        });
        fetchClinicalDetailsLogger.info('launching clinical data request', Severity.LOW);
        setIsLoading(true);
        axios.get(`/clinicalDetails/getInvestigatedPatientClinicalDetailsFields?epidemiologyNumber=${epidemiologyNumber}`).then(
            result => {
                if (result?.data) {
                    fetchClinicalDetailsLogger.info('got results back from the server', Severity.LOW);
                    const patientClinicalDetails = result.data;
                    let patientAddress = patientClinicalDetails.isolationAddress;
                    if (tabsValidations[id] === null && !patientAddress.cityByCity && !patientAddress.streetByStreet &&
                        !patientAddress.floor && !patientAddress.houseNum) {
                        patientAddress = address;
                    }
                    else {
                        patientAddress = {
                            city: patientAddress.cityByCity?.id,
                            street: patientAddress.streetByStreet?.id,
                            floor: patientAddress.floor,
                            houseNum: patientAddress.houseNum
                        }
                    }
                    const initialDBClinicalDetailsToSet = {
                        ...initialClinicalDetails,
                        isPregnant: Boolean(patientClinicalDetails.isPregnant),
                        backgroundDeseases: patientClinicalDetails.backgroundDiseases,
                        doesHaveBackgroundDiseases: Boolean(patientClinicalDetails.doesHaveBackgroundDiseases),
                        hospital: patientClinicalDetails.hospital !== null ? patientClinicalDetails.hospital : '',
                        hospitalizationStartDate: convertDate(patientClinicalDetails.hospitalizationStartTime),
                        hospitalizationEndDate: convertDate(patientClinicalDetails.hospitalizationEndTime),
                        isInIsolation: Boolean(patientClinicalDetails.isInIsolation),
                        isIsolationProblem: Boolean(patientClinicalDetails.isIsolationProblem),
                        isIsolationProblemMoreInfo: patientClinicalDetails.isIsolationProblemMoreInfo !== null ?
                            patientClinicalDetails.isIsolationProblemMoreInfo : '',
                        isolationStartDate: convertDate(patientClinicalDetails.isolationStartTime),
                        isolationEndDate: convertDate(patientClinicalDetails.isolationEndTime),
                        isolationSource: patientClinicalDetails.isolationSource,
                        symptoms: patientClinicalDetails.symptoms,
                        symptomsStartDate: convertDate(patientClinicalDetails.symptomsStartTime),
                        isSymptomsStartDateUnknown: patientClinicalDetails.symptomsStartTime === null,
                        doesHaveSymptoms: Boolean(patientClinicalDetails.doesHaveSymptoms),
                        wasHospitalized: Boolean(patientClinicalDetails.wasHospitalized),
                        isolationAddress: patientAddress,
                        otherSymptomsMoreInfo: patientClinicalDetails.otherSymptomsMoreInfo !== null ?
                            patientClinicalDetails.otherSymptomsMoreInfo : '',
                        otherBackgroundDiseasesMoreInfo: patientClinicalDetails.otherBackgroundDiseasesMoreInfo !== null ?
                            patientClinicalDetails.otherBackgroundDiseasesMoreInfo : '',
                    }
                    reset(initialDBClinicalDetailsToSet);
                    trigger();
                    setIsLoading(false);
                } else {
                    fetchClinicalDetailsLogger.warn('got status 200 but got invalid outcome', Severity.HIGH);
                    setIsLoading(false);
                }
            }
        );
    };

    const deleteIrrelevantContactEvents = (symptomsStartDate: Date | null, doesHaveSymptoms: boolean) => {
        const deleteIrrelevantEventsLogger = logger.setup({
           workflow: 'Deleting irrelevant contact events',
           investigation: epidemiologyNumber,
           user: userId
        });
        if(Boolean(coronaTestDate)) {
            const earliestDateToInvestigate = getDatesToInvestigate(doesHaveSymptoms, symptomsStartDate, coronaTestDate)[0];
            deleteIrrelevantEventsLogger.info('Sending to server date to delete contact events by', Severity.LOW);
            axios.post('/intersections/deleteContactEventsByDate', {earliestDate: earliestDateToInvestigate}).then((result) => {
                if(result.data?.data?.deleteContactEventsBeforeDate) {
                    deleteIrrelevantEventsLogger.info('Deleting contact events finished with success', Severity.LOW);
                } else {
                    deleteIrrelevantEventsLogger.error(`Deleting contact events finished with errors: ${result.data}`, Severity.LOW);
                    alertError('קרתה תקלה במחיקת אירועים מיותרים');
                }
            }).catch(err => {
                deleteIrrelevantEventsLogger.error(`Failed to delete irrelevant contact events: ${err}`, Severity.LOW);
                alertError('קרתה תקלה במחיקת אירועים מיותרים');
            })
        }
    }
    const saveClinicalDetails = (clinicalDetails: ClinicalDetailsData, validationDate: Date, id: number): void => {
        didSymptomsDateChangeOccur &&
            deleteIrrelevantContactEvents(clinicalDetails.symptomsStartDate, clinicalDetails.doesHaveSymptoms);
        const saveClinicalDetailsLogger = logger.setup({
            workflow: 'Saving clinical details tab',
            investigation: epidemiologyNumber,
            user: userId
        });
        saveClinicalDetailsLogger.info('launching the server request', Severity.LOW);
        setIsLoading(true);
        axios.post('/clinicalDetails/saveClinicalDetails', ({
            clinicalDetails: {
                ...clinicalDetails,
                epidemiologyNumber,
                investigatedPatientId
            }
        }))
            .then(() => {
                saveClinicalDetailsLogger.info('saved clinical details successfully', Severity.LOW);
            })
            .catch((error) => {
                saveClinicalDetailsLogger.error(`got error from server: ${error}`, Severity.HIGH);
                alertError('לא הצלחנו לשמור את השינויים, אנא נסה שוב בעוד מספר דקות');
            })
            .finally(() => {
                setIsLoading(false);
                ClinicalDetailsSchema(validationDate).isValid(clinicalDetails).then(valid => {
                    setFormState(epidemiologyNumber, id, valid);
                })
            })
    }


    return {
        getStreetByCity,
        saveClinicalDetails,
        fetchClinicalDetails,
        isolationSources
    };
}

export default useClinicalDetails;
