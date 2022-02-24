
import { Router, Request, Response } from 'express';

import UseCache, { setToCache } from '../../middlewares/UseCache';
import { InitialLogData, Severity } from '../../Models/Logger/types';
import { errorStatusCode, graphqlRequest } from '../../GraphqlHTTPRequest';
import { handleInvestigationRequest } from '../../middlewares/HandleInvestigationRequest';
import logger, { invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog } from '../../Logger/Logger';
import GetInvestigatedPatientDetails, { PersonalInfoDbData } from '../../Models/PersonalInfo/GetInvestigatedPatientDetails';
import { UPDATE_PERSONAL_INFO } from '../../DBService/PersonalDetails/Mutation';
import { GET_OCCUPATIONS, GET_HMOS, GET_INVESTIGATED_PATIENT_DETAILS_BY_EPIDEMIOLOGY_NUMBER, 
    GET_SUB_OCCUPATIONS_BY_OCCUPATION, GET_EDUCATION_SUB_OCCUPATION_BY_CITY, GET_ALL_INVESTIGATED_PATIENT_ROLES } from '../../DBService/PersonalDetails/Query';

const personalDetailsRoute = Router();

personalDetailsRoute.get('/occupations', UseCache, (request: Request, response: Response) => {
    const occupationsLogger = logger.setup({
        workflow: 'query all occupations',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    occupationsLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_OCCUPATIONS, response.locals).then((result: any) => {
        occupationsLogger.info(validDBResponseLog, Severity.LOW);
        
        setToCache(request.originalUrl,result);
        response.send(result);
    }).catch(error => {
        occupationsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.sendStatus(errorStatusCode).send(error);
    });
});

personalDetailsRoute.get('/hmos', UseCache, (request: Request, response: Response) => {
    const hmosLogger = logger.setup({
        workflow: 'query all hmos',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    hmosLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_HMOS, response.locals)
    .then(result => {
        hmosLogger.info(validDBResponseLog, Severity.LOW);

        setToCache(request.originalUrl, result);
        response.send(result);
    }).catch(error => {
        hmosLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.sendStatus(errorStatusCode).send(error);
    });
});

personalDetailsRoute.get('/investigatedPatientRoles', UseCache, (request: Request, response: Response) => {
    const investigatedPatientRolesLogger = logger.setup({
        workflow: 'query all investigated patient roles',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });
    investigatedPatientRolesLogger.info(launchingDBRequestLog(), Severity.LOW);
    graphqlRequest(GET_ALL_INVESTIGATED_PATIENT_ROLES, response.locals)
    .then(result => {
        investigatedPatientRolesLogger.info(validDBResponseLog, Severity.LOW);
        
        const data = result.data.allInvestigatedPatientRoles.nodes;
        setToCache(request.originalUrl, data);
        response.send(data);
    }).catch(error => {
        investigatedPatientRolesLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.sendStatus(errorStatusCode).send(error);
    });
});

const convertPatientDetailsFromDB = (investigatedPatientDetails: PersonalInfoDbData) => {
    const convertedInvestigatedPatientDetails = {
        ...investigatedPatientDetails,
        ...investigatedPatientDetails.covidPatientByCovidPatient
    }
    delete convertedInvestigatedPatientDetails.covidPatientByCovidPatient;

    return convertedInvestigatedPatientDetails;
}

personalDetailsRoute.get('/investigatedPatientPersonalInfoFields', handleInvestigationRequest, (request: Request, response: Response) => {
    const investigatedPatientPersonalInfoFieldsLogger = logger.setup({
        workflow: 'query investigation personal info tab',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });

    const parameters = {id: parseInt(request.query.epidemioligyNumber as string)};
    investigatedPatientPersonalInfoFieldsLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(GET_INVESTIGATED_PATIENT_DETAILS_BY_EPIDEMIOLOGY_NUMBER, response.locals, parameters)
    .then((result: GetInvestigatedPatientDetails) => {
        investigatedPatientPersonalInfoFieldsLogger.info(validDBResponseLog, Severity.LOW);
        const investigatedPatientDetails = result.data.investigationByEpidemiologyNumber.investigatedPatientByInvestigatedPatientId;
        response.send(convertPatientDetailsFromDB(investigatedPatientDetails));
    })
    .catch(error => {
        investigatedPatientPersonalInfoFieldsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.sendStatus(errorStatusCode).send(error);
    });
});

personalDetailsRoute.get('/subOccupations', (request: Request, response: Response) => {
    const subOccupationsLogger = logger.setup({
        workflow: 'query sub occupations by main occupation',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });

    const parameters = {parentOccupation: request.query.parentOccupation};
    subOccupationsLogger.info(launchingDBRequestLog(parameters), Severity.LOW);
    graphqlRequest(GET_SUB_OCCUPATIONS_BY_OCCUPATION, response.locals, parameters)
    .then(result => {
        subOccupationsLogger.info(validDBResponseLog, Severity.LOW);
        response.send({ subOccupations: result.data.allSubOccupations.nodes })
    }).catch(error => {
        subOccupationsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.sendStatus(errorStatusCode).send(error);
    });
});

personalDetailsRoute.get('/educationSubOccupations', (request: Request, response: Response) => {
    const educationSubOccupationsLogger = logger.setup({
        workflow: 'query education sub occupation by city',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    });

    const parameters = {city: request.query.city};
    educationSubOccupationsLogger.info(launchingDBRequestLog(parameters), Severity.LOW);

    graphqlRequest(GET_EDUCATION_SUB_OCCUPATION_BY_CITY, response.locals, parameters)
    .then(result => {
        educationSubOccupationsLogger.info(validDBResponseLog, Severity.LOW);
        response.send(result);
    }).catch(error => {
        educationSubOccupationsLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.sendStatus(errorStatusCode).send(error);
    });
});


personalDetailsRoute.post('/updatePersonalDetails', handleInvestigationRequest, (request: Request, response: Response) => {
    const logData = {
        workflow: 'saving personal details tab',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber,
    };
    const { personalInfoData, id } = request.body;
    const dbPersonalInfoData = {
        ...personalInfoData,
        id,
        epidemiologyNumber: response.locals.epidemiologynumber,
        
    }
    const savePersonalInfoLogger = logger.setup({...logData, workflow: `${logData.workflow}: save personal details`});
    savePersonalInfoLogger.info(launchingDBRequestLog(dbPersonalInfoData), Severity.LOW);
    const parameters = {input: JSON.stringify(dbPersonalInfoData)};
    
    graphqlRequest(UPDATE_PERSONAL_INFO, response.locals,parameters)
    .then(result => {
        savePersonalInfoLogger.info(validDBResponseLog, Severity.LOW);
        response.send(result);
    })
    .catch(error => {
        savePersonalInfoLogger.error(invalidDBResponseLog(error), Severity.HIGH);
        response.sendStatus(errorStatusCode).send(error);
    });
});

export default personalDetailsRoute;
