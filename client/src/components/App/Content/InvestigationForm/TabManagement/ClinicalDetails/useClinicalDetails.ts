import React from 'react';
import { useSelector } from 'react-redux';

import axios from 'Utils/axios';
import Street from 'models/Street';
import logger from 'logger/logger';
import DBAddress from 'models/DBAddress';
import { Service, Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';

import { useClinicalDetailsIncome, useClinicalDetailsOutcome } from './useClinicalDetailsInterfaces';

export const convertDate = (dbDate: Date | null) => dbDate === null ? null : new Date(dbDate);

const useClinicalDetails = (parameters: useClinicalDetailsIncome): useClinicalDetailsOutcome => {

    const {
        setSymptoms, setBackgroundDiseases, setIsolationCityName, setIsolationStreetName, setStreetsInCity, initialDBClinicalDetails,
        setInitialDBClinicalDetails
    } = parameters;

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const userId = useSelector<StoreStateType, string>(state => state.user.id);
    const address = useSelector<StoreStateType, DBAddress>(state => state.address);

    const getSymptoms = () => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching Symptoms',
            step: `launching symptoms request`,
            user: userId,
            investigation: epidemiologyNumber
        });
        axios.post('/clinicalDetails/symptoms', {}).then(result => {
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
            }}
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
        axios.post('/clinicalDetails/backgroundDiseases', {}).then(result => {
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
            }}
        );
    };

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
                setStreetsInCity(result.data.map((node: Street) => node))
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
    )};
    
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
                if (result?.data?.data?.investigationByEpidemiologyNumber) {
                    logger.info({
                        service: Service.CLIENT,
                        severity: Severity.LOW,
                        workflow: 'Fetching Clinical Details',
                        step: 'got results back from the server',
                        user: userId,
                        investigation: epidemiologyNumber
                    });
                    const clinicalDetailsByEpidemiologyNumber = result.data.data.investigationByEpidemiologyNumber.investigatedPatientByInvestigatedPatientId;
                    const patientInvestigation = clinicalDetailsByEpidemiologyNumber.investigationsByInvestigatedPatientId.nodes[0];
                    let patientAddress = patientInvestigation.addressByIsolationAddress;
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
                        ...initialDBClinicalDetails,
                        isPregnant: Boolean(clinicalDetailsByEpidemiologyNumber.isPregnant),
                        backgroundDeseases: getBackgroundDiseasesList(clinicalDetailsByEpidemiologyNumber),
                        doesHaveBackgroundDiseases: Boolean(clinicalDetailsByEpidemiologyNumber.doesHaveBackgroundDiseases),
                        hospital: patientInvestigation.hospital,
                        hospitalizationStartDate: convertDate(patientInvestigation.hospitalizationStartTime),
                        hospitalizationEndDate: convertDate(patientInvestigation.hospitalizationEndTime),
                        isInIsolation: Boolean(patientInvestigation.isInIsolation),
                        isIsolationProblem: Boolean(patientInvestigation.isIsolationProblem),
                        isIsolationProblemMoreInfo: patientInvestigation.isIsolationProblemMoreInfo,
                        isolationStartDate: convertDate(patientInvestigation.isolationStartTime),
                        isolationEndDate: convertDate(patientInvestigation.isolationEndTime),
                        symptoms: getSymptomsList(patientInvestigation),
                        symptomsStartDate: convertDate(patientInvestigation.symptomsStartTime),
                        isSymptomsStartDateUnknown: patientInvestigation.symptomsStartTime === null,
                        doesHaveSymptoms: Boolean(patientInvestigation.doesHaveSymptoms),
                        wasHospitalized: Boolean(patientInvestigation.wasHospitalized),
                        isolationAddress: patientAddress,
                        otherSymptomsMoreInfo: patientInvestigation.otherSymptomsMoreInfo,
                        otherBackgroundDiseasesMoreInfo: clinicalDetailsByEpidemiologyNumber.otherBackgroundDiseasesMoreInfo,
                    }
                    setInitialDBClinicalDetails(initialDBClinicalDetailsToSet);
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

    const getSymptomsList = (patientInvestigation: any) => {
        const symptoms: string[] = patientInvestigation.investigatedPatientSymptomsByInvestigationId.nodes.map((symptom: any) => symptom.symptomName);
        return symptoms;
    }

    const getBackgroundDiseasesList = (clinicalDetails: any) => {
        const backgroundDiseases: string[] = clinicalDetails.investigatedPatientBackgroundDiseasesByInvestigatedPatientId.nodes.map((backgroundDeseas: any) => backgroundDeseas.backgroundDeseasName);
        return backgroundDiseases;
    }

    const saveClinicalDetails = (clinicalDetails: ClinicalDetailsData, epidemiologyNumber: number, investigatedPatientId: number) : Promise<void> => {
        return axios.post('/clinicalDetails/saveClinicalDetails', ({ clinicalDetails: {...clinicalDetails, epidemiologyNumber, investigatedPatientId}}));
    }

    React.useEffect(() => {
        getSymptoms();
        getBackgroundDiseases();
    }, []);

    return {
        getStreetByCity,
        saveClinicalDetails,
        fetchClinicalDetails
    };
};

export default useClinicalDetails;
