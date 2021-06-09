import { Router, Request, Response } from 'express';

import { Severity } from '../../Models/Logger/types';
import UseCache, { setToCache } from '../../middlewares/UseCache';
import logger, { invalidAPIResponseLog, launchingAPIRequestLog, validAPIResponseLog, } from '../../Logger/Logger';

const router = Router();
const rulerApiUrl = `http://192.168.2.26:8888/Corona/RulerCheckColor`;

router.post('/ruler/', UseCache, (request: Request, response: Response) => {
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
    callRullerApi(parameters)
        .then((result: any) => {
            const data = result.data;
            rulerLogger.info(validAPIResponseLog, Severity.LOW);
            setToCache(request.originalUrl, data);
            response.send(data);
        })
        .catch((error: string) => {
            rulerLogger.error(invalidAPIResponseLog(error), Severity.HIGH);
            response.send(error);
        });
});

const callRullerApi = (parameters: JSON) => {
    const request = require('request');
    const options = {
        method: 'POST',
        url: rulerApiUrl,
        headers: {
            'content-type': 'application/json'
        },
        body: parameters,
        json: true
    };
    return request(options)
}

// headers: {
    // 'postman-token': '',
    // 'cache-control': 'no-cache',
    // autorization: '',


 // idType need to be: 
    //1 – ת"ז ישראלית
    //2 – דרכון
    //3 – אחר / לא ידוע
    //4 – ת"ז פלסטינאית
    
    //i'll get it from the client // request.body.idsArray
    // const idsArray = [ 
    //     {
    //         IdType: '1',
    //         IDnum: '235582947',
    //         DOB: '03031999',
    //         Tel: '0543455444'
    //     },
    //     {
    //         IdType: '1',
    //         IDnum: '236142543',
    //         DOB: '03031999',
    //         Tel: '0543455444'
    //     },
    //     {
    //         IdType: '1',
    //         IDnum: '237236377',
    //         DOB: '03031999',
    //         Tel: '0543455444'
    //     }]

    //add convert for id type (all types are the same exept of other that is 6 in our db)
    // const params = {
    //     RulerCheckColorRequest: {
    //         MOHHeader: {
    //             ActivationID: '1',
    //             CustID: '23',
    //             AppID: '123',
    //             SiteID: '2',
    //             InterfaceID: 'TrafficLightsMobile',
    //         },
    //         Ids: idsArray
    //     }
    // };


// add timer (to talk about it with bar to add in the client side)

//to filter only the relevant data that will need to be save

// save the data in the node cache