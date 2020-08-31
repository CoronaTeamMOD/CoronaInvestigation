import { Router, Request, Response } from 'express';

const mohRouter = Router();

mohRouter.get('/', (request: Request, response: Response) => {
    response.send('Hello from MOH Api');
})

export default mohRouter;