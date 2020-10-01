import React from 'react';
import { useSelector } from 'react-redux';

import axios from 'Utils/axios';
import Street from 'models/enums/Street';
import { initDBAddress } from 'models/Address';
import StoreStateType from 'redux/storeStateType';

import { otherBackgroundDiseaseFieldName } from './BackgroundDiseasesFields';
import { otherSymptomFieldName } from './SymptomsFields';
import { useClinicalDetailsIncome, useClinicalDetailsOutcome } from './useClinicalDetailsInterfaces';

export const convertDate = (dbDate: Date | null) => dbDate === null ? null : new Date(dbDate);

const useClinicalDetails = (parameters: useClinicalDetailsIncome): useClinicalDetailsOutcome => {

    const {
        setSymptoms, setBackgroundDiseases, setIsolationCityName, setIsolationStreetName, setStreetsInCity, setInitialDBClinicalDetails
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
    
    const getClinicalDetailsByEpidemiologyNumber = () => {
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

                    setInitialDBClinicalDetails({
                        isPregnant: clinicalDetailsByEpidemiologyNumber.isPregnant,
                        backgroundDeseases: getBackgroundDiseasesList(clinicalDetailsByEpidemiologyNumber),
                        doesHaveBackgroundDiseases: clinicalDetailsByEpidemiologyNumber.doesHaveBackgroundDiseases,
                        hospital: patientInvestigation.hospital,
                        hospitalizationStartDate: convertDate(patientInvestigation.hospitalizationStartTime),
                        hospitalizationEndDate: convertDate(patientInvestigation.hospitalizationEndTime),
                        isInIsolation: patientInvestigation.isInIsolation,
                        isIsolationProblem: patientInvestigation.isIsolationProblem,
                        isIsolationProblemMoreInfo: patientInvestigation.isIsolationProblemMoreInfo,
                        isolationStartDate: convertDate(patientInvestigation.isolationStartTime),
                        isolationEndDate: convertDate(patientInvestigation.isolationEndTime),
                        symptoms: getSymptomsList(patientInvestigation),
                        symptomsStartDate: convertDate(patientInvestigation.symptomsStartTime),
                        doesHaveSymptoms: patientInvestigation.doesHaveSymptoms,
                        wasHospitalized: patientInvestigation.wasHospitalized,
                        isolationAddress: patientAddress,
                        otherSymptomsMoreInfo: patientInvestigation.otherSymptomsMoreInfo,
                        otherBackgroundDiseasesMoreInfo: clinicalDetailsByEpidemiologyNumber.otherBackgroundDiseasesMoreInfo,
                    })
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

    React.useEffect(() => {
        getSymptoms();
        getBackgroundDiseases();
        getClinicalDetailsByEpidemiologyNumber();
    }, []);

    return {
        getStreetByCity,
    };
};

export default useClinicalDetails;
