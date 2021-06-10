import { Router, Request, Response } from 'express';
const request = require('request');

import { Severity } from '../../Models/Logger/types';
import UseCache, { setToCache } from '../../middlewares/UseCache';
import logger, { invalidAPIResponseLog, launchingAPIRequestLog, validAPIResponseLog, } from '../../Logger/Logger';

const rulerRoute = Router();
const rulerApiUrl = `http://192.168.2.26:8888/Corona/RulerCheckColor`;

rulerRoute.post('/rulerapi/', UseCache, (request: Request, response: Response) => {
    const rulerLogger = logger.setup({
        workflow: 'query ruller by list of ids',
        user: response.locals.user.id,
    });

    const params: any = 
    {
        "RulerCheckColorRequest":{     
        "MOHHeader":{       
            "ActivationID":"1",       
            "CustID":"23",       
            "AppID":"130",       
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
    const parameters = <JSON> params
    rulerLogger.info(launchingAPIRequestLog(parameters), Severity.LOW);
    
//     request.post(rulerApiUrl, { json: true }, (err: any, res: any, body: { url: any; explanation: any; }) => {
//         if (err) { return console.log(err); }
//         console.log(body.url);
//         console.log(body.explanation);
// });

    

    
    
    // return callRullerApi(parameters)
    
        // .then((result: any) => {
        //     const data = result.data;
        //     rulerLogger.info(validAPIResponseLog, Severity.LOW);
        //     setToCache(request.originalUrl, data);
        //     response.send(data);
        // })
        // .catch((error: string) => {
        //     rulerLogger.error(invalidAPIResponseLog(error), Severity.HIGH);
        //     response.send(error);
        // });
});

// const callRullerApi = (parameters: JSON) => {
//     const options = {
//         method: 'POST',
//         url: rulerApiUrl,
//         headers: {
//             'content-type': 'application/json'
//         },
//         body: parameters,
//         json: true
//     };
//     return request(options)
// }

export default rulerRoute;