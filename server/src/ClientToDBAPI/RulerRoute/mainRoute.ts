import axios from 'axios';
import { Router, Request, Response } from 'express';

import { Severity } from '../../Models/Logger/types';
import logger, { invalidAPIResponseLog, launchingAPIRequestLog } from '../../Logger/Logger';

const rulerRoute = Router();
const rulerApiUrl = process.env.RULER_URL;

const errorStatusCode = 500;

rulerRoute.post('/rulerapi/', (req: Request, res: Response) => {
    const parameters = req.body;

    const rulerLogger = logger.setup({
        workflow: `call ruler check color api with list of ids with parameters: ${JSON.stringify(parameters)}`,
    });

    rulerLogger.info(launchingAPIRequestLog(parameters), Severity.LOW);

    axios.post(rulerApiUrl, parameters)
        .then((result) => {
            rulerLogger.info(launchingAPIRequestLog(result.data), Severity.LOW);
            res.send(result.data);
        }
        ).catch((err: any) => {
            rulerLogger.error(invalidAPIResponseLog(err), Severity.HIGH);
            res.status(errorStatusCode).send(err);        
        })
});

export default rulerRoute;