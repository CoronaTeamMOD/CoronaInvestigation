import axios from 'axios';
import { Router, Request, Response } from 'express';

import { Severity } from '../../Models/Logger/types';
import UseCache, { setToCache } from '../../middlewares/UseCache';
import logger, { invalidAPIResponseLog, launchingAPIRequestLog, validAPIResponseLog, } from '../../Logger/Logger';

const rulerRoute = Router();
//const rulerApiUrl = `http://192.168.2.26:8888/Corona/RulerCheckColor`;
const rulerApiUrl = `https://moh-internal-api-m.azure-api.net/epiinvappbacktest/Corona/RulerCheckColor`;

const errorStatusCode = 500;

// rulerRoute.post('/rulerapi/', UseCache, (req: Request, res: Response) => {
rulerRoute.post('/rulerapi/', (req: Request, res: Response) => {
    // const parameters =  {"RulerCheckColorRequest":{     
    //     "MOHHeader":{       
    //         "ActivationID":"1",     
    //         "CustID":"23",
    //         "AppID":"123",
    //         "SiteID":"2",       
    //         "InterfaceID":"Ruler"
    //     },
    //     "Ids":[{
    //             "IdType":3,
    //             "IDnum":"??2563621",
    //             "DOB":"24011971",
    //             "Tel":"0542987778"
    //             },
    //             {
    //             "IdType":2,
    //             "IDnum":".T0901828",
    //             "DOB":"24011971",
    //             "Tel":"0542987778"
    //             },
    //             {
    //             "IdType":2,
    //             "IDnum":"?0901788",
    //             "DOB":"24011971",
    //             "Tel":"0542987778"
    //             }
    //         ]
    // }
    // }

    const rulerLogger = logger.setup({
        workflow: `call ruler check color api with list of ids with parameters: ${JSON.stringify(req.body)}`,
    });

    rulerLogger.info(launchingAPIRequestLog(req.body), Severity.LOW);

    axios.post(rulerApiUrl, req.body)
        .then((result) => {
            rulerLogger.info(launchingAPIRequestLog(result.data), Severity.LOW);
            // rulerLogger.info(validAPIResponseLog, Severity.LOW);
            // setToCache(req.originalUrl, result.result);
            res.send(result.data);
        }
        ).catch((err: any) => {
            rulerLogger.error(invalidAPIResponseLog(err), Severity.HIGH);
            res.send(err);
        })
});

export default rulerRoute;
