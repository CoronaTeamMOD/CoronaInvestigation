import axios from 'axios';
import { Router, Request, Response } from 'express';

import { Severity } from '../../Models/Logger/types';
import UseCache, { setToCache } from '../../middlewares/UseCache';
import logger, { invalidAPIResponseLog, launchingAPIRequestLog, validAPIResponseLog, } from '../../Logger/Logger';

const rulerRoute = Router();
const rulerApiUrl = `http://192.168.2.26:8888/Corona/RulerCheckColor`;
const errorStatusCode = 500;

// rulerRoute.post('/rulerapi/', UseCache, (req: Request, res: Response) => {
rulerRoute.post('/rulerapi/', (req: Request, res: Response) => {
    const parameters =  JSON.parse(req.body.data);
    const rulerLogger = logger.setup({
        workflow: `call ruler check color api with list of ids with parameters: ${JSON.stringify(parameters)}`,
    });
    
    rulerLogger.info(launchingAPIRequestLog(parameters), Severity.LOW);

    axios.post(rulerApiUrl, parameters)
        .then((data) => {
            rulerLogger.info(validAPIResponseLog, Severity.LOW);
            // setToCache(req.originalUrl, data.data);
            res.send(data);
        }
        ).catch((err: any) => {
            rulerLogger.error(invalidAPIResponseLog(err), Severity.HIGH);
            res.send(err);
        })
});

export default rulerRoute;
