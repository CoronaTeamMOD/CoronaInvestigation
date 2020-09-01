import bodyParser from 'body-parser';
import { Router, Request, Response } from 'express';

const mohRouter = Router();

mohRouter.get('/', (request: Request, response: Response) => {
    response.send('Hello from MOH Api');
})

mohRouter.post('/*', bodyParser.json(), (req, res, next) => {
    next();
});

export default mohRouter;