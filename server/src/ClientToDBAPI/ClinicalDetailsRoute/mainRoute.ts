import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import Investigation from '../../Models/ClinicalDetails/Investigation';
import ClinicalDetails from '../../Models/ClinicalDetails/ClinicalDetails';
import { CreateAddressResponse } from '../../Models/ClinicalDetails/CreateAddress';
import { GET_SYMPTOMS, GET_BACKGROUND_DISEASES } from '../../DBService/ClinicalDetails/Query';
import { CREATE_ADDRESS, CREATE_INVESTIGATION, ADD_BACKGROUND_DESEASES, ADD_SYMPTOMS } from '../../DBService/ClinicalDetails/Mutation';

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

clinicalDetailsRoute.post('/saveClinicalDetails', (request: Request, response: Response) => {

    const requestAddress = request.body;
    const clinicalDetails: ClinicalDetails = request.body.clinicalDetails;

    const requestInvestigation: Investigation = {
        epidemioligyNumber: clinicalDetails.epidemioligyNumber,
        creator: 15,
        lastUpdator: 15,
        hospital: clinicalDetails.hospital,
        hospitalizationEndDate: clinicalDetails.hospitalizationEndDate,
        hospitalizationStartDate: clinicalDetails.hospitalizationStartDate,
        investigatedPatientId: clinicalDetails.investigatedPatientId,
        isIsolationProblem: clinicalDetails.isIsolationProblem,
        isIsolationProblemMoreInfo: clinicalDetails.isIsolationProblemMoreInfo,
        isolationAddress: clinicalDetails.isolationAddress,
        isolationEndDate: clinicalDetails.isolationEndDate,
        isolationStartDate: clinicalDetails.isolationStartDate,
        symptomsStartDate: clinicalDetails.symptomsStartDate,
    }

    console.log(requestInvestigation)
    
    graphqlRequest(CREATE_INVESTIGATION, { investigation: {
            ...requestInvestigation,
            isolationAddress: 87,
        }}).then(() => {
            graphqlRequest(ADD_BACKGROUND_DESEASES, {
                backgroundDeseases: clinicalDetails.backgroundDeseases,
                investigatedPatientId: clinicalDetails.investigatedPatientId
            }).then(() => {
                graphqlRequest(ADD_SYMPTOMS, {
                    investigationIdValue: clinicalDetails.epidemioligyNumber,
                    symptomNames: clinicalDetails.symptoms
                }).then(() => {
                    response.send('Added clinical details');
                });
            });
        });
    });

export default clinicalDetailsRoute;
