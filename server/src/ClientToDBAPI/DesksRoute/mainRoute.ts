import { Router, Request, Response } from 'express';

import logger from '../../Logger/Logger';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { ALL_DESKS_QUERY, DESKS_BY_COUNTY_ID } from "../../DBService/Desk/Query";
import { Severity } from '../../Models/Logger/types';
import GetAllDesks from '../../Models/Desk/GetAllDesks'

const router = Router();

const RESPONSE_ERROR_CODE = 500;

router.get('/', (request: Request, response: Response) => {
    const desksLogger = logger.setup({
        workflow: 'Getting desks',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    desksLogger.info('launching graphql API desks request', Severity.LOW);
    graphqlRequest(ALL_DESKS_QUERY, response.locals)
    .then((res: GetAllDesks) => {
        desksLogger.info('got results from the DB', Severity.LOW);
        response.send(res.data.allDesks.nodes);
    })
    .catch(err => {
        desksLogger.error(`got error in requesting the graphql API ${err}`, Severity.HIGH);
        response.sendStatus(RESPONSE_ERROR_CODE);
    })
});

router.get('/county', (request: Request, response: Response) => {
    const countyLogger = logger.setup({
        workflow: 'Getting desks by county id',
        user: response.locals.user.id,
        investigation: response.locals.epidemiologynumber
    });
    countyLogger.info(`launching graphql API desks request with parameters ${JSON.stringify({ countyId: response.locals.user.investigationGroup })}`, Severity.LOW);
    graphqlRequest(DESKS_BY_COUNTY_ID, response.locals, { countyId: +response.locals.user.investigationGroup })
    .then((res: GetAllDesks) => {
        if (res?.data?.allDesks) {
            countyLogger.info('got results from the DB', Severity.LOW);
            response.send(res.data.allDesks.nodes)
        } else {
            countyLogger.error('didnt get data from the DB', Severity.HIGH);
            response.status(RESPONSE_ERROR_CODE).send('Error while trying to get userTypes')
        }
    })
    .catch(err => {
        countyLogger.error(`got error in requesting the graphql API ${err}`, Severity.HIGH);
        response.sendStatus(RESPONSE_ERROR_CODE);
    })
});

export default router;