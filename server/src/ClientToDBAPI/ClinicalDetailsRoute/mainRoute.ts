import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { CreateAddressResposne } from '../../Models/ClinicalDetails/CreateAddress';
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
    
    const requestAddress = request.body.input;

    const requestInvestigation = request.body.investigation;
    
    graphqlRequest(CREATE_ADDRESS, { input: {
        ...requestAddress
    }}).then((result: CreateAddressResposne) => {
        graphqlRequest(CREATE_INVESTIGATION, { investigation: {
            ...requestInvestigation,
            isolationAddress: result.data.insertAndGetAddressId.integer,
        }}).then(() => {
            graphqlRequest(ADD_BACKGROUND_DESEASES, {
                backgroundDeseases: requestInvestigation.backgroundIllnesses,
                investigatedPatientId: requestInvestigation.investigatedPatientId
            }).then(() => {
                graphqlRequest(ADD_SYMPTOMS, {
                    investigationIdValue: requestInvestigation.epidemioligyNumber,
                    symptomNames: requestInvestigation.symptoms
                }).then(() => {
                    response.send('Added clinical details');
                });
            });
        });
    });
});

export default clinicalDetailsRoute;
