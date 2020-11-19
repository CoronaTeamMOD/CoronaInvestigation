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

    const { setSymptoms, setBackgroundDiseases, setIsolationCityName, setIsolationStreetName, setStreetsInCity } = parameters;

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const userId = useSelector<StoreStateType, string>(state => state.user.data.id);
    const address = useSelector<StoreStateType, DBAddress>(state => state.address);
    const [isolationSources, setIsolationSources] = React.useState<IsolationSource[]>([]);
    
    React.useEffect(() => {
        getSymptoms();
        getBackgroundDiseases();
        getIsolationSources();
    }, []);

    const getSymptoms = () => {
        const getSymptomsLogger = logger.setup({
            workflow: 'Fetching Symptoms',
            service: Service.CLIENT,
            investigation: epidemiologyNumber,
            user: userId
        });
        getSymptomsLogger.info(`launching symptoms request`,Severity.LOW)
        axios.get('/clinicalDetails/symptoms').then(result => {
            if (result && result.data && result.data.data) {
                getSymptomsLogger.info('got results back from the server',Severity.LOW)
                setSymptoms((result.data.data.allSymptoms.nodes.map((node: any) => node.displayName as string[]).reverse()))
            } else {
                getSymptomsLogger.warn('got status 200 but wrong data',Severity.HIGH)
            }
        }
        );
    };

    const getBackgroundDiseases = () => {
        const getBackgroundDiseasesLogger = logger.setup({
            workflow: 'Fetching Background Diseases',
            service: Service.CLIENT,
            investigation: epidemiologyNumber,
            user: userId
        });
        getBackgroundDiseasesLogger.info(`launching background diseases request`,Severity.LOW)
        axios.get('/clinicalDetails/backgroundDiseases').then(result => {
            if (result?.data && result.data.data) {
                getBackgroundDiseasesLogger.info('got results back from the server',Severity.LOW)
                setBackgroundDiseases(result.data.data.allBackgroundDeseases.nodes.map((node: any) => node.displayName as string[]).reverse())
            } else {
                getBackgroundDiseasesLogger.warn('got status 200 but wrong data',Severity.HIGH)
            }
        }
        );
    };

    const getIsolationSources = () => {
        const getIsolationSourcesLogger = logger.setup({
            workflow: 'Fetching Isolation Sources',
            service: Service.CLIENT,
            investigation: epidemiologyNumber,
            user: userId
        });
        getIsolationSourcesLogger.info(`Start isolation sources request`,Severity.LOW)
        axios.get('/clinicalDetails/isolationSources').then(result => {
            if (result?.data) {
                getIsolationSourcesLogger.info('got results back from the server',Severity.LOW)
                setIsolationSources(result.data);
            } else {
                getIsolationSourcesLogger.warn('got status 200 but wrong data',Severity.HIGH)
            }
        }
        );
    }

    const getStreetByCity = (cityId: string) => {
        const getStreetByCityLogger = logger.setup({
            workflow: 'Getting streets of city',
            service: Service.CLIENT,
            investigation: epidemiologyNumber,
            user: userId
        });
        getStreetByCityLogger.info(`launching request to server with parameter ${cityId}`,Severity.LOW)
        axios.get('/addressDetails/city/' + cityId + '/streets').then(result => {
            if (result?.data) {
                getStreetByCityLogger.info('got data from the server',Severity.LOW)
                setStreetsInCity(result.data.map((node: Street) => node))
            } else {
                getStreetByCityLogger.error(`got errors in server result: ${JSON.stringify(result)}`,Severity.HIGH)
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
            service: Service.CLIENT,
            investigation: epidemiologyNumber,
            user: userId
        });
        fetchClinicalDetailsLogger.info('launching clinical data request',Severity.LOW)
        axios.get(`/clinicalDetails/getInvestigatedPatientClinicalDetailsFields?epidemiologyNumber=${epidemiologyNumber}`).then(
            result => {
                if (result?.data) {
                    fetchClinicalDetailsLogger.info('got results back from the server',Severity.LOW)
                    const patientClinicalDetails = result.data;
                    let patientAddress = patientClinicalDetails.isolationAddress;
                    if (patientAddress !== null && patientAddress.cityByCity !== null) {
                        let street = '';
                        if (patientAddress.streetByStreet !== null) {
                            street = patientAddress.streetByStreet.id;
                            setIsolationStreetName(patientAddress.streetByStreet.displayName);
                        }
                        setIsolationCityName(patientAddress.cityByCity.displayName);
                        patientAddress = {
                            city: patientAddress.cityByCity.id,
                            street,
                            floor: patientAddress.floor,
                            houseNum: patientAddress.houseNum
                        }
                    } else {
                        patientAddress = address;
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
                    fetchClinicalDetailsLogger.warn('got status 200 but got invalid outcome',Severity.HIGH)
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
