import React from 'react';
import { useSelector } from 'react-redux';

import axios from 'Utils/axios';
import Street from 'models/enums/Street';
import DBAddress from 'models/enums/DBAddress';
import StoreStateType from 'redux/storeStateType';
import ClinicalDetailsFields from 'models/enums/ClinicalDetailsFields';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';

import { useClinicalDetailsIncome, useClinicalDetailsOutcome } from './useClinicalDetailsInterfaces';
import { initAddress } from 'models/Address';

const useClinicalDetails = (parameters: useClinicalDetailsIncome): useClinicalDetailsOutcome => {

    const {
        setSymptoms, setBackgroundDiseases, context, setIsolationCityName, setIsolationStreetName, setStreetsInCity
    } = parameters;

    const hasBackgroundDeseasesToggle = (event: React.ChangeEvent<{}>, value: boolean): void => updateClinicalDetails(ClinicalDetailsFields.DOES_HAVE_BACKGROUND_DESEASSES, value);

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const updateClinicalDetails = (fieldToUpdate: ClinicalDetailsFields, updatedValue: any) => {
        context.setClinicalDetailsData({...context.clinicalDetailsData as ClinicalDetailsData, [fieldToUpdate]: updatedValue});
    };

    const updateIsolationAddressOnCityChange = (city: string) => {
        context.setClinicalDetailsData({
            ...context.clinicalDetailsData,
            isolationAddress: {
                ...context.clinicalDetailsData.isolationAddress,
                city,
                street: ''
            }
        })
    };

    const updateIsolationAddress = (fieldToUpdate: ClinicalDetailsFields, updatedValue: any) => {
        context.setClinicalDetailsData({
            ...context.clinicalDetailsData as ClinicalDetailsData,
            isolationAddress: {
                ...context.clinicalDetailsData.isolationAddress as DBAddress,
                [fieldToUpdate]: updatedValue
            }
        })
    };

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
        cityId !== '' && axios.get('/addressDetails/city/' + cityId + '/streets').then(
            result => result?.data && setStreetsInCity(result.data.map((node: Street) => node))
        )};
    
    const getClinicalDetailsByEpidemiologyNumber = () => {
        axios.get(`/clinicalDetails/getInvestigatedPatientClinicalDetailsFields?epidemiologyNumber=${epidemiologyNumber}`).then(
            result => {
                if (result?.data?.data?.investigationByEpidemiologyNumber) {
                    const clinicalDetailsByEpidemiologyNumber = result.data.data.investigationByEpidemiologyNumber.investigatedPatientByInvestigatedPatientId;
                    const patientBackgroundDiseases = clinicalDetailsByEpidemiologyNumber.investigatedPatientBackgroundDiseasesByInvestigatedPatientId.nodes.map((backgroundDeseas: any) => backgroundDeseas.backgroundDeseasName);
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
                        patientAddress = initAddress;
                    }
                    
                    context.setClinicalDetailsData({
                        ...context.clinicalDetailsData,
                        isPregnant: clinicalDetailsByEpidemiologyNumber.isPregnant,
                        backgroundDeseases: patientBackgroundDiseases,
                        doesHaveBackgroundDiseases: clinicalDetailsByEpidemiologyNumber.doesHaveBackgroundDiseases,
                        hospital: patientInvestigation.hospital,
                        hospitalizationStartDate: convertDate(patientInvestigation.hospitalizationStartTime),
                        hospitalizationEndDate: convertDate(patientInvestigation.hospitalizationEndTime),
                        isInIsolation: patientInvestigation.isInIsolation,
                        isIsolationProblem: patientInvestigation.isIsolationProblem,
                        isIsolationProblemMoreInfo: patientInvestigation.isIsolationProblemMoreInfo,
                        isolationStartDate: convertDate(patientInvestigation.isolationStartTime),
                        isolationEndDate: convertDate(patientInvestigation.isolationEndTime),
                        symptoms: patientInvestigation.investigatedPatientSymptomsByInvestigationId.nodes.map((symptom: any) => symptom.symptomName),
                        symptomsStartDate: convertDate(patientInvestigation.symptomsStartTime),
                        doesHaveSymptoms: patientInvestigation.doesHaveSymptoms,
                        wasHospitalized: patientInvestigation.wasHospitalized,
                        isolationAddress: patientAddress,
                        otherSymptomsMoreInfo: patientInvestigation.otherSymptomsMoreInfo,
                        otherBackgroundDiseasesMoreInfo: clinicalDetailsByEpidemiologyNumber.otherBackgroundDiseasesMoreInfo
                    })
                }
            }
        );
    };

    const convertDate = (dbDate: Date | null) => dbDate === null ? null : new Date(dbDate); 

    React.useEffect(() => {
        getSymptoms();
        getBackgroundDiseases();
        getClinicalDetailsByEpidemiologyNumber();
    }, []);

    return {
        hasBackgroundDeseasesToggle,
        getStreetByCity,
        updateClinicalDetails,
        updateIsolationAddress,
        updateIsolationAddressOnCityChange
    };
};

export default useClinicalDetails;
