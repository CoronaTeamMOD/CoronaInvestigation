import { Router, Request, Response } from 'express';

import logger from '../../Logger/Logger';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { ALL_DESKS_QUERY, DESKS_BY_COUNTY_ID } from "../../DBService/Desk/Query";
import { Service, Severity } from '../../Models/Logger/types';
import GetAllDesks from '../../Models/Desk/GetAllDesks'

const router = Router();

const RESPONSE_ERROR_CODE = 500;

router.get('/', (request: Request, response: Response) => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Getting desks',
        step: `launching graphql API desks request`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    })
    graphqlRequest(ALL_DESKS_QUERY, response.locals)
    .then((res: GetAllDesks) => {
        logger.info({
            service: Service.SERVER,
            severity: Severity.LOW,
            workflow: 'Getting desks',
            step: 'got results from the DB',
            user: response.locals.user.id,
            investigation: response.locals.epidemiologynumber
        })
        response.send(res.data.allDesks.nodes.map((desk: any) => ({
            id: desk.id,
            name: desk.deskName
        })));
    })
    .catch(err => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.HIGH,
            workflow: 'Getting desks',
            step: `got error in requesting the graphql API ${err}`,
            user: response.locals.user.id,
            investigation: response.locals.epidemiologynumber
        });
        response.sendStatus(RESPONSE_ERROR_CODE);
    })
});

router.get('/county', (request: Request, response: Response) => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        workflow: 'Getting desks by county id',
        step: `launching graphql API desks request with parameters ${JSON.stringify({ countyId: response.locals.user.investigationGroup })}`,
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    })
    graphqlRequest(DESKS_BY_COUNTY_ID, response.locals, { countyId: +response.locals.user.investigationGroup })
    .then((res: GetAllDesks) => {
        if (res?.data?.allDesks) {
            logger.info({
                service: Service.SERVER,
                severity: Severity.LOW,
                workflow: 'Getting desks by county id',
                step: 'got results from the DB',
                user: response.locals.user.id,
                investigation: response.locals.epidemiologynumber
            })
            response.send(res.data.allDesks.nodes)
        } else {
            logger.error({
                service: Service.SERVER,
                severity: Severity.HIGH,
                workflow: 'Getting desks by county id',
                step: 'didnt get data from the DB',
                user: response.locals.user.id
            })
            response.status(RESPONSE_ERROR_CODE).send('Error while trying to get userTypes')
        }
    })
    .catch(err => {
        logger.error({
            service: Service.SERVER,
            severity: Severity.HIGH,
            workflow: 'Getting desks by county id',
            step: `got error in requesting the graphql API ${err}`,
            user: response.locals.user.id,
            investigation: response.locals.epidemiologynumber
        });
        response.sendStatus(RESPONSE_ERROR_CODE);
    })
});

export default router;