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
    const parameters =  {"RulerCheckColorRequest":{     
        "MOHHeader":{       
            "ActivationID":"1",     
            "CustID":"23",
            "AppID":"123",
            "SiteID":"2",       
            "InterfaceID":"Ruler"
        },
        "Ids":[{
                "IdType":3,
                "IDnum":"??2563621",
                "DOB":"24011971",
                "Tel":"0542987778"
                },
                {
                "IdType":2,
                "IDnum":".T0901828",
                "DOB":"24011971",
                "Tel":"0542987778"
                },
                {
                "IdType":2,
                "IDnum":"?0901788",
                "DOB":"24011971",
                "Tel":"0542987778"
                }
            ]
    }
    }

    const rulerLogger = logger.setup({
        workflow: `call ruler check color api with list of ids with parameters: ${JSON.stringify(parameters)}`,
    });

    rulerLogger.info(launchingAPIRequestLog(parameters), Severity.LOW);

    axios.post(rulerApiUrl, parameters)
        .then((result) => {
            rulerLogger.info(launchingAPIRequestLog(result), Severity.LOW);
            // rulerLogger.info(validAPIResponseLog, Severity.LOW);
            // setToCache(req.originalUrl, result.result);
            res.send(result);
        }
        ).catch((err: any) => {
            rulerLogger.error(invalidAPIResponseLog(err), Severity.HIGH);
            res.status(errorStatusCode).send(err);
        })
});

export default rulerRoute;