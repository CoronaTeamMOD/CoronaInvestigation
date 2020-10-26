import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { ALL_DESKS_QUERY } from "../../DBService/Desk/Query";

const router = Router();

router.get('/', (request: Request, response: Response) => {
    graphqlRequest(ALL_DESKS_QUERY, response.locals)
    .then(res => {
        response.send(res.data.allDesks.nodes.map((desk: any) => ({
            id: desk.id,
            name: desk.deskName
        })));
    })
    .catch(err => {
        response.sendStatus(500);
    })
});

export default router;