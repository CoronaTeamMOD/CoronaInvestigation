import { Router, Request, Response } from 'express';

import logger from '../../Logger/Logger';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { Service, Severity } from '../../Models/Logger/types';
import { adminMiddleWare } from '../../middlewares/Authentication';

import {GET_USER_INVESTIGATIONS, GET_GROUP_INVESTIGATIONS} from '../../DBService/LandingPage/Query';

const landingPageRoute = Router();

landingPageRoute.get('/investigations', (request: Request, response: Response) => {
    const getInvestigationsParameters = { 
        userId: response.locals.user.id, 
        orderBy: request.query.orderBy 
    };
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Getting Investigations',
        step: `launching graphql API request with parameters ${JSON.stringify(getInvestigationsParameters)}`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    })
    graphqlRequest(GET_USER_INVESTIGATIONS, response.locals, getInvestigationsParameters)
    .then((result: any) => {
        if (result && result.data && result.data.userInvestigationsSort &&
            result.data.userInvestigationsSort.json) {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Getting Investigations',
                step: 'got investigations from the DB',
                user: response.locals.user.id,
                investigation: response.locals.epidemiologynumber
            });
            response.send(JSON.parse(result.data.userInvestigationsSort.json))
        }
        else {
            logger.error({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Getting Investigations',
                step: `got errors in querying the investigations from the DB ${JSON.stringify(result)}`,
                user: response.locals.user.id,
                investigation: response.locals.epidemiologynumber
            });
            response.status(500).send('error in fetching data')
        }
    })
    .catch(err => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Getting Investigations',
            step: `got errors in request to graphql API ${err}`,
            user: response.locals.user.id,
            investigation: response.locals.epidemiologynumber
        });
        response.status(500).send('error in fetching data: ' + err);
    });
})

landingPageRoute.get('/groupInvestigations', adminMiddleWare, (request: Request, response: Response) => {    
    const getInvestigationsParameters = { 
        investigationGroupId: +response.locals.user.group, 
        orderBy: request.query.orderBy  
    };   
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Getting Investigations',
        step: `launching graphql API group investigations request with parameters ${JSON.stringify(getInvestigationsParameters)}`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    })
    graphqlRequest(GET_GROUP_INVESTIGATIONS, response.locals, getInvestigationsParameters)
        .then((result: any) => {
            if (result && result.data && result.data.groupInvestigationsSort &&
                result.data.groupInvestigationsSort.json) {
                logger.info({
                    service: Service.SERVER,
                    severity: Severity.LOW,
                    workflow: 'Getting Investigations',
                    step: 'got results from the DB',
                    user: response.locals.user.id,
                    investigation: response.locals.epidemiologynumber
                })
                response.send(JSON.parse(result.data.groupInvestigationsSort.json))
            }
            else {
                logger.error({
                    service: Service.SERVER,
                    severity: Severity.HIGH,
                    workflow: 'Getting Investigations',
                    step: `got error in querying the DB ${JSON.stringify(result)}`,
                    user: response.locals.user.id,
                    investigation: response.locals.epidemiologynumber
                });
                response.status(500).send('error in fetching data')
            }
        })
        .catch(err => {
            logger.error({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: 'Getting Investigations',
                step: `got error in requesting the graphql API ${err}`,
                user: response.locals.user.id,
                investigation: response.locals.epidemiologynumber
            });
            response.status(500).send('error in fetching data: ' + err)
        });
})

export default landingPageRoute;