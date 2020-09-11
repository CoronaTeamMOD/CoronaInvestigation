import { Router, Request, Response } from 'express';

import Address from '../../Models/Address';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import Investigation from '../../Models/ClinicalDetails/Investigation';
import CreateAddressResponse from '../../Models/Address/CreateAddress';
import ClinicalDetails from '../../Models/ClinicalDetails/ClinicalDetails';
import {
    GET_SYMPTOMS, GET_BACKGROUND_DISEASES, GET_INVESTIGATED_PATIENT_CLINICAL_DETAILS_BY_EPIDEMIOLOGY_NUMBER
} from '../../DBService/ClinicalDetails/Query';
import {
    CREATE_ISOLATION_ADDRESS, ADD_BACKGROUND_DISEASES, ADD_SYMPTOMS, UPDATE_IS_PREGNANT, UPDATE_INVESTIGATION
} from '../../DBService/ClinicalDetails/Mutation';

const clinicalDetailsRoute = Router();

clinicalDetailsRoute.get('/', (request: Request, response: Response) => {
    response.send('Hello from Clinical Details route');
});

clinicalDetailsRoute.post('/symptoms', (request: Request, response: Response) => {
    graphqlRequest(GET_SYMPTOMS).then((result: any) => response.send(result));
});

clinicalDetailsRoute.post('/backgroundDiseases', (request: Request, response: Response) => {
    graphqlRequest(GET_BACKGROUND_DISEASES).then((result: any) => response.send(result));
});

clinicalDetailsRoute.get('/getInvestigatedPatientClinicalDetailsFields/:epidemiologyNumber', (request: Request, response: Response) => {
    graphqlRequest(GET_INVESTIGATED_PATIENT_CLINICAL_DETAILS_BY_EPIDEMIOLOGY_NUMBER, { epidemiologyNumber: +request.params.epidemiologyNumber }).then(
        (result: any) => response.send(result)
    );
});

clinicalDetailsRoute.post('/saveClinicalDetails', (request: Request, response: Response) => {

    const isolationAddress = request.body.clinicalDetails.isolationAddress;
    const clinicalDetails: ClinicalDetails = request.body.clinicalDetails;

    const requestInvestigation: Investigation = {
        epidemiologyNumber: clinicalDetails.epidemioligyNumber,
        hospital: clinicalDetails.hospital,
        hospitalizationEndTime: clinicalDetails.hospitalizationEndDate,
        hospitalizationStartTime: clinicalDetails.hospitalizationStartDate,
        isInIsolation: clinicalDetails.isInIsolation,
        isIsolationProblem: clinicalDetails.isIsolationProblem,
        isIsolationProblemMoreInfo: clinicalDetails.isIsolationProblemMoreInfo,
        isolationEndTime: clinicalDetails.isolationEndDate,
        isolationStartTime: clinicalDetails.isolationStartDate,
        symptomsStartTime: clinicalDetails.symptomsStartDate,
        doesHaveSymptoms: clinicalDetails.doesHaveSymptoms,
        wasHospitalized: clinicalDetails.wasHospitalized
    }

    const requestAddress: Address = {
        cityValue: isolationAddress?.city,
        streetValue: isolationAddress?.street,
        floorValue: +isolationAddress?.floor,
        houseNumValue: +isolationAddress?.houseNum,
    }
    
    graphqlRequest(CREATE_ISOLATION_ADDRESS, {
        input: { ...requestAddress }
    }).then((result: CreateAddressResponse) => {
        graphqlRequest(UPDATE_INVESTIGATION, {
            epidemiologyNumber: requestInvestigation.epidemiologyNumber,
            hospital: requestInvestigation.hospital,
            hospitalizationEndTime: requestInvestigation.hospitalizationEndTime,
            hospitalizationStartTime: requestInvestigation.hospitalizationStartTime,
            isInIsolation: requestInvestigation.isInIsolation,
            isIsolationProblem: requestInvestigation.isIsolationProblem,
            isIsolationProblemMoreInfo: requestInvestigation.isIsolationProblemMoreInfo,
            isolationEndTime: requestInvestigation.isolationEndTime,
            isolationStartTime: requestInvestigation.isolationStartTime,
            symptomsStartTime: requestInvestigation.symptomsStartTime,
            wasHospitalized: requestInvestigation.wasHospitalized,
            doesHaveSymptoms: requestInvestigation.doesHaveSymptoms,
            isolationAddress: result.data.insertAndGetAddressId.integer
        }).then(() => {
            graphqlRequest(ADD_BACKGROUND_DISEASES, {
                investigatedPatientId: clinicalDetails.investigatedPatientId,
                backgroundDeseases: clinicalDetails.backgroundDeseases
            }).then(() => {
                graphqlRequest(ADD_SYMPTOMS, {
                    investigationIdValue: clinicalDetails.epidemioligyNumber,
                    symptomNames: clinicalDetails.symptoms
                }).then(() => {
                    graphqlRequest(UPDATE_IS_PREGNANT, {
                        isPregnant: clinicalDetails.isPregnant,
                        id: clinicalDetails.investigatedPatientId
                    })
                }).then(() => {
                    response.send('Added clinical details');
                });
            });
        });
    });
});

export default clinicalDetailsRoute;
