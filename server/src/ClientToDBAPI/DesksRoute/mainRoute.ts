import { Router, Request, Response } from 'express';

import logger from '../../Logger/Logger';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { ALL_DESKS_QUERY } from "../../DBService/Desk/Query";
import { Service, Severity } from '../../Models/Logger/types';

const router = Router();

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
    .then(res => {
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
        response.sendStatus(500);
    })
});

export default router;