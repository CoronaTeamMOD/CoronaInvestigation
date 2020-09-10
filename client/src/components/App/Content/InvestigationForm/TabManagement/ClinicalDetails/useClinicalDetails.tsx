import React from 'react';
import { useSelector } from 'react-redux';

import City from 'models/City';
import axios from 'Utils/axios';
import StoreStateType from 'redux/storeStateType';

import { useClinicalDetailsIncome, useClinicalDetailsOutcome } from './useClinicalDetailsInterfaces';

const useClinicalDetails = (parameters: useClinicalDetailsIncome): useClinicalDetailsOutcome => {

    const { setIsInIsolation, setHasSymptoms, setHasBackgroundDiseases, setWasHospitalized, setSymptoms, setBackgroundDiseases, context } = parameters;

    const isInIsolationToggle = (event: React.ChangeEvent<{}>, value: boolean): void => (setIsInIsolation(value));
    const hasSymptomsToggle = (event: React.ChangeEvent<{}>, value: boolean): void => (setHasSymptoms(value));
    const hasBackgroundDeseasesToggle = (event: React.ChangeEvent<{}>, value: boolean): void => (setHasBackgroundDiseases(value));
    const wasHospitalizedToggle = (event: React.ChangeEvent<{}>, value: boolean): void => (setWasHospitalized(value));

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const getSymptoms = () => {
        axios.post('/clinicalDetails/symptoms').then(
            result => (result && result.data && result.data.data) &&
                setSymptoms((result.data.data.allSymptoms.nodes.map((node: any) => node.displayName as string[]).reverse()))
        );
    };

    const getBackgroundDiseases = () => {
        axios.post('/clinicalDetails/backgroundDiseases').then(
            result => (result && result.data && result.data.data) &&
                setBackgroundDiseases(result.data.data.allBackgroundDeseases.nodes.map((node: any) => node.displayName as string[]).reverse())
        );
    };

    const getClinicalDetailsByEpidemiologyNumber = () => {
        axios.post('/clinicalDetails/getInvestigatedPatientClinicalDetailsFields?epidemiologyNumber=' + epidemiologyNumber).then(
            result => {
                if (result && result.data && result.data.data && result.data.data.investigationByEpidemiologyNumber) {
                    const clinicalDetailsByEpidemiologyNumber = result.data.data.investigationByEpidemiologyNumber.investigatedPatientByInvestigatedPatientId;
                    const patientIsPregnant = clinicalDetailsByEpidemiologyNumber.isPregnant;
                    const patientBackgroundDiseases = clinicalDetailsByEpidemiologyNumber.investigatedPatientBackgroundDiseasesByInvestigatedPatientId.nodes;
                    const patientInvestigation = clinicalDetailsByEpidemiologyNumber.investigationsByInvestigatedPatientId.nodes[0];
                    const patientAddress = patientInvestigation.addressByIsolationAddress;
                    
                    context.setClinicalDetailsData({
                        ...context.clinicalDetailsData,
                        isPregnant: patientIsPregnant,
                        backgroundDeseases: patientBackgroundDiseases,
                        hospital: patientInvestigation.hospital,
                        hospitalizationStartDate: new Date(patientInvestigation.hospitalizationStartTime),
                        hospitalizationEndDate: new Date(patientInvestigation.hospitalizationEndTime),
                        isIsolationProblem: patientInvestigation.isIsolationProblem,
                        isIsolationProblemMoreInfo: patientInvestigation.isIsolationProblemMoreInfo,
                        isolationStartDate: new Date(patientInvestigation.isolationStartTime),
                        isolationEndDate: new Date(patientInvestigation.isolationEndTime),
                        symptoms: patientInvestigation.investigatedPatientSymptomsByInvestigationId.nodes,
                        symptomsStartDate: new Date(patientInvestigation.symptomsStartTime),
                        isolationAddress: {
                            city: patientAddress.cityByCity.displayName,
                            street: patientAddress.streetByStreet.displayName,
                            floor: patientAddress.floor,
                            houseNum: patientAddress.houseNum
                        }
                    })
                }
            }
        );
    };

    React.useEffect(() => {
        console.log(cities.get('5000')?.displayName)
        getSymptoms();
        getBackgroundDiseases();
        getClinicalDetailsByEpidemiologyNumber();
    }, []);

    return { 
        isInIsolationToggle,
        hasSymptomsToggle,
        hasBackgroundDeseasesToggle,
        wasHospitalizedToggle,
    };
};

export default useClinicalDetails;
