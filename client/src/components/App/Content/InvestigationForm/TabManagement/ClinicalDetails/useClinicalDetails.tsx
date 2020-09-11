import React from 'react';
import { useSelector } from 'react-redux';

import axios from 'Utils/axios';
import Street from 'models/enums/Street';
import StoreStateType from 'redux/storeStateType';

import { useClinicalDetailsIncome, useClinicalDetailsOutcome } from './useClinicalDetailsInterfaces';

const useClinicalDetails = (parameters: useClinicalDetailsIncome): useClinicalDetailsOutcome => {

    const {
        setHasBackgroundDiseases, setSymptoms, setBackgroundDiseases, context, setIsolationCityName, setIsolationStreetName, setStreetsInCity
    } = parameters;

    const hasBackgroundDeseasesToggle = (event: React.ChangeEvent<{}>, value: boolean): void => (setHasBackgroundDiseases(value));

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const getSymptoms = () => {
        axios.post('/clinicalDetails/symptoms').then(
            result => (result && result.data && result.data.data) &&
                setSymptoms((result.data.data.allSymptoms.nodes.map((node: any) => node.displayName as string[]).reverse()))
        );
    };

    const getBackgroundDiseases = () => {
        axios.post('/clinicalDetails/backgroundDiseases').then(
            result => (result?.data && result.data.data) &&
                setBackgroundDiseases(result.data.data.allBackgroundDeseases.nodes.map((node: any) => node.displayName as string[]).reverse())
        );
    };

    const getStreetByCity = (cityId: string) => {
        axios.get('/addressDetails/city/' + cityId + '/streets').then(
            result => result?.data && setStreetsInCity(result.data.map((node: Street) => node))
        )};
    
    const getClinicalDetailsByEpidemiologyNumber = () => {
        axios.post('/clinicalDetails/getInvestigatedPatientClinicalDetailsFields?epidemiologyNumber=' + epidemiologyNumber).then(
            result => {
                if (result && result.data && result.data.data && result.data.data.investigationByEpidemiologyNumber) {
                    const clinicalDetailsByEpidemiologyNumber = result.data.data.investigationByEpidemiologyNumber.investigatedPatientByInvestigatedPatientId;
                    const patientIsPregnant = clinicalDetailsByEpidemiologyNumber.isPregnant;
                    const patientBackgroundDiseases = clinicalDetailsByEpidemiologyNumber.investigatedPatientBackgroundDiseasesByInvestigatedPatientId.nodes;
                    const patientInvestigation = clinicalDetailsByEpidemiologyNumber.investigationsByInvestigatedPatientId.nodes[0];
                    const patientAddress = patientInvestigation.addressByIsolationAddress;
                    setIsolationCityName(patientAddress.cityByCity.displayName);
                    setIsolationStreetName(patientAddress.streetByStreet.displayName);
                    
                    context.setClinicalDetailsData({
                        ...context.clinicalDetailsData,
                        isPregnant: patientIsPregnant,
                        backgroundDeseases: patientBackgroundDiseases,
                        hospital: patientInvestigation.hospital,
                        hospitalizationStartDate: new Date(patientInvestigation.hospitalizationStartTime),
                        hospitalizationEndDate: new Date(patientInvestigation.hospitalizationEndTime),
                        isInIsolation: patientInvestigation.isInIsolation,
                        isIsolationProblem: patientInvestigation.isIsolationProblem,
                        isIsolationProblemMoreInfo: patientInvestigation.isIsolationProblemMoreInfo,
                        isolationStartDate: new Date(patientInvestigation.isolationStartTime),
                        isolationEndDate: new Date(patientInvestigation.isolationEndTime),
                        symptoms: patientInvestigation.investigatedPatientSymptomsByInvestigationId.nodes,
                        symptomsStartDate: new Date(patientInvestigation.symptomsStartTime),
                        doesHaveSymptoms: patientInvestigation.doesHaveSymptoms,
                        wasHospitalized: patientInvestigation.wasHospitalized,
                        isolationAddress: {
                            city: patientAddress.cityByCity.id,
                            street: patientAddress.streetByStreet.id,
                            floor: patientAddress.floor,
                            houseNum: patientAddress.houseNum
                        }
                    })
                }
            }
        );
    };

    React.useEffect(() => {
        getSymptoms();
        getBackgroundDiseases();
        getClinicalDetailsByEpidemiologyNumber();
    }, []);

    return {
        hasBackgroundDeseasesToggle,
        getStreetByCity
    };
};

export default useClinicalDetails;
