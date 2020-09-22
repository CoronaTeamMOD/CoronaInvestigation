import { Router, Request, Response } from 'express';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { GET_CONTACTED_PEOPLE } from '../../DBService/ContactedPeople/Query';

const ContactedPepoleRoute = Router();

ContactedPepoleRoute.get('/:investigationId', (request: Request, response: Response) =>
    graphqlRequest(GET_CONTACTED_PEOPLE, response.locals, {investigationId: parseInt(request.params.investigationId)})
        .then((result: any) => response.send(result))
        .catch(error => response.status(500).json({error: 'failed to fetch contacted pepole'}))
);


export default ContactedPepoleRoute;