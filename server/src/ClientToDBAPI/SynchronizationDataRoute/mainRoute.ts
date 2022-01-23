import axios from 'axios';
import { Router, Request, Response } from 'express';

import City from '../../Models/Address/City';
import { Severity } from '../../Models/Logger/types';
import {ADD_CITY_TEMP, ADD_CITIES_TEMP} from '../../DBService/DataSynchronization/mutation';
import { errorStatusCode, graphqlRequest } from '../../GraphqlHTTPRequest';
import logger, { invalidAPIResponseLog, launchingAPIRequestLog, invalidDBResponseLog, launchingDBRequestLog, validDBResponseLog  } from '../../Logger/Logger';

const synchronizationRoute = Router();

// const mohCitiesApiUrl = process.env.CITIES_URL;
// const mohStreetsApiUrl = process.env.STREETS_URL;
const mohCitiesApiUrl = 'https://mohservicesapitest.health.gov.il/api/Lists/edm/israelcities';
const mohStreetsApiUrl = 'https://mohservicesapitest.health.gov.il/api/Lists/edm/israelstreets';

const parseCities = (citis: any) => {
     return citis.map((city: { Code: string; Description: string; }) => ({'id': city.Code, 'displayName': city.Description}));
}

const parseStreets = (streets: any) => {
    return streets.map((street: { Code: string; Street_desc: string; City_code: string, Street_code: string }) => (
        {'id': '///////', 'display_name': street.Street_desc, 'city': street.City_code, mho_code: street.Street_code })
    );
}

synchronizationRoute.post('/cities/', (req: Request, res: Response) => {
    const citiesSynchronizationLogger = logger.setup({
        workflow: 'cities synchronization to DB',
    });
    citiesSynchronizationLogger.info(launchingAPIRequestLog(), Severity.LOW);
    axios.get(mohCitiesApiUrl)
        .then((result) => {
            citiesSynchronizationLogger.info(launchingAPIRequestLog(result.data), Severity.LOW);
            const cities = parseCities(result.data);
            const addCityLogger = logger.setup({
                workflow: 'add new city to DB',
            });
            cities.forEach((city: { id: any; displayName: any; }) => {
                const cityParamaters = {
                    id: city.id,
                    displayName: city.displayName
                };
                addCityLogger.info(launchingDBRequestLog(cityParamaters), Severity.LOW);
                graphqlRequest(ADD_CITY_TEMP, res.locals, cityParamaters)
                .then((result: any) => {
                    addCityLogger.info(validDBResponseLog, Severity.LOW);
                })
                .catch(error => {
                    addCityLogger.error(invalidDBResponseLog(error), Severity.HIGH);
                });
            });
            res.send(result);
        }).catch((err: any) => {
            console.log('######ERROR -- ' , err)
            res.status(errorStatusCode).send(err);
        });
});

synchronizationRoute.post('/streets/', (req: Request, res: Response) => {
    const streetsSynchronizationLogger = logger.setup({
        workflow: 'streets synchronization to DB',
    });
    streetsSynchronizationLogger.info(launchingAPIRequestLog(), Severity.LOW);
    axios.get(mohStreetsApiUrl)
        .then((result) => {
            streetsSynchronizationLogger.info(launchingAPIRequestLog(result.data), Severity.LOW);
            const streets = parseStreets(result.data)
            console.log('%%%%           ',streets)
            res.send(result.data.result);
        }).catch((err: any) => {
            console.log('######ERROR STREETS-- ' , err)
            res.status(errorStatusCode).send(err);
        });
});

export default synchronizationRoute;