import { Router, Request, Response } from 'express';

const exosureRoute = Router();

exosureRoute.get('/', (request: Request, response: Response) => {
    response.send('Hello from Exposure route');
})

export default exosureRoute;