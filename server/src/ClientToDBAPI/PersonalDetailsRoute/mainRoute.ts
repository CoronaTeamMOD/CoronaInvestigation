import { Router, Request, Response } from 'express';

const personalDetailsRoute = Router();

personalDetailsRoute.get('/', (request: Request, response: Response) => {
    response.send('Hello from Personal Details route');
})

export default personalDetailsRoute;