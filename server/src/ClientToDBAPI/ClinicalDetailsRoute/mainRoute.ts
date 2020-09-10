import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import Investigation from '../../Models/ClinicalDetails/Investigation';
import ClinicalDetails from '../../Models/ClinicalDetails/ClinicalDetails';
import { CreateAddressResponse } from '../../Models/ClinicalDetails/CreateAddress';
import { GET_SYMPTOMS, GET_BACKGROUND_DISEASES } from '../../DBService/ClinicalDetails/Query';
import { CREATE_ADDRESS, CREATE_INVESTIGATION, ADD_BACKGROUND_DISEASES, ADD_SYMPTOMS, UPDATE_IS_PREGNANT } from '../../DBService/ClinicalDetails/Mutation';

const clinicalDetailsRoute = Router();

clinicalDetailsRoute.get('/', (request: Request, response: Response) => {
    response.send('Hello from Clinical Details route');
});

clinicalDetailsRoute.post('/symptoms', async (request: Request, response: Response) => {
    const result = await graphqlRequest(GET_SYMPTOMS);

    response.send(result);
});

clinicalDetailsRoute.post('/backgroundDiseases', (request: Request, response: Response) => {
    graphqlRequest(GET_BACKGROUND_DISEASES).then((result: any) => response.send(result));
});

clinicalDetailsRoute.post('/saveClinicalDetails', (request: Request, response: Response) => {

    const requestAddress = request.body;
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
        isolationAddress: +clinicalDetails.isolationAddress,
        isolationEndTime: clinicalDetails.isolationEndDate,
        isolationStartTime: clinicalDetails.isolationStartDate,
        symptomsStartTime: clinicalDetails.symptomsStartDate,
    }
    
    graphqlRequest(CREATE_INVESTIGATION, { investigation: {
            ...requestInvestigation
        }}).then(() => {
            graphqlRequest(ADD_BACKGROUND_DISEASES, {
                backgroundDeseases: clinicalDetails.backgroundDeseases,
                investigatedPatientId: clinicalDetails.investigatedPatientId
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

export default clinicalDetailsRoute;
