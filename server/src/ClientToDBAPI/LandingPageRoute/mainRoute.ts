import { Router, Request, Response } from 'express';

const landingPageRoute = Router();

landingPageRoute.get('/', (request: Request, response: Response) => {
    response.send('Hello from Landing page route');
})

export default landingPageRoute;