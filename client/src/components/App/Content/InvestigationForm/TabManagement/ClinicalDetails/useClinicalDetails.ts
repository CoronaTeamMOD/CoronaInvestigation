import axios from 'axios';
import React, {useState} from 'react';
import { useSelector } from 'react-redux';

import logger from 'logger/logger';
import {Severity} from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import IsolationSource from 'models/IsolationSource';
import { useDateUtils} from 'Utils/DateUtils/useDateUtils';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { setFormState } from 'redux/Form/formActionCreators';
import FlattenedDBAddress, {initDBAddress} from 'models/DBAddress';
import useSymptomsUtils from 'Utils/ClinicalDetails/useSymptomsUtils';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';
import { setSymptomsExistenceInfo } from 'redux/Investigation/investigationActionCreators';

import ClinicalDetailsSchema from './ClinicalDetailsSchema';
import {useClinicalDetailsIncome, useClinicalDetailsOutcome} from './useClinicalDetailsInterfaces';

const otherOptionDescription = 'אחר';

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

const deletingContactEventsErrorMsg = 'קרתה תקלה במחיקת אירועים מיותרים';

const useClinicalDetails = (parameters: useClinicalDetailsIncome): useClinicalDetailsOutcome => {

    const { id, setSymptoms, setBackgroundDiseases, didSymptomsDateChangeOccur } = parameters;

    const { alertError } = useCustomSwal();
    const { getDatesToInvestigate, convertDate } = useDateUtils();
    const { alertSymptomsDatesChange } = useSymptomsUtils();

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigatedPatientId = useSelector<StoreStateType, number>(state => state.investigation.investigatedPatient.investigatedPatientId);
    const tabsValidations  = useSelector<StoreStateType, (boolean | null)[]>(store => store.formsValidations[epidemiologyNumber]);
    const address = useSelector<StoreStateType, FlattenedDBAddress>(state => state.address);
    
    const [coronaTestDate, setCoronaTestDate] = useState<Date | null>(null);
    const [isolationAddressId, setIsolationAddressId] = useState<number | null>(null);
    const [isolationSources, setIsolationSources] = React.useState<IsolationSource[]>([]);
    const [didDeletingContactEventsSucceed, setDidDeletingContactEventsSucceed] = React.useState<boolean>(true);

    React.useEffect(() => {
        getSymptoms();
        getBackgroundDiseases();
        getIsolationSources();
        getCoronaTestDate();
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

    const getCoronaTestDate = () => {
        const fetchCoronaTestDateLogger = logger.setup('Fetching corona test date');
        fetchCoronaTestDateLogger.info('launching corona test date post request', Severity.LOW);
        axios.get(`/clinicalDetails/coronaTestDate`).then((res: any) => {
            if (Boolean(res?.data)) {
                fetchCoronaTestDateLogger.info('got results back from the server', Severity.LOW);
                setCoronaTestDate(convertDate(res.data.coronaTestDate));
            } else {
                fetchCoronaTestDateLogger.warn('got status 200 but wrong data', Severity.HIGH);
            }
        }).catch(err => {
            fetchCoronaTestDateLogger.warn(`Got 500 from coronaTestDate request: ${err}`, Severity.HIGH);
        });
    }

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
        axios.get(`/clinicalDetails/getInvestigatedPatientClinicalDetailsFields?epidemiologyNumber=${epidemiologyNumber}`).then(
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
                            isolationAddressId: patientAddress.id
                        }
                    }
                    setIsolationAddressId(patientAddress.isolationAddressId ? patientAddress.isolationAddressId : null);
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
                        symptomsStartDate: convertDate(patientClinicalDetails.symptomsStartDate),
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
        const deleteIrrelevantEventsLogger = logger.setup('Deleting irrelevant contact events');
        if(Boolean(coronaTestDate)) {
            const allDatesToInvestigate = getDatesToInvestigate(doesHaveSymptoms, symptomsStartDate, coronaTestDate);
            if(allDatesToInvestigate.length > 0) {
                deleteIrrelevantEventsLogger.info('Sending to server date to delete contact events by', Severity.LOW);
                setIsLoading(true);
                axios.delete('/intersections/deleteContactEventsByDate', {params: {earliestDateToInvestigate: allDatesToInvestigate[0]}}).then((result) => {
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
                }).finally(() => {
                    setIsLoading(false);
                })
            }
        }
    }

    const saveClinicalDetailsToDB = (clinicalDetails: ClinicalDetailsData, validationDate: Date, id: number) => {
        const saveClinicalDetailsLogger = logger.setup('Saving clinical details tab');
        saveClinicalDetailsLogger.info('launching the server request', Severity.LOW);
        setIsLoading(true);
        axios.post('/clinicalDetails/saveClinicalDetails', ({
            clinicalDetails: {
                ...clinicalDetails,
                epidemiologyNumber,
                investigatedPatientId,
                isolationAddressId
            }
        })).then(() => {
            saveClinicalDetailsLogger.info('saved clinical details successfully', Severity.LOW);
            setSymptomsExistenceInfo({doesHaveSymptoms: clinicalDetails.doesHaveSymptoms, symptomsStartDate: clinicalDetails.symptomsStartDate});
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

    const saveClinicalDetailsAndDeleteContactEvents = (clinicalDetails: ClinicalDetailsData, validationDate: Date, id: number): void => {
        if(didSymptomsDateChangeOccur) {
            alertSymptomsDatesChange().then(result => {
                if(result.isConfirmed) {
                    deleteIrrelevantContactEvents(clinicalDetails.symptomsStartDate, clinicalDetails.doesHaveSymptoms);
                    didDeletingContactEventsSucceed &&
                        saveClinicalDetailsToDB(clinicalDetails, validationDate, id);
                }
            })
        } else {
            saveClinicalDetailsToDB(clinicalDetails, validationDate, id);
        }
    }

    return {
        saveClinicalDetailsAndDeleteContactEvents,
        fetchClinicalDetails,
        isolationSources
    };
}

export default useClinicalDetails;
