import { Router, Request, Response } from 'express';

const clinicalDetailsRoute = Router();

clinicalDetailsRoute.get('/', (request: Request, response: Response) => {
    response.send('Hello from Clinical Details route');
})

export default clinicalDetailsRoute;