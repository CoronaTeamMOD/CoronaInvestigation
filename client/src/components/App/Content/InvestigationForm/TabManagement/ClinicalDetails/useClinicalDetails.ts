import React from 'react';
import { useSelector } from 'react-redux';

import axios from 'Utils/axios';
import Street from 'models/Street';
import { initDBAddress } from 'models/Address';
import StoreStateType from 'redux/storeStateType';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';

import { otherSymptomFieldName } from './SymptomsFields';
import { otherBackgroundDiseaseFieldName } from './BackgroundDiseasesFields';
import { useClinicalDetailsIncome, useClinicalDetailsOutcome } from './useClinicalDetailsInterfaces';

export const convertDate = (dbDate: Date | null) => dbDate === null ? null : new Date(dbDate);

const useClinicalDetails = (parameters: useClinicalDetailsIncome): useClinicalDetailsOutcome => {

    const {
        setSymptoms, setBackgroundDiseases, setIsolationCityName, setIsolationStreetName, setStreetsInCity, initialDBClinicalDetails, setInitialDBClinicalDetails
    } = parameters;

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const getSymptoms = () => {
        axios.post('/clinicalDetails/symptoms', {}).then(
            result => (result && result.data && result.data.data) &&
                setSymptoms((result.data.data.allSymptoms.nodes.map((node: any) => node.displayName as string[]).reverse()))
        );
    };

    const getBackgroundDiseases = () => {
        axios.post('/clinicalDetails/backgroundDiseases', {}).then(
            result => (result?.data && result.data.data) &&
                setBackgroundDiseases(result.data.data.allBackgroundDeseases.nodes.map((node: any) => node.displayName as string[]).reverse())
        );
    };

    const getStreetByCity = (cityId: string) => {
        axios.get('/addressDetails/city/' + cityId + '/streets').then(
            result => result?.data && setStreetsInCity(result.data.map((node: Street) => node))
        )};
    
    const fetchClinicalDetails = (reset: (values?: Record<string, any>, omitResetState?: Record<string, boolean>) => void,
                                  trigger: (payload?: string | string[]) => Promise<boolean>
                                 ) => {
        axios.get(`/clinicalDetails/getInvestigatedPatientClinicalDetailsFields?epidemiologyNumber=${epidemiologyNumber}`).then(
            result => {
                if (result?.data?.data?.investigationByEpidemiologyNumber) {
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
                        patientAddress = initDBAddress;
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
                }
            }
        );
    };

    const getSymptomsList = (patientInvestigation: any) => {
        const symptoms: string[] = patientInvestigation.investigatedPatientSymptomsByInvestigationId.nodes.map((symptom: any) => symptom.symptomName);
        if (patientInvestigation.otherSymptomsMoreInfo) symptoms.push(otherSymptomFieldName);
        return symptoms;
    }

    const getBackgroundDiseasesList = (clinicalDetails: any) => {
        const backgroundDiseases: string[] = clinicalDetails.investigatedPatientBackgroundDiseasesByInvestigatedPatientId.nodes.map((backgroundDeseas: any) => backgroundDeseas.backgroundDeseasName);
        if (clinicalDetails.otherBackgroundDiseasesMoreInfo) backgroundDiseases.push(otherBackgroundDiseaseFieldName);
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
