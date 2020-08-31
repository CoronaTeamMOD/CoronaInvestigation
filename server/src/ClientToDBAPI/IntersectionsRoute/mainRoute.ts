import { Router, Request, Response } from 'express';

const intersectionsRoute = Router();

intersectionsRoute.get('/', (request: Request, response: Response) => {
    response.send('Hello from Intersections route');
})

export default intersectionsRoute;