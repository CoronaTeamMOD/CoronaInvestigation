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
    CREATE_ISOLATION_ADDRESS, ADD_BACKGROUND_DISEASES, ADD_SYMPTOMS, UPDATE_INVESTIGATED_PATIENT_CLINICAL_DETAILS, UPDATE_INVESTIGATION
} from '../../DBService/ClinicalDetails/Mutation';

const clinicalDetailsRoute = Router();

clinicalDetailsRoute.get('/', (request: Request, response: Response) => {
    response.send('Hello from Clinical Details route');
});

clinicalDetailsRoute.post('/symptoms', (request: Request, response: Response) => {
    graphqlRequest(GET_SYMPTOMS, response.locals).then((result: any) => response.send(result));
});

clinicalDetailsRoute.post('/backgroundDiseases', (request: Request, response: Response) => {
    graphqlRequest(GET_BACKGROUND_DISEASES, response.locals).then((result: any) => response.send(result));
});

clinicalDetailsRoute.get('/getInvestigatedPatientClinicalDetailsFields', (request: Request, response: Response) => {
    graphqlRequest(GET_INVESTIGATED_PATIENT_CLINICAL_DETAILS_BY_EPIDEMIOLOGY_NUMBER,  response.locals, { epidemiologyNumber: +request.query.epidemiologyNumber }).then(
        (result: any) => response.send(result)
    );
});

const saveClinicalDetails = (request: Request, response: Response, isolationAddress?: number, ) => {
    const clinicalDetails: ClinicalDetails = request.body.clinicalDetails;

    const requestInvestigation: Investigation = {
        epidemiologyNumber: +request.headers.epidemiologynumber,
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
        wasHospitalized: clinicalDetails.wasHospitalized,
        isolationAddress
    }

    graphqlRequest(UPDATE_INVESTIGATION,  response.locals,requestInvestigation).then(() => {
        graphqlRequest(ADD_BACKGROUND_DISEASES,  response.locals, {
            investigatedPatientId: clinicalDetails.investigatedPatientId,
            backgroundDeseases: clinicalDetails.backgroundDeseases
        }).then(() => {
            graphqlRequest(ADD_SYMPTOMS, response.locals, {
                investigationIdValue: +request.headers.epidemiologynumber,
                symptomNames: clinicalDetails.symptoms
            }).then(() => {
                graphqlRequest(UPDATE_INVESTIGATED_PATIENT_CLINICAL_DETAILS,response.locals, {
                    isPregnant: clinicalDetails.isPregnant,
                    doesHaveBackgroundDiseases: clinicalDetails.doesHaveBackgroundDiseases,
                    id: clinicalDetails.investigatedPatientId
                })
            }).then(() => {
                response.send('Added clinical details');
            });
        });
    });
}

clinicalDetailsRoute.post('/saveClinicalDetails', (request: Request, response: Response) => {

    const isolationAddress = request.body.clinicalDetails.isolationAddress;

    if (isolationAddress !== null) {
        const requestAddress: Address = {
            cityValue: isolationAddress?.city,
            streetValue: isolationAddress?.street === '' ? null : isolationAddress?.street,
            floorValue: +isolationAddress?.floor,
            houseNumValue: +isolationAddress?.houseNum,
        }
        graphqlRequest(CREATE_ISOLATION_ADDRESS,  response.locals, {
            input: { ...requestAddress }
        }).then((result: CreateAddressResponse) => {
            saveClinicalDetails(request, response, result.data.insertAndGetAddressId.integer);
        });
    } else {
        saveClinicalDetails(request, response, null);
    }
});

export default clinicalDetailsRoute;
