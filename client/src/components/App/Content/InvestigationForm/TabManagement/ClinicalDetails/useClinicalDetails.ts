import axios from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';

import theme from 'styles/theme';
import logger from 'logger/logger';
import {Severity} from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import IsolationSource from 'models/IsolationSource';
import { useDateUtils } from 'Utils/DateUtils/useDateUtils';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { setFormState } from 'redux/Form/formActionCreators';
import FlattenedDBAddress, { initDBAddress } from 'models/DBAddress';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import { getDatesToInvestigate } from 'Utils/ClinicalDetails/symptomsUtils';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';
import { setDatesToInvestigateParams } from 'redux/Investigation/investigationActionCreators';

import ClinicalDetailsSchema from './ClinicalDetailsSchema';
import {useClinicalDetailsIncome, useClinicalDetailsOutcome} from './useClinicalDetailsInterfaces';

const otherOptionDescription = 'אחר';

export const initialClinicalDetails: ClinicalDetailsData = {
    isolationStartDate: null,
    isolationEndDate: null,
    isolationSource: null,
    isolationAddress: initDBAddress,
    isInIsolation: false,
    isIsolationProblem: null,
    isIsolationProblemMoreInfo: '',
    symptomsStartDate: null,
    symptoms: [],
    doesHaveBackgroundDiseases: null,
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

const deletingContactEventsErrorMsg = 'קרתה תקלה במחיקת אירועים מיותרים';

const useClinicalDetails = (parameters: useClinicalDetailsIncome): useClinicalDetailsOutcome => {

    const { id, setSymptoms, setBackgroundDiseases, didSymptomsDateChangeOccur } = parameters;

    const { convertDate } = useDateUtils();
    const { alertError } = useCustomSwal();

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigatedPatientId = useSelector<StoreStateType, number>(state => state.investigation.investigatedPatient.investigatedPatientId);
    const tabsValidations  = useSelector<StoreStateType, (boolean | null)[]>(store => store.formsValidations[epidemiologyNumber]);
    const address = useSelector<StoreStateType, FlattenedDBAddress>(state => state.address);
    const validationDate = useSelector<StoreStateType, Date>(state => state.investigation.validationDate);
    
    const [isolationSources, setIsolationSources] = React.useState<IsolationSource[]>([]);
    const [didDeletingContactEventsSucceed, setDidDeletingContactEventsSucceed] = React.useState<boolean>(true);

    React.useEffect(() => {
        getSymptoms();
        getBackgroundDiseases();
        getIsolationSources();
    }, []);

    const getSymptoms = () => {
        const getSymptomsLogger = logger.setup('Fetching Symptoms');
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

    const getBackgroundDiseases = () => {
        const getBackgroundDiseasesLogger = logger.setup('Fetching Background Diseases');
        getBackgroundDiseasesLogger.info('launching background diseases request', Severity.LOW);
        axios.get('/clinicalDetails/backgroundDiseases').then(result => {
            if (result?.data && result.data.data) {
                getBackgroundDiseasesLogger.info('got results back from the server', Severity.LOW);
                setBackgroundDiseases(result.data.data.allBackgroundDeseases.nodes.map((node: any) => node.displayName as string[]).reverse())
            } else {
                getBackgroundDiseasesLogger.warn('got status 200 but wrong data', Severity.HIGH);
            }
        });
    };

    const sortedIsolationSource = (fetchedIsolationSources : IsolationSource[]) : IsolationSource[] => {
        const otherIndex : number = fetchedIsolationSources.findIndex(source => source.description === otherOptionDescription);
        const otherIsolationSource : IsolationSource[] = fetchedIsolationSources.splice(otherIndex, 1);
        return fetchedIsolationSources.concat(otherIsolationSource);
    }

    const getIsolationSources = () => {
        const getIsolationSourcesLogger = logger.setup('Fetching Isolation Sources');
        getIsolationSourcesLogger.info('Start isolation sources request', Severity.LOW);
        axios.get('/clinicalDetails/isolationSources').then(result => {
            if (result?.data) {
                getIsolationSourcesLogger.info('got results back from the server', Severity.LOW);
                const fetchedIsolationSources : IsolationSource[] = sortedIsolationSource(result.data);
                setIsolationSources(fetchedIsolationSources);
            } else {
                getIsolationSourcesLogger.warn('got status 200 but wrong data', Severity.HIGH);
            }
        }
        );
    }

    const fetchClinicalDetails = (
        reset: (values?: Record<string, any>, omitResetState?: Record<string, boolean>) => void,
        trigger: (payload?: string | string[]) => Promise<boolean>
    ) => {
        const fetchClinicalDetailsLogger = logger.setup('Fetching Clinical Details');
        fetchClinicalDetailsLogger.info('launching clinical data request', Severity.LOW);
        setIsLoading(true);
        axios.get(`/clinicalDetails/getInvestigatedPatientClinicalDetailsFields`).then(
            result => {
                if (result?.data) {
                    fetchClinicalDetailsLogger.info('got results back from the server', Severity.LOW);
                    const patientClinicalDetails = result.data;
                    let patientAddress = patientClinicalDetails.isolationAddress;
                    if (tabsValidations[id] === null && !patientAddress?.cityByCity && !patientAddress?.streetByStreet &&
                        !patientAddress?.floor && !patientAddress?.houseNum) {
                        patientAddress = address;
                    }
                    else {
                        patientAddress = {
                            city: patientAddress.cityByCity?.id,
                            street: patientAddress.streetByStreet?.id,
                            floor: patientAddress.floor,
                            houseNum: patientAddress.houseNum,
                        }
                    }
                    const initialDBClinicalDetailsToSet = {
                        ...initialClinicalDetails,
                        isPregnant: Boolean(patientClinicalDetails.isPregnant),
                        backgroundDeseases: patientClinicalDetails.backgroundDiseases,
                        doesHaveBackgroundDiseases: patientClinicalDetails.doesHaveBackgroundDiseases,
                        hospital: patientClinicalDetails.hospital !== null ? patientClinicalDetails.hospital : '',
                        hospitalizationStartDate: convertDate(patientClinicalDetails.hospitalizationStartTime),
                        hospitalizationEndDate: convertDate(patientClinicalDetails.hospitalizationEndTime),
                        isInIsolation: Boolean(patientClinicalDetails.isInIsolation),
                        isIsolationProblem: patientClinicalDetails.isIsolationProblem,
                        isIsolationProblemMoreInfo: patientClinicalDetails.isIsolationProblemMoreInfo !== null ?
                            patientClinicalDetails.isIsolationProblemMoreInfo : '',
                        isolationStartDate: convertDate(patientClinicalDetails.isolationStartTime),
                        isolationEndDate: convertDate(patientClinicalDetails.isolationEndTime),
                        isolationSource: patientClinicalDetails.isolationSource,
                        symptoms: patientClinicalDetails.symptoms,
                        symptomsStartDate: convertDate(patientClinicalDetails.symptomsStartDate),
                        isSymptomsStartDateUnknown: patientClinicalDetails.symptomsStartTime === null,
                        doesHaveSymptoms: patientClinicalDetails.doesHaveSymptoms,
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
        const deleteIrrelevantEventsLogger = logger.setup('Deleting irrelevant contact events');
        const earliestDateToInvestigate = getDatesToInvestigate(doesHaveSymptoms, symptomsStartDate, validationDate).slice(-1)[0];
        if(earliestDateToInvestigate) {
            deleteIrrelevantEventsLogger.info('Sending to server date to delete contact events by', Severity.LOW);
            setIsLoading(true);
            axios.delete('/intersections/deleteContactEventsByDate', {params: {earliestDateToInvestigate}})
            .then((result) => {
                if(result.data?.data?.deleteContactEventsBeforeDate) {
                    deleteIrrelevantEventsLogger.info('Deleting contact events finished with success', Severity.LOW);
                } else {
                    deleteIrrelevantEventsLogger.error(`Deleting contact events finished with errors: ${result.data}`, Severity.LOW);
                    alertError(deletingContactEventsErrorMsg);
                    setDidDeletingContactEventsSucceed(false);
                }
            }).catch(err => {
                deleteIrrelevantEventsLogger.error(`Failed to delete irrelevant contact events: ${err}`, Severity.LOW);
                alertError(deletingContactEventsErrorMsg);
                setDidDeletingContactEventsSucceed(false);
                setIsLoading(false);
            })
        }
    }

    const saveClinicalDetailsToDB = (clinicalDetails: ClinicalDetailsData, id: number) => {
        const saveClinicalDetailsLogger = logger.setup('Saving clinical details tab');
        saveClinicalDetailsLogger.info('launching the server request', Severity.LOW);
        setIsLoading(true);
        axios.post('/clinicalDetails/saveClinicalDetails', ({
            clinicalDetails: {
                ...clinicalDetails,
                epidemiologyNumber,
                investigatedPatientId            }
        }))
        .then(() => {
            saveClinicalDetailsLogger.info('saved clinical details successfully', Severity.LOW);
            didSymptomsDateChangeOccur && setDatesToInvestigateParams({doesHaveSymptoms: clinicalDetails.doesHaveSymptoms, symptomsStartDate: clinicalDetails.symptomsStartDate});
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
    };

    const saveClinicalDetailsAndDeleteContactEvents = (clinicalDetails: ClinicalDetailsData, id: number): void => {
        if(didSymptomsDateChangeOccur) {
            const { symptomsStartDate, doesHaveSymptoms } = clinicalDetails;
            ClinicalDetailsSchema(validationDate)
            .validateAt(ClinicalDetailsFields.SYMPTOMS_START_DATE, clinicalDetails as any)
            .then(() => {
                deleteIrrelevantContactEvents(symptomsStartDate, doesHaveSymptoms);
                didDeletingContactEventsSucceed && saveClinicalDetailsToDB(clinicalDetails, id);
            })
            .catch(() => alertError('לא ניתן להשלים את הטאב עם תאריך תסמינים לא חוקי'));
        } else {
            saveClinicalDetailsToDB(clinicalDetails, id);
        }
    };

    return {
        saveClinicalDetailsAndDeleteContactEvents,
        fetchClinicalDetails,
        isolationSources
    };
}

export default useClinicalDetails;
