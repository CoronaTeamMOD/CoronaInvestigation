import React from 'react';
import { useSelector } from 'react-redux';

import axios from 'Utils/axios';
import Street from 'models/Street';
import DBAddress, { initDBAddress } from 'models/DBAddress';
import { Service, Severity } from 'models/Logger';
import logger from 'logger/logger';
import StoreStateType from 'redux/storeStateType';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';
import IsolationSource from 'models/IsolationSource';

import { useClinicalDetailsIncome, useClinicalDetailsOutcome } from './useClinicalDetailsInterfaces';

export const convertDate = (dbDate: Date | null) => dbDate === null ? null : new Date(dbDate);

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
            setStreetsInCity } = parameters;

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const userId = useSelector<StoreStateType, string>(state => state.user.id);
    const tabsValidations  = useSelector<StoreStateType, (boolean | null)[]>(store => store.formsValidations[epidemiologyNumber]);
    const address = useSelector<StoreStateType, DBAddress>(state => state.address);

    const [isolationSources, setIsolationSources] = React.useState<IsolationSource[]>([]);
    
    React.useEffect(() => {
        getSymptoms();
        getBackgroundDiseases();
        getIsolationSources();
    }, []);

    const getSymptoms = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching Symptoms',
            step: `launching symptoms request`,
            user: userId,
            investigation: epidemiologyNumber
        });
        axios.get('/clinicalDetails/symptoms').then(result => {
            if (result && result.data && result.data.data) {
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Fetching Symptoms',
                    step: 'got results back from the server',
                    user: userId,
                    investigation: epidemiologyNumber
                });
                setSymptoms((result.data.data.allSymptoms.nodes.map((node: any) => node.displayName as string[]).reverse()))
            } else {
                logger.warn({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Getting Symptoms',
                    step: 'got status 200 but wrong data'
                });
            }
        }
        );
    };

    const getBackgroundDiseases = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching Background Diseases',
            step: `launching background diseases request`,
            user: userId,
            investigation: epidemiologyNumber
        });
        axios.get('/clinicalDetails/backgroundDiseases').then(result => {
            if (result?.data && result.data.data) {
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Fetching Background Diseases',
                    step: 'got results back from the server',
                    user: userId,
                    investigation: epidemiologyNumber
                });
                setBackgroundDiseases(result.data.data.allBackgroundDeseases.nodes.map((node: any) => node.displayName as string[]).reverse())
            } else {
                logger.warn({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Getting Background Diseases',
                    step: 'got status 200 but wrong data'
                });
            }
        }
        );
    };

    const getIsolationSources = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching Isolation Sources',
            step: `Start isolation sources request`,
            user: userId,
            investigation: epidemiologyNumber
        });
        axios.get('/clinicalDetails/isolationSources').then(result => {
            if (result?.data) {
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Fetching Isolation Sources',
                    step: 'got results back from the server',
                    user: userId,
                    investigation: epidemiologyNumber
                });
                setIsolationSources(result.data);
            } else {
                logger.warn({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Fetching Isolation Sources',
                    step: 'got status 200 but wrong data'
                });
            }
        }
        );
    }

    const getStreetByCity = (cityId: string) => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Getting streets of city',
            step: `launching request to server with parameter ${cityId}`,
            user: userId,
            investigation: epidemiologyNumber
        })
        axios.get('/addressDetails/city/' + cityId + '/streets').then(result => {
            if (result?.data) {
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Getting streets of city',
                    step: 'got data from the server',
                    user: userId,
                    investigation: epidemiologyNumber
                })
                const streets: Map<string, Street> = new Map();
                result.data.forEach((street: Street) => {
                    streets.set(street.id, street)
                });
                setStreetsInCity(streets)
            } else {
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Fetching Clinical Details',
                    step: `got errors in server result: ${JSON.stringify(result)}`,
                    user: userId,
                    investigation: epidemiologyNumber
                });
            }
        }
        )
    };

    const fetchClinicalDetails = (
        reset: (values?: Record<string, any>, omitResetState?: Record<string, boolean>) => void,
        trigger: (payload?: string | string[]) => Promise<boolean>
    ) => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching Clinical Details',
            step: 'launching clinical data request',
            user: userId,
            investigation: epidemiologyNumber
        });
        axios.get(`/clinicalDetails/getInvestigatedPatientClinicalDetailsFields?epidemiologyNumber=${epidemiologyNumber}`).then(
            result => {
                if (result?.data) {
                    logger.info({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'Fetching Clinical Details',
                        step: 'got results back from the server',
                        user: userId,
                        investigation: epidemiologyNumber
                    });
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
                } else {
                    logger.warn({
                        service: Service.CLIENT,
                        severity: Severity.HIGH,
                        workflow: 'Fetching Clinical Details',
                        step: 'got status 200 but got invalid outcome'
                    })
                }
            }
        );
    };

    const saveClinicalDetails = (clinicalDetails: ClinicalDetailsData, epidemiologyNumber: number, investigatedPatientId: number): Promise<void> => {
        return axios.post('/clinicalDetails/saveClinicalDetails', ({ clinicalDetails: { ...clinicalDetails, epidemiologyNumber, investigatedPatientId } }));
    }

    return {
        getStreetByCity,
        saveClinicalDetails,
        fetchClinicalDetails,
        isolationSources
    };
};

export default useClinicalDetails;
