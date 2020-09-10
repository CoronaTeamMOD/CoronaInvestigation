import { Router, Request, Response } from 'express';

import Address from '../../Models/Address';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import Investigation from '../../Models/ClinicalDetails/Investigation';
import ClinicalDetails from '../../Models/ClinicalDetails/ClinicalDetails';
import { GET_SYMPTOMS, GET_BACKGROUND_DISEASES, GET_INVESTIGATED_PATIENT_CLINICAL_DETAILS_BY_EPIDEMIOLOGY_NUMBER } from '../../DBService/ClinicalDetails/Query';
import { CREATE_ADDRESS, CREATE_INVESTIGATION, ADD_BACKGROUND_DISEASES, ADD_SYMPTOMS, UPDATE_IS_PREGNANT } from '../../DBService/ClinicalDetails/Mutation';

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

clinicalDetailsRoute.post('/getInvestigatedPatientClinicalDetailsFields', (request: Request, response: Response) => {
    graphqlRequest(GET_INVESTIGATED_PATIENT_CLINICAL_DETAILS_BY_EPIDEMIOLOGY_NUMBER, { epidemiologyNumber: +request.query.epidemiologyNumber }).then(
        (result: any) => response.send(result)
    );
});

clinicalDetailsRoute.post('/saveClinicalDetails', (request: Request, response: Response) => {

    const isolationAddress = request.body.clinicalDetails.isolationAddress;
    const clinicalDetails: ClinicalDetails = request.body.clinicalDetails;

    const requestInvestigation: Investigation = {
        epidemiologyNumber: clinicalDetails.epidemioligyNumber,
        creator: clinicalDetails.creator,
        lastUpdator: clinicalDetails.lastUpdator,
        hospital: clinicalDetails.hospital,
        hospitalizationEndTime: clinicalDetails.hospitalizationEndDate,
        hospitalizationStartTime: clinicalDetails.hospitalizationStartDate,
        investigatedPatientId: clinicalDetails.investigatedPatientId,
        isIsolationProblem: clinicalDetails.isIsolationProblem,
        isIsolationProblemMoreInfo: clinicalDetails.isIsolationProblemMoreInfo,
        isolationEndTime: clinicalDetails.isolationEndDate,
        isolationStartTime: clinicalDetails.isolationStartDate,
        symptomsStartTime: clinicalDetails.symptomsStartDate,
    }

    const requestAddress: Address = {
        city: isolationAddress.city,
        street: isolationAddress.street,
        floor: +isolationAddress.floor,
        houseNum: +isolationAddress.houseNum,
    }
    
    graphqlRequest(CREATE_ADDRESS, {
        address: { ...requestAddress }
    }).then(() => {
        graphqlRequest(CREATE_INVESTIGATION, {
            investigation: { ...requestInvestigation }
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
